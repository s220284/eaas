"""
Drift Monitoring API routes.

Provides endpoints for baseline management, drift event tracking,
score timeline visualization, run comparison, regression scheduling,
and alert configuration. All endpoints are org-scoped via authentication.
"""

from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from src.database import get_db
from src.models import CharacterCard, Franchise, EvalRun, User
from src.models.drift import DriftBaseline, DriftEvent, DriftAlertConfig, RegressionTestSchedule
from src.schemas.drift import (
    BaselineCreate,
    BaselineResponse,
    DriftEventResponse,
    DriftEventAcknowledge,
    TimelinePoint,
    TimelineResponse,
    RunComparisonResponse,
    OrgDriftSummary,
    CharacterDriftSummary,
    AlertConfigCreate,
    AlertConfigResponse,
    RegressionScheduleCreate,
    RegressionScheduleResponse,
    RegressionRunResponse,
)
from src.services.auth import get_current_user
from src.services.drift import DriftDetectionService
from src.services.regression import RegressionTestService

router = APIRouter()
drift_service = DriftDetectionService()
regression_service = RegressionTestService()


def _get_org_card_ids(db: Session, organization_id: str) -> list:
    """Get all character card IDs belonging to an organization."""
    org_franchise_ids = [
        f.id for f in db.query(Franchise.id).filter(
            Franchise.organization_id == organization_id
        ).all()
    ]
    if not org_franchise_ids:
        return []
    return [
        c.id for c in db.query(CharacterCard.id).filter(
            CharacterCard.franchise_id.in_(org_franchise_ids)
        ).all()
    ]


