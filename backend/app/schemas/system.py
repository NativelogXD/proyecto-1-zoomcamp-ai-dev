from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class SystemStatusEnum(str, Enum):
    OPERATIONAL = "OPERATIONAL"
    DEGRADED = "DEGRADED"
    CRITICAL = "CRITICAL"


class HealthResponse(BaseModel):
    status: str = "ok"
    timestamp: datetime
    database: str = "connected"
    version: str = "1.0.0"


class SystemSummaryResponse(BaseModel):
    total_services: int
    healthy_services: int
    active_incidents: int
    resolved_incidents: int
    system_status: SystemStatusEnum
