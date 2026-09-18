"""
MockProvider simulates Bedrock's output using simple keyword rules.

Use this for all local development. It's deliberately dumb — it exists
so you (and Members 2-4) can build and test the rest of the pipeline
today, without waiting on AWS credentials or worrying about Bedrock
rate limits during the hackathon.
"""

from __future__ import annotations

import json
import re

from .ai_provider import AIProvider

# (category, keywords, default person_state, default severity_indicators)
_RULES = [
    ("MEDICAL", ["collapse", "unconscious", "faint", "seizure", "bleeding",
                 "injured", "medical emergency", "heart attack", "not breathing"],
     "UNCONSCIOUS", ["unconscious"]),
    ("FIRE", ["fire", "smoke", "burning", "flames"],
     "NOT_APPLICABLE", ["active fire"]),
    ("SECURITY", ["fight", "violence", "weapon", "assault", "harassment",
                  "suspicious person", "threat", "stalking"],
     "DISTRESSED", ["violence in progress"]),
    ("ELECTRICAL", ["power outage", "electrical", "sparking", "short circuit",
                    "wire", "transformer"],
     "NOT_APPLICABLE", ["electrical hazard"]),
    ("WATER", ["leak", "flooding", "water leakage", "burst pipe", "flooded"],
     "NOT_APPLICABLE", ["water leakage"]),
    ("LOST_ITEM", ["lost", "missing item", "can't find", "misplaced"],
     "NOT_APPLICABLE", []),
]

_LOCATION_PATTERN = re.compile(
    r"(?:near|at|in|by)\s+(?:the\s+)?([A-Za-z0-9][\w\s\-]{2,40})", re.IGNORECASE
)


def _guess_location(text: str, hint: str | None) -> str:
    if hint:
        return hint
    match = _LOCATION_PATTERN.search(text)
    if match:
        return match.group(1).strip().rstrip(".,!")
    return "UNKNOWN"


def _guess_entities(text: str) -> list[str]:
    entities = []
    lowered = text.lower()
    for word in ["person", "student", "people", "fire", "smoke", "water", "wire"]:
        if word in lowered:
            entities.append(word)
    return entities or ["unknown"]


class MockProvider(AIProvider):
    @property
    def name(self) -> str:
        return "mock"

    def extract(self, raw_text: str, location_hint: str | None = None) -> str:
        lowered = raw_text.lower()

        category, severity_indicators, person_state = "OTHER", [], "UNKNOWN"
        for cat, keywords, p_state, sev in _RULES:
            if any(kw in lowered for kw in keywords):
                category, person_state, severity_indicators = cat, p_state, sev
                break

        result = {
            "category": category,
            "location": _guess_location(raw_text, location_hint),
            "person_state": person_state,
            "entities": _guess_entities(raw_text),
            "severity_indicators": severity_indicators,
            "summary": raw_text.strip()[:200],
            "confidence": 0.6 if category != "OTHER" else 0.3,
        }
        return json.dumps(result)
