"""
Tests for the DriftDetectionService.

Covers drift detection logic, severity classification, delta computation,
baseline comparison, and summary generation.
"""

import pytest
from decimal import Decimal
from datetime import datetime, timedelta

from src.models.evaluation import EvalRun, TestSuite, TestCase
from src.models.drift import DriftBaseline, DriftEvent, DriftAlertConfig
from src.models.character import CharacterCard, Franchise, CardVersion
from src.models.organization import Organization, User
from src.services.drift import DriftDetectionService


@pytest.fixture
def drift_service():
    return DriftDetectionService()


@pytest.fixture
def org_setup(db_session):
    """Create org, user, franchise, character, and version for testing."""
    org = Organization(id="org-1", name="Test Org", slug="test-org")
    db_session.add(org)
    db_session.flush()

    user = User(
        id="user-1",
        organization_id="org-1",
        email="test@test.com",
        name="Test User",
        hashed_password="hashed",
        role="admin",
    )
    db_session.add(user)
    db_session.flush()

    franchise = Franchise(id="fran-1", organization_id="org-1", name="Test Franchise")
    db_session.add(franchise)
    db_session.flush()

    card = CharacterCard(
        id="card-1",
        franchise_id="fran-1",
        name="Test Character",
        slug="test-char",
        status="approved",
    )
    db_session.add(card)
    db_session.flush()

    version = CardVersion(
        id="ver-1",
        character_card_id="card-1",
        version_number=1,
        canon_facts={},
        canon_voice={},
        canon_relationships=[],
    )
    db_session.add(version)
    card.current_version_id = "ver-1"
    db_session.flush()

    return {"org": org, "user": user, "franchise": franchise, "card": card, "version": version}


@pytest.fixture
def baseline_run(db_session, org_setup):
    """Create a completed eval run to use as baseline."""
    run = EvalRun(
        id="run-baseline",
        character_card_id="card-1",
        card_version_id="ver-1",
        model_provider="openai",
        model_name="gpt-4o-mini",
        model_version="gpt-4o-mini-2024-07-18",
        status="completed",
        total_tests=5,
        passed_tests=5,
        failed_tests=0,
        avg_canon_fidelity=Decimal("92.50"),
        avg_voice_consistency=Decimal("88.00"),
        avg_brand_safety=Decimal("95.00"),
        avg_legal_compliance=Decimal("90.00"),
        avg_total_score=Decimal("91.38"),
        is_baseline=True,
        created_by="user-1",
        started_at=datetime.utcnow() - timedelta(days=7),
        completed_at=datetime.utcnow() - timedelta(days=7),
    )
    db_session.add(run)
    db_session.flush()
    return run


@pytest.fixture
def drift_baseline(db_session, org_setup, baseline_run):
    """Create a drift baseline from the baseline run."""
    baseline = DriftBaseline(
        id="baseline-1",
        organization_id="org-1",
        character_card_id="card-1",
        eval_run_id="run-baseline",
        model_provider="openai",
        model_name="gpt-4o-mini",
        model_version="gpt-4o-mini-2024-07-18",
        baseline_canon=Decimal("92.50"),
        baseline_voice=Decimal("88.00"),
        baseline_safety=Decimal("95.00"),
        baseline_legal=Decimal("90.00"),
        baseline_total=Decimal("91.38"),
        active=True,
        created_by="user-1",
    )
    db_session.add(baseline)
    db_session.flush()
    return baseline


class TestSeverityClassification:
    """Test drift severity classification logic."""

    def test_no_drift_below_threshold(self, drift_service):
        severity = drift_service._classify_severity(2.5, drift_service.DEFAULT_THRESHOLDS)
        assert severity is None

    def test_info_at_threshold(self, drift_service):
        severity = drift_service._classify_severity(3.0, drift_service.DEFAULT_THRESHOLDS)
        assert severity == "info"

    def test_info_between_thresholds(self, drift_service):
        severity = drift_service._classify_severity(5.0, drift_service.DEFAULT_THRESHOLDS)
        assert severity == "info"

    def test_warning_at_threshold(self, drift_service):
        severity = drift_service._classify_severity(7.0, drift_service.DEFAULT_THRESHOLDS)
        assert severity == "warning"

    def test_critical_at_threshold(self, drift_service):
        severity = drift_service._classify_severity(12.0, drift_service.DEFAULT_THRESHOLDS)
        assert severity == "critical"

    def test_critical_above_threshold(self, drift_service):
        severity = drift_service._classify_severity(20.0, drift_service.DEFAULT_THRESHOLDS)
        assert severity == "critical"

    def test_certification_lost_overrides(self, drift_service):
        # Even with small delta, certification loss is critical
        severity = drift_service._classify_severity(1.0, drift_service.DEFAULT_THRESHOLDS, certification_lost=True)
        assert severity == "critical"


