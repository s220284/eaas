"""
Tests for the Drift Monitoring API endpoints.

Covers baseline CRUD, drift event listing/acknowledgement,
timeline, comparison, summary, and alert config endpoints.
"""

import uuid
import pytest
from decimal import Decimal
from datetime import datetime, timedelta

from src.models.evaluation import EvalRun, TestSuite, TestCase
from src.models.drift import DriftBaseline, DriftEvent, DriftAlertConfig
from src.models.character import CharacterCard, Franchise, CardVersion
from src.models.organization import Organization, User


# Fixed UUID-format IDs for test reproducibility
FRAN_ID = str(uuid.uuid5(uuid.NAMESPACE_DNS, "test-franchise"))
CARD_ID = str(uuid.uuid5(uuid.NAMESPACE_DNS, "test-character"))
VER_ID = str(uuid.uuid5(uuid.NAMESPACE_DNS, "test-version"))
RUN_ID = str(uuid.uuid5(uuid.NAMESPACE_DNS, "test-run-1"))
RUN2_ID = str(uuid.uuid5(uuid.NAMESPACE_DNS, "test-run-2"))
BASELINE_ID = str(uuid.uuid5(uuid.NAMESPACE_DNS, "test-baseline"))
EVT_IDS = [str(uuid.uuid5(uuid.NAMESPACE_DNS, f"test-event-{i}")) for i in range(3)]


@pytest.fixture
def seeded_db(db_session, registered_user, client, auth_headers):
    """Seed the DB with org, franchise, character, version, and eval runs."""
    from src.models.organization import User as UserModel, Organization as OrgModel
    user = db_session.query(UserModel).filter(UserModel.email == "test@example.com").first()
    org = db_session.query(OrgModel).filter(OrgModel.id == user.organization_id).first()

    franchise = Franchise(id=FRAN_ID, organization_id=org.id, name="API Test Franchise")
    db_session.add(franchise)
    db_session.flush()

    card = CharacterCard(
        id=CARD_ID,
        franchise_id=franchise.id,
        name="API Test Character",
        slug="api-test-char",
        status="approved",
    )
    db_session.add(card)
    db_session.flush()

    version = CardVersion(
        id=VER_ID,
        character_card_id=card.id,
        version_number=1,
        canon_facts={},
        canon_voice={},
        canon_relationships=[],
    )
    db_session.add(version)
    card.current_version_id = version.id
    db_session.flush()

    # Create a completed eval run
    run = EvalRun(
        id=RUN_ID,
        character_card_id=card.id,
        card_version_id=version.id,
        model_provider="openai",
        model_name="gpt-4o-mini",
        model_version="gpt-4o-mini-2024-07-18",
        status="completed",
        total_tests=3,
        passed_tests=3,
        failed_tests=0,
        avg_canon_fidelity=Decimal("90.00"),
        avg_voice_consistency=Decimal("88.00"),
        avg_brand_safety=Decimal("95.00"),
        avg_legal_compliance=Decimal("92.00"),
        avg_total_score=Decimal("91.25"),
        is_baseline=False,
        created_by=user.id,
        started_at=datetime.utcnow() - timedelta(hours=1),
        completed_at=datetime.utcnow() - timedelta(hours=1),
    )
    db_session.add(run)
    db_session.commit()

    return {
        "user": user,
        "org": org,
        "franchise": franchise,
        "card": card,
        "version": version,
        "run": run,
        "headers": auth_headers,
    }


