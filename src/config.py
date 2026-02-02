"""
Configuration management for MASH AI platform.

Loads settings from environment variables with sensible defaults.
"""

from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "MASH AI"
    app_version: str = "0.1.0"
    debug: bool = True
    environment: str = "development"

    # API
    api_prefix: str = "/api/v1"
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:5173"]

    @property
    def all_cors_origins(self) -> list[str]:
        """Get all CORS origins including frontend_url for production."""
        origins = self.cors_origins.copy()
        if self.frontend_url and self.frontend_url not in origins:
            origins.append(self.frontend_url)
        # Explicitly allow production Vercel domain
        if self.environment == "production":
            origins.append("https://eaas-mu.vercel.app")
        return origins

    # Authentication
    secret_key: str = "dev-secret-key-change-in-production-use-openssl-rand-hex-32"
    access_token_expire_minutes: int = 1440  # 24 hours

    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/mash_ai"

    # LLM Providers
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None

    # Evaluation Settings
    default_eval_model: str = "gpt-4o-mini"  # Cost-effective for evals
    eval_temperature: float = 0.0  # Deterministic for consistency
    max_eval_retries: int = 3

    # Scoring Thresholds
    canon_fidelity_threshold: float = 80.0
    voice_consistency_threshold: float = 70.0
    brand_safety_threshold: float = 95.0
    legal_compliance_threshold: float = 100.0
    total_score_threshold: float = 80.0

    # Weights for aggregate scoring
    weight_canon_fidelity: float = 0.30
    weight_voice_consistency: float = 0.25
    weight_brand_safety: float = 0.30
    weight_legal_compliance: float = 0.15

    # Frontend URL (for CORS and redirects)
    frontend_url: str = "http://localhost:3001"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"  # Ignore extra env variables


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
