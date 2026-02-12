"""
Drift monitoring models for behavioral change detection.

Tracks model version baselines, detects score drift between eval runs,
and manages regression test schedules. Aligns with patent Claims 12
(agent certification versioning), 21 (continuous governance), and 23
(immutable versioning).
"""

import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, DateTime, ForeignKey, Boolean, Numeric, Text, JSON,
)
from sqlalchemy.orm import relationship

from src.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class DriftBaseline(Base):
    """
    A pinned evaluation run that serves as the behavioral reference point.

    When a new eval run completes for the same character + model_provider,
    scores are compared against the baseline to detect drift.
    """

    __tablename__ = "drift_baselines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    character_card_id = Column(String(36), ForeignKey("character_cards.id"), nullable=False)
    eval_run_id = Column(String(36), ForeignKey("eval_runs.id"), nullable=False)

    # What this baseline captures
    model_provider = Column(String(100), nullable=False)
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(100), nullable=True)
    judge_model_name = Column(String(100), nullable=True)

    # Cached scores for fast comparison (avoid re-querying eval_run)
    baseline_canon = Column(Numeric(5, 2))
    baseline_voice = Column(Numeric(5, 2))
    baseline_safety = Column(Numeric(5, 2))
    baseline_legal = Column(Numeric(5, 2))
    baseline_total = Column(Numeric(5, 2))

    # Status
    active = Column(Boolean, default=True, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)

    # Relationships
    organization = relationship("Organization")
    character_card = relationship("CharacterCard")
    eval_run = relationship("EvalRun", foreign_keys=[eval_run_id])
    creator = relationship("User", foreign_keys=[created_by])

    def __repr__(self):
        return f"<DriftBaseline(character={self.character_card_id}, model={self.model_provider}/{self.model_name})>"

    def to_dict(self) -> dict:
        """Convert to dictionary for API response."""
        return {
            "id": self.id,
            "organization_id": self.organization_id,
            "character_card_id": self.character_card_id,
            "eval_run_id": self.eval_run_id,
            "model_provider": self.model_provider,
            "model_name": self.model_name,
            "model_version": self.model_version,
            "judge_model_name": self.judge_model_name,
            "baseline_canon": float(self.baseline_canon) if self.baseline_canon else None,
            "baseline_voice": float(self.baseline_voice) if self.baseline_voice else None,
            "baseline_safety": float(self.baseline_safety) if self.baseline_safety else None,
            "baseline_legal": float(self.baseline_legal) if self.baseline_legal else None,
            "baseline_total": float(self.baseline_total) if self.baseline_total else None,
            "active": self.active,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class DriftEvent(Base):
    """
    A detected behavioral change between a new eval and its baseline.

    Created automatically when check_for_drift() finds threshold breaches.
    Severity levels: info (3+ point shift), warning (7+), critical (12+ or certification lost).
    """

    __tablename__ = "drift_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    character_card_id = Column(String(36), ForeignKey("character_cards.id"), nullable=False)
    baseline_id = Column(String(36), ForeignKey("drift_baselines.id"), nullable=False)
    eval_run_id = Column(String(36), ForeignKey("eval_runs.id"), nullable=False)

    # What changed
    drift_type = Column(String(50))   # score_drop, score_spike, dimension_shift, certification_lost
    severity = Column(String(20))     # info, warning, critical

    # Score deltas (new - baseline; negative = regression)
    delta_canon = Column(Numeric(5, 2))
    delta_voice = Column(Numeric(5, 2))
    delta_safety = Column(Numeric(5, 2))
    delta_legal = Column(Numeric(5, 2))
    delta_total = Column(Numeric(5, 2))

    # Context
    old_model_version = Column(String(100))
    new_model_version = Column(String(100))
    summary = Column(Text)  # Human-readable explanation of what drifted

    # Acknowledgement tracking
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    organization = relationship("Organization")
    character_card = relationship("CharacterCard")
    baseline = relationship("DriftBaseline")
    eval_run = relationship("EvalRun", foreign_keys=[eval_run_id])
    acknowledger = relationship("User", foreign_keys=[acknowledged_by])

    def __repr__(self):
        return f"<DriftEvent(type={self.drift_type}, severity={self.severity})>"

    def to_dict(self) -> dict:
        """Convert to dictionary for API response."""
        return {
            "id": self.id,
            "organization_id": self.organization_id,
            "character_card_id": self.character_card_id,
            "baseline_id": self.baseline_id,
            "eval_run_id": self.eval_run_id,
            "drift_type": self.drift_type,
            "severity": self.severity,
            "delta_canon": float(self.delta_canon) if self.delta_canon else None,
            "delta_voice": float(self.delta_voice) if self.delta_voice else None,
            "delta_safety": float(self.delta_safety) if self.delta_safety else None,
            "delta_legal": float(self.delta_legal) if self.delta_legal else None,
            "delta_total": float(self.delta_total) if self.delta_total else None,
            "old_model_version": self.old_model_version,
            "new_model_version": self.new_model_version,
            "summary": self.summary,
            "acknowledged": self.acknowledged,
            "acknowledged_at": self.acknowledged_at.isoformat() if self.acknowledged_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class DriftAlertConfig(Base):
    """
    Per-organization alert preferences for drift events.

    Allows customizing thresholds and notification channels.
    """

    __tablename__ = "drift_alert_configs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, unique=True)

    # Threshold overrides (defaults in DriftDetectionService)
    warning_threshold = Column(Numeric(5, 2), default=7.0)
    critical_threshold = Column(Numeric(5, 2), default=12.0)

    # Notification preferences
    notify_on_warning = Column(Boolean, default=True)
    notify_on_critical = Column(Boolean, default=True)
    webhook_url = Column(String(500), nullable=True)
    email_recipients = Column(JSON, default=[])

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    # Relationships
    organization = relationship("Organization")

    def __repr__(self):
        return f"<DriftAlertConfig(org={self.organization_id})>"


class RegressionTestSchedule(Base):
    """
    Scheduled regression test configuration.

    Runs a test suite against specified models on a schedule,
    comparing results to the pinned baseline. Patent Claim 12:
    agent certification versioning.
    """

    __tablename__ = "regression_test_schedules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    character_card_id = Column(String(36), ForeignKey("character_cards.id"), nullable=False)
    test_suite_id = Column(String(36), ForeignKey("test_suites.id"), nullable=False)

    # What to test
    model_provider = Column(String(100), nullable=False)
    model_names = Column(JSON, nullable=False)  # ["gpt-4o-mini", "gpt-4o"]
    baseline_id = Column(String(36), ForeignKey("drift_baselines.id"), nullable=False)

    # Schedule
    frequency = Column(String(50), default="weekly")  # daily, weekly, monthly, on_release
    last_run_at = Column(DateTime, nullable=True)
    next_run_at = Column(DateTime, nullable=True)
    enabled = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    organization = relationship("Organization")
    character_card = relationship("CharacterCard")
    test_suite = relationship("TestSuite")
    baseline = relationship("DriftBaseline")

    def __repr__(self):
        return f"<RegressionTestSchedule(character={self.character_card_id}, freq={self.frequency})>"

    def to_dict(self) -> dict:
        """Convert to dictionary for API response."""
        return {
            "id": self.id,
            "organization_id": self.organization_id,
            "character_card_id": self.character_card_id,
            "test_suite_id": self.test_suite_id,
            "model_provider": self.model_provider,
            "model_names": self.model_names,
            "baseline_id": self.baseline_id,
            "frequency": self.frequency,
            "last_run_at": self.last_run_at.isoformat() if self.last_run_at else None,
            "next_run_at": self.next_run_at.isoformat() if self.next_run_at else None,
            "enabled": self.enabled,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
