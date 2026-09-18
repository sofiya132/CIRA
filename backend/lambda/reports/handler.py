"""
Lambda handler for POST /reports.

Responsibilities (kept intentionally thin — business logic lives in
services/, not here):
    1. Parse + validate the incoming JSON report.
    2. Generate report_id + timestamp if not provided.
    3. Store the report.
    4. Find a matching incident (fusion) or create a new one.
    5. Calculate priority and save/update the incident.
    6. Return a clean JSON response.
"""

import json
import os
import sys
import uuid
from datetime import datetime, timezone

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from models.report import Report, VALID_CATEGORIES
from models.incident import Incident
from services import dynamodb_service
from services.fusion_engine import find_matching_incident, FUSION_THRESHOLD
from services.priority_engine import calculate_priority


def _response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def _validate_payload(payload: dict) -> str:
    """Return an error message string, or "" if the payload is valid."""
    if not isinstance(payload, dict):
        return "Malformed JSON body."
    if not payload.get("text") or not str(payload.get("text")).strip():
        return "Missing required field: text."
    if not payload.get("location") or not str(payload.get("location")).strip():
        return "Missing required field: location."
    category = str(payload.get("category", "")).strip().upper()
    if not category:
        return "Missing required field: category."
    if category not in VALID_CATEGORIES:
        return f"Invalid category: {category}. Must be one of {sorted(VALID_CATEGORIES)}."
    timestamp = payload.get("timestamp")
    if timestamp:
        try:
            datetime.fromisoformat(str(timestamp).replace("Z", "+00:00"))
        except ValueError:
            return f"Invalid timestamp: {timestamp}. Expected ISO 8601 format."
    return ""


def handler(event, context):
    """
    API Gateway (Lambda proxy integration) entry point for POST /reports.
    """
    try:
        raw_body = event.get("body", "{}") if isinstance(event, dict) else "{}"
        payload = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
    except (json.JSONDecodeError, TypeError):
        return _response(400, {"success": False, "error": "Malformed JSON body."})

    error = _validate_payload(payload)
    if error:
        return _response(400, {"success": False, "error": error})

    now_iso = datetime.now(timezone.utc).isoformat()
    report = Report(
        report_id=f"R-{uuid.uuid4().hex[:8].upper()}",
        text=str(payload["text"]).strip(),
        location=str(payload["location"]).strip(),
        category=str(payload["category"]).strip().upper(),
        timestamp=payload.get("timestamp") or now_iso,
        person_state=(str(payload["person_state"]).strip().upper()
                      if payload.get("person_state") else None),
        entities=payload.get("entities", []) or [],
        summary=payload.get("summary"),
    )

    try:
        dynamodb_service.create_report(report)

        active_incidents = dynamodb_service.get_active_incidents()
        matching_incident, fusion_score = find_matching_incident(report, active_incidents)

        priority = calculate_priority(
            category=report.category,
            person_state=report.person_state,
            text=report.text,
        )

        if matching_incident:
            matching_incident.report_count += 1
            matching_incident.report_ids.append(report.report_id)
            matching_incident.updated_at = now_iso
            # Escalate priority if the new report is more severe than
            # what the incident currently holds; never downgrade automatically.
            priority_order = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "CRITICAL": 3}
            if priority_order.get(priority, 0) > priority_order.get(matching_incident.priority, 0):
                matching_incident.priority = priority
            dynamodb_service.update_incident(matching_incident)
            report.incident_id = matching_incident.incident_id
            dynamodb_service.create_report(report)  # re-save with incident_id linked

            return _response(200, {
                "success": True,
                "action": "FUSED",
                "incident_id": matching_incident.incident_id,
                "report_id": report.report_id,
                "fusion_score": fusion_score,
                "priority": matching_incident.priority,
                "report_count": matching_incident.report_count,
            })

        new_incident = Incident(
            incident_id=f"INC-{uuid.uuid4().hex[:6].upper()}",
            category=report.category,
            location=report.location,
            priority=priority,
            status="NEW",
            summary=report.summary or report.text,
            report_count=1,
            report_ids=[report.report_id],
            created_at=now_iso,
            updated_at=now_iso,
        )
        dynamodb_service.create_incident(new_incident)
        report.incident_id = new_incident.incident_id
        dynamodb_service.create_report(report)  # re-save with incident_id linked

        return _response(201, {
            "success": True,
            "action": "CREATED",
            "incident_id": new_incident.incident_id,
            "report_id": report.report_id,
            "fusion_score": fusion_score,
            "priority": new_incident.priority,
            "report_count": new_incident.report_count,
        })

    except dynamodb_service.DynamoDBServiceError as e:
        return _response(500, {"success": False, "error": str(e)})
    except Exception as e:  # noqa: BLE001 - last-resort guard for a Lambda handler
        return _response(500, {"success": False, "error": f"Unexpected server error: {e}"})
