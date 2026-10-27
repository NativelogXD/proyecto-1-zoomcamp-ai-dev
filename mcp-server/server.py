#!/usr/bin/env python3
"""
CloudOps Commander MCP Server
Exposes operational tools to coding agents (Claude Code, Cursor, Antigravity, OpenCode).
"""

import httpx
import os
from typing import Dict, Any, List

API_BASE_URL = os.getenv("CLOUDOPS_API_URL", "http://localhost:8000")

def get_client() -> httpx.Client:
    return httpx.Client(base_url=API_BASE_URL, timeout=10.0)

def list_active_incidents(status: str = "OPEN") -> List[Dict[str, Any]]:
    """List current active or unmitigated incidents from CloudOps Commander."""
    with get_client() as client:
        res = client.get(f"/api/v1/incidents?status={status}")
        res.raise_for_status()
        return res.json()

def get_service_telemetry(service_id: str) -> Dict[str, Any]:
    """Retrieve real-time health, error rate, and p95 latency for a microservice."""
    with get_client() as client:
        res = client.get(f"/api/v1/services/{service_id}")
        res.raise_for_status()
        return res.json()

def trigger_ai_investigation(incident_id: str) -> Dict[str, Any]:
    """Run AI root-cause analysis on an incident to obtain evidence packet and recommended runbook."""
    with get_client() as client:
        res = client.post(f"/api/v1/incidents/{incident_id}/investigate")
        res.raise_for_status()
        return res.json()

def execute_remediation_runbook(runbook_id: str, incident_id: str) -> Dict[str, Any]:
    """Execute a validated SRE remediation runbook (e.g. restart service, flush cache)."""
    with get_client() as client:
        res = client.post(
            f"/api/v1/runbooks/{runbook_id}/execute",
            json={"incident_id": incident_id, "parameters": {}}
        )
        res.raise_for_status()
        return res.json()

if __name__ == "__main__":
    print("CloudOps Commander MCP Server available.")
    print("Available Tools:")
    print(" - list_active_incidents(status)")
    print(" - get_service_telemetry(service_id)")
    print(" - trigger_ai_investigation(incident_id)")
    print(" - execute_remediation_runbook(runbook_id, incident_id)")
