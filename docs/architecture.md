# CloudOps Commander — Architecture & System Design

> Comprehensive design document detailing system architecture, data models, communication contracts, and the autonomous AI incident triage loop.

---

## 🏛️ 1. High-Level Architecture Topology

```mermaid
flowchart TD
    subgraph Clients["Observability Sources & Users"]
        WebUser["SRE / Operator UI<br/>(React SPA on :3000)"]
        Monitoring["Prometheus / Grafana / Webhooks"]
        AgentClient["AI Coding Assistant<br/>(Claude Code, Antigravity, Cursor)"]
    end

    subgraph Platform["CloudOps Commander Fleet (Docker Compose)"]
        subgraph FrontendLayer["Frontend Layer (:3000)"]
            SPA["Nginx Alpine Static Server<br/>React 18 + Vite"]
            APIClient["Centralized API Client<br/>services/api.js"]
            SPA --> APIClient
        end

        subgraph BackendLayer["Application & Operations Layer (:8000)"]
            FastAPI["FastAPI 0.115+ REST API<br/>app/main.py"]
            Contract["OpenAPI 3.0 Contract<br/>openapi.yaml"]
            AIInvestigator["AI Incident Investigator<br/>app/services/ai_investigator.py"]
            RunbookEngine["Runbook Execution Engine<br/>app/services/runbook_runner.py"]

            FastAPI <--> Contract
            FastAPI --> AIInvestigator
            FastAPI --> RunbookEngine
        end

        subgraph StorageLayer["Data & Persistence Layer (:5432)"]
            PostgresDB[("PostgreSQL 16 Engine<br/>(Production & Compose)")]
            SQLiteDB[("SQLite 3 Engine<br/>(Local Dev & In-Memory Tests)")]
        end

        subgraph MCPLayer["Agent Tooling Layer"]
            MCPServer["FastMCP Server<br/>mcp-server/server.py"]
        end
    end

    WebUser --> SPA
    APIClient -- "REST JSON HTTP/1.1" --> FastAPI
    Monitoring -- "POST /api/v1/webhooks/alert" --> FastAPI
    AgentClient -- "Stdio / SSE Tool Protocol" --> MCPServer
    MCPServer -- "REST API Calls" --> FastAPI

    FastAPI --> PostgresDB
    FastAPI -. "Fallback / Tests" .-> SQLiteDB
```

---

## 🔄 2. Incident Lifecycle & Autonomous Remediation Sequence

```mermaid
sequenceDiagram
    autonumber
    participant AlertSource as Prometheus / Webhook
    participant Backend as FastAPI Backend (:8000)
    participant DB as PostgreSQL / SQLite
    participant AI as AI Incident Investigator
    participant UI as SRE Dashboard (:3000)
    participant Operator as SRE Engineer

    AlertSource->>Backend: POST /api/v1/webhooks/alert (Alert Payload)
    Backend->>DB: Persist Incident (status: OPEN, severity: P1)
    Backend->>DB: Update target service status to DEGRADED
    Backend-->>AlertSource: HTTP 201 Created (Incident inc-xxx)

    UI->>Backend: Poll /api/v1/system/summary & /api/v1/incidents
    Backend-->>UI: Incident inc-xxx rendered on feed

    Operator->>UI: Clicks "AI Investigate" on inc-xxx
    UI->>Backend: POST /api/v1/incidents/inc-xxx/investigate
    Backend->>AI: Synthesize logs, stack traces, and commit diffs
    AI-->>Backend: Return Evidence Packet + Recommended Runbook (e.g. rb-restart-service)
    Backend->>DB: Update incident status to INVESTIGATING
    Backend-->>UI: Display Root Cause Analysis & Confidence Score (96%)

    Operator->>UI: Clicks "Execute Remediation"
    UI->>Backend: POST /api/v1/runbooks/rb-restart-service/execute
    Backend->>Backend: Execute validated container restart routine
    Backend->>DB: Log execution to runbook_execution_logs
    Backend->>DB: Update target service to HEALTHY
    Backend->>DB: Transition incident to RESOLVED (record resolved_at)
    Backend-->>UI: HTTP 200 OK (execution_time_ms: 1250ms, status: SUCCESS)
    UI-->>Operator: Banner: System restored to HEALTHY!
```

---

## 💾 3. Database Layer Architecture

The database architecture is built on SQLAlchemy 2.0 with dynamic dialect resolution:

1. **Local Development & Fast CI:**
   - Dialect: `sqlite:///./data/cloudops.db` (file-based) or `sqlite:///:memory:` (in-memory for pytest with `StaticPool`).
   - Advantage: Zero external prerequisites, instant test execution in 0.6 seconds.
2. **Production & Docker Compose:**
   - Dialect: `postgresql://cloudops:cloudops_password@postgres:5432/cloudops_db`.
   - Advantage: ACID compliance, transactional concurrency, production-grade indexing.
3. **Core Entities:**
   - `services`: Monitored microservice catalog, real-time SLAs, error rates, status.
   - `incidents`: Full lifecycle records, severity, root cause diagnosis, AI recommendations.
   - `runbooks`: Catalog of executable operational playbooks with parameter schemas.
   - `runbook_execution_logs`: Immutable audit log of every automated or manual execution.
