# AI Tool & Data Governance Policy

**Project:** CloudOps Commander  
**Effective Date:** 2026-10-27  
**Scope:** All developers, AI coding assistants (Antigravity, Claude Code, Cursor, Copilot), and autonomous subagents.

---

## 1. Acceptable Use of AI Assistants

1. **Assisted Development, Not Blind Acceptance:**
   - AI tools may generate code suggestions, tests, documentation, and operational scripts.
   - Every AI-generated line of code must be reviewed by a human engineer before merging into `main`.
2. **Context Boundaries:**
   - Provide only project-relevant files (`AGENTS.md`, `openapi.yaml`, specific modules) to coding agents.
   - Do not index or provide sensitive user production databases or private encryption keys to LLM contexts.

---

## 2. Secrets & Credential Protection

- **Zero Secret Ingestion:** API tokens, database connection passwords, SSH private keys, and cloud credentials must never appear in prompts, context files, or git commits.
- **Environment Isolation:** Secrets are injected strictly via container environment variables or cloud secret managers (AWS Secrets Manager / Vault), never written into repository files.

---

## 3. Autonomous Agent Guardrails

1. **Read vs Write Isolation:** Autonomous incident responders may read logs and telemetry freely. However, state-changing remediation actions (such as container restarts or cache flushes) must require confirmation if marked with `requires_confirmation: true`.
2. **Deterministic Fallbacks:** AI diagnostics must rely on structured, inspectable evidence packets rather than free-form hallucination.
3. **Audit Trail:** All automated decisions must produce structured logs for post-mortem compliance.