def _verify_card_in_org(db: Session, card_id: str, organization_id: str) -> CharacterCard:
    """Verify a character card belongs to the user's organization."""
    card = db.query(CharacterCard).filter(CharacterCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Character card not found")
    franchise = db.query(Franchise).filter(
        Franchise.id == card.franchise_id,
        Franchise.organization_id == organization_id,
    ).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Character card not found")
    return card


# ============================================================
# Baseline endpoints
# ============================================================

@router.post("/baselines", response_model=BaselineResponse)
async def create_baseline(
    request: BaselineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Pin an existing eval run as a drift baseline."""
    eval_run = db.query(EvalRun).filter(EvalRun.id == str(request.eval_run_id)).first()
    if not eval_run:
        raise HTTPException(status_code=404, detail="Evaluation run not found")
    if eval_run.status != "completed":
        raise HTTPException(status_code=400, detail="Only completed runs can be pinned as baselines")

    # Verify ownership
    _verify_card_in_org(db, eval_run.character_card_id, str(current_user.organization_id))

    # Deactivate any existing baseline for same character + provider
    existing = db.query(DriftBaseline).filter(
        DriftBaseline.character_card_id == eval_run.character_card_id,
        DriftBaseline.model_provider == eval_run.model_provider,
        DriftBaseline.active == True,
    ).all()
    for b in existing:
        b.active = False

    # Mark the eval run as a baseline
    eval_run.is_baseline = True

    baseline = DriftBaseline(
        organization_id=str(current_user.organization_id),
        character_card_id=eval_run.character_card_id,
        eval_run_id=eval_run.id,
        model_provider=eval_run.model_provider,
        model_name=eval_run.model_name,
        model_version=eval_run.model_version,
        judge_model_name=eval_run.judge_model_name,
        baseline_canon=eval_run.avg_canon_fidelity,
        baseline_voice=eval_run.avg_voice_consistency,
        baseline_safety=eval_run.avg_brand_safety,
        baseline_legal=eval_run.avg_legal_compliance,
        baseline_total=eval_run.avg_total_score,
        notes=request.notes,
        created_by=str(current_user.id),
    )
    db.add(baseline)
    db.commit()
    db.refresh(baseline)
    return baseline


@router.get("/baselines", response_model=List[BaselineResponse])
async def list_baselines(
    character_card_id: Optional[UUID] = None,
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List drift baselines for the organization."""
    query = db.query(DriftBaseline).filter(
        DriftBaseline.organization_id == str(current_user.organization_id),
    )
    if character_card_id:
        query = query.filter(DriftBaseline.character_card_id == str(character_card_id))
    if active_only:
        query = query.filter(DriftBaseline.active == True)
    return query.order_by(DriftBaseline.created_at.desc()).all()


@router.delete("/baselines/{baseline_id}")
async def deactivate_baseline(
    baseline_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deactivate a drift baseline (soft delete)."""
    baseline = db.query(DriftBaseline).filter(
        DriftBaseline.id == str(baseline_id),
        DriftBaseline.organization_id == str(current_user.organization_id),
    ).first()
    if not baseline:
        raise HTTPException(status_code=404, detail="Baseline not found")

    baseline.active = False
    db.commit()
    return {"detail": "Baseline deactivated"}


# ============================================================
# Drift Event endpoints
# ============================================================

@router.get("/events", response_model=List[DriftEventResponse])
async def list_drift_events(
    character_card_id: Optional[UUID] = None,
    severity: Optional[str] = None,
    acknowledged: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List drift events for the organization with optional filters."""
    query = db.query(DriftEvent).filter(
        DriftEvent.organization_id == str(current_user.organization_id),
    )
    if character_card_id:
        query = query.filter(DriftEvent.character_card_id == str(character_card_id))
    if severity:
        query = query.filter(DriftEvent.severity == severity)
    if acknowledged is not None:
        query = query.filter(DriftEvent.acknowledged == acknowledged)

    return query.order_by(DriftEvent.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/events/{event_id}", response_model=DriftEventResponse)
async def get_drift_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get full drift event detail."""
    event = db.query(DriftEvent).filter(
        DriftEvent.id == str(event_id),
        DriftEvent.organization_id == str(current_user.organization_id),
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Drift event not found")
    return event


@router.patch("/events/{event_id}/acknowledge", response_model=DriftEventResponse)
async def acknowledge_drift_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark a drift event as reviewed/acknowledged."""
    event = db.query(DriftEvent).filter(
        DriftEvent.id == str(event_id),
        DriftEvent.organization_id == str(current_user.organization_id),
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Drift event not found")

    event.acknowledged = True
    event.acknowledged_by = str(current_user.id)
    event.acknowledged_at = datetime.utcnow()
    db.commit()
    db.refresh(event)
    return event


# ============================================================
# Timeline endpoint
# ============================================================

@router.get("/timeline/{character_card_id}", response_model=TimelineResponse)
async def get_drift_timeline(
    character_card_id: UUID,
    days: int = Query(default=90, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get score history over time for a character (for charts)."""
    card_id_str = str(character_card_id)
    _verify_card_in_org(db, card_id_str, str(current_user.organization_id))

    from datetime import timedelta
    cutoff = datetime.utcnow() - timedelta(days=days)

    runs = db.query(EvalRun).filter(
        EvalRun.character_card_id == card_id_str,
        EvalRun.status == "completed",
        EvalRun.created_at >= cutoff,
    ).order_by(EvalRun.created_at.asc()).all()

    data_points = [
        TimelinePoint(
            eval_run_id=run.id,
            model_version=run.model_version,
            canon_fidelity=float(run.avg_canon_fidelity) if run.avg_canon_fidelity else None,
            voice_consistency=float(run.avg_voice_consistency) if run.avg_voice_consistency else None,
            brand_safety=float(run.avg_brand_safety) if run.avg_brand_safety else None,
            legal_compliance=float(run.avg_legal_compliance) if run.avg_legal_compliance else None,
            total_score=float(run.avg_total_score) if run.avg_total_score else None,
            is_baseline=run.is_baseline,
            created_at=run.created_at,
        )
        for run in runs
    ]

    # Get active baseline
    baseline = db.query(DriftBaseline).filter(
        DriftBaseline.character_card_id == card_id_str,
        DriftBaseline.organization_id == str(current_user.organization_id),
        DriftBaseline.active == True,
    ).first()

    return TimelineResponse(
        character_card_id=card_id_str,
        data_points=data_points,
        baseline=baseline,
    )


# ============================================================
# Compare endpoint
# ============================================================

@router.get("/compare", response_model=RunComparisonResponse)
async def compare_runs(
    baseline_run_id: UUID = Query(...),
    comparison_run_id: UUID = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Side-by-side comparison of two eval runs."""
    result = drift_service.compare_runs(
        db, str(baseline_run_id), str(comparison_run_id)
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


# ============================================================
# Summary endpoint
# ============================================================

@router.get("/summary", response_model=OrgDriftSummary)
async def get_drift_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Organization-wide drift health: characters with active warnings, trend arrows."""
    org_id = str(current_user.organization_id)
    org_card_ids = _get_org_card_ids(db, org_id)

    characters = []
    total_warnings = 0
    total_criticals = 0
    chars_with_baselines = 0

    for card_id in org_card_ids:
        card = db.query(CharacterCard).filter(CharacterCard.id == card_id).first()
        if not card:
            continue

        # Check for baseline
        baseline = db.query(DriftBaseline).filter(
            DriftBaseline.character_card_id == card_id,
            DriftBaseline.active == True,
        ).first()

        has_baseline = baseline is not None
        if has_baseline:
            chars_with_baselines += 1

        # Count unacknowledged events
        warnings = db.query(DriftEvent).filter(
            DriftEvent.character_card_id == card_id,
            DriftEvent.severity == "warning",
            DriftEvent.acknowledged == False,
        ).count()
        criticals = db.query(DriftEvent).filter(
            DriftEvent.character_card_id == card_id,
            DriftEvent.severity == "critical",
            DriftEvent.acknowledged == False,
        ).count()

        total_warnings += warnings
        total_criticals += criticals

        # Get latest run score
        latest_run = db.query(EvalRun).filter(
            EvalRun.character_card_id == card_id,
            EvalRun.status == "completed",
        ).order_by(EvalRun.created_at.desc()).first()

        # Compute trend
        summary = drift_service.get_drift_summary(db, card_id, days=30)

        characters.append(CharacterDriftSummary(
            character_card_id=card_id,
            character_name=card.name,
            has_baseline=has_baseline,
            active_warnings=warnings,
            active_criticals=criticals,
            latest_total_score=float(latest_run.avg_total_score) if latest_run and latest_run.avg_total_score else None,
            baseline_total_score=float(baseline.baseline_total) if baseline and baseline.baseline_total else None,
            trend=summary["trend"],
        ))

    return OrgDriftSummary(
        total_characters=len(org_card_ids),
        characters_with_baselines=chars_with_baselines,
        active_warnings=total_warnings,
        active_criticals=total_criticals,
        characters=characters,
    )


# ============================================================
# Alert Config endpoints
# ============================================================

@router.get("/alerts/config", response_model=Optional[AlertConfigResponse])
async def get_alert_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get alert configuration for the organization."""
    config = db.query(DriftAlertConfig).filter(
        DriftAlertConfig.organization_id == str(current_user.organization_id),
    ).first()
    return config


@router.put("/alerts/config", response_model=AlertConfigResponse)
async def upsert_alert_config(
    request: AlertConfigCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create or update alert configuration for the organization."""
    org_id = str(current_user.organization_id)
    config = db.query(DriftAlertConfig).filter(
        DriftAlertConfig.organization_id == org_id,
    ).first()

    if config:
        config.warning_threshold = request.warning_threshold
        config.critical_threshold = request.critical_threshold
        config.notify_on_warning = request.notify_on_warning
        config.notify_on_critical = request.notify_on_critical
        config.webhook_url = request.webhook_url
        config.email_recipients = request.email_recipients
    else:
        config = DriftAlertConfig(
            organization_id=org_id,
            warning_threshold=request.warning_threshold,
            critical_threshold=request.critical_threshold,
            notify_on_warning=request.notify_on_warning,
            notify_on_critical=request.notify_on_critical,
            webhook_url=request.webhook_url,
            email_recipients=request.email_recipients,
        )
        db.add(config)

    db.commit()
    db.refresh(config)
    return config


# ============================================================
# Regression Schedule endpoints
# ============================================================

@router.post("/regression-schedules", response_model=RegressionScheduleResponse)
async def create_regression_schedule(
    request: RegressionScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a regression test schedule."""
    org_id = str(current_user.organization_id)
    _verify_card_in_org(db, str(request.character_card_id), org_id)

    # Verify baseline exists and is active
    baseline = db.query(DriftBaseline).filter(
        DriftBaseline.id == str(request.baseline_id),
        DriftBaseline.organization_id == org_id,
        DriftBaseline.active == True,
    ).first()
    if not baseline:
        raise HTTPException(status_code=404, detail="Active baseline not found")

    from datetime import timedelta
    from src.services.regression import FREQUENCY_DELTAS

    freq_delta = FREQUENCY_DELTAS.get(request.frequency, timedelta(weeks=1))

    schedule = RegressionTestSchedule(
        organization_id=org_id,
        character_card_id=str(request.character_card_id),
        test_suite_id=str(request.test_suite_id),
        model_provider=request.model_provider,
        model_names=request.model_names,
        baseline_id=str(request.baseline_id),
        frequency=request.frequency,
        next_run_at=datetime.utcnow() + freq_delta,
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.get("/regression-schedules", response_model=List[RegressionScheduleResponse])
async def list_regression_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List regression test schedules for the organization."""
    return db.query(RegressionTestSchedule).filter(
        RegressionTestSchedule.organization_id == str(current_user.organization_id),
    ).order_by(RegressionTestSchedule.created_at.desc()).all()


@router.post("/regression-schedules/{schedule_id}/run")
async def trigger_regression(
    schedule_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Trigger a regression test schedule immediately."""
    schedule = db.query(RegressionTestSchedule).filter(
        RegressionTestSchedule.id == str(schedule_id),
        RegressionTestSchedule.organization_id == str(current_user.organization_id),
    ).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Regression schedule not found")

    result = regression_service.run_regression(db, schedule)
    db.commit()

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/regression-schedules/{schedule_id}/history")
async def get_regression_history(
    schedule_id: UUID,
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get past regression results for a schedule."""
    schedule = db.query(RegressionTestSchedule).filter(
        RegressionTestSchedule.id == str(schedule_id),
        RegressionTestSchedule.organization_id == str(current_user.organization_id),
    ).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Regression schedule not found")

    # Get eval runs linked to this schedule's baseline
    runs = db.query(EvalRun).filter(
        EvalRun.character_card_id == schedule.character_card_id,
        EvalRun.baseline_run_id == schedule.baseline.eval_run_id if schedule.baseline else None,
        EvalRun.status == "completed",
    ).order_by(EvalRun.created_at.desc()).limit(limit).all()

    # Get associated drift events
    run_ids = [r.id for r in runs]
    events = db.query(DriftEvent).filter(
        DriftEvent.eval_run_id.in_(run_ids),
    ).all() if run_ids else []
    event_map = {e.eval_run_id: e for e in events}

    return [
        {
            "eval_run_id": run.id,
            "model_name": run.model_name,
            "model_version": run.model_version,
            "total_score": float(run.avg_total_score) if run.avg_total_score else None,
            "drift_event": event_map.get(run.id, {}).to_dict() if event_map.get(run.id) else None,
            "created_at": run.created_at.isoformat() if run.created_at else None,
        }
        for run in runs
    ]
