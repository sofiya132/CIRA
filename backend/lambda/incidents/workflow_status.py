import os
import sys
from datetime import datetime, timezone

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from services import dynamodb_service


def handler(event, context):
    """
    Updates an incident status when called by the Step Functions workflow.

    Expected input:
    {
        "incident_id": "INC42",
        "status": "ACTIVE"
    }
    """

    incident_id = event.get("incident_id")
    new_status = str(event.get("status", "")).strip().upper()

    if not incident_id:
        raise ValueError("incident_id is required")

    if new_status not in {"NEW", "ACTIVE", "RESOLVED", "CLOSED"}:
        raise ValueError(f"Invalid incident status: {new_status}")

    incident = dynamodb_service.get_incident(incident_id)

    if not incident:
        raise ValueError(f"Incident {incident_id} not found")

    incident.status = new_status
    incident.updated_at = datetime.now(timezone.utc).isoformat()

    updated_incident = dynamodb_service.update_incident(incident)

    return {
        "incident_id": updated_incident.incident_id,
        "status": updated_incident.status,
        "updated_at": updated_incident.updated_at
    }