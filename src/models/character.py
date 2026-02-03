"""
Character Card models - the core of the MASH AI platform.

A Character Card contains everything needed to evaluate AI outputs
against a character's canonical traits, legal requirements, and safety rules.
"""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text, JSON
from sqlalchemy.orm import relationship

from src.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Franchise(Base):
    """
    Franchise represents an IP collection (e.g., Toy Story, Star Wars).

    Characters belong to franchises, which belong to organizations.
    """

    __tablename__ = "franchises"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    extra_data = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="franchises")
    characters = relationship("CharacterCard", back_populates="franchise")

    def __repr__(self):
        return f"<Franchise(name='{self.name}')>"


class CharacterCard(Base):
    """
    Character Card is the canonical source of truth for a character.

    Contains references to versioned card content (canon, legal, safety packs).
    Status workflow: draft -> pending_approval -> approved -> archived
    """

    __tablename__ = "character_cards"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    franchise_id = Column(String(36), ForeignKey("franchises.id"))
    name = Column(String(255), nullable=False)
    slug = Column(String(100), nullable=False)
    image_url = Column(String(500))  # URL to character image
    current_version_id = Column(String(36), ForeignKey("card_versions.id", use_alter=True))
    status = Column(String(50), default="draft")  # draft, pending_approval, approved, archived
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    franchise = relationship("Franchise", back_populates="characters")
    versions = relationship(
        "CardVersion",
        back_populates="character_card",
        foreign_keys="CardVersion.character_card_id",
    )
    current_version = relationship(
        "CardVersion",
        foreign_keys=[current_version_id],
        post_update=True,
    )
    test_suites = relationship("TestSuite", back_populates="character_card")
    eval_runs = relationship("EvalRun", back_populates="character_card")

    def __repr__(self):
        return f"<CharacterCard(name='{self.name}', status='{self.status}')>"


class CardVersion(Base):
    """
    Immutable version of a Character Card.

    Each version contains the complete character definition:
    - Canon Pack: Facts, voice profile, relationships
    - Legal Pack: Rights metadata, performer consent
    - Safety Pack: Content rating, prohibited topics, disclosures
    """

    __tablename__ = "card_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    character_card_id = Column(String(36), ForeignKey("character_cards.id"))
    version_number = Column(Integer, nullable=False)

    # Canon Pack - Facts about the character
    canon_facts = Column(JSON, nullable=False, default={})
    # Example: {"hometown": {"value": "Andy's Room", "source": "Toy Story 1"}}

    # Canon Pack - Voice/personality profile
    canon_voice = Column(JSON, nullable=False, default={})
    # Example: {"personality": "friendly, loyal", "tone": "warm, encouraging"}

    # Canon Pack - Relationship graph
    canon_relationships = Column(JSON, nullable=False, default=[])
    # Example: [{"entity": "Buzz Lightyear", "relationship": "best friend"}]

    # Legal Pack - Rights metadata
    legal_rights = Column(JSON, nullable=False, default={})
    # Example: {"owner": "Disney/Pixar", "territories": ["worldwide"]}

    # Legal Pack - Performer consent (SAG-AFTRA compliance)
    legal_performer_consent = Column(JSON, nullable=False, default={})
    # Example: {"performer": "Tom Hanks", "consent_type": "AI_DIGITAL_REPLICA"}

    # Safety Pack - Content rating
    safety_content_rating = Column(String(10), default="PG")  # G, PG, PG-13, R

    # Safety Pack - Topics to avoid
    safety_prohibited_topics = Column(JSON, nullable=False, default=[])
    # Example: ["violence", "politics", "adult_content"]

    # Safety Pack - Required disclosures
    safety_required_disclosures = Column(JSON, nullable=False, default=[])
    # Example: ["This is an AI-generated character experience"]

    # Safety Pack - Age gating
    safety_age_gating = Column(JSON, nullable=False, default={})
    # Example: {"enabled": false, "minimum_age": 0}

    # Metadata
    change_summary = Column(Text)
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    character_card = relationship(
        "CharacterCard",
        back_populates="versions",
        foreign_keys=[character_card_id],
    )

    def __repr__(self):
        return f"<CardVersion(character_card_id='{self.character_card_id}', version={self.version_number})>"

    def to_dict(self) -> dict:
        """Convert to dictionary for evaluation context."""
        return {
            "canon_facts": self.canon_facts,
            "canon_voice": self.canon_voice,
            "canon_relationships": self.canon_relationships,
            "legal_rights": self.legal_rights,
            "legal_performer_consent": self.legal_performer_consent,
            "safety_content_rating": self.safety_content_rating,
            "safety_prohibited_topics": self.safety_prohibited_topics,
            "safety_required_disclosures": self.safety_required_disclosures,
            "safety_age_gating": self.safety_age_gating,
        }
