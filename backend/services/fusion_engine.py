"""
Incident fusion engine for SentinelX / CampusPulse.

Decides whether a new report describes an event already covered by an
existing active incident (fuse) or is something new (create a new
incident). This is done with four explainable, dependency-light
similarity signals combined into a single weighted fusion score:

    fusion_score = 0.40 * text_score
                 + 0.30 * location_score
                 + 0.20 * time_score
                 + 0.10 * category_score

No ML libraries (sklearn/numpy) are used, on purpose — a from-scratch
TF-IDF + cosine similarity implementation keeps the Lambda deployment
package small and every score easy to explain to judges.
"""

import math
import re
from datetime import datetime
from typing import Dict, List, Optional, Tuple

from models.report import Report
from models.incident import Incident

# ---------------------------------------------------------------------------
# Configurable weights & threshold
# ---------------------------------------------------------------------------
WEIGHT_TEXT = 0.40
WEIGHT_LOCATION = 0.30
WEIGHT_TIME = 0.20
WEIGHT_CATEGORY = 0.10

FUSION_THRESHOLD = 0.75

# Time window (minutes) after which time_score decays to ~0.
# Two reports more than this far apart are treated as unrelated in time.
TIME_DECAY_WINDOW_MINUTES = 30

_STOPWORDS = {
    "a", "an", "the", "is", "are", "was", "were", "near", "at", "in", "on",
    "of", "to", "there", "someone", "person", "it", "and", "or", "by",
}

# Campus-location synonyms so "Basketball Court" and "Basketball Ground"
# normalize to the same canonical token before comparison.
_LOCATION_SYNONYMS = {
    "court": "court_area",
    "ground": "court_area",
    "field": "court_area",
    "hall": "hall",
    "building": "building",
    "block": "building",
    "lab": "lab",
    "laboratory": "lab",
    "hostel": "hostel",
    "dorm": "hostel",
    "dormitory": "hostel",
    "library": "library",
    "canteen": "canteen",
    "cafeteria": "canteen",
    "mess": "canteen",
}

# Domain vocabulary synonyms so reports describing the same event with
# different words (e.g. "collapsed" vs "unconscious") are recognized as
# related terms rather than scoring as completely unrelated tokens. This
# keeps the approach explainable (a fixed lookup table) rather than a
# black-box embedding model.
_TEXT_SYNONYMS = {
    # medical distress
    "collapsed": "medical_distress", "collapse": "medical_distress",
    "unconscious": "medical_distress", "fainted": "medical_distress",
    "faint": "medical_distress", "passed": "medical_distress",
    "fell": "medical_distress", "dizzy": "medical_distress",
    "seizure": "medical_distress", "bleeding": "medical_distress",
    "injured": "medical_distress", "hurt": "medical_distress",
    # fire
    "fire": "fire_event", "burning": "fire_event", "flames": "fire_event",
    "smoke": "fire_event", "blaze": "fire_event",
    # violence
    "fight": "violence_event", "fighting": "violence_event",
    "assault": "violence_event", "attack": "violence_event",
    "violence": "violence_event", "weapon": "violence_event",
    # water
    "water": "water_event", "leaking": "water_event", "leak": "water_event",
    "flooding": "water_event", "flood": "water_event",
    # electrical
    "sparking": "electrical_event", "spark": "electrical_event",
    "shock": "electrical_event", "electrical": "electrical_event",
    "wire": "electrical_event", "wires": "electrical_event",
}


# ---------------------------------------------------------------------------
# A. Text similarity — TF-IDF + cosine similarity (pure Python)
# ---------------------------------------------------------------------------
def _tokenize(text: str) -> List[str]:
    words = re.findall(r"[a-z0-9]+", (text or "").lower())
    words = [_TEXT_SYNONYMS.get(w, w) for w in words]
    return [w for w in words if w not in _STOPWORDS]


def _term_frequency(tokens: List[str]) -> Dict[str, float]:
    if not tokens:
        return {}
    tf = {}
    for token in tokens:
        tf[token] = tf.get(token, 0) + 1
    total = len(tokens)
    return {term: count / total for term, count in tf.items()}


def _inverse_document_frequency(docs_tokens: List[List[str]]) -> Dict[str, float]:
    n_docs = len(docs_tokens)
    df: Dict[str, int] = {}
    for tokens in docs_tokens:
        for term in set(tokens):
            df[term] = df.get(term, 0) + 1
    # Standard smoothed IDF so a term in every document doesn't hit zero.
    return {term: math.log((1 + n_docs) / (1 + count)) + 1 for term, count in df.items()}


def _tfidf_vector(tf: Dict[str, float], idf: Dict[str, float]) -> Dict[str, float]:
    return {term: freq * idf.get(term, 0.0) for term, freq in tf.items()}


def _cosine_similarity(vec_a: Dict[str, float], vec_b: Dict[str, float]) -> float:
    if not vec_a or not vec_b:
        return 0.0
    shared_terms = set(vec_a.keys()) & set(vec_b.keys())
    dot_product = sum(vec_a[t] * vec_b[t] for t in shared_terms)
    norm_a = math.sqrt(sum(v * v for v in vec_a.values()))
    norm_b = math.sqrt(sum(v * v for v in vec_b.values()))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)


