"""
Evaluation Version model for storing and versioning evaluation prompts.
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from src.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class EvaluationVersion(Base):
    """
    Evaluation Version - Version control for evaluation prompts and criteria.

    Allows A/B testing and continuous improvement of evaluation accuracy.
    Each organization can have multiple versions, but only one active at a time.
    """

    __tablename__ = "evaluation_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    version_name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    # Prompt templates for each evaluation dimension
    canon_prompt_template = Column(Text, nullable=True)
    voice_prompt_template = Column(Text, nullable=True)
    safety_prompt_template = Column(Text, nullable=True)
    legal_prompt_template = Column(Text, nullable=True)

    # Scoring configuration
    scoring_criteria = Column(JSON, nullable=False, default={})
    thresholds = Column(JSON, nullable=False, default={})

    # Status
    active = Column(Boolean, default=False, nullable=False)

    # Performance tracking
    total_uses = Column(Integer, default=0, nullable=False)
    avg_accuracy_rating = Column(Float, nullable=True)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)

    # Relationships
    organization = relationship("Organization")
    creator = relationship("User", foreign_keys=[created_by])

    def __repr__(self):
        return f"<EvaluationVersion(version={self.version_number}, name='{self.version_name}', active={self.active})>"