class TestDriftTypeClassification:
    """Test drift type classification logic."""

    def test_score_drop(self, drift_service):
        deltas = {"canon": -5.0, "voice": -3.0, "safety": -1.0, "legal": 0.0, "total": -4.0}
        assert drift_service._classify_drift_type(deltas, False) == "score_drop"

    def test_score_spike(self, drift_service):
        deltas = {"canon": 5.0, "voice": 3.0, "safety": 1.0, "legal": 0.0, "total": 4.0}
        assert drift_service._classify_drift_type(deltas, False) == "score_spike"

    def test_dimension_shift(self, drift_service):
        deltas = {"canon": -8.0, "voice": 6.0, "safety": -1.0, "legal": 2.0, "total": -0.5}
        assert drift_service._classify_drift_type(deltas, False) == "dimension_shift"

    def test_certification_lost(self, drift_service):
        deltas = {"canon": -2.0, "voice": -3.0, "safety": -1.0, "legal": 0.0, "total": -1.5}
        assert drift_service._classify_drift_type(deltas, True) == "certification_lost"


class TestCheckForDrift:
    """Test the main check_for_drift method."""

    def test_no_drift_when_no_baseline(self, db_session, drift_service, org_setup):
        """No drift event when no baseline exists."""
        run = EvalRun(
            id="run-new",
            character_card_id="card-1",
            model_provider="openai",
            model_name="gpt-4o-mini",
            status="completed",
            avg_canon_fidelity=Decimal("90.00"),
            avg_voice_consistency=Decimal("85.00"),
            avg_brand_safety=Decimal("92.00"),
            avg_legal_compliance=Decimal("88.00"),
            avg_total_score=Decimal("88.75"),
            created_by="user-1",
        )
        db_session.add(run)
        db_session.flush()

        event = drift_service.check_for_drift(db_session, run)
        assert event is None

    def test_no_drift_within_threshold(self, db_session, drift_service, org_setup, drift_baseline):
        """No drift event when scores are within threshold."""
        run = EvalRun(
            id="run-close",
            character_card_id="card-1",
            model_provider="openai",
            model_name="gpt-4o-mini",
            status="completed",
            avg_canon_fidelity=Decimal("91.00"),
            avg_voice_consistency=Decimal("87.00"),
            avg_brand_safety=Decimal("94.00"),
            avg_legal_compliance=Decimal("89.50"),
            avg_total_score=Decimal("90.38"),
            created_by="user-1",
        )
        db_session.add(run)
        db_session.flush()

        event = drift_service.check_for_drift(db_session, run)
        assert event is None

    def test_drift_detected_score_drop(self, db_session, drift_service, org_setup, drift_baseline):
        """Drift event created when scores drop but stay above certification threshold."""
        # Baseline total is 91.38. Drop to ~86 (still certified) so we get
        # a score_drop rather than certification_lost.
        run = EvalRun(
            id="run-dropped",
            character_card_id="card-1",
            model_provider="openai",
            model_name="gpt-4o-mini",
            model_version="gpt-4o-mini-2024-11-05",
            status="completed",
            avg_canon_fidelity=Decimal("84.00"),
            avg_voice_consistency=Decimal("80.00"),
            avg_brand_safety=Decimal("90.00"),
            avg_legal_compliance=Decimal("88.00"),
            avg_total_score=Decimal("85.50"),
            created_by="user-1",
        )
        db_session.add(run)
        db_session.flush()

        event = drift_service.check_for_drift(db_session, run)
        assert event is not None
        assert event.drift_type == "score_drop"
        assert event.severity in ("info", "warning", "critical")
        assert float(event.delta_total) < 0

    def test_drift_critical_certification_lost(self, db_session, drift_service, org_setup, drift_baseline):
        """Critical drift when CanonSafe certification is lost."""
        run = EvalRun(
            id="run-cert-lost",
            character_card_id="card-1",
            model_provider="openai",
            model_name="gpt-4o-mini",
            status="completed",
            avg_canon_fidelity=Decimal("78.00"),
            avg_voice_consistency=Decimal("80.00"),
            avg_brand_safety=Decimal("82.00"),
            avg_legal_compliance=Decimal("80.00"),
            avg_total_score=Decimal("80.00"),
            created_by="user-1",
        )
        db_session.add(run)
        db_session.flush()

        event = drift_service.check_for_drift(db_session, run)
        assert event is not None
        assert event.severity == "critical"
        assert event.drift_type == "certification_lost"

    def test_no_event_for_pending_run(self, db_session, drift_service, org_setup, drift_baseline):
        """No drift check for non-completed runs."""
        run = EvalRun(
            id="run-pending",
            character_card_id="card-1",
            model_provider="openai",
            model_name="gpt-4o-mini",
            status="pending",
            created_by="user-1",
        )
        db_session.add(run)
        db_session.flush()

        event = drift_service.check_for_drift(db_session, run)
        assert event is None

    def test_no_event_for_different_provider(self, db_session, drift_service, org_setup, drift_baseline):
        """No drift event when provider doesn't match baseline."""
        run = EvalRun(
            id="run-anthropic",
            character_card_id="card-1",
            model_provider="anthropic",
            model_name="claude-3-haiku",
            status="completed",
            avg_canon_fidelity=Decimal("60.00"),
            avg_voice_consistency=Decimal("60.00"),
            avg_brand_safety=Decimal("60.00"),
            avg_legal_compliance=Decimal("60.00"),
            avg_total_score=Decimal("60.00"),
            created_by="user-1",
        )
        db_session.add(run)
        db_session.flush()

        event = drift_service.check_for_drift(db_session, run)
        assert event is None


