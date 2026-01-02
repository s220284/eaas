"""
Evaluation models for the MASH AI scoring system.

The evaluation framework measures AI outputs against Character Cards
across multiple dimensions: canon fidelity, voice consistency,
brand safety, and legal compliance.
"""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text, Boolean, Numeric, JSON
from sqlalchemy.orm import relationship

from src.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class TestSuite(Base):
    """
    Collection of test cases for evaluating a character.

    Test suites contain prompts and expected behaviors
    organized by category (canon, voice, safety, refusal).
    """

    __tablename__ = "test_suites"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    character_card_id = Column(String(36), ForeignKey("character_cards.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    character_card = relationship("CharacterCard", back_populates="test_suites")
    test_cases = relationship("TestCase", back_populates="test_suite")
    eval_runs = relationship("EvalRun", back_populates="test_suite")

    def __repr__(self):
        return f"<TestSuite(name='{self.name}')>"


class TestCase(Base):
    """
    Individual test case within a test suite.

    Categories:
    - canon: Factual accuracy tests
    - voice: Style/personality tests
    - safety: Brand safety boundary tests
    - refusal: Appropriate rejection tests
    - edge_case: Unusual/boundary scenarios
    """

    __tablename__ = "test_cases"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    test_suite_id = Column(String(36), ForeignKey("test_suites.id"))
    name = Column(String(255), nullable=False)
    category = Column(String(100))  # canon, voice, safety, refusal, edge_case
    prompt = Column(Text, nullable=False)
    expected_behavior = Column(Text)  # Description of expected behavior
    expected_response = Column(Text)  # Optional: For exact match tests
    tags = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    test_suite = relationship("TestSuite", back_populates="test_cases")
    eval_results = relationship("EvalResult", back_populates="test_case")

    def __repr__(self):
        return f"<TestCase(name='{self.name}', category='{self.category}')>"


class EvalRun(Base):
    """
    A single evaluation run against a character using a test suite.

    Tracks which model was used and aggregates results.
    Status: pending -> running -> completed | failed
    """

    __tablename__ = "eval_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    character_card_id = Column(String(36), ForeignKey("character_cards.id"))
    card_version_id = Column(String(36), ForeignKey("card_versions.id"))
    test_suite_id = Column(String(36), ForeignKey("test_suites.id"))

    # Model configuration
    model_provider = Column(String(100))  # openai, anthropic, google
    model_name = Column(String(100))  # gpt-4, claude-3, etc.
    llm_config = Column(JSON, default={})  # temperature, max_tokens, etc.

    # Status tracking
    status = Column(String(50), default="pending")  # pending, running, completed, failed
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    error_message = Column(Text)

    # Aggregate scores (populated on completion)
    total_tests = Column(Integer, default=0)
    passed_tests = Column(Integer, default=0)
    failed_tests = Column(Integer, default=0)
    avg_canon_fidelity = Column(Numeric(5, 2))
    avg_voice_consistency = Column(Numeric(5, 2))
    avg_brand_safety = Column(Numeric(5, 2))
    avg_legal_compliance = Column(Numeric(5, 2))
    avg_total_score = Column(Numeric(5, 2))

    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    character_card = relationship("CharacterCard", back_populates="eval_runs")
    test_suite = relationship("TestSuite", back_populates="eval_runs")
    results = relationship("EvalResult", back_populates="eval_run")

    def __repr__(self):
        return f"<EvalRun(id='{self.id}', status='{self.status}')>"


class EvalResult(Base):
    """
    Result of evaluating a single test case.

    Contains the model's response and scores across all dimensions.
    """

    __tablename__ = "eval_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    eval_run_id = Column(String(36), ForeignKey("eval_runs.id"))
    test_case_id = Column(String(36), ForeignKey("test_cases.id"))

    # Model response
    model_response = Column(Text)
    response_latency_ms = Column(Integer)

    # Scores (0-100)
    score_canon_fidelity = Column(Numeric(5, 2))
    score_voice_consistency = Column(Numeric(5, 2))
    score_brand_safety = Column(Numeric(5, 2))
    score_legal_compliance = Column(Numeric(5, 2))
    score_total = Column(Numeric(5, 2))

    # Explanations (from LLM judge)
    explanation_canon = Column(Text)
    explanation_voice = Column(Text)
    explanation_safety = Column(Text)
    explanation_legal = Column(Text)

    # Pass/Fail determination
    passed = Column(Boolean)
    failure_reasons = Column(JSON, default=[])

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    eval_run = relationship("EvalRun", back_populates="results")
    test_case = relationship("TestCase", back_populates="eval_results")

    def __repr__(self):
        return f"<EvalResult(test_case_id='{self.test_case_id}', passed={self.passed})>"

    def to_dict(self) -> dict:
        """Convert to dictionary for API response."""
        return {
            "id": str(self.id),
            "test_case_id": str(self.test_case_id),
            "model_response": self.model_response,
            "response_latency_ms": self.response_latency_ms,
            "scores": {
                "canon_fidelity": float(self.score_canon_fidelity) if self.score_canon_fidelity else None,
                "voice_consistency": float(self.score_voice_consistency) if self.score_voice_consistency else None,
                "brand_safety": float(self.score_brand_safety) if self.score_brand_safety else None,
                "legal_compliance": float(self.score_legal_compliance) if self.score_legal_compliance else None,
                "total": float(self.score_total) if self.score_total else None,
            },
            "explanations": {
                "canon": self.explanation_canon,
                "voice": self.explanation_voice,
                "safety": self.explanation_safety,
                "legal": self.explanation_legal,
            },
            "passed": self.passed,
            "failure_reasons": self.failure_reasons,
        }
