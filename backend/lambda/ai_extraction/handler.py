"""
AWS Lambda entry point for Member 1's module.

API Gateway (proxy integration) invokes this. Deploy this function and
wire it to a POST /reports/extract route.

Env vars to set on the Lambda:
  AI_PROVIDER=bedrock
  AWS_REGION=us-east-1  (or wherever your Bedrock access is enabled)
  BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
"""

from __future__ import annotations

import json
import os

from ...models.schemas import ReportInput
from ...services.extraction_service import extract_incident
from ...services.mock_provider import MockProvider


def _get_provider():
    if os.getenv("AI_PROVIDER", "mock") == "bedrock":
        from ...services.bedrock_service import BedrockProvider
        return BedrockProvider()
    return MockProvider()


def handler(event, context):
    try:
        body = json.loads(event.get("body") or "{}")
        report = ReportInput(
            raw_text=body["raw_text"],
            location_hint=body.get("location_hint"),
            report_id=body.get("report_id"),
            student_id=body.get("student_id"),
            has_evidence=body.get("has_evidence", False),
        )
        result = extract_incident(report, _get_provider())
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": result.model_dump_json(),
        }
    except KeyError as exc:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": f"Missing field: {exc}"}),
        }
    except ValueError as exc:
        return {
            "statusCode": 422,
            "body": json.dumps({"error": str(exc)}),
        }
    except Exception as exc:  # noqa: BLE001 - top-level Lambda safety net
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal extraction error", "detail": str(exc)}),
        }
