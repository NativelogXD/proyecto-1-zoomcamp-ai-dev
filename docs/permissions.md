# Permissions & Least-Privilege Governance

This document establishes the security boundaries, authorization matrix, and human-in-the-loop requirements for agents interacting with CloudOps Commander.

---

## 🛡️ 1. Least-Privilege Access Matrix

| Component / Action | Scope | Access Level | Confirmation Required? |
| :--- | :--- | :--- | :--- |
| **Health & Telemetry Inspection** | `/healthz`, `/api/v1/services` | Read-Only | No |
| **Incident List & Details** | `/api/v1/incidents` | Read-Only | No |
| **Trigger AI Diagnostic** | `/api/v1/incidents/{id}/investigate` | Analyze / Read | No |
| **Graceful Container Restart** | `rb-restart-service` | Execute | **Yes (Human Operator)** |
| **Flush Redis Cache** | `rb-flush-cache` | Execute | **Yes (Human Operator)** |
| **Horizontal Pod Autoscaling** | `rb-scale-replicas` | Execute | No (Bounded parameter: max 5) |
| **Deployment Rollback** | `rb-rollback-deployment` | Execute | **Yes (Senior SRE Approval)** |
| **Direct Production Database Mutations** | Raw SQL against PostgreSQL | **Blocked** | Never Allowed |
| **Direct Host Shell Access** | `ssh` / `bash` on host machine | **Blocked** | Never Allowed |

---

## 🔒 2. Guardrails Enforcement

1. **Parameter Whitelisting:** All runbooks validate execution arguments against predefined JSON schemas. Arbitrary command strings are rejected at the API layer.
2. **Audit Logging:** Every runbook execution writes an immutable record to the `runbook_execution_logs` table, storing the operator ID, target incident ID, execution duration, and timestamp.
3. **Pre-Commit Secrets Scanning:** Any patch produced by an agent must pass `agent-hooks/pre-commit-check.sh` before being accepted into the codebase.
