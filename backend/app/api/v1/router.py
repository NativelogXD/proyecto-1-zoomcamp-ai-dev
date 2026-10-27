from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.incidents import router as incidents_router
from app.api.v1.runbooks import router as runbooks_router
from app.api.v1.services import router as services_router
from app.api.v1.webhooks import router as webhooks_router
from app.core.database import get_db
from app.models.incident import Incident as IncidentModel
from app.models.service import Service as ServiceModel
from app.schemas.system import SystemStatusEnum, SystemSummaryResponse

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(services_router)
api_v1_router.include_router(incidents_router)
api_v1_router.include_router(runbooks_router)
api_v1_router.include_router(webhooks_router)


@api_v1_router.get("/system/summary", response_model=SystemSummaryResponse, tags=["System"])
def get_system_summary(db: Session = Depends(get_db)):
    total_services = db.query(ServiceModel).count()
    healthy_services = db.query(ServiceModel).filter(ServiceModel.status == "HEALTHY").count()
    active_incidents = (
        db.query(IncidentModel).filter(IncidentModel.status.in_(["OPEN", "INVESTIGATING"])).count()
    )
    resolved_incidents = (
        db.query(IncidentModel).filter(IncidentModel.status.in_(["MITIGATED", "RESOLVED"])).count()
    )

    if active_incidents == 0 and healthy_services == total_services:
        status = SystemStatusEnum.OPERATIONAL
    elif any(
        db.query(IncidentModel)
        .filter(IncidentModel.status.in_(["OPEN", "INVESTIGATING"]), IncidentModel.severity == "P1")
        .all()
    ):
        status = SystemStatusEnum.CRITICAL
    else:
        status = SystemStatusEnum.DEGRADED

    return SystemSummaryResponse(
        total_services=total_services,
        healthy_services=healthy_services,
        active_incidents=active_incidents,
        resolved_incidents=resolved_incidents,
        system_status=status,
    )
