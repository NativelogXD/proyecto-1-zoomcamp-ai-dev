from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.incident import Incident as IncidentModel
from app.models.runbook import Runbook as RunbookModel
from app.models.service import Service as ServiceModel
from app.schemas.runbook import (
    Runbook,
    RunbookExecutionRequest,
    RunbookExecutionResult,
)
from app.services.runbook_runner import RunbookRunner

router = APIRouter(prefix="/runbooks", tags=["Runbooks"])


@router.get("", response_model=list[Runbook])
def list_runbooks(db: Session = Depends(get_db)):
    return db.query(RunbookModel).all()


@router.post("/{runbook_id}/execute", response_model=RunbookExecutionResult)
def execute_runbook(
    runbook_id: str, payload: RunbookExecutionRequest, db: Session = Depends(get_db)
):
    runbook = db.query(RunbookModel).filter(RunbookModel.id == runbook_id).first()
    if not runbook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Runbook '{runbook_id}' not found."
        )

    incident = db.query(IncidentModel).filter(IncidentModel.id == payload.incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident '{payload.incident_id}' not found.",
        )

    service = db.query(ServiceModel).filter(ServiceModel.id == incident.service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Associated service '{incident.service_id}' not found.",
        )

    result = RunbookRunner.execute(
        db=db, runbook=runbook, incident=incident, service=service, parameters=payload.parameters
    )
    return result
