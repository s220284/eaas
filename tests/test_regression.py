"""
Tests for the RegressionTestService.

Covers regression test execution, schedule management,
and drift event creation from regression results.
"""

import pytest
from decimal import Decimal
from datetime import datetime, timedelta

from src.models.evaluation import EvalRun, EvalResult, TestSuite, TestCase
from src.models.drift import DriftBaseline, DriftEvent, RegressionTestSchedule
from src.models.character import CharacterCard, Franchise, CardVersion
from src.models.organization import Organization, User
from src.services.regression import RegressionTestService


@pytest.fixture
def regression_service():
    return RegressionTestService()


@pytest.fixture
def regression_setup(db_session):
    """Create full setup: org, user, franchise, character, version, test suite, baseline."""
    org = Organization(id="reg-org-1", name="Regression Org", slug="reg-org")
    db_session.add(org)
    db_session.flush()

    user = User(
        id="reg-user-1",
        organization_id="reg-org-1",
        email="reg@test.com",
        name="Reg User",
        hashed_password="hashed",
        role="admin",
    )
    db_session.add(user)
    db_session.flush()

    franchise = Franchise(id="reg-fran-1", organization_id="reg-org-1", name="Regression Franchise")
    db_session.add(franchise)
    db_session.flush()

    card = CharacterCard(
        id="reg-card-1",
        franchise_id="reg-fran-1",
        name="Regression Character",
        slug="reg-char",
        status="approved",
    )
    db_session.add(card)
    db_session.flush()

    version = CardVersion(
        id="reg-ver-1",
        character_card_id="reg-card-1",
        version_number=1,
        canon_facts={},
        canon_voice={},
        canon_relationships=[],
    )
    db_session.add(version)
    card.current_version_id = "reg-ver-1"
    db_session.flush()

    # Create test suite with cases
    suite = TestSuite(
        id="reg-suite-1",
        character_card_id="reg-card-1",
        name="Regression Suite",
        created_by="reg-user-1",
    )
    db_session.add(suite)
    db_session.flush()

    for i in range(3):
        tc = TestCase(
            id=f"reg-tc-{i}",
            test_suite_id="reg-suite-1",
            name=f"Test Case {i}",
            category="canon",
            prompt=f"Test prompt {i}",
        )
        db_session.add(tc)
    db_session.flush()

    # Create baseline run
    baseline_run = EvalRun(
        id="reg-run-baseline",
        character_card_id="reg-card-1",
        card_version_id="reg-ver-1",
        test_suite_id="reg-suite-1",
        model_provider="openai",
        model_name="gpt-4o-mini",
        model_version="gpt-4o-mini-2024-07-18",
        status="completed",
        total_tests=3,
        passed_tests=3,
        failed_tests=0,
        avg_canon_fidelity=Decimal("92.00"),
        avg_voice_consistency=Decimal("88.00"),
        avg_brand_safety=Decimal("95.00"),
        avg_legal_compliance=Decimal("90.00"),
        avg_total_score=Decimal("91.25"),
        is_baseline=True,
        created_by="reg-user-1",
        started_at=datetime.utcnow() - timedelta(days=7),
        completed_at=datetime.utcnow() - timedelta(days=7),
    )
    db_session.add(baseline_run)
    db_session.flush()

    # Create drift baseline
    baseline = DriftBaseline(
        id="reg-baseline-1",
        organization_id="reg-org-1",
        character_card_id="reg-card-1",
        eval_run_id="reg-run-baseline",
        model_provider="openai",
        model_name="gpt-4o-mini",
        model_version="gpt-4o-mini-2024-07-18",
        baseline_canon=Decimal("92.00"),
        baseline_voice=Decimal("88.00"),
        baseline_safety=Decimal("95.00"),
        baseline_legal=Decimal("90.00"),
        baseline_total=Decimal("91.25"),
        active=True,
        created_by="reg-user-1",
    )
    db_session.add(baseline)
    db_session.flush()

    return {
        "org": org,
        "user": user,
        "card": card,
        "suite": suite,
        "baseline_run": baseline_run,
        "baseline": baseline,
    }


