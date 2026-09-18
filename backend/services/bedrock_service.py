"""
Real Amazon Bedrock provider.

Only used when AI_PROVIDER=bedrock. Needs AWS credentials configured
(via `aws configure` or environment variables) and Bedrock model access
enabled in your AWS account/region for the model below.
"""

from __future__ import annotations

import json
import os

import boto3

from .ai_provider import AIProvider
from .prompts import SYSTEM_PROMPT, build_user_prompt

# Anthropic Claude on Bedrock. Swap the model id if your account has a
# different one enabled (check AWS console -> Bedrock -> Model access).
DEFAULT_MODEL_ID = os.getenv(
    "BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0"
)
DEFAULT_REGION = os.getenv("AWS_REGION", "us-east-1")


class BedrockProvider(AIProvider):
    def __init__(self, model_id: str = DEFAULT_MODEL_ID, region: str = DEFAULT_REGION):
        self._model_id = model_id
        self._client = boto3.client("bedrock-runtime", region_name=region)

    @property
    def name(self) -> str:
        return "bedrock"

    def extract(self, raw_text: str, location_hint: str | None = None) -> str:
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 400,
            "temperature": 0,
            "system": SYSTEM_PROMPT,
            "messages": [
                {
                    "role": "user",
                    "content": build_user_prompt(raw_text, location_hint),
                }
            ],
        }

        response = self._client.invoke_model(
            modelId=self._model_id,
            body=json.dumps(body),
            contentType="application/json",
            accept="application/json",
        )

        payload = json.loads(response["body"].read())
        # Claude on Bedrock returns content as a list of blocks.
        text = "".join(
            block.get("text", "") for block in payload.get("content", [])
        )
        return text.strip()