class TestBaselineEndpoints:
    """Test baseline CRUD endpoints."""

    def test_create_baseline(self, client, seeded_db):
        response = client.post(
            "/api/v1/drift/baselines",
            json={"eval_run_id": RUN_ID, "notes": "Initial baseline"},
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert data["character_card_id"] == CARD_ID
        assert data["model_provider"] == "openai"
        assert data["active"] is True
        assert data["notes"] == "Initial baseline"

    def test_create_baseline_nonexistent_run(self, client, seeded_db):
        fake_uuid = str(uuid.uuid4())
        response = client.post(
            "/api/v1/drift/baselines",
            json={"eval_run_id": fake_uuid},
            headers=seeded_db["headers"],
        )
        assert response.status_code == 404

    def test_list_baselines(self, client, db_session, seeded_db):
        baseline = DriftBaseline(
            id=BASELINE_ID,
            organization_id=seeded_db["org"].id,
            character_card_id=CARD_ID,
            eval_run_id=RUN_ID,
            model_provider="openai",
            model_name="gpt-4o-mini",
            baseline_total=Decimal("91.25"),
            active=True,
            created_by=seeded_db["user"].id,
        )
        db_session.add(baseline)
        db_session.commit()

        response = client.get(
            "/api/v1/drift/baselines",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1

    def test_deactivate_baseline(self, client, db_session, seeded_db):
        bl_id = str(uuid.uuid4())
        baseline = DriftBaseline(
            id=bl_id,
            organization_id=seeded_db["org"].id,
            character_card_id=CARD_ID,
            eval_run_id=RUN_ID,
            model_provider="openai",
            model_name="gpt-4o-mini",
            baseline_total=Decimal("91.25"),
            active=True,
            created_by=seeded_db["user"].id,
        )
        db_session.add(baseline)
        db_session.commit()

        response = client.delete(
            f"/api/v1/drift/baselines/{bl_id}",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200

        db_session.refresh(baseline)
        assert baseline.active is False


class TestDriftEventEndpoints:
    """Test drift event listing and acknowledgement."""

    @pytest.fixture
    def seeded_events(self, db_session, seeded_db):
        """Create some drift events for testing."""
        bl_id = str(uuid.uuid4())
        baseline = DriftBaseline(
            id=bl_id,
            organization_id=seeded_db["org"].id,
            character_card_id=CARD_ID,
            eval_run_id=RUN_ID,
            model_provider="openai",
            model_name="gpt-4o-mini",
            baseline_total=Decimal("91.25"),
            active=True,
        )
        db_session.add(baseline)
        db_session.flush()

        events = []
        for i, severity in enumerate(["info", "warning", "critical"]):
            evt = DriftEvent(
                id=EVT_IDS[i],
                organization_id=seeded_db["org"].id,
                character_card_id=CARD_ID,
                baseline_id=bl_id,
                eval_run_id=RUN_ID,
                drift_type="score_drop",
                severity=severity,
                delta_total=Decimal(f"-{(i + 1) * 4}.00"),
                acknowledged=False,
            )
            db_session.add(evt)
            events.append(evt)

        db_session.commit()
        return events

    def test_list_events(self, client, seeded_db, seeded_events):
        response = client.get(
            "/api/v1/drift/events",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3

    def test_list_events_filter_severity(self, client, seeded_db, seeded_events):
        response = client.get(
            "/api/v1/drift/events?severity=critical",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["severity"] == "critical"

    def test_get_single_event(self, client, seeded_db, seeded_events):
        response = client.get(
            f"/api/v1/drift/events/{EVT_IDS[0]}",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        assert response.json()["severity"] == "info"

    def test_acknowledge_event(self, client, seeded_db, seeded_events):
        response = client.patch(
            f"/api/v1/drift/events/{EVT_IDS[1]}/acknowledge",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert data["acknowledged"] is True
        assert data["acknowledged_at"] is not None

    def test_list_unacknowledged_only(self, client, db_session, seeded_db, seeded_events):
        seeded_events[0].acknowledged = True
        db_session.commit()

        response = client.get(
            "/api/v1/drift/events?acknowledged=false",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2


class TestTimelineEndpoint:
    """Test score timeline endpoint."""

    def test_timeline_returns_data(self, client, db_session, seeded_db):
        response = client.get(
            f"/api/v1/drift/timeline/{CARD_ID}?days=90",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert data["character_card_id"] == CARD_ID
        assert len(data["data_points"]) >= 1

    def test_timeline_nonexistent_character(self, client, seeded_db):
        fake = str(uuid.uuid4())
        response = client.get(
            f"/api/v1/drift/timeline/{fake}",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 404


class TestCompareEndpoint:
    """Test run comparison endpoint."""

    def test_compare_two_runs(self, client, db_session, seeded_db):
        run2 = EvalRun(
            id=RUN2_ID,
            character_card_id=CARD_ID,
            model_provider="openai",
            model_name="gpt-4o-mini",
            status="completed",
            avg_canon_fidelity=Decimal("85.00"),
            avg_voice_consistency=Decimal("82.00"),
            avg_brand_safety=Decimal("90.00"),
            avg_legal_compliance=Decimal("88.00"),
            avg_total_score=Decimal("86.25"),
            created_by=seeded_db["user"].id,
        )
        db_session.add(run2)
        db_session.commit()

        response = client.get(
            f"/api/v1/drift/compare?baseline_run_id={RUN_ID}&comparison_run_id={RUN2_ID}",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert data["delta_total"] == -5.0


class TestSummaryEndpoint:
    """Test org drift summary endpoint."""

    def test_summary_returns_characters(self, client, seeded_db):
        response = client.get(
            "/api/v1/drift/summary",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total_characters"] >= 1
        assert len(data["characters"]) >= 1


class TestAlertConfigEndpoints:
    """Test alert configuration endpoints."""

    def test_get_no_config(self, client, seeded_db):
        response = client.get(
            "/api/v1/drift/alerts/config",
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        assert response.json() is None

    def test_create_config(self, client, seeded_db):
        response = client.put(
            "/api/v1/drift/alerts/config",
            json={
                "warning_threshold": 5.0,
                "critical_threshold": 10.0,
                "notify_on_warning": True,
                "notify_on_critical": True,
                "email_recipients": ["admin@test.com"],
            },
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert data["warning_threshold"] == 5.0
        assert data["email_recipients"] == ["admin@test.com"]

    def test_update_config(self, client, seeded_db):
        # Create first
        client.put(
            "/api/v1/drift/alerts/config",
            json={"warning_threshold": 5.0, "critical_threshold": 10.0},
            headers=seeded_db["headers"],
        )
        # Update
        response = client.put(
            "/api/v1/drift/alerts/config",
            json={"warning_threshold": 8.0, "critical_threshold": 15.0},
            headers=seeded_db["headers"],
        )
        assert response.status_code == 200
        assert response.json()["warning_threshold"] == 8.0
