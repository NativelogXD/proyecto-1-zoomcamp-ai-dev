from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Text

from app.core.database import Base


def utc_now():
    return datetime.now(UTC)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    service_id = Column(String, ForeignKey("services.id"), nullable=False)
    severity = Column(String, default="P2")  # P1, P2, P3, P4
    status = Column(String, default="OPEN")  # OPEN, INVESTIGATING, MITIGATED, RESOLVED
    created_at = Column(DateTime, default=utc_now)
    resolved_at = Column(DateTime, nullable=True)
    root_cause = Column(Text, nullable=True)
    ai_recommendation = Column(Text, nullable=True)
