---
name: investigate-incident
description: Autonomous step-by-step procedure for investigating production incidents, analyzing telemetry packets, and recommending SRE runbooks.
---

# Skill: Production Incident Investigation

Use this skill whenever an alert triggers or an incident is opened in CloudOps Commander.

## Step 1: Ingest Context & Identify Service
1. Query the incident details:
   ```bash
   curl -s http://localhost:8000/api/v1/incidents/<incident_id>
   ```
2. Retrieve current telemetry of the target service:
   ```bash
   curl -s http://localhost:8000/api/v1/services/<service_id>
   ```

## Step 2: Correlate Signals & Synthesize Evidence Packet
1. Review recent logs for `5xx`, `timeout`, or deadlock patterns.
2. Check if a recent commit or deployment coincides with the error spike.
3. Classify severity:
   - `P1`: Total service outage or >5% error rate on critical paths.
   - `P2`: High degradation or latency exceeding 1000ms.
   - `P3`: Minor warning / intermittent failure.

## Step 3: Trigger AI Diagnostic Analysis
1. Invoke the AI Investigator endpoint:
   ```bash
   curl -s -X POST http://localhost:8000/api/v1/incidents/<incident_id>/investigate
   ```
2. Verify confidence score and recommended runbook ID.

## Step 4: Propose or Execute Remediation
1. If the recommended runbook has `requires_confirmation: true`, prompt the human SRE operator before running.
2. If confirmed, execute the runbook:
   ```bash
   curl -s -X POST http://localhost:8000/api/v1/runbooks/<runbook_id>/execute \
     -H "Content-Type: application/json" \
     -d '{"incident_id": "<incident_id>", "parameters": {}}'
   ```
3. Verify that the target service health status returns to `HEALTHY`.
