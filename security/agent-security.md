# Agent & MCP Threat Model & Security Architecture

This document analyzes the threat vectors specific to AI developer tools, autonomous coding subagents, and Model Context Protocol (MCP) servers.

---

## 🎯 1. Threat Modeling (STRIDE Analysis)

| Threat Category | Potential Attack Vector | CloudOps Commander Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Unauthorized agent masquerading as an SRE responder. | Webhook requests require shared secret header validation; MCP tools require local stdio or token authentication. |
| **Tampering** | LLM hallucinations generating destructive parameters (e.g. `rm -rf /`). | Runbooks reject arbitrary shell commands. Only pre-defined, schema-validated parameters are permitted. |
| **Repudiation** | Action executed without traceability. | Every invocation is recorded to `runbook_execution_logs` with caller context and UTC timestamp. |
| **Information Disclosure** | Agent leaking production database credentials into chat logs. | `agent-hooks/pre-commit-check.sh` blocks secret leaks. Credentials only exist in environment variables. |
| **Denial of Service** | Agent spawning an infinite loop of runbook restarts. | Rate-limiting on `/investigate` and `/execute` endpoints; debouncing on webhook ingestion. |
| **Elevation of Privilege** | Read-only agent attempting database drops. | Database user permissions in PostgreSQL are scoped to CRUD tables; DDL operations are blocked at runtime. |

---

## 🛡️ 2. Defense-in-Depth Layers

1. **Layer 1: Context Isolation (AGENTS.md & SKILL.md):** The agent operates within strict instructions, restricting actions to defined paths.
2. **Layer 2: Schema Validation (OpenAPI & Pydantic):** Every input is strictly validated before touching application logic.
3. **Layer 3: Bounded MCP Tools:** MCP tools only expose specific high-level API operations, preventing raw OS shell access.
4. **Layer 4: Human-in-the-Loop Confirmation:** Destructive or service-impacting runbooks require explicit confirmation before execution.
