"""
Test Suite API routes.

All endpoints require authentication and scope data to the user's organization.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database import get_db
from src.models import (
    CharacterCard,
    TestSuite,
    TestCase,
    Franchise,
    User,
)
from src.schemas.evaluation import (
    TestSuiteCreate,
    TestSuiteResponse,
    TestCaseCreate,
    TestCaseResponse,
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


# Test Suite CRUD endpoints
@router.post("/", response_model=TestSuiteResponse)
async def create_test_suite(
    suite: TestSuiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new test suite with test cases."""
    # Verify character card belongs to user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    db_suite = TestSuite(
        character_card_id=str(suite.character_card_id),
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
            expected_response=tc.expected_response if hasattr(tc, 'expected_response') else None,
            tags=tc.tags if tc.tags else [],
        )
        db.add(db_case)

    db.commit()
    db.refresh(db_suite)
    return db_suite


@router.get("/", response_model=List[TestSuiteResponse])
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
            Franchise.organization_id == str(current_user.organization_id)
        ).all()
    ]
    org_card_ids = [
        c.id for c in db.query(CharacterCard.id).filter(
            CharacterCard.franchise_id.in_(org_franchise_ids)
        ).all()
    ]

    query = db.query(TestSuite).filter(TestSuite.character_card_id.in_(org_card_ids))
    if character_card_id:
        query = query.filter(TestSuite.character_card_id == str(character_card_id))

    return query.offset(skip).limit(limit).all()


@router.get("/{suite_id}", response_model=TestSuiteResponse)
async def get_test_suite(
    suite_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a test suite by ID."""
    suite = db.query(TestSuite).filter(TestSuite.id == str(suite_id)).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    return suite


@router.put("/{suite_id}", response_model=TestSuiteResponse)
async def update_test_suite(
    suite_id: UUID,
    suite_update: TestSuiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a test suite."""
    suite = db.query(TestSuite).filter(TestSuite.id == str(suite_id)).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    # Update basic fields
    suite.name = suite_update.name
    suite.description = suite_update.description

    # Delete existing test cases
    db.query(TestCase).filter(TestCase.test_suite_id == str(suite_id)).delete()

    # Add new test cases
    for tc in suite_update.test_cases:
        db_case = TestCase(
            test_suite_id=str(suite_id),
            name=tc.name,
            category=tc.category,
            prompt=tc.prompt,
            expected_behavior=tc.expected_behavior,
            expected_response=tc.expected_response if hasattr(tc, 'expected_response') else None,
            tags=tc.tags if tc.tags else [],
        )
        db.add(db_case)

    db.commit()
    db.refresh(suite)
    return suite


@router.delete("/{suite_id}")
async def delete_test_suite(
    suite_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a test suite."""
    suite = db.query(TestSuite).filter(TestSuite.id == str(suite_id)).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    # Delete associated test cases first
    db.query(TestCase).filter(TestCase.test_suite_id == str(suite_id)).delete()

    # Delete the suite
    db.delete(suite)
    db.commit()

    return {"detail": "Test suite deleted successfully"}


# Test Case endpoints
@router.post("/{suite_id}/test-cases", response_model=TestCaseResponse)
async def add_test_case(
    suite_id: UUID,
    test_case: TestCaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a test case to a test suite."""
    suite = db.query(TestSuite).filter(TestSuite.id == str(suite_id)).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    db_case = TestCase(
        test_suite_id=str(suite_id),
        name=test_case.name,
        category=test_case.category,
        prompt=test_case.prompt,
        expected_behavior=test_case.expected_behavior,
        expected_response=test_case.expected_response if hasattr(test_case, 'expected_response') else None,
        tags=test_case.tags if test_case.tags else [],
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case


@router.get("/{suite_id}/test-cases", response_model=List[TestCaseResponse])
async def list_test_cases(
    suite_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all test cases for a test suite."""
    suite = db.query(TestSuite).filter(TestSuite.id == str(suite_id)).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    return db.query(TestCase).filter(TestCase.test_suite_id == str(suite_id)).all()


@router.put("/{suite_id}/test-cases/{case_id}", response_model=TestCaseResponse)
async def update_test_case(
    suite_id: UUID,
    case_id: UUID,
    test_case_update: TestCaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a test case."""
    suite = db.query(TestSuite).filter(TestSuite.id == str(suite_id)).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    test_case = db.query(TestCase).filter(
        TestCase.id == str(case_id),
        TestCase.test_suite_id == str(suite_id)
    ).first()
    if not test_case:
        raise HTTPException(status_code=404, detail="Test case not found")

    # Update fields
    test_case.name = test_case_update.name
    test_case.category = test_case_update.category
    test_case.prompt = test_case_update.prompt
    test_case.expected_behavior = test_case_update.expected_behavior
    test_case.expected_response = test_case_update.expected_response if hasattr(test_case_update, 'expected_response') else None
    test_case.tags = test_case_update.tags if test_case_update.tags else []

    db.commit()
    db.refresh(test_case)
    return test_case


@router.delete("/{suite_id}/test-cases/{case_id}")
async def delete_test_case(
    suite_id: UUID,
    case_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a test case."""
    suite = db.query(TestSuite).filter(TestSuite.id == str(suite_id)).first()
    if not suite:
        raise HTTPException(status_code=404, detail="Test suite not found")

    # Verify the suite belongs to the user's organization
    verify_card_ownership(db, suite.character_card_id, current_user.organization_id)

    test_case = db.query(TestCase).filter(
        TestCase.id == str(case_id),
        TestCase.test_suite_id == str(suite_id)
    ).first()
    if not test_case:
        raise HTTPException(status_code=404, detail="Test case not found")

    db.delete(test_case)
    db.commit()

    return {"detail": "Test case deleted successfully"}
