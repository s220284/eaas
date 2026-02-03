"""
Evaluation API routes.

All endpoints require authentication and scope data to the user's organization.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

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
        status="pending",
        total_tests=test_count,
        created_by=current_user.id,
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)

    # Queue background evaluation
    # background_tasks.add_task(run_evaluation, db_run.id)

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
            Franchise.organization_id == current_user.organization_id
        ).all()
    ]
    org_card_ids = [
        c.id for c in db.query(CharacterCard.id).filter(
            CharacterCard.franchise_id.in_(org_franchise_ids)
        ).all()
    ]

    query = db.query(EvalRun).filter(EvalRun.character_card_id.in_(org_card_ids))
    if character_card_id:
        query = query.filter(EvalRun.character_card_id == character_card_id)
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

    query = db.query(EvalRun).filter(EvalRun.character_card_id.in_(org_card_ids))
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

    return result
