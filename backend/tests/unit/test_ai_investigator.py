def test_ai_investigate_incident(client):
    response = client.post("/api/v1/incidents/inc-101/investigate")
    assert response.status_code == 200
    data = response.json()
    assert data["incident_id"] == "inc-101"
    assert data["confidence_score"] > 90.0
    assert "root_cause" in data
    assert "evidence_packet" in data
    assert data["recommended_runbook_id"] == "rb-restart-service"
    assert len(data["action_plan"]) > 0

    # Incident status should now be INVESTIGATING
    inc_resp = client.get("/api/v1/incidents/inc-101")
    assert inc_resp.json()["status"] == "INVESTIGATING"


def test_investigate_nonexistent_incident(client):
    response = client.post("/api/v1/incidents/inc-doesnotexist/investigate")
    assert response.status_code == 404
