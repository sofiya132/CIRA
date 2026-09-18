"""
Lambda handler for incident read/update operations:

    GET   /incidents            -> list active incidents
    GET   /incidents/{id}       -> get a single incident
    PATCH /incidents/{id}       -> update status / assigned_responder

Report ingestion (which creates/fuses incidents) lives in
lambda/reports/handler.py — this handler only reads and lightly updates
incidents that already exist. All business logic stays in services/.
"""

import json
import os
import sys
from datetime import datetime, timezone

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from models.incident import VALID_STATUSES
from services import dynamodb_service


def _response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def _get_incident_id(event: dict) -> str:
    path_params = (event.get("pathParameters") or {}) if isinstance(event, dict) else {}
    return path_params.get("incident_id") or path_params.get("id") or ""


def _handle_get(event):
    incident_id = _get_incident_id(event)

    try:
        if incident_id:
            incident = dynamodb_service.get_incident(incident_id)
            if not incident:
                return _response(404, {"success": False, "error": f"Incident {incident_id} not found."})
            return _response(200, {"success": True, "incident": incident.to_dict()})

        incidents = dynamodb_service.get_active_incidents()
        return _response(200, {
            "success": True,
            "count": len(incidents),
            "incidents": [inc.to_dict() for inc in incidents],
        })
    except dynamodb_service.DynamoDBServiceError as e:
        return _response(500, {"success": False, "error": str(e)})


def _handle_patch(event):
    incident_id = _get_incident_id(event)
    if not incident_id:
        return _response(400, {"success": False, "error": "Missing incident id in path."})

    try:
        raw_body = event.get("body", "{}") if isinstance(event, dict) else "{}"
        payload = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
    except (json.JSONDecodeError, TypeError):
        return _response(400, {"success": False, "error": "Malformed JSON body."})

    if not isinstance(payload, dict) or not payload:
        return _response(400, {"success": False, "error": "Request body must contain at least one field to update."})

    try:
        incident = dynamodb_service.get_incident(incident_id)
    except dynamodb_service.DynamoDBServiceError as e:
        return _response(500, {"success": False, "error": str(e)})

    if not incident:
        return _response(404, {"success": False, "error": f"Incident {incident_id} not found."})

    if "status" in payload:
        new_status = str(payload["status"]).strip().upper()
        if new_status not in VALID_STATUSES:
            return _response(400, {"success": False, "error": f"Invalid status: {new_status}. Must be one of {sorted(VALID_STATUSES)}."})
        incident.status = new_status

    if "assigned_responder" in payload:
        incident.assigned_responder = payload["assigned_responder"]

    incident.updated_at = datetime.now(timezone.utc).isoformat()

    try:
        dynamodb_service.update_incident(incident)
    except dynamodb_service.DynamoDBServiceError as e:
        return _response(500, {"success": False, "error": str(e)})

    return _response(200, {"success": True, "incident": incident.to_dict()})


def handler(event, context):
    """
    API Gateway (Lambda proxy integration) entry point for the
    /incidents and /incidents/{incident_id} routes.
    """
    http_method = (event.get("httpMethod") or event.get("requestContext", {})
                   .get("http", {}).get("method", "")) if isinstance(event, dict) else ""
    http_method = http_method.upper()

    if http_method == "GET":
        return _handle_get(event)
    if http_method == "PATCH":
        return _handle_patch(event)

    return _response(400, {"success": False, "error": f"Unsupported method: {http_method}"})
