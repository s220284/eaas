"""
Configuration for bulk upload system.
"""

import os
from typing import Dict, Any
from dataclasses import dataclass


@dataclass
class BulkUploadConfig:
    """Configuration for bulk upload operations."""

    # API Settings
    api_base_url: str
    api_timeout: int = 30

    # Scraping Settings
    scrape_delay: float = 1.0  # Seconds between requests
    max_retries: int = 3
    retry_delay: float = 2.0

    # Data Quality Settings
    min_facts_required: int = 5
    min_relationships_required: int = 1
    min_prohibited_topics: int = 10

    # Confidence Thresholds
    confidence_threshold_official: float = 1.0
    confidence_threshold_licensed_wiki: float = 0.8
    confidence_threshold_fan_site: float = 0.5

    # Conflict Detection
    conflict_delta_threshold: float = 0.3  # Flag conflicts with delta > 0.3

    # Test Generation
    canon_tests_per_character: int = 5
    voice_tests_per_character: int = 5
    safety_tests_per_character: int = 5
    edge_case_tests_per_character: int = 3

    # Batch Processing
    batch_size: int = 10  # Process characters in batches
    parallel_workers: int = 5

    # Logging
    log_level: str = "INFO"
    log_file: str = "bulk_upload.log"


def get_config(env: str = "local") -> BulkUploadConfig:
    """
    Get configuration for specified environment.

    Args:
        env: Environment name (local, production)

    Returns:
        BulkUploadConfig instance
    """
    if env == "local":
        return BulkUploadConfig(
            api_base_url="http://localhost:8000",
            scrape_delay=0.5,  # Faster for local testing
        )
    elif env == "production":
        return BulkUploadConfig(
            api_base_url="https://mash-ai-backend-611530284830.us-central1.run.app",
            scrape_delay=2.0,  # Be nice to production servers
        )
    else:
        raise ValueError(f"Unknown environment: {env}")


# Confidence scores by source type
CONFIDENCE_SCORES = {
    "official_website": 1.0,
    "official_style_guide": 1.0,
    "licensed_wiki": 0.8,
    "fan_site": 0.5,
    "social_media": 0.3,
}


# Default safety pack for G-rated content
DEFAULT_SAFETY_PACK = {
    "content_rating": "G",
    "prohibited_topics": [
        {"topic": "violence", "severity": "strict", "rationale": "Not age-appropriate"},
        {"topic": "weapons", "severity": "strict", "rationale": "Not age-appropriate"},
        {"topic": "scary_content", "severity": "strict", "rationale": "May frighten young children"},
        {"topic": "adult_themes", "severity": "strict", "rationale": "Not age-appropriate"},
        {"topic": "sexual_content", "severity": "strict", "rationale": "Not age-appropriate"},
        {"topic": "drugs_alcohol", "severity": "strict", "rationale": "Not age-appropriate"},
        {"topic": "profanity", "severity": "strict", "rationale": "Not age-appropriate"},
        {"topic": "hate_speech", "severity": "strict", "rationale": "Harmful content"},
        {"topic": "politics", "severity": "moderate", "rationale": "Keep content neutral"},
        {"topic": "religion", "severity": "moderate", "rationale": "Keep content neutral"},
        {"topic": "medical_advice", "severity": "strict", "rationale": "Not qualified to provide"},
        {"topic": "legal_advice", "severity": "strict", "rationale": "Not qualified to provide"},
        {"topic": "financial_advice", "severity": "strict", "rationale": "Not qualified to provide"},
        {"topic": "dangerous_activities", "severity": "strict", "rationale": "Safety concern"},
    ],
    "required_disclosures": [
        "This is an AI-generated character experience"
    ],
    "age_gating": {
        "enabled": False,
        "minimum_age": 0
    }
}


# Default legal pack template
DEFAULT_LEGAL_PACK = {
    "rights_holder": {
        "name": "Unknown",
        "territories": ["Worldwide"]
    },
    "performer_consent": {
        "type": "AI_VOICE_REFERENCE",
        "performer_name": "Various voice actors",
        "scope": "Character portrayal for approved use cases",
        "restrictions": [
            "No impersonation of voice actors",
            "AI disclosure required",
            "Educational and entertainment purposes only"
        ]
    },
    "usage_restrictions": {
        "commercial_use": False,
        "attribution_required": True,
        "derivative_works": False
    }
}