def text_similarity(text_a: str, text_b: str) -> float:
    """
    TF-IDF + cosine similarity between two short report texts.

    The "corpus" for IDF purposes is just the two documents being compared
    (there's no large corpus available at fusion time) — this still lets
    common/stopword-like terms score lower than distinctive shared terms
    like "collapsed" or "unconscious".
    """
    tokens_a = _tokenize(text_a)
    tokens_b = _tokenize(text_b)
    if not tokens_a or not tokens_b:
        return 0.0

    idf = _inverse_document_frequency([tokens_a, tokens_b])
    vec_a = _tfidf_vector(_term_frequency(tokens_a), idf)
    vec_b = _tfidf_vector(_term_frequency(tokens_b), idf)
    return round(_cosine_similarity(vec_a, vec_b), 4)


# ---------------------------------------------------------------------------
# B. Location similarity
# ---------------------------------------------------------------------------
def _normalize_location(location: str) -> List[str]:
    words = re.findall(r"[a-z0-9]+", (location or "").lower())
    return [_LOCATION_SYNONYMS.get(w, w) for w in words if w not in _STOPWORDS]


def location_similarity(location_a: str, location_b: str) -> float:
    """
    Jaccard similarity over normalized location tokens, so
    "Basketball Court" vs "Basketball Ground" score highly (both normalize
    to {"basketball", "court_area"}) while unrelated locations score low.
    """
    tokens_a = set(_normalize_location(location_a))
    tokens_b = set(_normalize_location(location_b))
    if not tokens_a or not tokens_b:
        return 0.0
    if tokens_a == tokens_b:
        return 1.0
    intersection = tokens_a & tokens_b
    union = tokens_a | tokens_b
    return round(len(intersection) / len(union), 4) if union else 0.0


# ---------------------------------------------------------------------------
# C. Time proximity
# ---------------------------------------------------------------------------
def _parse_timestamp(timestamp: str) -> Optional[datetime]:
    if not timestamp:
        return None
    try:
        # Support both "...Z" and explicit-offset ISO 8601 strings.
        return datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return None


def time_proximity(timestamp_a: str, timestamp_b: str,
                    window_minutes: float = TIME_DECAY_WINDOW_MINUTES) -> float:
    """
    Linear decay: identical timestamps -> 1.0, timestamps `window_minutes`
    or further apart -> 0.0.
    """
    dt_a = _parse_timestamp(timestamp_a)
    dt_b = _parse_timestamp(timestamp_b)
    if dt_a is None or dt_b is None:
        return 0.0

    diff_minutes = abs((dt_a - dt_b).total_seconds()) / 60.0
    if diff_minutes >= window_minutes:
        return 0.0
    return round(1.0 - (diff_minutes / window_minutes), 4)


# ---------------------------------------------------------------------------
# D. Category match
# ---------------------------------------------------------------------------
def category_match(category_a: str, category_b: str) -> float:
    a = (category_a or "").strip().upper()
    b = (category_b or "").strip().upper()
    if not a or not b:
        return 0.0
    return 1.0 if a == b else 0.0


# ---------------------------------------------------------------------------
# Fusion score
# ---------------------------------------------------------------------------
def calculate_fusion_score(report: Report, incident: Incident,
                            incident_text: Optional[str] = None) -> Dict[str, float]:
    """
    Compute the weighted fusion score between a new report and an existing
    incident, plus the individual signal scores (useful for logging/debug
    and for the API response's transparency).

    `incident_text` lets the caller pass a representative text for the
    incident (e.g. its most recent report's text or its summary) since
    Incident itself doesn't store raw report text.
    """
    text_score = text_similarity(report.text, incident_text or incident.summary or "")
    loc_score = location_similarity(report.location, incident.location)
    time_score = time_proximity(report.timestamp, incident.updated_at)
    cat_score = category_match(report.category, incident.category)

    fusion_score = (
        WEIGHT_TEXT * text_score
        + WEIGHT_LOCATION * loc_score
        + WEIGHT_TIME * time_score
        + WEIGHT_CATEGORY * cat_score
    )

    return {
        "text_score": text_score,
        "location_score": loc_score,
        "time_score": time_score,
        "category_score": cat_score,
        "fusion_score": round(fusion_score, 4),
    }


# ---------------------------------------------------------------------------
# Find matching incident
# ---------------------------------------------------------------------------
def find_matching_incident(
    report: Report,
    active_incidents: List[Incident],
    incident_texts: Optional[Dict[str, str]] = None,
    threshold: float = FUSION_THRESHOLD,
) -> Tuple[Optional[Incident], float]:
    """
    Compare `report` against every active incident, and return the
    best-matching incident (if its score clears `threshold`) plus its score.

    `incident_texts` is an optional {incident_id: representative_text} map
    (e.g. built from the latest report text per incident) to improve text
    similarity beyond just the incident's stored summary.

    Returns:
        (matching_incident_or_None, best_fusion_score)
    """
    best_incident: Optional[Incident] = None
    best_score = 0.0

    for incident in active_incidents:
        incident_text = (incident_texts or {}).get(incident.incident_id)
        scores = calculate_fusion_score(report, incident, incident_text=incident_text)
        if scores["fusion_score"] > best_score:
            best_score = scores["fusion_score"]
            best_incident = incident

    if best_incident is not None and best_score >= threshold:
        return best_incident, best_score

    return None, best_score
