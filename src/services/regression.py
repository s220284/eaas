"""
Regression Test Service.

Runs scheduled test suites against model versions and compares results
to baselines. Aligns with patent Claim 12 (certification per model version).
"""

import logging
from datetime import datetime, timedelta
from typing import List

from sqlalchemy.orm import Session

from src.models.drift import RegressionTestSchedule, DriftBaseline
from src.models.evaluation import EvalRun, EvalResult, TestCase, TestSuite
from src.services.drift import DriftDetectionService

logger = logging.getLogger(__name__)


# Frequency to timedelta mapping
FREQUENCY_DELTAS = {
    "daily": timedelta(days=1),
    "weekly": timedelta(weeks=1),
    "monthly": timedelta(days=30),
}


class RegressionTestService:
    """Runs scheduled test suites against model versions and compares to baselines."""

    def __init__(self):
        self.drift_service = DriftDetectionService()

    def run_regression(self, db: Session, schedule: RegressionTestSchedule) -> dict:
        """
        Execute test suite against each model in model_names.
        Compare results to baseline. Create DriftEvents for threshold breaches.

        Args:
            db: Database session
            schedule: The regression test schedule to execute

        Returns:
            Dict with per-model results and drift events
        """
        results = []
        baseline = db.query(DriftBaseline).filter(
            DriftBaseline.id == schedule.baseline_id
        ).first()

        if not baseline:
            return {"error": "Baseline not found", "schedule_id": schedule.id}

        test_suite = db.query(TestSuite).filter(
            TestSuite.id == schedule.test_suite_id
        ).first()

        if not test_suite:
            return {"error": "Test suite not found", "schedule_id": schedule.id}

        test_cases = db.query(TestCase).filter(
            TestCase.test_suite_id == schedule.test_suite_id
        ).all()

        for model_name in schedule.model_names:
            result = self._run_single_model(
                db=db,
                schedule=schedule,
                model_name=model_name,
                test_cases=test_cases,
                baseline=baseline,
            )
            results.append(result)

        # Update schedule timing
        schedule.last_run_at = datetime.utcnow()
        freq_delta = FREQUENCY_DELTAS.get(schedule.frequency, timedelta(weeks=1))
        schedule.next_run_at = datetime.utcnow() + freq_delta
        db.flush()

        return {
            "schedule_id": schedule.id,
            "results": results,
            "completed_at": datetime.utcnow().isoformat(),
        }

    def check_due_schedules(self, db: Session) -> List[dict]:
        """
        Find schedules past next_run_at and execute them.

        Args:
            db: Database session

        Returns:
            List of regression run results
        """
        now = datetime.utcnow()
        due_schedules = db.query(RegressionTestSchedule).filter(
            RegressionTestSchedule.enabled == True,
            RegressionTestSchedule.next_run_at <= now,
        ).all()

        results = []
        for schedule in due_schedules:
            try:
                result = self.run_regression(db, schedule)
                results.append(result)
            except Exception as e:
                logger.error(f"Regression failed for schedule {schedule.id}: {e}")
                results.append({
                    "schedule_id": schedule.id,
                    "error": str(e),
                })

        if results:
            db.commit()

        return results

    def _run_single_model(
        self,
        db: Session,
        schedule: RegressionTestSchedule,
        model_name: str,
        test_cases: list,
        baseline: DriftBaseline,
    ) -> dict:
        """
        Run test suite against a single model and create an EvalRun.

        Uses mock scores for now (same pattern as existing test suite runs).
        In production, this would call the actual LLM judge.
        """
        import random

        # Create the eval run
        eval_run = EvalRun(
            character_card_id=schedule.character_card_id,
            test_suite_id=schedule.test_suite_id,
            model_provider=schedule.model_provider,
            model_name=model_name,
            model_version=f"{model_name}-regression-{datetime.utcnow().strftime('%Y%m%d')}",
            status="running",
            total_tests=len(test_cases),
            started_at=datetime.utcnow(),
            baseline_run_id=baseline.eval_run_id,
        )
        db.add(eval_run)
        db.flush()

        all_scores = {"canon": [], "voice": [], "safety": [], "legal": []}
        passed = 0
        failed = 0

        for test_case in test_cases:
            scores = {
                "canon_fidelity": round(random.uniform(75, 100), 1),
                "voice_consistency": round(random.uniform(70, 95), 1),
                "brand_safety": round(random.uniform(80, 100), 1),
                "legal_compliance": round(random.uniform(85, 100), 1),
            }
            total = sum(scores.values()) / len(scores)
            is_passed = total >= 85.0

            if is_passed:
                passed += 1
            else:
                failed += 1

            result = EvalResult(
                eval_run_id=eval_run.id,
                test_case_id=test_case.id,
                model_response=f"Regression test response for: {test_case.name}",
                response_latency_ms=random.randint(200, 1500),
                score_canon_fidelity=scores["canon_fidelity"],
                score_voice_consistency=scores["voice_consistency"],
                score_brand_safety=scores["brand_safety"],
                score_legal_compliance=scores["legal_compliance"],
                score_total=total,
                explanation_canon="Regression test evaluation",
                explanation_voice="Regression test evaluation",
                explanation_safety="Regression test evaluation",
                explanation_legal="Regression test evaluation",
                passed=is_passed,
                failure_reasons=[] if is_passed else ["Below regression threshold"],
            )
            db.add(result)

            all_scores["canon"].append(scores["canon_fidelity"])
            all_scores["voice"].append(scores["voice_consistency"])
            all_scores["safety"].append(scores["brand_safety"])
            all_scores["legal"].append(scores["legal_compliance"])

        # Update eval run with aggregates
        eval_run.status = "completed"
        eval_run.completed_at = datetime.utcnow()
        eval_run.passed_tests = passed
        eval_run.failed_tests = failed

        if all_scores["canon"]:
            eval_run.avg_canon_fidelity = round(sum(all_scores["canon"]) / len(all_scores["canon"]), 1)
            eval_run.avg_voice_consistency = round(sum(all_scores["voice"]) / len(all_scores["voice"]), 1)
            eval_run.avg_brand_safety = round(sum(all_scores["safety"]) / len(all_scores["safety"]), 1)
            eval_run.avg_legal_compliance = round(sum(all_scores["legal"]) / len(all_scores["legal"]), 1)
            eval_run.avg_total_score = round(
                (eval_run.avg_canon_fidelity + eval_run.avg_voice_consistency +
                 eval_run.avg_brand_safety + eval_run.avg_legal_compliance) / 4, 1
            )

        db.flush()

        # Check for drift against baseline
        drift_event = self.drift_service.check_for_drift(db, eval_run)

        return {
            "model_name": model_name,
            "eval_run_id": eval_run.id,
            "drift_event_id": drift_event.id if drift_event else None,
            "delta_total": round(
                float(eval_run.avg_total_score or 0) - float(baseline.baseline_total or 0), 2
            ),
            "severity": drift_event.severity if drift_event else "none",
        }
