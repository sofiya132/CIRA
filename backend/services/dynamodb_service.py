"""
DynamoDB access layer for SentinelX / CampusPulse.

All AWS/DynamoDB-specific code lives here so the rest of the backend
(fusion engine, priority engine, Lambda handlers) never talks to boto3
directly. Table names come from environment variables — nothing is
hardcoded, and no credentials are stored in code (boto3 picks up
credentials from the Lambda execution role / local AWS config).
"""

import os
import boto3
from botocore.exceptions import ClientError
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from models.report import Report
from models.incident import Incident

# ---------------------------------------------------------------------------
# Configuration (all via environment variables — no hardcoded resources)
# ---------------------------------------------------------------------------
REPORTS_TABLE_NAME = os.environ.get("REPORTS_TABLE_NAME", "sentinelx-reports")
INCIDENTS_TABLE_NAME = os.environ.get("INCIDENTS_TABLE_NAME", "sentinelx-incidents")
TIMELINE_TABLE_NAME = os.environ.get(
    "TIMELINE_TABLE_NAME",
    "cira-incident-timeline"
)
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

# Lazily-created singletons so tests can monkeypatch / avoid AWS calls
# when they don't need them.
_dynamodb_resource = None


def _get_resource():
    global _dynamodb_resource
    if _dynamodb_resource is None:
        _dynamodb_resource = boto3.resource("dynamodb", region_name=AWS_REGION)
    return _dynamodb_resource


def _reports_table():
    return _get_resource().Table(REPORTS_TABLE_NAME)


def _incidents_table():
    return _get_resource().Table(INCIDENTS_TABLE_NAME)

def _timeline_table():
    return _get_resource().Table(TIMELINE_TABLE_NAME)


class DynamoDBServiceError(Exception):
    """Raised when a DynamoDB operation fails, wrapping the underlying error."""
    pass


# ---------------------------------------------------------------------------
# Reports
# ---------------------------------------------------------------------------
def create_report(report: Report) -> Report:
    """Persist a new report. Reports are never overwritten or deleted."""
    try:
        _reports_table().put_item(Item=report.to_dict())
        return report
    except ClientError as e:
        raise DynamoDBServiceError(f"Failed to create report: {e}") from e


def get_report(report_id: str) -> Optional[Report]:
    """Fetch a single report by id. Returns None if it doesn't exist."""
    try:
        response = _reports_table().get_item(Key={"report_id": report_id})
        item = response.get("Item")
        return Report.from_dict(item) if item else None
    except ClientError as e:
        raise DynamoDBServiceError(f"Failed to get report {report_id}: {e}") from e


# ---------------------------------------------------------------------------
# Incidents
# ---------------------------------------------------------------------------
def create_incident(incident: Incident) -> Incident:
    """Persist a new incident."""
    try:
        _incidents_table().put_item(Item=incident.to_dict())
        return incident
    except ClientError as e:
        raise DynamoDBServiceError(f"Failed to create incident: {e}") from e


def get_incident(incident_id: str) -> Optional[Incident]:
    """Fetch a single incident by id. Returns None if it doesn't exist."""
    try:
        response = _incidents_table().get_item(Key={"incident_id": incident_id})
        item = response.get("Item")
        return Incident.from_dict(item) if item else None
    except ClientError as e:
        raise DynamoDBServiceError(f"Failed to get incident {incident_id}: {e}") from e


def get_active_incidents() -> List[Incident]:
    """
    Return all incidents that are not RESOLVED/CLOSED, i.e. candidates for
    fusion against a newly-arriving report.

    Uses a table scan for simplicity (fine for a hackathon-scale dataset).
    For production scale, this should be a GSI on `status`.
    """
    try:
        items = []
        scan_kwargs = {}
        while True:
            response = _incidents_table().scan(**scan_kwargs)
            items.extend(response.get("Items", []))
            if "LastEvaluatedKey" not in response:
                break
            scan_kwargs["ExclusiveStartKey"] = response["LastEvaluatedKey"]

        incidents = [Incident.from_dict(item) for item in items]
        return [
    inc for inc in incidents
    if inc.status not in ("RESOLVED", "CLOSED")
]
    except ClientError as e:
        raise DynamoDBServiceError(f"Failed to get active incidents: {e}") from e


def update_incident(incident: Incident) -> Incident:
    """Overwrite an existing incident with new field values (fuse, re-prioritize, etc.)."""
    try:
        _incidents_table().put_item(Item=incident.to_dict())
        return incident
    except ClientError as e:
        raise DynamoDBServiceError(f"Failed to update incident {incident.incident_id}: {e}") from e



def log_incident_event(
    incident_id: str,
    event_type: str,
    details: Optional[Dict[str, Any]] = None,
) -> dict:
    """Persist an event in the incident timeline."""

    timestamp = datetime.now(timezone.utc).isoformat()

    item = {
        "incident_id": incident_id,
        "timestamp": timestamp,
        "event_type": event_type,
        "details": details or {},
        "created_at": timestamp,
    }

    try:
        _timeline_table().put_item(Item=item)
        return item
    except ClientError as e:
        raise DynamoDBServiceError(
            f"Failed to log incident event for {incident_id}: {e}"
        ) from e
