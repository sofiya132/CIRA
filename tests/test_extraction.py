"""
Run (from repo root):  pytest tests/test_extraction.py -v

These use MockProvider so they run instantly with no AWS credentials.
When you're ready, duplicate this file as test_extraction_bedrock.py,
swap in BedrockProvider, and mark it with @pytest.mark.skipif to skip
in CI when AWS creds aren't present.
"""

import pytest

from backend.models.schemas import ReportInput
from backend.services.extraction_service import extract_incident
from backend.services.mock_provider import MockProvider

provider = MockProvider()


@pytest.mark.parametrize(
    "text,expected_category",
    [
        ("Someone collapsed near the basketball court.", "MEDICAL"),
        ("There is a fire in the chemistry lab, smoke everywhere!", "FIRE"),
        ("Two people are fighting near the parking lot.", "SECURITY"),
        ("Sparking wires near the electrical room in Block C.", "ELECTRICAL"),
        ("There's water leakage flooding the corridor near the library.", "WATER"),
        ("I lost my laptop bag somewhere near the cafeteria.", "LOST_ITEM"),
    ],
)
def test_category_classification(text, expected_category):
    report = ReportInput(raw_text=text)
    result = extract_incident(report, provider)
    assert result.category.value == expected_category


def test_medical_sets_person_state_unconscious():
    report = ReportInput(raw_text="Someone collapsed and is unconscious near the gym.")
    result = extract_incident(report, provider)
    assert result.person_state.value == "UNCONSCIOUS"
    assert "unconscious" in result.severity_indicators


def test_location_hint_overrides_guess():
    report = ReportInput(
        raw_text="Medical emergency, please help fast.",
        location_hint="Hostel Block B",
    )
    result = extract_incident(report, provider)
    assert result.location == "Hostel Block B"


def test_unknown_location_falls_back_gracefully():
    report = ReportInput(raw_text="Someone needs help.")
    result = extract_incident(report, provider)
    assert result.location  # never empty/None, per schema contract


def test_output_matches_downstream_contract():
    """Sanity check that every field Members 2-4 depend on is present."""
    report = ReportInput(raw_text="Fire near the auditorium entrance.")
    result = extract_incident(report, provider)
    for field in ("category", "location", "person_state", "entities",
                  "severity_indicators", "summary", "confidence", "provider"):
        assert hasattr(result, field)
    assert result.provider == "mock"


def test_three_report_fusion_scenario_inputs():
    """These are the three reports the whole team's demo is built around —
    just confirming all three extract to the same category/location shape
    so Member 2's fusion logic has consistent input to work with."""
    texts = [
        "Someone collapsed near the basketball court.",
        "There is an unconscious person near the basketball ground.",
        "Medical emergency near the basketball court.",
    ]
    results = [extract_incident(ReportInput(raw_text=t), provider) for t in texts]
    assert all(r.category.value == "MEDICAL" for r in results)
