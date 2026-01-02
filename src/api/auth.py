"""
Authentication API routes.
"""

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.config import get_settings
from src.database import get_db
from src.models import User, Organization
from src.schemas.auth import (
    Token,
    LoginRequest,
    RegisterRequest,
    UserProfile,
    ChangePasswordRequest,
    InviteUserRequest,
)
from src.services.auth import (
    authenticate_user,
    create_access_token,
    create_organization_with_admin,
    create_user,
    get_current_user,
    get_password_hash,
    verify_password,
)

settings = get_settings()
router = APIRouter()


@router.post("/register", response_model=Token)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new organization and admin user.

    Creates both the organization and the first admin user.
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Check if organization slug already exists
    existing_org = db.query(Organization).filter(
        Organization.slug == request.organization_slug
    ).first()
    if existing_org:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization slug already taken",
        )

    # Create organization and admin user
    org, user = create_organization_with_admin(
        db=db,
        org_name=request.organization_name,
        org_slug=request.organization_slug,
        admin_email=request.email,
        admin_password=request.password,
        admin_name=request.name,
    )

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    return Token(access_token=access_token)


@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login and get an access token.
    """
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    return Token(access_token=access_token)


@router.get("/me", response_model=UserProfile)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get the current user's profile.
    """
    org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()

    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        organization_id=current_user.organization_id,
        organization_name=org.name if org else "Unknown",
    )


@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Change the current user's password.
    """
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    current_user.hashed_password = get_password_hash(request.new_password)
    db.commit()

    return {"message": "Password changed successfully"}


@router.post("/invite", response_model=UserProfile)
def invite_user(
    request: InviteUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Invite a new user to the organization (admin only).
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can invite users",
        )

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create user with temporary password
    # In production, send email with password reset link
    temp_password = "changeme123"  # TODO: Generate random password and email

    user = create_user(
        db=db,
        email=request.email,
        password=temp_password,
        name=request.name,
        organization_id=current_user.organization_id,
        role=request.role,
    )

    org = db.query(Organization).filter(Organization.id == user.organization_id).first()

    return UserProfile(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        organization_id=user.organization_id,
        organization_name=org.name if org else "Unknown",
    )
