"""
Incident data model for SentinelX / CampusPulse.

An "incident" is the operational unit responders act on. Multiple reports
that describe the same real-world event are fused into a single incident
(see services/fusion_engine.py), so responders see ONE actionable item
instead of a flood of duplicate reports.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Optional


VALID_STATUSES = {
    "NEW",
    "AWAITING_ACK",
    "ACKNOWLEDGED",
    "EN_ROUTE",
    "ON_SCENE",
    "ESCALATED",
    "RESOLVED",
    "CLOSED",
}
VALID_PRIORITIES = {"CRITICAL", "HIGH", "MEDIUM", "LOW"}


@dataclass
class Incident:
    incident_id: str
    category: str
    location: str
    priority: str
    created_at: str
    updated_at: str
    status: str = "NEW"
    summary: Optional[str] = None
    report_count: int = 0
    report_ids: List[str] = field(default_factory=list)
    assigned_responder: Optional[str] = None

    def to_dict(self) -> dict:
        """Convert to a plain dict, ready for DynamoDB or JSON serialization."""
        return asdict(self)

    @staticmethod
    def from_dict(data: dict) -> "Incident":
        """Build an Incident from a plain dict (e.g. a DynamoDB item)."""
        return Incident(
            incident_id=data.get("incident_id"),
            category=data.get("category"),
            location=data.get("location"),
            priority=data.get("priority"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
            status=data.get("status", "NEW"),
            summary=data.get("summary"),
            report_count=int(data.get("report_count", 0) or 0),
            report_ids=data.get("report_ids", []) or [],
            assigned_responder=data.get("assigned_responder"),
        )