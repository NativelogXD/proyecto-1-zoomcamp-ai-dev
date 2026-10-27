def test_full_incident_lifecycle_workflow(client):
    """
    End-to-end integration test validating the closed-loop incident management lifecycle:
    1. External monitoring alert is ingested via webhook.
    2. Incident is registered and target service degrades.
    3. System summary metrics reflect degraded state.
    4. AI diagnostic engine investigates root cause and produces an evidence packet.
    5. Remediation runbook is executed.
    6. System restores to HEALTHY and incident marked RESOLVED with audit trail.
    """
    # Step 1: Alert Ingestion via Webhook
    alert_payload = {
        "alert_name": "HighLatencyAnomaly",
        "service_id": "srv-orders",
        "severity": "P1",
        "summary": "p95 latency exceeded 2000ms threshold",
        "details": "High queue depth in worker threads handling order fulfillment",
    }
    webhook_res = client.post("/api/v1/webhooks/alert", json=alert_payload)
    assert webhook_res.status_code == 201
    incident = webhook_res.json()
    incident_id = incident["id"]
    assert incident["status"] == "OPEN"
    assert incident["severity"] == "P1"

    # Step 2: Verify Service Health Degraded in Database
    srv_res = client.get("/api/v1/services/srv-orders")
    assert srv_res.status_code == 200
    assert srv_res.json()["status"] == "DEGRADED"

    # Step 3: Check System Summary Reflects Critical/Degraded Status
    summary_res = client.get("/api/v1/system/summary")
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["active_incidents"] >= 1
    assert summary["system_status"] in ["DEGRADED", "CRITICAL"]

    # Step 4: AI Diagnostic Engine Triggered
    investigation_res = client.post(f"/api/v1/incidents/{incident_id}/investigate")
    assert investigation_res.status_code == 200
    diag = investigation_res.json()
    assert diag["incident_id"] == incident_id
    assert diag["confidence_score"] > 85.0
    recommended_rb = diag["recommended_runbook_id"]
    assert recommended_rb in ["rb-scale-replicas", "rb-restart-service", "rb-flush-cache"]

    # Verify Incident State is now INVESTIGATING
    inc_check = client.get(f"/api/v1/incidents/{incident_id}")
    assert inc_check.json()["status"] == "INVESTIGATING"

    # Step 5: Execute Recommended Runbook Action
    exec_res = client.post(
        f"/api/v1/runbooks/{recommended_rb}/execute",
        json={"incident_id": incident_id, "parameters": {"replicas": 4}},
    )
    assert exec_res.status_code == 200
    exec_data = exec_res.json()
    assert exec_data["status"] == "SUCCESS"
    assert len(exec_data["logs"]) > 0

    # Step 6: Verify Closed Loop - Incident Resolved & Service Restored
    inc_final = client.get(f"/api/v1/incidents/{incident_id}")
    assert inc_final.json()["status"] == "RESOLVED"
    assert inc_final.json()["resolved_at"] is not None

    srv_final = client.get("/api/v1/services/srv-orders")
    assert srv_final.json()["status"] == "HEALTHY"
