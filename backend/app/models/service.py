from sqlalchemy import Column, Float, String

from app.core.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")
    environment = Column(String, default="production")
    status = Column(String, default="HEALTHY")  # HEALTHY, DEGRADED, DOWN
    latency_ms = Column(Float, default=25.0)
    error_rate = Column(Float, default=0.0)
    uptime_percentage = Column(Float, default=99.9)
