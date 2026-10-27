def test_list_runbooks(client):
    response = client.get("/api/v1/runbooks")
    assert response.status_code == 200
    runbooks = response.json()
    assert len(runbooks) >= 4
    rb_ids = [rb["id"] for rb in runbooks]
    assert "rb-restart-service" in rb_ids
    assert "rb-flush-cache" in rb_ids


def test_execute_runbook(client):
    payload = {"incident_id": "inc-101", "parameters": {"graceful_timeout_sec": 5}}
    response = client.post("/api/v1/runbooks/rb-restart-service/execute", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["runbook_id"] == "rb-restart-service"
    assert data["status"] == "SUCCESS"
    assert data["execution_time_ms"] > 0
    assert len(data["logs"]) >= 4

    # Verify incident is now RESOLVED
    inc_resp = client.get("/api/v1/incidents/inc-101")
    assert inc_resp.json()["status"] == "RESOLVED"

    # Verify service is back to HEALTHY
    srv_resp = client.get("/api/v1/services/srv-orders")
    assert srv_resp.json()["status"] == "HEALTHY"


def test_execute_nonexistent_runbook(client):
    payload = {"incident_id": "inc-101", "parameters": {}}
    response = client.post("/api/v1/runbooks/rb-ghost/execute", json=payload)
    assert response.status_code == 404
