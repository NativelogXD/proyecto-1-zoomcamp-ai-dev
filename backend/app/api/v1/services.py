from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.service import Service as ServiceModel
from app.schemas.service import Service, ServiceCreate

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("", response_model=list[Service])
def list_services(db: Session = Depends(get_db)):
    return db.query(ServiceModel).all()


@router.post("", response_model=Service, status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceCreate, db: Session = Depends(get_db)):
    existing = db.query(ServiceModel).filter(ServiceModel.id == payload.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Service with id '{payload.id}' already exists.",
        )
    service = ServiceModel(
        id=payload.id,
        name=payload.name,
        description=payload.description or "",
        environment=payload.environment,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.get("/{service_id}", response_model=Service)
def get_service_by_id(service_id: str, db: Session = Depends(get_db)):
    service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Service '{service_id}' not found."
        )
    return service
