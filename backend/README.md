# SentinelX / CampusPulse — Member 2 Backend

Deterministic fusion + priority backend for turning multiple student
reports into a single actionable incident.

## Structure

```text
backend/
├── lambda/
│   ├── reports/handler.py     # POST /reports — ingest, fuse/create, prioritize
│   └── incidents/handler.py   # GET/PATCH /incidents — read & update incidents
├── services/
│   ├── dynamodb_service.py    # All DynamoDB access (boto3), env-var config
│   ├── fusion_engine.py       # Text/location/time/category similarity + fusion
│   └── priority_engine.py     # Deterministic (non-LLM) priority rules
├── models/
│   ├── report.py
│   └── incident.py
├── tests/
│   ├── test_fusion.py
│   └── test_priority.py
└── requirements.txt
```

## How it works

1. `POST /reports` receives a raw report (text, location, category, ...).
2. It's validated, timestamped, and stored (reports are never deleted).
3. `fusion_engine.find_matching_incident` scores the report against every
   active incident using:
   - **Text similarity** — TF-IDF + cosine similarity (pure Python, no ML deps)
   - **Location similarity** — normalized/synonym-aware Jaccard similarity
   - **Time proximity** — linear decay over a configurable window
   - **Category match** — exact match (1 or 0)
   - Weighted: `0.40*text + 0.30*location + 0.20*time + 0.10*category`
4. If the best score ≥ `FUSION_THRESHOLD` (default `0.75`), the report is
   **fused** into that incident (`report_count += 1`, `report_ids` appended).
   Otherwise a **new** incident is created.
5. `priority_engine.calculate_priority` applies fixed rules (never an LLM)
   to set/escalate the incident's priority.
6. The Lambda returns a clean JSON response for the frontend.

## Environment variables

| Variable              | Purpose                          | Default              |
|------------------------|-----------------------------------|-----------------------|
| `REPORTS_TABLE_NAME`   | DynamoDB table for reports        | `sentinelx-reports`   |
| `INCIDENTS_TABLE_NAME` | DynamoDB table for incidents      | `sentinelx-incidents` |
| `AWS_REGION`           | AWS region for the DynamoDB client| `us-east-1`           |

No AWS credentials are hardcoded — boto3 picks them up from the Lambda
execution role (or local AWS CLI config when testing locally).

## Running tests

```bash
cd backend
pip install -r requirements.txt
python -m unittest discover -s tests -v
```

## Explicitly NOT included in this backend

React frontend, Bedrock integration, responder routing, Step Functions,
SNS notifications, responder dashboard/command-center UI, authentication,
GPS, maps, computer vision, facial recognition.
