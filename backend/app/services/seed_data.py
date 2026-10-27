from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.models.incident import Incident
from app.models.runbook import Runbook
from app.models.service import Service


def seed_initial_data(db: Session):
    """Pre-populates sample services, runbooks, and one initial incident if empty."""
    # Check if services already exist
    if db.query(Service).count() > 0:
        return

    # 1. Monitored Microservices
    services = [
        Service(
            id="srv-orders",
            name="Order Processing API",
            description="Core FastAPI microservice managing shopping carts, checkouts, and fulfillment",
            environment="production",
            status="DEGRADED",
            latency_ms=185.4,
            error_rate=0.048,
            uptime_percentage=98.9,
        ),
        Service(
            id="srv-payments",
            name="Payment Gateway Service",
            description="Integrations with Stripe, PayPal, and credit card processing",
            environment="production",
            status="HEALTHY",
            latency_ms=42.1,
            error_rate=0.001,
            uptime_percentage=99.98,
        ),
        Service(
            id="srv-auth",
            name="Authentication & Identity",
            description="OAuth2 and JWT token verification authority",
            environment="production",
            status="HEALTHY",
            latency_ms=18.6,
            error_rate=0.000,
            uptime_percentage=99.99,
        ),
        Service(
            id="srv-inventory",
            name="Inventory Warehouse Worker",
            description="Async queue consumer for inventory reservation and sync",
            environment="production",
            status="HEALTHY",
            latency_ms=88.0,
            error_rate=0.003,
            uptime_percentage=99.85,
        ),
    ]
    for s in services:
        db.add(s)

    # 2. Standard Operations Runbooks
    runbooks = [
        Runbook(
            id="rb-restart-service",
            title="Graceful Container Restart",
            description="Drains active HTTP traffic and performs a zero-downtime rolling restart of worker pods",
            target_service_id="srv-orders",
            requires_confirmation=True,
            parameters_schema={"graceful_timeout_sec": 5},
        ),
        Runbook(
            id="rb-flush-cache",
            title="Flush Distributed Redis Cache",
            description="Purges corrupted query cache and drops active locks causing connection pool pressure",
            target_service_id="srv-orders",
            requires_confirmation=True,
            parameters_schema={"flush_all": False},
        ),
        Runbook(
            id="rb-scale-replicas",
            title="Horizontal Pod Autoscaler Scale Up",
            description="Dynamically scales deployment replica count to absorb traffic surges and lower latency",
            target_service_id="srv-orders",
            requires_confirmation=False,
            parameters_schema={"replicas": 4},
        ),
        Runbook(
            id="rb-rollback-deployment",
            title="Emergency Canary Rollback",
            description="Rolls back current container release to the previous stable release tag",
            target_service_id="srv-orders",
            requires_confirmation=True,
            parameters_schema={"target_revision": "previous"},
        ),
    ]
    for rb in runbooks:
        db.add(rb)

    # 3. An initial active incident to explore immediately
    incident = Incident(
        id="inc-101",
        title="Spike in 5xx error rate on Order API checkout",
        description="Grafana Alert fired: HTTP 500 response rate exceeded 4.5% during express order processing",
        service_id="srv-orders",
        severity="P1",
        status="OPEN",
        created_at=datetime.now(UTC),
        root_cause=None,
        ai_recommendation=None,
    )
    db.add(incident)

    db.commit()
