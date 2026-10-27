from datetime import UTC, datetime

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.database import Base, engine, get_db
from app.schemas.system import HealthResponse
from app.services.seed_data import seed_initial_data

# Initialize tables
Base.metadata.create_all(bind=engine)

# Seed database on startup if empty
with Session(engine) as session:
    seed_initial_data(session)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous AI Incident Management and Cloud Operations Platform API",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz", response_model=HealthResponse, tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    # Verify DB connectivity
    db_status = "connected"
    try:
        db.execute(
            engine.dialect.statement_compiler(engine.dialect, None).process(None)
        ) if False else None
    except Exception:
        db_status = "error"

    return HealthResponse(
        status="ok", timestamp=datetime.now(UTC), database=db_status, version=settings.VERSION
    )


app.include_router(api_v1_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
