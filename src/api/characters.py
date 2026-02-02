"""
Character Card API routes.

All endpoints require authentication and scope data to the user's organization.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database import get_db
from src.models import CharacterCard, CardVersion, Franchise, User
from src.schemas.character import (
    CharacterCardCreate,
    CharacterCardResponse,
    CharacterCardUpdate,
    CardVersionCreate,
    CardVersionResponse,
    FranchiseCreate,
    FranchiseResponse,
)
from src.services.auth import get_current_user

router = APIRouter()


# Franchise endpoints
@router.post("/franchises", response_model=FranchiseResponse)
async def create_franchise(
    franchise: FranchiseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new franchise for the current user's organization."""
    db_franchise = Franchise(
        organization_id=current_user.organization_id,
        name=franchise.name,
        description=franchise.description,
        extra_data=franchise.extra_data,
    )
    db.add(db_franchise)
    db.commit()
    db.refresh(db_franchise)
    return db_franchise


@router.get("/franchises", response_model=List[FranchiseResponse])
async def list_franchises(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List franchises for the current user's organization."""
    return (
        db.query(Franchise)
        .filter(Franchise.organization_id == current_user.organization_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# Character Card endpoints
@router.post("/", response_model=CharacterCardResponse)
async def create_character_card(
    card: CharacterCardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new character card with optional initial version."""
    # Verify the franchise belongs to the user's organization
    franchise = db.query(Franchise).filter(
        Franchise.id == str(card.franchise_id),
        Franchise.organization_id == current_user.organization_id,
    ).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")

    db_card = CharacterCard(
        franchise_id=str(card.franchise_id),
        name=card.name,
        slug=card.slug,
        status="draft",
        created_by=current_user.id,
    )
    db.add(db_card)
    db.flush()

    # Create initial version if provided
    if card.initial_version:
        version = CardVersion(
            character_card_id=db_card.id,
            version_number=1,
            canon_facts=card.initial_version.canon_facts,
            canon_voice=card.initial_version.canon_voice,
            canon_relationships=card.initial_version.canon_relationships,
            legal_rights=card.initial_version.legal_rights,
            legal_performer_consent=card.initial_version.legal_performer_consent,
            safety_content_rating=card.initial_version.safety_content_rating,
            safety_prohibited_topics=card.initial_version.safety_prohibited_topics,
            safety_required_disclosures=card.initial_version.safety_required_disclosures,
            safety_age_gating=card.initial_version.safety_age_gating,
            change_summary=card.initial_version.change_summary or "Initial version",
            created_by=current_user.id,
        )
        db.add(version)
        db.flush()
        db_card.current_version_id = version.id

    db.commit()
    db.refresh(db_card)
    return db_card


@router.get("/", response_model=List[CharacterCardResponse])
async def list_character_cards(
    franchise_id: UUID = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List character cards for the current user's organization with optional filters."""
    # Get all franchise IDs for the user's organization
    org_franchise_ids = [
        f.id for f in db.query(Franchise.id).filter(
            Franchise.organization_id == current_user.organization_id
        ).all()
    ]

    query = db.query(CharacterCard).filter(CharacterCard.franchise_id.in_(org_franchise_ids))
    if franchise_id:
        query = query.filter(CharacterCard.franchise_id == str(franchise_id))
    if status:
        query = query.filter(CharacterCard.status == status)
    return query.offset(skip).limit(limit).all()


@router.get("/{card_id}", response_model=CharacterCardResponse)
async def get_character_card(
    card_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a character card by ID (must belong to user's organization)."""
    card = db.query(CharacterCard).filter(CharacterCard.id == str(card_id)).first()
    if not card:
        raise HTTPException(status_code=404, detail="Character card not found")

    # Verify the card belongs to the user's organization
    franchise = db.query(Franchise).filter(
        Franchise.id == card.franchise_id,
        Franchise.organization_id == current_user.organization_id,
    ).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Character card not found")

    return card


@router.patch("/{card_id}", response_model=CharacterCardResponse)
async def update_character_card(
    card_id: UUID,
    update: CharacterCardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a character card (must belong to user's organization)."""
    card = db.query(CharacterCard).filter(CharacterCard.id == str(card_id)).first()
    if not card:
        raise HTTPException(status_code=404, detail="Character card not found")

    # Verify the card belongs to the user's organization
    franchise = db.query(Franchise).filter(
        Franchise.id == card.franchise_id,
        Franchise.organization_id == current_user.organization_id,
    ).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Character card not found")

    if update.name is not None:
        card.name = update.name
    if update.status is not None:
        # Validate status transition
        valid_statuses = ["draft", "pending_approval", "approved", "archived"]
        if update.status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status: {update.status}")
        card.status = update.status

    db.commit()
    db.refresh(card)
    return card


# Card Version endpoints
@router.post("/{card_id}/versions", response_model=CardVersionResponse)
async def create_card_version(
    card_id: UUID,
    version: CardVersionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new version of a character card."""
    card = db.query(CharacterCard).filter(CharacterCard.id == str(card_id)).first()
    if not card:
        raise HTTPException(status_code=404, detail="Character card not found")

    # Verify the card belongs to the user's organization
    franchise = db.query(Franchise).filter(
        Franchise.id == card.franchise_id,
        Franchise.organization_id == current_user.organization_id,
    ).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Character card not found")

    # Get next version number
    latest_version = (
        db.query(CardVersion)
        .filter(CardVersion.character_card_id == str(card_id))
        .order_by(CardVersion.version_number.desc())
        .first()
    )
    next_version = (latest_version.version_number + 1) if latest_version else 1

    db_version = CardVersion(
        character_card_id=card_id,
        version_number=next_version,
        canon_facts=version.canon_facts,
        canon_voice=version.canon_voice,
        canon_relationships=version.canon_relationships,
        legal_rights=version.legal_rights,
        legal_performer_consent=version.legal_performer_consent,
        safety_content_rating=version.safety_content_rating,
        safety_prohibited_topics=version.safety_prohibited_topics,
        safety_required_disclosures=version.safety_required_disclosures,
        safety_age_gating=version.safety_age_gating,
        change_summary=version.change_summary,
        created_by=current_user.id,
    )
    db.add(db_version)
    db.flush()

    # Update current version
    card.current_version_id = db_version.id
    db.commit()
    db.refresh(db_version)
    return db_version


@router.get("/{card_id}/versions", response_model=List[CardVersionResponse])
async def list_card_versions(
    card_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all versions of a character card."""
    card = db.query(CharacterCard).filter(CharacterCard.id == str(card_id)).first()
    if not card:
        raise HTTPException(status_code=404, detail="Character card not found")

    # Verify the card belongs to the user's organization
    franchise = db.query(Franchise).filter(
        Franchise.id == card.franchise_id,
        Franchise.organization_id == current_user.organization_id,
    ).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Character card not found")

    return (
        db.query(CardVersion)
        .filter(CardVersion.character_card_id == str(card_id))
        .order_by(CardVersion.version_number.desc())
        .all()
    )


@router.get("/{card_id}/versions/{version_id}", response_model=CardVersionResponse)
async def get_card_version(
    card_id: UUID,
    version_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific version of a character card."""
    card = db.query(CharacterCard).filter(CharacterCard.id == str(card_id)).first()
    if not card:
        raise HTTPException(status_code=404, detail="Character card not found")

    # Verify the card belongs to the user's organization
    franchise = db.query(Franchise).filter(
        Franchise.id == card.franchise_id,
        Franchise.organization_id == current_user.organization_id,
    ).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Character card not found")

    version = (
        db.query(CardVersion)
        .filter(CardVersion.id == str(version_id), CardVersion.character_card_id == str(card_id))
        .first()
    )
    if not version:
        raise HTTPException(status_code=404, detail="Card version not found")
    return version
