"""
Data contracts for Member 1's AI extraction module.

Everything downstream (fusion, priority, routing) consumes the
ExtractionResult shape below. Don't change field names without
telling Members 2-4 — this is the contract.
"""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class Category(str, Enum):
    MEDICAL = "MEDICAL"
    FIRE = "FIRE"
    SECURITY = "SECURITY"      # violence, harassment, suspicious activity
    ELECTRICAL = "ELECTRICAL"
    WATER = "WATER"
    LOST_ITEM = "LOST_ITEM"
    OTHER = "OTHER"


class PersonState(str, Enum):
    UNCONSCIOUS = "UNCONSCIOUS"
    INJURED = "INJURED"
    DISTRESSED = "DISTRESSED"
    SAFE = "SAFE"
    UNKNOWN = "UNKNOWN"
    NOT_APPLICABLE = "NOT_APPLICABLE"


class ReportInput(BaseModel):
    """What the student actually submits."""
    report_id: Optional[str] = None
    raw_text: str = Field(..., min_length=1, max_length=2000)
    location_hint: Optional[str] = None   # student-picked location, if any
    reported_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    student_id: Optional[str] = None
    has_evidence: bool = False


class ExtractionResult(BaseModel):
    """
    What Member 1's module produces. This is the ONLY thing that
    leaves this module — Members 2/3/4 never touch Bedrock directly.
    """
    category: Category
    location: str
    person_state: PersonState = PersonState.NOT_APPLICABLE
    entities: List[str] = Field(default_factory=list)
    severity_indicators: List[str] = Field(default_factory=list)
    summary: str = Field(..., max_length=280)

    # Confidence + provenance — useful for debugging and for the demo's
    # "why critical?" explanation feature.
    confidence: float = Field(ge=0.0, le=1.0, default=0.5)
    provider: str = "mock"          # "mock" | "bedrock"
    raw_report_id: Optional[str] = None
    extracted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("location")
    @classmethod
    def location_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            return "UNKNOWN"
        return v.strip()


class ExtractionError(BaseModel):
    error: str
    raw_text: str
    provider: str
