"""
Organization API routes.

All endpoints require authentication and scope data to the user's own organization.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database import get_db
from src.models import Organization, User
from src.schemas.organization import (
    OrganizationCreate,
    OrganizationResponse,
    UserCreate,
    UserResponse,
)
from src.services.auth import get_current_user, get_password_hash

router = APIRouter()


@router.get("/me", response_model=OrganizationResponse)
async def get_my_organization(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the current user's organization."""
    org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


@router.patch("/me", response_model=OrganizationResponse)
async def update_my_organization(
    update: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the current user's organization (admin only)."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update organization settings")

    org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    # Update allowed fields
    if update.name:
        org.name = update.name
    if update.settings:
        org.settings = update.settings
    # Note: slug cannot be changed to avoid breaking references

    db.commit()
    db.refresh(org)
    return org


@router.get("/me/users", response_model=List[UserResponse])
async def list_organization_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List users in the current user's organization."""
    return db.query(User).filter(User.organization_id == current_user.organization_id).all()


@router.post("/me/users", response_model=UserResponse)
async def create_organization_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a user in the current user's organization (admin only)."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create users")

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = User(
        organization_id=current_user.organization_id,
        email=user.email,
        name=user.name,
        role=user.role,
        hashed_password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Legacy routes - kept for backward compatibility but scoped to user's organization
@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get organization by ID (must be user's own organization)."""
    if org_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")

    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


@router.get("/{org_id}/users", response_model=List[UserResponse])
async def list_users(
    org_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List users in an organization (must be user's own organization)."""
    if org_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return db.query(User).filter(User.organization_id == org_id).all()
