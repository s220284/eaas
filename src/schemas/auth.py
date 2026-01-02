"""
Authentication schemas for MASH AI.
"""

from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Data stored in JWT token."""
    user_id: Optional[str] = None


class LoginRequest(BaseModel):
    """Login request schema."""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """Registration request schema."""
    email: EmailStr
    password: str
    name: str
    organization_name: str
    organization_slug: str


class UserProfile(BaseModel):
    """User profile response."""
    id: UUID
    email: str
    name: Optional[str]
    role: str
    organization_id: UUID
    organization_name: str

    class Config:
        from_attributes = True


class ChangePasswordRequest(BaseModel):
    """Change password request."""
    current_password: str
    new_password: str


class InviteUserRequest(BaseModel):
    """Invite user to organization."""
    email: EmailStr
    name: str
    role: str = "member"