class TestRunRegression:
    """Test regression test execution."""

    def test_run_single_model(self, db_session, regression_service, regression_setup):
        schedule = RegressionTestSchedule(
            id="sched-1",
            organization_id="reg-org-1",
            character_card_id="reg-card-1",
            test_suite_id="reg-suite-1",
            model_provider="openai",
            model_names=["gpt-4o-mini"],
            baseline_id="reg-baseline-1",
            frequency="weekly",
            next_run_at=datetime.utcnow() - timedelta(hours=1),
        )
        db_session.add(schedule)
        db_session.flush()

        result = regression_service.run_regression(db_session, schedule)
        db_session.commit()

        assert "results" in result
        assert len(result["results"]) == 1
        assert result["results"][0]["model_name"] == "gpt-4o-mini"
        assert result["results"][0]["eval_run_id"] is not None
        assert "completed_at" in result

    def test_run_multiple_models(self, db_session, regression_service, regression_setup):
        schedule = RegressionTestSchedule(
            id="sched-multi",
            organization_id="reg-org-1",
            character_card_id="reg-card-1",
            test_suite_id="reg-suite-1",
            model_provider="openai",
            model_names=["gpt-4o-mini", "gpt-4o"],
            baseline_id="reg-baseline-1",
            frequency="weekly",
            next_run_at=datetime.utcnow() - timedelta(hours=1),
        )
        db_session.add(schedule)
        db_session.flush()

        result = regression_service.run_regression(db_session, schedule)
        db_session.commit()

        assert len(result["results"]) == 2

    def test_regression_creates_eval_runs(self, db_session, regression_service, regression_setup):
        schedule = RegressionTestSchedule(
            id="sched-runs",
            organization_id="reg-org-1",
            character_card_id="reg-card-1",
            test_suite_id="reg-suite-1",
            model_provider="openai",
            model_names=["gpt-4o-mini"],
            baseline_id="reg-baseline-1",
            frequency="weekly",
            next_run_at=datetime.utcnow(),
        )
        db_session.add(schedule)
        db_session.flush()

        result = regression_service.run_regression(db_session, schedule)
        db_session.commit()

        # Verify the eval run was created
        new_run_id = result["results"][0]["eval_run_id"]
        new_run = db_session.query(EvalRun).filter(EvalRun.id == new_run_id).first()
        assert new_run is not None
        assert new_run.status == "completed"
        assert new_run.baseline_run_id == "reg-run-baseline"

        # Verify eval results were created
        results = db_session.query(EvalResult).filter(EvalResult.eval_run_id == new_run_id).all()
        assert len(results) == 3  # One per test case

    def test_regression_updates_schedule_timing(self, db_session, regression_service, regression_setup):
        old_next = datetime.utcnow() - timedelta(hours=1)
        schedule = RegressionTestSchedule(
            id="sched-timing",
            organization_id="reg-org-1",
            character_card_id="reg-card-1",
            test_suite_id="reg-suite-1",
            model_provider="openai",
            model_names=["gpt-4o-mini"],
            baseline_id="reg-baseline-1",
            frequency="weekly",
            next_run_at=old_next,
        )
        db_session.add(schedule)
        db_session.flush()

        regression_service.run_regression(db_session, schedule)
        db_session.commit()

        db_session.refresh(schedule)
        assert schedule.last_run_at is not None
        assert schedule.next_run_at > old_next

    def test_regression_missing_baseline(self, db_session, regression_service, regression_setup):
        schedule = RegressionTestSchedule(
            id="sched-no-baseline",
            organization_id="reg-org-1",
            character_card_id="reg-card-1",
            test_suite_id="reg-suite-1",
            model_provider="openai",
            model_names=["gpt-4o-mini"],
            baseline_id="nonexistent",
            frequency="weekly",
            next_run_at=datetime.utcnow(),
        )
        db_session.add(schedule)
        db_session.flush()

        result = regression_service.run_regression(db_session, schedule)
        assert "error" in result


class TestCheckDueSchedules:
    """Test scheduled regression execution."""

    def test_finds_due_schedules(self, db_session, regression_service, regression_setup):
        schedule = RegressionTestSchedule(
            id="sched-due",
            organization_id="reg-org-1",
            character_card_id="reg-card-1",
            test_suite_id="reg-suite-1",
            model_provider="openai",
            model_names=["gpt-4o-mini"],
            baseline_id="reg-baseline-1",
            frequency="daily",
            enabled=True,
            next_run_at=datetime.utcnow() - timedelta(hours=1),
        )
        db_session.add(schedule)
        db_session.flush()

        results = regression_service.check_due_schedules(db_session)
        assert len(results) == 1
        assert "results" in results[0]

    def test_skips_disabled_schedules(self, db_session, regression_service, regression_setup):
        schedule = RegressionTestSchedule(
            id="sched-disabled",
            organization_id="reg-org-1",
            character_card_id="reg-card-1",
            test_suite_id="reg-suite-1",
            model_provider="openai",
            model_names=["gpt-4o-mini"],
            baseline_id="reg-baseline-1",
            frequency="daily",
            enabled=False,
            next_run_at=datetime.utcnow() - timedelta(hours=1),
        )
        db_session.add(schedule)
        db_session.flush()

        results = regression_service.check_due_schedules(db_session)
        assert len(results) == 0

    def test_skips_future_schedules(self, db_session, regression_service, regression_setup):
        schedule = RegressionTestSchedule(
            id="sched-future",
            organization_id="reg-org-1",
            character_card_id="reg-card-1",
            test_suite_id="reg-suite-1",
            model_provider="openai",
            model_names=["gpt-4o-mini"],
            baseline_id="reg-baseline-1",
            frequency="weekly",
            enabled=True,
            next_run_at=datetime.utcnow() + timedelta(days=3),
        )
        db_session.add(schedule)
        db_session.flush()

        results = regression_service.check_due_schedules(db_session)
        assert len(results) == 0
