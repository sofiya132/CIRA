import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from services.dynamodb_service import log_incident_event


def handler(event, context):
    """
    Records an incident event in the DynamoDB timeline.
    """

    incident_id = event.get("incident_id")

    if not incident_id:
        raise ValueError("incident_id is required")

    event_type = event.get("event_type", "UNKNOWN")
    details = event.get("details", {})

    return log_incident_event(
        incident_id=incident_id,
        event_type=event_type,
        details=details,
    )