from enum import Enum

from pydantic import BaseModel, ConfigDict


class ServiceStatusEnum(str, Enum):
    HEALTHY = "HEALTHY"
    DEGRADED = "DEGRADED"
    DOWN = "DOWN"


class ServiceBase(BaseModel):
    name: str
    description: str | None = ""
    environment: str = "production"


class ServiceCreate(ServiceBase):
    id: str


class Service(ServiceBase):
    id: str
    status: ServiceStatusEnum = ServiceStatusEnum.HEALTHY
    latency_ms: float = 25.0
    error_rate: float = 0.0
    uptime_percentage: float = 99.9

    model_config = ConfigDict(from_attributes=True)
