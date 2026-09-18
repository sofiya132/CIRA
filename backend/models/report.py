"""
Report data model for SentinelX / CampusPulse.

A "report" is a single raw submission from a student describing something
they observed (e.g. "Someone collapsed near the basketball court"). Reports
are never deleted or mutated once created — they are the source-of-truth
evidence that gets fused into incidents.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Optional


VALID_CATEGORIES = {"MEDICAL", "FIRE", "VIOLENCE", "ELECTRICAL", "WATER", "LOST_ITEM", "OTHER"}


@dataclass
class Report:
    report_id: str
    text: str
    location: str
    category: str
    timestamp: str
    incident_id: Optional[str] = None
    person_state: Optional[str] = None
    entities: List[str] = field(default_factory=list)
    summary: Optional[str] = None

    def to_dict(self) -> dict:
        """Convert to a plain dict, ready for DynamoDB or JSON serialization."""
        return asdict(self)

    @staticmethod
    def from_dict(data: dict) -> "Report":
        """Build a Report from a plain dict (e.g. a DynamoDB item)."""
        return Report(
            report_id=data.get("report_id"),
            text=data.get("text"),
            location=data.get("location"),
            category=data.get("category"),
            timestamp=data.get("timestamp"),
            incident_id=data.get("incident_id"),
            person_state=data.get("person_state"),
            entities=data.get("entities", []) or [],
            summary=data.get("summary"),
        )
