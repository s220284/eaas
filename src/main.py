"""
MASH AI - Managed Evals-as-a-Service

FastAPI application for the Character Trust Layer platform.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import get_settings
from src.database import engine, Base
from src.api import auth, characters, evaluations, organizations

settings = get_settings()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MASH AI",
    description="Character Trust Layer - Evals-as-a-Service for IP Owners",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS middleware - use all_cors_origins which includes frontend_url
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.all_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(organizations.router, prefix="/api/v1/organizations", tags=["organizations"])
app.include_router(characters.router, prefix="/api/v1/characters", tags=["characters"])
app.include_router(evaluations.router, prefix="/api/v1/evaluations", tags=["evaluations"])


@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "MASH AI", "version": "0.1.0"}


@app.get("/health")
def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "version": "0.1.0",
    }
