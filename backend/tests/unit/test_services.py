def test_health_check(client):
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "timestamp" in data
    assert data["version"] == "1.0.0"


def test_list_services(client):
    response = client.get("/api/v1/services")
    assert response.status_code == 200
    services = response.json()
    assert len(services) >= 4
    service_ids = [s["id"] for s in services]
    assert "srv-orders" in service_ids
    assert "srv-payments" in service_ids


def test_get_service_by_id(client):
    response = client.get("/api/v1/services/srv-orders")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "srv-orders"
    assert data["name"] == "Order Processing API"


def test_get_service_not_found(client):
    response = client.get("/api/v1/services/srv-nonexistent")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_create_service(client):
    payload = {
        "id": "srv-notification",
        "name": "Notification Service",
        "description": "Sends push and email alerts",
        "environment": "staging",
    }
    response = client.post("/api/v1/services", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == "srv-notification"
    assert data["status"] == "HEALTHY"
    assert data["environment"] == "staging"


def test_create_duplicate_service_fails(client):
    payload = {"id": "srv-orders", "name": "Duplicate Orders"}
    response = client.post("/api/v1/services", json=payload)
    assert response.status_code == 400
