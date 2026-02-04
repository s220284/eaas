"""
Pydantic schemas for Evaluation Version models.
"""

from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel, Field


class EvaluationVersionBase(BaseModel):
    """Base schema for evaluation version."""
    version_name: str = Field(..., description="Human-readable version name")
    description: Optional[str] = Field(None, description="Description of changes in this version")

    # Prompt templates for each dimension
    canon_prompt_template: Optional[str] = Field(None, description="Prompt template for canon fidelity evaluation")
    voice_prompt_template: Optional[str] = Field(None, description="Prompt template for voice consistency evaluation")
    safety_prompt_template: Optional[str] = Field(None, description="Prompt template for brand safety evaluation")
    legal_prompt_template: Optional[str] = Field(None, description="Prompt template for legal compliance evaluation")

    # Scoring configuration
    scoring_criteria: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Scoring criteria and weights")
    thresholds: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Pass/fail thresholds")


class EvaluationVersionCreate(EvaluationVersionBase):
    """Schema for creating a new evaluation version."""
    pass


class EvaluationVersionUpdate(BaseModel):
    """Schema for updating an evaluation version."""
    version_name: Optional[str] = None
    description: Optional[str] = None
    canon_prompt_template: Optional[str] = None
    voice_prompt_template: Optional[str] = None
    safety_prompt_template: Optional[str] = None
    legal_prompt_template: Optional[str] = None
    scoring_criteria: Optional[Dict[str, Any]] = None
    thresholds: Optional[Dict[str, Any]] = None


class EvaluationVersionResponse(EvaluationVersionBase):
    """Schema for evaluation version response."""
    id: str
    organization_id: str
    version_number: int
    active: bool
    total_uses: int
    avg_accuracy_rating: Optional[float]
    created_at: datetime
    created_by: Optional[str]

    class Config:
        from_attributes = True
