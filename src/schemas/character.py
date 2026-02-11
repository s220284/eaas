"""
Pydantic schemas for Character Card models.
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field


class CanonFact(BaseModel):
    """A single canon fact with source citation."""
    value: str
    source: Optional[str] = None


class Relationship(BaseModel):
    """A character relationship entry."""
    entity: str
    relationship: str
    notes: Optional[str] = None


class PerformerConsent(BaseModel):
    """Performer consent tracking for SAG-AFTRA compliance."""
    performer: str
    consent_type: str  # AI_DIGITAL_REPLICA, VOICE_ONLY, FULL_LIKENESS
    consent_date: Optional[str] = None
    expiration_date: Optional[str] = None
    territories: List[str] = []
    restrictions: List[str] = []


class AgeGating(BaseModel):
    """Age gating configuration."""
    enabled: bool = False
    minimum_age: int = 0
    verification_required: bool = False


# Franchise schemas
class FranchiseCreate(BaseModel):
    """Schema for creating a franchise."""
    name: str
    description: Optional[str] = None
    extra_data: Optional[dict] = {}


class FranchiseResponse(BaseModel):
    """Schema for franchise response."""
    id: UUID
    organization_id: UUID
    name: str
    description: Optional[str]
    image_url: Optional[str]
    extra_data: dict
    created_at: datetime

    class Config:
        from_attributes = True


# Card Version schemas
class CardVersionCreate(BaseModel):
    """Schema for creating a new card version."""
    # Canon Pack
    canon_facts: dict = Field(default_factory=dict)
    canon_voice: dict = Field(default_factory=dict)
    canon_relationships: List[dict] = Field(default_factory=list)

    # Legal Pack
    legal_rights: dict = Field(default_factory=dict)
    legal_performer_consent: dict = Field(default_factory=dict)

    # Safety Pack
    safety_content_rating: str = "PG"
    safety_prohibited_topics: List[str] = Field(default_factory=list)
    safety_required_disclosures: List[str] = Field(default_factory=list)
    safety_age_gating: dict = Field(default_factory=dict)

    change_summary: Optional[str] = None


class CardVersionResponse(BaseModel):
    """Schema for card version response."""
    id: UUID
    character_card_id: UUID
    version_number: int

    # Canon Pack
    canon_facts: dict
    canon_voice: dict
    canon_relationships: list

    # Legal Pack
    legal_rights: dict
    legal_performer_consent: dict

    # Safety Pack
    safety_content_rating: str
    safety_prohibited_topics: list
    safety_required_disclosures: list
    safety_age_gating: dict

    change_summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Character Card schemas
class CharacterCardCreate(BaseModel):
    """Schema for creating a character card."""
    franchise_id: UUID
    name: str
    slug: str
    is_main_character: Optional[bool] = False
    initial_version: Optional[CardVersionCreate] = None


class CharacterCardUpdate(BaseModel):
    """Schema for updating a character card."""
    name: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None
    is_main_character: Optional[bool] = None


class CharacterCardResponse(BaseModel):
    """Schema for character card response."""
    id: UUID
    franchise_id: UUID
    name: str
    slug: str
    image_url: Optional[str] = None
    is_main_character: bool = False
    status: str
    current_version_id: Optional[UUID]
    current_version: Optional[CardVersionResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
