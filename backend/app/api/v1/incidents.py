import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.incident import Incident as IncidentModel
from app.models.service import Service as ServiceModel
from app.schemas.incident import (
    Incident,
    IncidentCreate,
    IncidentSeverityEnum,
    IncidentStatusEnum,
    IncidentUpdate,
    InvestigationResult,
)
from app.services.ai_investigator import AIIncidentInvestigator

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.get("", response_model=list[Incident])
def list_incidents(
    status: IncidentStatusEnum | None = Query(None),
    severity: IncidentSeverityEnum | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(IncidentModel)
    if status:
        query = query.filter(IncidentModel.status == status.value)
    if severity:
        query = query.filter(IncidentModel.severity == severity.value)
    return query.order_by(IncidentModel.created_at.desc()).all()


@router.post("", response_model=Incident, status_code=status.HTTP_201_CREATED)
def create_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
    service = db.query(ServiceModel).filter(ServiceModel.id == payload.service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service '{payload.service_id}' does not exist.",
        )

    incident_id = f"inc-{uuid.uuid4().hex[:6]}"
    incident = IncidentModel(
        id=incident_id,
        title=payload.title,
        description=payload.description or "",
        service_id=payload.service_id,
        severity=payload.severity.value,
        status="OPEN",
        created_at=datetime.now(UTC),
    )
    # Degrade service status if P1 or P2
    if payload.severity in [IncidentSeverityEnum.P1, IncidentSeverityEnum.P2]:
        service.status = "DEGRADED"
        service.error_rate = 0.05

    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


@router.get("/{incident_id}", response_model=Incident)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Incident '{incident_id}' not found."
        )
    return incident


@router.patch("/{incident_id}", response_model=Incident)
def update_incident(incident_id: str, payload: IncidentUpdate, db: Session = Depends(get_db)):
    incident = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Incident '{incident_id}' not found."
        )

    if payload.status:
        incident.status = payload.status.value
        if payload.status == IncidentStatusEnum.RESOLVED and not incident.resolved_at:
            incident.resolved_at = datetime.now(UTC)
            # Check if all other incidents for service are resolved
            other_active = (
                db.query(IncidentModel)
                .filter(
                    IncidentModel.service_id == incident.service_id,
                    IncidentModel.id != incident.id,
                    IncidentModel.status.in_(["OPEN", "INVESTIGATING", "DEGRADED"]),
                )
                .count()
            )
            if other_active == 0:
                service = (
                    db.query(ServiceModel).filter(ServiceModel.id == incident.service_id).first()
                )
                if service:
                    service.status = "HEALTHY"
                    service.error_rate = 0.001

    if payload.root_cause is not None:
        incident.root_cause = payload.root_cause
    if payload.ai_recommendation is not None:
        incident.ai_recommendation = payload.ai_recommendation

    db.commit()
    db.refresh(incident)
    return incident


@router.post("/{incident_id}/investigate", response_model=InvestigationResult)
def investigate_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Incident '{incident_id}' not found."
        )

    service = db.query(ServiceModel).filter(ServiceModel.id == incident.service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Associated service '{incident.service_id}' not found.",
        )

    # Set status to INVESTIGATING
    incident.status = "INVESTIGATING"

    result = AIIncidentInvestigator.investigate(incident, service)
    incident.root_cause = result.root_cause
    incident.ai_recommendation = f"Recommended: {result.recommended_runbook_id}"

    db.commit()
    return result
