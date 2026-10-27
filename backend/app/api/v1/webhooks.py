import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.incident import Incident as IncidentModel
from app.models.service import Service as ServiceModel
from app.schemas.incident import AlertWebhookPayload, Incident

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/alert", response_model=Incident, status_code=status.HTTP_201_CREATED)
def ingest_alert_webhook(payload: AlertWebhookPayload, db: Session = Depends(get_db)):
    service = db.query(ServiceModel).filter(ServiceModel.id == payload.service_id).first()
    if not service:
        # Auto-provision or reject
        service = ServiceModel(
            id=payload.service_id,
            name=f"Service {payload.service_id}",
            environment="production",
            status="DEGRADED",
            error_rate=0.08,
        )
        db.add(service)
    else:
        service.status = "DEGRADED"
        service.error_rate = 0.08

    incident_id = f"inc-{uuid.uuid4().hex[:6]}"
    desc = (
        payload.details
        or payload.summary
        or f"Alert notification triggered by {payload.alert_name}"
    )

    incident = IncidentModel(
        id=incident_id,
        title=f"Alert: {payload.alert_name} on {payload.service_id}",
        description=desc,
        service_id=payload.service_id,
        severity=payload.severity.value,
        status="OPEN",
        created_at=datetime.now(UTC),
    )

    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident
