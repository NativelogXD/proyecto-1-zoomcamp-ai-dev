from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict


class IncidentStatusEnum(str, Enum):
    OPEN = "OPEN"
    INVESTIGATING = "INVESTIGATING"
    MITIGATED = "MITIGATED"
    RESOLVED = "RESOLVED"


class IncidentSeverityEnum(str, Enum):
    P1 = "P1"
    P2 = "P2"
    P3 = "P3"
    P4 = "P4"


class IncidentBase(BaseModel):
    title: str
    description: str | None = ""
    service_id: str
    severity: IncidentSeverityEnum = IncidentSeverityEnum.P2


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(BaseModel):
    status: IncidentStatusEnum | None = None
    root_cause: str | None = None
    ai_recommendation: str | None = None


class Incident(IncidentBase):
    id: str
    status: IncidentStatusEnum = IncidentStatusEnum.OPEN
    created_at: datetime
    resolved_at: datetime | None = None
    root_cause: str | None = None
    ai_recommendation: str | None = None

    model_config = ConfigDict(from_attributes=True)


class InvestigationResult(BaseModel):
    incident_id: str
    confidence_score: float
    root_cause: str
    evidence_packet: dict[str, Any]
    recommended_runbook_id: str
    action_plan: list[str]


class AlertWebhookPayload(BaseModel):
    alert_name: str
    service_id: str
    severity: IncidentSeverityEnum
    summary: str | None = None
    details: str | None = None
