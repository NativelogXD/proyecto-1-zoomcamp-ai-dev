# AGENTS.md — CloudOps Commander Agent Instructions

> Durable context, architecture conventions, command shortcuts, and security guardrails for AI coding assistants and autonomous agents.

---

## 🎯 1. Project Mission & Identity

**CloudOps Commander** is a production-grade AI incident management and cloud operations platform built during the **AI Dev Tools Zoomcamp 2026** (DataTalks.Club).
- **Core Purpose:** Bridge observability alerts, automated root-cause investigation, and safe runbook remediation.
- **Contract-First:** All API endpoints and data transfer contracts must strictly adhere to `openapi.yaml`.

---

## 🏗️ 2. Architectural Conventions

```text
cloudops-commander/
├── product-spec.md                # System specification & acceptance criteria
├── AGENTS.md                      # This durable instruction file
├── openapi.yaml                   # Single source of truth for all API contracts
├── docker-compose.yml             # Full-stack multi-container runtime
├── frontend/                      # SPA (React + Vite, centralized API service)
├── backend/                       # REST API (FastAPI, Python 3.12, uv)
│   ├── app/
│   │   ├── api/v1/                # Endpoint routers matching openapi.yaml
│   │   ├── core/                  # Database config, settings, lifecycle
│   │   ├── models/                # SQLAlchemy / SQLModel database entities
│   │   ├── schemas/               # Pydantic schemas mirroring OpenAPI specs
│   │   └── services/              # Business logic (AI engine, runbooks, metrics)
│   └── tests/
│       ├── unit/                  # Fast in-memory unit tests
│       └── integration/           # End-to-end database workflow tests
├── agent-capabilities/            # Reusable skills and subagents (Module 5)
├── agent-hooks/                   # Pre-commit checks & validation guardrails
├── mcp-server/                    # FastMCP server for IDE/agent tooling
├── security/                      # Security audits, scans & AI governance policy
└── ops/                           # Operational runbooks and telemetry
```

### Key Engineering Rules
1. **Never alter an API contract without updating `openapi.yaml` first.** The OpenAPI contract is the single source of truth.
2. **Dual Database Architecture:** The database layer must support both SQLite (`sqlite:///./data/cloudops.db`) for testing/local mode and PostgreSQL (`postgresql://...`) for production/Docker. Use standard SQL types and avoid SQLite-exclusive or Postgres-exclusive dialects.
3. **Centralized Frontend Client:** All HTTP requests from the frontend must pass through `frontend/src/services/api.js`. Never write ad-hoc `fetch()` calls inside individual UI components.
4. **Deterministic AI Diagnostic Engine:** The AI diagnostic engine in `backend/app/services/ai_investigator.py` must produce predictable, structured evidence packets with clear confidence scores and actionable recommendations.
5. **Separation of Tests:** Unit tests in `backend/tests/unit/` must never depend on an external database or network. Integration tests in `backend/tests/integration/` verify complete multi-step database transactions.

---

## 🛠️ 3. Standard Development Commands

### Backend (Python + `uv`)
```bash
# Navigate to backend
cd backend

# Install dependencies
uv sync

# Run development server
uv run uvicorn app.main:app --reload --port 8000

# Run unit tests
uv run pytest tests/unit -v

# Run integration tests
uv run pytest tests/integration -v

# Run linter & formatter checks
uv run ruff check .
```

### Frontend (React + Vite)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Run unit / component tests
npm test

# Build production bundle
npm run build
```

### Full-Stack Docker Compose
```bash
# Start all services (Backend + Frontend + PostgreSQL)
docker compose up --build -d

# Check health endpoint
curl http://localhost:8000/healthz

# View container logs
docker compose logs -f

# Teardown
docker compose down -v
```

---

## 🔒 4. Security & Guardrails

- **Secret Handling:** Never hardcode credentials, API tokens, or database passwords. Always read from environment variables defined in `.env.example`.
- **Runbook Safety:** Runbooks must validate input arguments against strict whitelists before executing remediation logic.
- **AI Tool Bounds:** The AI investigator is read-only for inspection and diagnosis. Remediation runbooks require explicit execution confirmation or human-in-the-loop validation.
