"""
Pydantic schemas for Organization and User models.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class OrganizationCreate(BaseModel):
    """Schema for creating an organization."""
    name: str
    slug: str
    settings: Optional[dict] = {}


class OrganizationResponse(BaseModel):
    """Schema for organization response."""
    id: UUID
    name: str
    slug: str
    settings: dict
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    """Schema for creating a user."""
    email: EmailStr
    name: Optional[str] = None
    role: str = "member"
    password: str


class UserResponse(BaseModel):
    """Schema for user response."""
    id: UUID
    organization_id: UUID
    email: str
    name: Optional[str]
    role: str
    created_at: datetime

    class Config:
        from_attributes = True
