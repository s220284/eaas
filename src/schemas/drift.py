"""
Pydantic schemas for drift monitoring API.
"""

from datetime import datetime
from typing import Optional, List, Dict
from uuid import UUID

from pydantic import BaseModel, Field


# --- Baseline schemas ---

class BaselineCreate(BaseModel):
    """Pin an existing eval run as a drift baseline."""
    eval_run_id: UUID
    notes: Optional[str] = None


class BaselineResponse(BaseModel):
    """Drift baseline response."""
    id: UUID
    organization_id: UUID
    character_card_id: UUID
    eval_run_id: UUID
    model_provider: str
    model_name: str
    model_version: Optional[str]
    judge_model_name: Optional[str]
    baseline_canon: Optional[float]
    baseline_voice: Optional[float]
    baseline_safety: Optional[float]
    baseline_legal: Optional[float]
    baseline_total: Optional[float]
    active: bool
    notes: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


# --- Drift Event schemas ---

class DriftEventResponse(BaseModel):
    """Drift event response."""
    id: UUID
    organization_id: UUID
    character_card_id: UUID
    baseline_id: UUID
    eval_run_id: UUID
    drift_type: Optional[str]
    severity: Optional[str]
    delta_canon: Optional[float]
    delta_voice: Optional[float]
    delta_safety: Optional[float]
    delta_legal: Optional[float]
    delta_total: Optional[float]
    old_model_version: Optional[str]
    new_model_version: Optional[str]
    summary: Optional[str]
    acknowledged: bool
    acknowledged_by: Optional[UUID] = None
    acknowledged_at: Optional[datetime] = None
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class DriftEventAcknowledge(BaseModel):
    """Acknowledge a drift event."""
    pass  # No body needed; user comes from auth


# --- Timeline schema ---

class TimelinePoint(BaseModel):
    """Single data point in a score timeline."""
    eval_run_id: str
    model_version: Optional[str]
    canon_fidelity: Optional[float]
    voice_consistency: Optional[float]
    brand_safety: Optional[float]
    legal_compliance: Optional[float]
    total_score: Optional[float]
    is_baseline: bool
    created_at: datetime


class TimelineResponse(BaseModel):
    """Score history over time for a character."""
    character_card_id: str
    data_points: List[TimelinePoint]
    baseline: Optional[BaselineResponse] = None


# --- Compare schema ---

class RunComparisonResponse(BaseModel):
    """Side-by-side comparison of two eval runs."""
    baseline_run_id: str
    comparison_run_id: str
    delta_canon: float
    delta_voice: float
    delta_safety: float
    delta_legal: float
    delta_total: float
    severity: str
    drift_type: str


# --- Summary schema ---

class CharacterDriftSummary(BaseModel):
    """Drift health for a single character."""
    character_card_id: str
    character_name: str
    has_baseline: bool
    active_warnings: int
    active_criticals: int
    latest_total_score: Optional[float]
    baseline_total_score: Optional[float]
    trend: str  # "stable", "improving", "degrading"


class OrgDriftSummary(BaseModel):
    """Organization-wide drift health."""
    total_characters: int
    characters_with_baselines: int
    active_warnings: int
    active_criticals: int
    characters: List[CharacterDriftSummary]


# --- Alert Config schemas ---

class AlertConfigCreate(BaseModel):
    """Create or update alert configuration."""
    warning_threshold: float = Field(default=7.0, ge=0, le=100)
    critical_threshold: float = Field(default=12.0, ge=0, le=100)
    notify_on_warning: bool = True
    notify_on_critical: bool = True
    webhook_url: Optional[str] = None
    email_recipients: List[str] = Field(default_factory=list)


class AlertConfigResponse(BaseModel):
    """Alert configuration response."""
    id: UUID
    organization_id: UUID
    warning_threshold: Optional[float]
    critical_threshold: Optional[float]
    notify_on_warning: bool
    notify_on_critical: bool
    webhook_url: Optional[str]
    email_recipients: Optional[list]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# --- Regression Schedule schemas ---

class RegressionScheduleCreate(BaseModel):
    """Create a regression test schedule."""
    character_card_id: UUID
    test_suite_id: UUID
    model_provider: str
    model_names: List[str]
    baseline_id: UUID
    frequency: str = "weekly"  # daily, weekly, monthly, on_release


class RegressionScheduleResponse(BaseModel):
    """Regression test schedule response."""
    id: UUID
    organization_id: UUID
    character_card_id: UUID
    test_suite_id: UUID
    model_provider: str
    model_names: list
    baseline_id: UUID
    frequency: str
    last_run_at: Optional[datetime]
    next_run_at: Optional[datetime]
    enabled: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class RegressionRunResult(BaseModel):
    """Result of a single regression run against one model."""
    model_name: str
    eval_run_id: str
    drift_event_id: Optional[str]
    delta_total: float
    severity: str


class RegressionRunResponse(BaseModel):
    """Results from running a full regression schedule."""
    schedule_id: str
    results: List[RegressionRunResult]
    completed_at: datetime
