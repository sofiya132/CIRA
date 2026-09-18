import os
import sys
import unittest
from datetime import datetime, timezone, timedelta

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from models.report import Report
from models.incident import Incident
from services.fusion_engine import (
    text_similarity,
    location_similarity,
    time_proximity,
    category_match,
    calculate_fusion_score,
    find_matching_incident,
    FUSION_THRESHOLD,
)


def _now_iso(offset_minutes: float = 0) -> str:
    return (datetime.now(timezone.utc) + timedelta(minutes=offset_minutes)).isoformat()


class TestTextSimilarity(unittest.TestCase):
    def test_similar_medical_sentences_score_high(self):
        score = text_similarity(
            "Someone collapsed near basketball court",
            "Unconscious person near basketball ground",
        )
        self.assertGreater(score, 0.15)

    def test_unrelated_sentences_score_low(self):
        score = text_similarity(
            "Someone collapsed near basketball court",
            "Water leaking in the library basement",
        )
        self.assertLess(score, 0.15)

    def test_empty_text_returns_zero(self):
        self.assertEqual(text_similarity("", "anything"), 0.0)
        self.assertEqual(text_similarity("anything", ""), 0.0)


class TestLocationSimilarity(unittest.TestCase):
    def test_synonym_locations_score_high(self):
        score = location_similarity("Basketball Court", "Basketball Ground")
        self.assertGreaterEqual(score, 0.9)

    def test_different_locations_score_low(self):
        score = location_similarity("Basketball Court", "Main Library")
        self.assertEqual(score, 0.0)

    def test_identical_locations_score_one(self):
        self.assertEqual(location_similarity("Library", "Library"), 1.0)


class TestTimeProximity(unittest.TestCase):
    def test_same_timestamp_scores_one(self):
        ts = _now_iso()
        self.assertEqual(time_proximity(ts, ts), 1.0)

    def test_far_apart_timestamps_score_zero(self):
        ts_a = _now_iso()
        ts_b = _now_iso(offset_minutes=90)
        self.assertEqual(time_proximity(ts_a, ts_b), 0.0)

    def test_recent_reports_score_higher_than_older(self):
        base = _now_iso()
        close = time_proximity(base, _now_iso(offset_minutes=2))
        far = time_proximity(base, _now_iso(offset_minutes=20))
        self.assertGreater(close, far)


class TestCategoryMatch(unittest.TestCase):
    def test_same_category_scores_one(self):
        self.assertEqual(category_match("MEDICAL", "MEDICAL"), 1.0)

    def test_different_category_scores_zero(self):
        self.assertEqual(category_match("MEDICAL", "FIRE"), 0.0)


class TestFindMatchingIncident(unittest.TestCase):
    def setUp(self):
        self.now = _now_iso()
        self.existing_incident = Incident(
            incident_id="INC-001",
            category="MEDICAL",
            location="Basketball Court",
            priority="CRITICAL",
            status="NEW",
            summary="Someone collapsed near basketball court",
            report_count=1,
            report_ids=["R-0001"],
            created_at=self.now,
            updated_at=self.now,
        )

    def test_similar_report_fuses_with_existing_incident(self):
        new_report = Report(
            report_id="R-0002",
            text="There is an unconscious person near basketball ground.",
            location="Basketball Ground",
            category="MEDICAL",
            timestamp=_now_iso(offset_minutes=1),
            person_state="UNCONSCIOUS",
        )
        matched, score = find_matching_incident(new_report, [self.existing_incident])
        self.assertIsNotNone(matched)
        self.assertEqual(matched.incident_id, "INC-001")
        self.assertGreaterEqual(score, FUSION_THRESHOLD)

    def test_unrelated_report_creates_new_incident(self):
        new_report = Report(
            report_id="R-0003",
            text="Water is leaking from the ceiling in the main library.",
            location="Main Library",
            category="WATER",
            timestamp=_now_iso(offset_minutes=45),
        )
        matched, score = find_matching_incident(new_report, [self.existing_incident])
        self.assertIsNone(matched)
        self.assertLess(score, FUSION_THRESHOLD)

    def test_no_active_incidents_returns_none(self):
        new_report = Report(
            report_id="R-0004",
            text="Someone collapsed.",
            location="Gym",
            category="MEDICAL",
            timestamp=_now_iso(),
        )
        matched, score = find_matching_incident(new_report, [])
        self.assertIsNone(matched)
        self.assertEqual(score, 0.0)


if __name__ == "__main__":
    unittest.main()
