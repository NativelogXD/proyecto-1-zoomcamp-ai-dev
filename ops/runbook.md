# SRE Operational Runbook & Incident Response Playbook

**System:** CloudOps Commander  
**Target Architecture:** Distributed Microservices Fleet (Order API, Payments, Auth, Inventory)  
**Maintained by:** Site Reliability Engineering (SRE) Team

---

## 🎯 1. Incident Classification Matrix

| Severity Level | Response SLA | Triggers | Escalation Path |
| :---: | :---: | :--- | :--- |
| **P1 — Critical** | < 5 min | Service outage, 5xx rate > 5%, payment gateway failure | On-call SRE + Incident Commander |
| **P2 — High** | < 15 min | p95 latency > 1000ms, non-critical service degraded, pool capacity > 85% | Primary On-Call Engineer |
| **P3 — Medium** | < 1 hour | Intermittent errors, background queue backlog | Service Squad Lead |
| **P4 — Low** | Next business day | Minor cosmetic or non-blocking diagnostic warnings | Development Backlog |

---

## 🚨 2. Standard Operating Procedures (SOP)

### SOP-01: High 5xx HTTP Error Rate on Order API
- **Symptoms:** Prometheus alert `HighHttp5xxErrorRate` triggers; Grafana shows spike in HTTP 500 responses on `/api/orders`.
- **Diagnosis:**
  1. Inspect error stack trace using `/api/v1/incidents/{id}/investigate` or MCP tool `query_incident_logs`.
  2. Correlate with recent deployments.
- **Remediation Action:**
  - Execute Runbook: `rb-restart-service`
  ```bash
  curl -X POST http://localhost:8000/api/v1/runbooks/rb-restart-service/execute \
    -H "Content-Type: application/json" \
    -d '{"incident_id": "<INCIDENT_ID>", "parameters": {"graceful_timeout_sec": 5}}'
  ```
- **Verification:**
  - Check `/api/v1/services/srv-orders` status: must be `HEALTHY` with error rate < 0.1%.

---

### SOP-02: Connection Pool Exhaustion / Deadlocks
- **Symptoms:** Database queries timing out; active connection count reaches maximum limit.
- **Remediation Action:**
  - Execute Runbook: `rb-flush-cache`
  ```bash
  curl -X POST http://localhost:8000/api/v1/runbooks/rb-flush-cache/execute \
    -H "Content-Type: application/json" \
    -d '{"incident_id": "<INCIDENT_ID>", "parameters": {"flush_all": false}}'
  ```
- **Verification:**
  - Connection pool drops below 20% utilization.

---

### SOP-03: Sudden Traffic Spike & High Latency
- **Symptoms:** p95 latency exceeds 1500ms during flash sales or marketing campaigns.
- **Remediation Action:**
  - Execute Runbook: `rb-scale-replicas`
  ```bash
  curl -X POST http://localhost:8000/api/v1/runbooks/rb-scale-replicas/execute \
    -H "Content-Type: application/json" \
    -d '{"incident_id": "<INCIDENT_ID>", "parameters": {"replicas": 4}}'
  ```
- **Verification:**
  - Service latency normalizes below 50ms.

---

### SOP-04: Deployment Regression
- **Symptoms:** New container release introduces breaking API contract or unexpected exceptions.
- **Remediation Action:**
  - Execute Runbook: `rb-rollback-deployment`
  ```bash
  curl -X POST http://localhost:8000/api/v1/runbooks/rb-rollback-deployment/execute \
    -H "Content-Type: application/json" \
    -d '{"incident_id": "<INCIDENT_ID>", "parameters": {"target_revision": "previous"}}'
  ```
- **Verification:**
  - Service rolls back to previous stable release tag, smoke tests pass.
