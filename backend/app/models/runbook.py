from datetime import UTC, datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, Float, String, Text

from app.core.database import Base


def utc_now():
    return datetime.now(UTC)


class Runbook(Base):
    __tablename__ = "runbooks"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    target_service_id = Column(String, nullable=False)
    requires_confirmation = Column(Boolean, default=True)
    parameters_schema = Column(JSON, default=dict)


class RunbookExecutionLog(Base):
    __tablename__ = "runbook_execution_logs"

    id = Column(String, primary_key=True, index=True)
    runbook_id = Column(String, nullable=False)
    incident_id = Column(String, nullable=False)
    status = Column(String, default="SUCCESS")  # SUCCESS, FAILED
    execution_time_ms = Column(Float, default=0.0)
    logs = Column(JSON, default=list)
    executed_at = Column(DateTime, default=utc_now)
