def test_list_incidents(client):
    response = client.get("/api/v1/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert len(incidents) >= 1
    assert incidents[0]["id"] == "inc-101"


def test_create_incident(client):
    payload = {
        "title": "Payment webhook timeouts",
        "description": "504 Gateway Timeout while contacting Stripe",
        "service_id": "srv-payments",
        "severity": "P2",
    }
    response = client.post("/api/v1/incidents", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "OPEN"
    assert data["severity"] == "P2"

    # Verify service state degraded
    srv_resp = client.get("/api/v1/services/srv-payments")
    assert srv_resp.json()["status"] == "DEGRADED"


def test_update_incident_status(client):
    response = client.patch("/api/v1/incidents/inc-101", json={"status": "RESOLVED"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "RESOLVED"
    assert data["resolved_at"] is not None


def test_filter_incidents_by_severity(client):
    response = client.get("/api/v1/incidents?severity=P1")
    assert response.status_code == 200
    incidents = response.json()
    assert all(inc["severity"] == "P1" for inc in incidents)
