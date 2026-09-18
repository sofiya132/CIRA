"""
Provider abstraction. This is the key architectural decision for your
module: your extraction_service never calls boto3 or Bedrock directly —
it calls whatever AIProvider is configured. That means:

- You can build and demo your whole module with zero AWS credentials
  (MockProvider).
- Switching to Bedrock for the real demo is a one-line env var change.
- Members 2-4 can build against your mock output today without
  waiting for your Bedrock integration to be finished.
"""

from __future__ import annotations

from abc import ABC, abstractmethod


class AIProvider(ABC):
    """Anything that can turn raw report text into a JSON string
    matching the ExtractionResult schema (minus provenance fields)."""

    @abstractmethod
    def extract(self, raw_text: str, location_hint: str | None = None) -> str:
        """Return a raw JSON string (not yet validated/parsed)."""
        raise NotImplementedError

    @property
    @abstractmethod
    def name(self) -> str:
        raise NotImplementedError
