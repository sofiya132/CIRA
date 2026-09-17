# CIRA 🛡️

### **Cognitive Incident Response & Analytics**
An enterprise-grade, serverless campus safety engine that transforms chaotic emergency data into structured, real-time crisis intelligence. Built natively on AWS, **CIRA** automatically ingests multi-channel reports, aggregates related events, determines dynamic priority scores, and orchestrates critical escalation workflows when seconds matter most.


---

## 🚀 Key Features

*   **Intelligent AI Triage:** Leverages **AWS Bedrock LLMs** to extract critical metadata (threat types, intent, weapons, injuries) from unstructured text inputs.
*   **Incident Fusion Engine:** Dynamically groups isolated incident reports into a single, cohesive crisis timeline using geographic and temporal proximity algorithms.
*   **Dynamic Priority Scoring:** Employs a multi-variable threat-level algorithm evaluating immediate danger, victim vulnerability, and operational escalation.
*   **Automated State-Machine Escalation:** Orchestrates human-in-the-loop workflows via **AWS Step Functions** to alert responders and escalate unacknowledged emergencies to supervisors automatically.
*   **Real-Time Command Dashboard:** Streamlines responder communication with low-latency event streaming powered by **Amazon DynamoDB** and optimized frontend states.

---

## 🛠️ Architecture & Tech Stack

*   **Frontend:** React (Vite), TailwindCSS, Axios
*   **Backend & Processing:** Python, AWS Lambda, AWS Bedrock (Claude 3.5 Sonnet / Haiku), AWS Step Functions, Amazon SNS
*   **Database:** Amazon DynamoDB (Single-Table Design optimized for high-throughput, sub-second latency)
*   **Infrastructure:** Serverless Framework / AWS SAM

---

## 📁 Repository Structure

```text
CIRA/
│
├── frontend/                   # React Web Applications
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI (Navbar, IncidentCard, StatusBadge)
│       ├── pages/             # App Views (StudentReport, ResponderDashboard, CommandCenter)
│       └── services/          # API layer connectivity (api.js)
│
├── backend/                    # Serverless Python Microservices
│   ├── lambda/                # AWS Lambda Event Handlers
│   │   ├── reports/           # Crude ingestion points
│   │   ├── incidents/         # Unified incident lifecycle
│   │   ├── ai_extraction/     # AWS Bedrock parsing layer
│   │   ├── fusion/            # Duplicate & grouping controller
│   │   ├── priority/          # Threat-score calculator
│   │   ├── routing/           # Alert routing logic
│   │   └── timeline/          # Historical incident append log
│   │
│   ├── services/              # Core Domain Core Logic
│   │   ├── bedrock_service.py # Generative AI orchestration
│   │   ├── dynamodb_service.py# Data access layer patterns
│   │   ├── fusion_engine.py   # Spatiotemporal record aggregation
│   │   ├── priority_engine.py # Risk scoring algorithms
│   │   └── routing_engine.py  # Notification dispersal rules
│   │
│   ├── models/                # Pydantic / Native Data Schemas
│   └── requirements.txt
│
├── workflows/                  # AWS Orchestration Visuals
│   └── escalation/
│       └── state-machine.json # Step Functions JSON definitions
│
├── infrastructure/             # IaC CloudFormation Templates / Serverless YAMLs
│
├── docs/                       # High-fidelity architectural details
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DATABASE_SCHEMA.md
│
├── tests/                      # Core backend processing assertions
│   ├── test_fusion.py
│   └── test_priority.py
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 👥 Hackathon Team & System Map

CIRA was built entirely in **4 days** by a cross-functional squad of **4 engineers**. The repository mapping mirrors our core sprint tracks:

### 🧠 1. AI Integration Track
*   **Files:** `backend/lambda/ai_extraction/`, `backend/services/bedrock_service.py`
*   **Mission:** Handle prompt engineering and orchestrate **AWS Bedrock JSON mode** to parse chaotic unstructured user reports into strictly typed systemic schemas.

### ⚙️ 2. Core Backend & Fusion Track
*   **Files:** `backend/services/fusion_engine.py`, `backend/services/dynamodb_service.py`, `backend/lambda/fusion/`
*   **Mission:** Design single-table DynamoDB indexes and construct data processing systems capable of determining if independent reports are related to the same event.

### 💻 3. Frontend & Visualization Track
*   **Files:** All components inside `frontend/src/`
*   **Mission:** Build highly clean dashboards split into three perspectives: Student Reporting, Responder Triaging, and High-Level Command Center Monitoring.

### ☁️ 4. AWS Infrastructure & Workflow Track
*   **Files:** `workflows/escalation/`, `infrastructure/`
*   **Mission:** Design the state-machine workflow architecture (**AWS Step Functions**) responsible for timeout-based emergency escalation paths and automated SMS/Email routing via **Amazon SNS**.

---

## 🚦 Getting Started

### Prerequisites
*   Python 3.11+
*   Node.js 18+
*   AWS CLI configured with appropriate Sandbox credentials

### Local Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install project dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and populate secrets:
   ```bash
   cp .env.example .env
   ```

### Local Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install standard Node modules:
   ```bash
   npm install
   ```
3. Boot up the local hot-reloading development server:
   ```bash
   npm run dev
   ```

---

## ⚖️ License
This project is open-source software licensed under the MIT License.
