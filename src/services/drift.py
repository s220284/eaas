"""
Drift Detection Service.

Compares evaluation results against baselines to detect behavioral drift
when model vendors ship updates. Aligns with patent Claim 21 (continuous
governance) and Claim 12 (agent certification versioning).
"""

from datetime import datetime, timedelta
from decimal import Decimal
from typing import Optional

from sqlalchemy.orm import Session

from src.models.drift import DriftBaseline, DriftEvent, DriftAlertConfig
from src.models.evaluation import EvalRun


class DriftDetectionService:
    """Compares evaluation results against baselines to detect behavioral drift."""

    # Default thresholds (overridable per-org via DriftAlertConfig)
    DEFAULT_THRESHOLDS = {
        "info": 3.0,       # Any dimension moves 3+ points
        "warning": 7.0,    # Any dimension moves 7+ points
        "critical": 12.0,  # Any dimension moves 12+ points OR certification lost
    }

    CANONSAFE_CERTIFICATION_THRESHOLD = 85.0

    def _get_thresholds(self, db: Session, organization_id: str) -> dict:
        """Load org-specific thresholds or fall back to defaults."""
        config = db.query(DriftAlertConfig).filter(
            DriftAlertConfig.organization_id == organization_id
        ).first()

        if config:
            return {
                "info": self.DEFAULT_THRESHOLDS["info"],
                "warning": float(config.warning_threshold) if config.warning_threshold else self.DEFAULT_THRESHOLDS["warning"],
                "critical": float(config.critical_threshold) if config.critical_threshold else self.DEFAULT_THRESHOLDS["critical"],
            }
        return self.DEFAULT_THRESHOLDS.copy()

    def check_for_drift(self, db: Session, eval_run: EvalRun) -> Optional[DriftEvent]:
        """
        Called after every completed evaluation.

        Finds active baseline for same character + model_provider.
        Computes deltas. Creates DriftEvent if thresholds breached.

        Args:
            db: Database session
            eval_run: The just-completed evaluation run

        Returns:
            DriftEvent if drift detected, None otherwise
        """
        if eval_run.status != "completed":
            return None

        # Find active baseline for this character + model_provider
        baseline = db.query(DriftBaseline).filter(
            DriftBaseline.character_card_id == eval_run.character_card_id,
            DriftBaseline.model_provider == eval_run.model_provider,
            DriftBaseline.active == True,
        ).first()

        if not baseline:
            return None

        # Compute per-dimension deltas
        deltas = self._compute_deltas(baseline, eval_run)
        max_abs_delta = max(abs(d) for d in deltas.values())

        # Load org thresholds
        thresholds = self._get_thresholds(db, baseline.organization_id)

        # Check for certification loss (critical regardless of score delta)
        baseline_certified = (
            float(baseline.baseline_total) >= self.CANONSAFE_CERTIFICATION_THRESHOLD
            if baseline.baseline_total else False
        )
        new_total = float(eval_run.avg_total_score) if eval_run.avg_total_score else 0
        new_certified = new_total >= self.CANONSAFE_CERTIFICATION_THRESHOLD
        certification_lost = baseline_certified and not new_certified

        # Classify severity
        severity = self._classify_severity(max_abs_delta, thresholds, certification_lost)

        if severity is None:
            return None  # Below info threshold, no event

        # Determine drift type
        drift_type = self._classify_drift_type(deltas, certification_lost)

        # Build summary
        summary = self._build_summary(deltas, severity, drift_type, baseline, eval_run)

        # Create DriftEvent
        event = DriftEvent(
            organization_id=baseline.organization_id,
            character_card_id=eval_run.character_card_id,
            baseline_id=baseline.id,
            eval_run_id=eval_run.id,
            drift_type=drift_type,
            severity=severity,
            delta_canon=Decimal(str(round(deltas["canon"], 2))),
            delta_voice=Decimal(str(round(deltas["voice"], 2))),
            delta_safety=Decimal(str(round(deltas["safety"], 2))),
            delta_legal=Decimal(str(round(deltas["legal"], 2))),
            delta_total=Decimal(str(round(deltas["total"], 2))),
            old_model_version=baseline.model_version,
            new_model_version=eval_run.model_version,
            summary=summary,
        )
        db.add(event)
        db.flush()
        return event

    def compare_runs(self, db: Session, baseline_run_id: str, comparison_run_id: str) -> dict:
        """
        Point comparison between two specific runs.

        Args:
            db: Database session
            baseline_run_id: The reference eval run ID
            comparison_run_id: The new eval run ID to compare

        Returns:
            Dict with per-dimension deltas and severity classification
        """
        baseline_run = db.query(EvalRun).filter(EvalRun.id == baseline_run_id).first()
        comparison_run = db.query(EvalRun).filter(EvalRun.id == comparison_run_id).first()

        if not baseline_run or not comparison_run:
            return {"error": "One or both runs not found"}

        deltas = {
            "canon": self._safe_float(comparison_run.avg_canon_fidelity) - self._safe_float(baseline_run.avg_canon_fidelity),
            "voice": self._safe_float(comparison_run.avg_voice_consistency) - self._safe_float(baseline_run.avg_voice_consistency),
            "safety": self._safe_float(comparison_run.avg_brand_safety) - self._safe_float(baseline_run.avg_brand_safety),
            "legal": self._safe_float(comparison_run.avg_legal_compliance) - self._safe_float(baseline_run.avg_legal_compliance),
            "total": self._safe_float(comparison_run.avg_total_score) - self._safe_float(baseline_run.avg_total_score),
        }

        max_abs_delta = max(abs(d) for d in deltas.values())
        severity = self._classify_severity(max_abs_delta, self.DEFAULT_THRESHOLDS) or "none"
        drift_type = self._classify_drift_type(deltas, certification_lost=False)

        return {
            "baseline_run_id": baseline_run_id,
            "comparison_run_id": comparison_run_id,
            "delta_canon": round(deltas["canon"], 2),
            "delta_voice": round(deltas["voice"], 2),
            "delta_safety": round(deltas["safety"], 2),
            "delta_legal": round(deltas["legal"], 2),
            "delta_total": round(deltas["total"], 2),
            "severity": severity,
            "drift_type": drift_type,
        }

    def get_drift_summary(self, db: Session, character_card_id: str, days: int = 30) -> dict:
        """
        Rolling window analysis for a character.

        Args:
            db: Database session
            character_card_id: Character to analyze
            days: Lookback window

        Returns:
            Dict with trend direction, volatility, and recent alerts
        """
        cutoff = datetime.utcnow() - timedelta(days=days)

        # Get recent events
        events = db.query(DriftEvent).filter(
            DriftEvent.character_card_id == character_card_id,
            DriftEvent.created_at >= cutoff,
        ).order_by(DriftEvent.created_at.desc()).all()

        # Get recent eval runs for trend
        runs = db.query(EvalRun).filter(
            EvalRun.character_card_id == character_card_id,
            EvalRun.status == "completed",
            EvalRun.created_at >= cutoff,
        ).order_by(EvalRun.created_at.asc()).all()

        # Compute trend
        trend = "stable"
        if len(runs) >= 2:
            first_half = runs[:len(runs) // 2]
            second_half = runs[len(runs) // 2:]
            avg_first = sum(self._safe_float(r.avg_total_score) for r in first_half) / len(first_half)
            avg_second = sum(self._safe_float(r.avg_total_score) for r in second_half) / len(second_half)
            delta = avg_second - avg_first
            if delta > 2.0:
                trend = "improving"
            elif delta < -2.0:
                trend = "degrading"

        # Count unacknowledged events by severity
        warnings = sum(1 for e in events if e.severity == "warning" and not e.acknowledged)
        criticals = sum(1 for e in events if e.severity == "critical" and not e.acknowledged)

        return {
            "character_card_id": character_card_id,
            "days": days,
            "total_events": len(events),
            "active_warnings": warnings,
            "active_criticals": criticals,
            "trend": trend,
            "total_runs": len(runs),
            "latest_score": self._safe_float(runs[-1].avg_total_score) if runs else None,
        }

    # --- Private helpers ---

    def _compute_deltas(self, baseline: DriftBaseline, eval_run: EvalRun) -> dict:
        """Compute score deltas between baseline and new run."""
        return {
            "canon": self._safe_float(eval_run.avg_canon_fidelity) - self._safe_float(baseline.baseline_canon),
            "voice": self._safe_float(eval_run.avg_voice_consistency) - self._safe_float(baseline.baseline_voice),
            "safety": self._safe_float(eval_run.avg_brand_safety) - self._safe_float(baseline.baseline_safety),
            "legal": self._safe_float(eval_run.avg_legal_compliance) - self._safe_float(baseline.baseline_legal),
            "total": self._safe_float(eval_run.avg_total_score) - self._safe_float(baseline.baseline_total),
        }

    def _classify_severity(
        self, max_abs_delta: float, thresholds: dict, certification_lost: bool = False
    ) -> Optional[str]:
        """
        Classify drift severity based on largest absolute delta.

        Returns None if below info threshold.
        """
        if certification_lost:
            return "critical"
        if max_abs_delta >= thresholds["critical"]:
            return "critical"
        if max_abs_delta >= thresholds["warning"]:
            return "warning"
        if max_abs_delta >= thresholds["info"]:
            return "info"
        return None

    def _classify_drift_type(self, deltas: dict, certification_lost: bool) -> str:
        """Classify what kind of drift occurred."""
        if certification_lost:
            return "certification_lost"

        # Check if total dropped
        if deltas["total"] < -3.0:
            return "score_drop"

        # Check if total spiked (unusual improvement worth investigating)
        if deltas["total"] > 3.0:
            return "score_spike"

        # Individual dimensions shifted in opposite directions
        positive = sum(1 for d in ["canon", "voice", "safety", "legal"] if deltas[d] > 3.0)
        negative = sum(1 for d in ["canon", "voice", "safety", "legal"] if deltas[d] < -3.0)
        if positive > 0 and negative > 0:
            return "dimension_shift"

        # Default: score_drop for negative, score_spike for positive
        return "score_drop" if deltas["total"] < 0 else "score_spike"

    def _build_summary(
        self, deltas: dict, severity: str, drift_type: str,
        baseline: DriftBaseline, eval_run: EvalRun
    ) -> str:
        """Build human-readable drift summary."""
        parts = []

        if drift_type == "certification_lost":
            parts.append("CanonSafe certification LOST.")

        # Describe biggest movers
        for dim_key, dim_name in [
            ("canon", "Canon Fidelity"),
            ("voice", "Voice Consistency"),
            ("safety", "Brand Safety"),
            ("legal", "Legal Compliance"),
        ]:
            delta = deltas[dim_key]
            if abs(delta) >= 3.0:
                direction = "increased" if delta > 0 else "decreased"
                parts.append(f"{dim_name} {direction} by {abs(delta):.1f} points.")

        total_delta = deltas["total"]
        parts.append(f"Overall score moved {total_delta:+.1f} points.")

        if baseline.model_version and eval_run.model_version:
            if baseline.model_version != eval_run.model_version:
                parts.append(
                    f"Model version changed from {baseline.model_version} to {eval_run.model_version}."
                )

        return " ".join(parts)

    @staticmethod
    def _safe_float(val) -> float:
        """Safely convert Decimal/None to float."""
        if val is None:
            return 0.0
        return float(val)
