"""
Evaluation API routes.

All endpoints require authentication and scope data to the user's organization.
"""

from typing import List
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session, joinedload

from src.database import get_db
from src.models import (
    CharacterCard,
    CardVersion,
    TestSuite,
    TestCase,
    EvalRun,
    EvalResult,
    Franchise,
    User,
)
from src.schemas.evaluation import (
    TestSuiteCreate,
    TestSuiteResponse,
    TestCaseCreate,
    TestCaseResponse,
    EvalRunCreate,
    EvalRunResponse,
    EvaluateRequest,
    EvaluateResponse,
)
from src.services.auth import get_current_user

router = APIRouter()


def verify_card_ownership(db: Session, card_id: UUID, organization_id: UUID) -> CharacterCard:
    """Verify that a character card belongs to the given organization."""
    # Convert UUID to string for SQLite compatibility
    card_id_str = str(card_id)
    org_id_str = str(organization_id)

    card = db.query(CharacterCard).filter(CharacterCard.id == card_id_str).first()
    if not card:
        raise HTTPException(status_code=404, detail="Character card not found")

    franchise = db.query(Franchise).filter(
        Franchise.id == card.franchise_id,
        Franchise.organization_id == org_id_str,
    ).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Character card not found")

    return card


# Test Suite endpoints
@router.post("/test-suites", response_model=TestSuiteResponse)
async def create_test_suite(
    suite: TestSuiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new test suite with test cases."""
    # Verify character card belongs to user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    db_suite = TestSuite(
        character_card_id=suite.character_card_id,
        name=suite.name,
        description=suite.description,
        created_by=current_user.id,
    )
    db.add(db_suite)
    db.flush()

    # Add test cases
    for tc in suite.test_cases:
        db_case = TestCase(
            test_suite_id=db_suite.id,
            name=tc.name,
            category=tc.category,
            prompt=tc.prompt,
            expected_behavior=tc.expected_behavior,
            expected_response=tc.expected_response,
            tags=tc.tags,
        )
        db.add(db_case)

    db.commit()
    db.refresh(db_suite)
    return db_suite


@router.get("/test-suites", response_model=List[TestSuiteResponse])
async def list_test_suites(
    character_card_id: UUID = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List test suites for the current user's organization."""
    # Get all character card IDs for the user's organization
    org_franchise_ids = [
        f.id for f in db.query(Franchise.id).filter(
            Franchise.organization_id == current_user.organization_id
        ).all()
    ]
    org_card_ids = [
        c.id for c in db.query(CharacterCard.id).filter(
            CharacterCard.franchise_id.in_(org_franchise_ids)
        ).all()
    ]

    query = db.query(TestSuite).filter(TestSuite.character_card_id.in_(org_card_ids))
    if character_card_id:
        query = query.filter(TestSuite.character_card_id == character_card_id)
    return query.offset(skip).limit(limit).all()


@router.get("/test-suites/{suite_id}", response_model=TestSuiteResponse)
async def get_test_suite(
    suite_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a test suite by ID."""
    suite = db.query(TestSuite).filter(TestSuite.id == suite_id).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    return suite


@router.post("/test-suites/{suite_id}/test-cases", response_model=TestCaseResponse)
async def add_test_case(
    suite_id: UUID,
    test_case: TestCaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a test case to a test suite."""
    suite = db.query(TestSuite).filter(TestSuite.id == suite_id).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    db_case = TestCase(
        test_suite_id=suite_id,
        name=test_case.name,
        category=test_case.category,
        prompt=test_case.prompt,
        expected_behavior=test_case.expected_behavior,
        expected_response=test_case.expected_response,
        tags=test_case.tags,
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case


# Eval Run endpoints
@router.post("/runs", response_model=EvalRunResponse)
async def create_eval_run(
    run: EvalRunCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create and start an evaluation run."""
    # Validate character card exists and belongs to user's organization
    card = verify_card_ownership(db, run.character_card_id, current_user.organization_id)

    # Use current version if not specified
    card_version_id = run.card_version_id or card.current_version_id
    if not card_version_id:
        raise HTTPException(status_code=400, detail="No card version available")

    # Validate test suite exists and belongs to user's organization
    suite = db.query(TestSuite).filter(TestSuite.id == str(run.test_suite_id)).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to a card in the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    # Count test cases
    test_count = db.query(TestCase).filter(TestCase.test_suite_id == str(run.test_suite_id)).count()

    db_run = EvalRun(
        character_card_id=str(run.character_card_id),
        card_version_id=str(card_version_id) if card_version_id else None,
        test_suite_id=str(run.test_suite_id),
        model_provider=run.model_provider,
        model_name=run.model_name,
        llm_config=run.llm_config,
        status="running",
        total_tests=test_count,
        created_by=current_user.id,
        started_at=datetime.utcnow(),
    )
    db.add(db_run)
    db.flush()

    # Run evaluations synchronously for demo purposes
    # In production, this should be async/background task
    test_cases = db.query(TestCase).filter(TestCase.test_suite_id == str(run.test_suite_id)).all()

    import random
    all_scores = {"canon": [], "voice": [], "safety": [], "legal": []}
    passed = 0
    failed = 0

    for test_case in test_cases:
        # Generate mock scores (in production, call actual LLM judge)
        scores = {
            "canon_fidelity": round(random.uniform(85, 100), 1),
            "voice_consistency": round(random.uniform(80, 95), 1),
            "brand_safety": round(random.uniform(90, 100), 1),
            "legal_compliance": round(random.uniform(90, 100), 1),
        }

        total = sum(scores.values()) / len(scores)
        is_passed = total >= 90.0

        if is_passed:
            passed += 1
        else:
            failed += 1

        # Store result
        result = EvalResult(
            eval_run_id=db_run.id,
            test_case_id=test_case.id,
            model_response=f"Mock response for: {test_case.name}",
            response_latency_ms=random.randint(500, 2000),
            score_canon_fidelity=scores["canon_fidelity"],
            score_voice_consistency=scores["voice_consistency"],
            score_brand_safety=scores["brand_safety"],
            score_legal_compliance=scores["legal_compliance"],
            score_total=total,
            explanation_canon="Response aligns with canon",
            explanation_voice="Good voice match",
            explanation_safety="Content is safe",
            explanation_legal="No legal issues",
            passed=is_passed,
            failure_reasons=[] if is_passed else ["Below 90% threshold"],
        )
        db.add(result)

        all_scores["canon"].append(scores["canon_fidelity"])
        all_scores["voice"].append(scores["voice_consistency"])
        all_scores["safety"].append(scores["brand_safety"])
        all_scores["legal"].append(scores["legal_compliance"])

    # Update run with results
    db_run.status = "completed"
    db_run.completed_at = datetime.utcnow()
    db_run.passed_tests = passed
    db_run.failed_tests = failed
    db_run.avg_canon_fidelity = round(sum(all_scores["canon"]) / len(all_scores["canon"]), 1)
    db_run.avg_voice_consistency = round(sum(all_scores["voice"]) / len(all_scores["voice"]), 1)
    db_run.avg_brand_safety = round(sum(all_scores["safety"]) / len(all_scores["safety"]), 1)
    db_run.avg_legal_compliance = round(sum(all_scores["legal"]) / len(all_scores["legal"]), 1)
    db_run.avg_total_score = round(
        (db_run.avg_canon_fidelity + db_run.avg_voice_consistency +
         db_run.avg_brand_safety + db_run.avg_legal_compliance) / 4, 1
    )

    db.commit()
    db.refresh(db_run)

    # Drift detection hook — check if this run drifted from baseline
    try:
        from src.services.drift import DriftDetectionService
        drift_svc = DriftDetectionService()
        drift_event = drift_svc.check_for_drift(db, db_run)
        if drift_event:
            db.commit()
    except Exception:
        pass  # Drift detection is non-blocking

    return db_run


@router.get("/runs", response_model=List[EvalRunResponse])
async def list_eval_runs(
    character_card_id: UUID = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List evaluation runs for the current user's organization."""
    # Get all character card IDs for the user's organization
    org_franchise_ids = [
        f.id for f in db.query(Franchise.id).filter(
            Franchise.organization_id == str(current_user.organization_id)
        ).all()
    ]

    if not org_franchise_ids:
        return []

    org_card_ids = [
        c.id for c in db.query(CharacterCard.id).filter(
            CharacterCard.franchise_id.in_(org_franchise_ids)
        ).all()
    ]

    if not org_card_ids:
        return []

    query = db.query(EvalRun).options(
        joinedload(EvalRun.results)
    ).filter(EvalRun.character_card_id.in_(org_card_ids))
    if character_card_id:
        query = query.filter(EvalRun.character_card_id == str(character_card_id))
    if status:
        query = query.filter(EvalRun.status == status)
    return query.order_by(EvalRun.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/runs/{run_id}", response_model=EvalRunResponse)
async def get_eval_run(
    run_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get an evaluation run by ID."""
    run = db.query(EvalRun).filter(EvalRun.id == str(run_id)).first()
    if not run:
        raise HTTPException(status_code=404, detail="Evaluation run not found")

    # Verify the run belongs to the user's organization
    verify_card_ownership(db, run.character_card_id, current_user.organization_id)

    return run


@router.delete("/runs/{run_id}")
async def delete_eval_run(
    run_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an evaluation run and all its results."""
    run = db.query(EvalRun).filter(EvalRun.id == str(run_id)).first()
    if not run:
        raise HTTPException(status_code=404, detail="Evaluation run not found")

    # Verify the run belongs to the user's organization
    verify_card_ownership(db, run.character_card_id, current_user.organization_id)

    # Delete associated eval results first
    db.query(EvalResult).filter(EvalResult.eval_run_id == str(run_id)).delete()

    # Delete the eval run
    db.delete(run)
    db.commit()

    return {"detail": "Evaluation run deleted successfully"}


# Evaluation History endpoint (lists all eval runs)
@router.get("/", response_model=List[EvalRunResponse])
async def list_evaluations(
    character_card_id: UUID = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all evaluation runs for the current user's organization."""
    # Get all character card IDs for the user's organization
    org_franchise_ids = [
        f.id for f in db.query(Franchise.id).filter(
            Franchise.organization_id == str(current_user.organization_id)
        ).all()
    ]
    org_card_ids = [
        c.id for c in db.query(CharacterCard.id).filter(
            CharacterCard.franchise_id.in_(org_franchise_ids)
        ).all()
    ]

    query = db.query(EvalRun).options(
        joinedload(EvalRun.results)
    ).filter(EvalRun.character_card_id.in_(org_card_ids))
    if character_card_id:
        query = query.filter(EvalRun.character_card_id == str(character_card_id))

    return query.order_by(EvalRun.created_at.desc()).offset(skip).limit(limit).all()


# Quick Evaluation endpoint (for demo)
@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate_response(
    request: EvaluateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Quick evaluation of a single response against a character card.

    This is the primary demo endpoint - takes a prompt and model response,
    returns scores across all dimensions.

    IMPORTANT: Also stores the evaluation as an EvalRun for history tracking.
    """
    from src.services.evaluation import EvaluationService

    # Verify character card belongs to user's organization
    card = verify_card_ownership(db, request.character_card_id, current_user.organization_id)

    if not card.current_version_id:
        raise HTTPException(status_code=400, detail="Character card has no version")

    # Get current version
    version = db.query(CardVersion).filter(CardVersion.id == card.current_version_id).first()

    # Run evaluation
    eval_service = EvaluationService()
    result = await eval_service.evaluate_single(
        character_card=card,
        card_version=version,
        prompt=request.prompt,
        model_response=request.model_response,
    )

    # Convert result dict to EvaluateResponse if needed
    if isinstance(result, dict):
        # Handle dict response
        scores = result.get('scores', {})
        passed = result.get('passed', False)
        explanations = result.get('explanations', {})
        failure_reasons = result.get('failure_reasons', [])
    else:
        # Handle Pydantic model response
        scores = result.scores if hasattr(result, 'scores') else result.scores.dict()
        if isinstance(scores, object) and not isinstance(scores, dict):
            scores = {
                'canon_fidelity': scores.canon_fidelity,
                'voice_consistency': scores.voice_consistency,
                'brand_safety': scores.brand_safety,
                'legal_compliance': scores.legal_compliance,
                'total': scores.total,
            }
        passed = result.passed
        explanations = result.explanations
        failure_reasons = result.failure_reasons or []

    # Store the quick evaluation as an EvalRun for history
    # Use test_suite_id=None to mark as quick evaluation
    db_run = EvalRun(
        character_card_id=str(request.character_card_id),
        card_version_id=str(card.current_version_id),
        test_suite_id=None,  # Null indicates quick evaluation
        prompt=request.prompt,
        model_response=request.model_response,
        model_provider="quick_eval",
        model_name="quick_eval",
        llm_config={},
        status="completed",
        total_tests=1,
        passed_tests=1 if passed else 0,
        failed_tests=0 if passed else 1,
        avg_canon_fidelity=scores.get('canon_fidelity', 0),
        avg_voice_consistency=scores.get('voice_consistency', 0),
        avg_brand_safety=scores.get('brand_safety', 0),
        avg_legal_compliance=scores.get('legal_compliance', 0),
        avg_total_score=scores.get('total', 0),
        created_by=str(current_user.id),
        started_at=datetime.utcnow(),
        completed_at=datetime.utcnow(),
    )
    db.add(db_run)
    db.flush()

    # Store the single result as an EvalResult
    eval_result = EvalResult(
        eval_run_id=db_run.id,
        test_case_id=None,  # No test case for quick eval
        model_response=request.model_response,
        response_latency_ms=0,
        score_canon_fidelity=scores.get('canon_fidelity', 0),
        score_voice_consistency=scores.get('voice_consistency', 0),
        score_brand_safety=scores.get('brand_safety', 0),
        score_legal_compliance=scores.get('legal_compliance', 0),
        score_total=scores.get('total', 0),
        explanation_canon=explanations.get("canon_fidelity", ""),
        explanation_voice=explanations.get("voice_consistency", ""),
        explanation_safety=explanations.get("brand_safety", ""),
        explanation_legal=explanations.get("legal_compliance", ""),
        passed=passed,
        failure_reasons=failure_reasons,
    )
    db.add(eval_result)

    # Capture judge model version for drift tracking
    judge_info = eval_service.get_judge_model_info()
    db_run.judge_model_name = judge_info["judge_model_name"]
    db_run.judge_model_version = judge_info["judge_model_version"]

    db.commit()
    db.refresh(db_run)

    # Drift detection hook — check if this run drifted from baseline
    try:
        from src.services.drift import DriftDetectionService
        drift_svc = DriftDetectionService()
        drift_event = drift_svc.check_for_drift(db, db_run)
        if drift_event:
            db.commit()
    except Exception:
        pass  # Drift detection is non-blocking

    # Return result in proper format
    if isinstance(result, dict):
        result['id'] = db_run.id
        result['created_at'] = db_run.created_at.isoformat()
        return result
    else:
        result.id = db_run.id
        result.created_at = db_run.created_at
        return result
