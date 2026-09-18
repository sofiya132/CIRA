"""
The main entry point for Member 1's module.

extract_incident() is the one function everyone else's code — the
FastAPI route, the Lambda handler, your own tests — should call.
"""

from __future__ import annotations

import json
import logging
import re

from pydantic import ValidationError

from ..models.schemas import ExtractionResult, ReportInput
from ..services.ai_provider import AIProvider

logger = logging.getLogger("campuspulse.extraction")

_JSON_BLOCK = re.compile(r"\{.*\}", re.DOTALL)


def _clean_json(raw: str) -> str:
    """LLMs sometimes wrap JSON in ```json fences despite instructions.
    Strip those and grab the first {...} block as a safety net."""
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.strip("`")
        raw = raw.replace("json\n", "", 1).replace("json\r\n", "", 1)
    match = _JSON_BLOCK.search(raw)
    return match.group(0) if match else raw


def extract_incident(report: ReportInput, provider: AIProvider) -> ExtractionResult:
    """
    Turn a raw student report into a validated ExtractionResult.
    Raises ValueError if the provider's output can't be parsed/validated
    even after cleanup — callers should catch this and return a 422/500
    with the raw text preserved (never silently drop a report).
    """
    raw_output = provider.extract(report.raw_text, report.location_hint)
    cleaned = _clean_json(raw_output)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.error("Provider returned non-JSON output: %r", raw_output)
        raise ValueError(f"Could not parse provider output as JSON: {exc}") from exc

    data["provider"] = provider.name
    data["raw_report_id"] = report.report_id

    try:
        return ExtractionResult(**data)
    except ValidationError as exc:
        logger.error("Provider output failed schema validation: %s", exc)
        raise ValueError(f"Provider output failed validation: {exc}") from exc
