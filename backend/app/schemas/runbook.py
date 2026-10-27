from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class RunbookStatusEnum(str, Enum):
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"


class Runbook(BaseModel):
    id: str
    title: str
    description: str
    target_service_id: str
    requires_confirmation: bool = True
    parameters_schema: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)


class RunbookExecutionRequest(BaseModel):
    incident_id: str
    parameters: dict[str, Any] = Field(default_factory=dict)


class RunbookExecutionResult(BaseModel):
    runbook_id: str
    execution_id: str
    status: RunbookStatusEnum
    execution_time_ms: float
    logs: list[str]
