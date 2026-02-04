"""
Taxonomy models for system-wide categorization and tagging.

Provides centralized taxonomy management for:
- Content ingestion and classification
- Vector embeddings and semantic search
- Character evaluation criteria
- Safety and compliance filtering
- Data quality assessment
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from src.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class TaxonomyCategory(Base):
    """
    Taxonomy Category - Top-level classification groups.

    Examples: Prohibited Content, Character Traits, Content Ratings, etc.
    """

    __tablename__ = "taxonomy_categories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)

    # Category identification
    key = Column(String(100), nullable=False)  # e.g., "prohibited_content"
    name = Column(String(255), nullable=False)  # e.g., "Prohibited Content"
    description = Column(Text, nullable=True)
    icon = Column(String(10), nullable=True)  # Emoji or icon identifier
    color = Column(String(50), nullable=True)  # Color theme

    # Configuration
    system_managed = Column(Boolean, default=False, nullable=False)  # Can't be deleted if True
    active = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)

    # Relationships
    organization = relationship("Organization")
    tags = relationship("TaxonomyTag", back_populates="category", cascade="all, delete-orphan")
    creator = relationship("User", foreign_keys=[created_by])

    def __repr__(self):
        return f"<TaxonomyCategory(key='{self.key}', name='{self.name}')>"


class TaxonomyTag(Base):
    """
    Taxonomy Tag - Individual classification tags within categories.

    Examples: violence, friendly, PG-13, family, etc.
    """

    __tablename__ = "taxonomy_tags"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    category_id = Column(String(36), ForeignKey("taxonomy_categories.id"), nullable=False)

    # Tag identification
    name = Column(String(100), nullable=False)  # e.g., "violence", "friendly"
    description = Column(Text, nullable=True)

    # Classification metadata
    severity = Column(String(20), nullable=True)  # neutral, low, medium, high
    tag_metadata = Column(JSON, default={}, nullable=False)  # Additional flexible metadata

    # Usage tracking
    usage_count = Column(Integer, default=0, nullable=False)

    # Configuration
    system_managed = Column(Boolean, default=False, nullable=False)
    active = Column(Boolean, default=True, nullable=False)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)

    # Relationships
    category = relationship("TaxonomyCategory", back_populates="tags")
    creator = relationship("User", foreign_keys=[created_by])

    def __repr__(self):
        return f"<TaxonomyTag(name='{self.name}', category='{self.category.key if self.category else None}')>"