class TestCompareRuns:
    """Test point comparison between two eval runs."""

    def test_compare_with_deltas(self, db_session, drift_service, org_setup):
        run_a = EvalRun(
            id="run-a",
            character_card_id="card-1",
            model_provider="openai",
            model_name="gpt-4o",
            status="completed",
            avg_canon_fidelity=Decimal("90.00"),
            avg_voice_consistency=Decimal("85.00"),
            avg_brand_safety=Decimal("92.00"),
            avg_legal_compliance=Decimal("88.00"),
            avg_total_score=Decimal("88.75"),
            created_by="user-1",
        )
        run_b = EvalRun(
            id="run-b",
            character_card_id="card-1",
            model_provider="openai",
            model_name="gpt-4o",
            status="completed",
            avg_canon_fidelity=Decimal("82.00"),
            avg_voice_consistency=Decimal("80.00"),
            avg_brand_safety=Decimal("88.00"),
            avg_legal_compliance=Decimal("85.00"),
            avg_total_score=Decimal("83.75"),
            created_by="user-1",
        )
        db_session.add_all([run_a, run_b])
        db_session.flush()

        result = drift_service.compare_runs(db_session, "run-a", "run-b")
        assert result["delta_canon"] == -8.0
        assert result["delta_voice"] == -5.0
        assert result["delta_total"] == -5.0
        assert result["severity"] == "warning"

    def test_compare_missing_run(self, db_session, drift_service, org_setup):
        result = drift_service.compare_runs(db_session, "missing-1", "missing-2")
        assert "error" in result


class TestDriftSummary:
    """Test rolling window drift summary."""

    def test_summary_with_no_data(self, db_session, drift_service, org_setup):
        summary = drift_service.get_drift_summary(db_session, "card-1", days=30)
        assert summary["total_events"] == 0
        assert summary["trend"] == "stable"

    def test_summary_with_events(self, db_session, drift_service, org_setup, drift_baseline):
        # Create some drift events
        for i in range(3):
            event = DriftEvent(
                id=f"event-{i}",
                organization_id="org-1",
                character_card_id="card-1",
                baseline_id="baseline-1",
                eval_run_id="run-baseline",
                drift_type="score_drop",
                severity="warning",
                delta_total=Decimal("-5.00"),
                acknowledged=False,
            )
            db_session.add(event)
        db_session.flush()

        summary = drift_service.get_drift_summary(db_session, "card-1", days=30)
        assert summary["total_events"] == 3
        assert summary["active_warnings"] == 3


class TestCustomThresholds:
    """Test org-specific threshold loading."""

    def test_default_thresholds(self, db_session, drift_service, org_setup):
        thresholds = drift_service._get_thresholds(db_session, "org-1")
        assert thresholds["warning"] == 7.0
        assert thresholds["critical"] == 12.0

    def test_custom_thresholds(self, db_session, drift_service, org_setup):
        config = DriftAlertConfig(
            organization_id="org-1",
            warning_threshold=Decimal("5.0"),
            critical_threshold=Decimal("10.0"),
        )
        db_session.add(config)
        db_session.flush()

        thresholds = drift_service._get_thresholds(db_session, "org-1")
        assert thresholds["warning"] == 5.0
        assert thresholds["critical"] == 10.0


class TestBuildSummary:
    """Test human-readable drift summary generation."""

    def test_summary_includes_dimension_changes(self, drift_service):
        deltas = {"canon": -8.0, "voice": -2.0, "safety": 0.5, "legal": -1.0, "total": -5.0}
        baseline = DriftBaseline(
            model_version="v1.0",
            model_provider="openai",
            model_name="gpt-4o",
        )
        eval_run = EvalRun(model_version="v2.0")
        summary = drift_service._build_summary(deltas, "warning", "score_drop", baseline, eval_run)
        assert "Canon Fidelity" in summary
        assert "decreased" in summary
        assert "v1.0" in summary
        assert "v2.0" in summary

    def test_summary_certification_lost(self, drift_service):
        deltas = {"canon": -3.0, "voice": -3.0, "safety": -3.0, "legal": -3.0, "total": -3.0}
        baseline = DriftBaseline(model_version="v1", model_provider="openai", model_name="gpt-4o")
        eval_run = EvalRun(model_version="v2")
        summary = drift_service._build_summary(deltas, "critical", "certification_lost", baseline, eval_run)
        assert "certification LOST" in summary
