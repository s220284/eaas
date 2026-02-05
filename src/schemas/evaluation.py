"""
Pydantic schemas for Evaluation models.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from decimal import Decimal

from pydantic import BaseModel, Field, model_validator


# Test Suite schemas
class TestCaseCreate(BaseModel):
    """Schema for creating a test case."""
    name: str
    category: str  # canon, voice, safety, refusal, edge_case
    prompt: str
    expected_behavior: Optional[str] = None
    expected_response: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class TestCaseResponse(BaseModel):
    """Schema for test case response."""
    id: UUID
    test_suite_id: UUID
    name: str
    category: str
    prompt: str
    expected_behavior: Optional[str]
    expected_response: Optional[str]
    tags: list
    created_at: datetime

    class Config:
        from_attributes = True


class TestSuiteCreate(BaseModel):
    """Schema for creating a test suite."""
    character_card_id: UUID
    name: str
    description: Optional[str] = None
    test_cases: List[TestCaseCreate] = Field(default_factory=list)


class TestSuiteResponse(BaseModel):
    """Schema for test suite response."""
    id: UUID
    character_card_id: UUID
    name: str
    description: Optional[str]
    test_cases: List[TestCaseResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


# Eval Run schemas
class EvalRunCreate(BaseModel):
    """Schema for creating an evaluation run."""
    character_card_id: UUID
    card_version_id: Optional[UUID] = None
    test_suite_id: UUID
    model_provider: str  # openai, anthropic, google
    model_name: str  # gpt-4, claude-3-sonnet, gemini-pro
    llm_config: dict = Field(default_factory=dict)


class EvalResultResponse(BaseModel):
    """Schema for evaluation result response."""
    id: UUID
    test_case_id: Optional[UUID]  # Nullable for quick evaluations
    model_response: Optional[str]
    response_latency_ms: Optional[int]
    scores: Dict[str, Optional[float]]
    explanations: Dict[str, Optional[str]]
    passed: Optional[bool]
    failure_reasons: list

    class Config:
        from_attributes = True

    @model_validator(mode='before')
    @classmethod
    def build_dicts_from_fields(cls, data: Any) -> Any:
        """Build scores and explanations dicts from individual model fields."""
        if isinstance(data, dict):
            return data

        # If it's a model instance, extract the fields
        scores = {
            "canon_fidelity": float(data.score_canon_fidelity) if data.score_canon_fidelity else None,
            "voice_consistency": float(data.score_voice_consistency) if data.score_voice_consistency else None,
            "brand_safety": float(data.score_brand_safety) if data.score_brand_safety else None,
            "legal_compliance": float(data.score_legal_compliance) if data.score_legal_compliance else None,
            "total": float(data.score_total) if data.score_total else None,
        }

        explanations = {
            "canon": data.explanation_canon,
            "voice": data.explanation_voice,
            "safety": data.explanation_safety,
            "legal": data.explanation_legal,
        }

        return {
            "id": data.id,
            "test_case_id": data.test_case_id,
            "model_response": data.model_response,
            "response_latency_ms": data.response_latency_ms,
            "scores": scores,
            "explanations": explanations,
            "passed": data.passed,
            "failure_reasons": data.failure_reasons or [],
        }


class EvalRunResponse(BaseModel):
    """Schema for evaluation run response."""
    id: UUID
    character_card_id: UUID
    card_version_id: Optional[UUID]
    test_suite_id: Optional[UUID]  # Nullable for quick evaluations
    model_provider: str
    model_name: str
    llm_config: dict
    status: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    error_message: Optional[str]
    total_tests: int
    passed_tests: int
    failed_tests: int
    avg_canon_fidelity: Optional[float]
    avg_voice_consistency: Optional[float]
    avg_brand_safety: Optional[float]
    avg_legal_compliance: Optional[float]
    avg_total_score: Optional[float]
    results: List[EvalResultResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


# Quick Evaluation schemas (for demo)
class EvaluateRequest(BaseModel):
    """Schema for quick evaluation request."""
    character_card_id: UUID
    prompt: str
    model_response: str
    model_provider: Optional[str] = None
    model_name: Optional[str] = None


class ScoreBreakdown(BaseModel):
    """Breakdown of scores by dimension."""
    canon_fidelity: float = Field(ge=0, le=100)
    voice_consistency: float = Field(ge=0, le=100)
    brand_safety: float = Field(ge=0, le=100)
    legal_compliance: float = Field(ge=0, le=100)
    total: float = Field(ge=0, le=100)


class EvaluateResponse(BaseModel):
    """Schema for quick evaluation response."""
    id: Optional[str] = None  # EvalRun ID if stored in database
    character_card_id: UUID
    prompt: str
    model_response: str
    scores: ScoreBreakdown
    explanations: Dict[str, str]
    passed: bool
    failure_reasons: List[str]
    canonsafe_certified: bool
    evaluation_latency_ms: int
    created_at: Optional[datetime] = None  # Timestamp when evaluation was created
