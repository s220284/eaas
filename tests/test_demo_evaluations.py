"""
Tests for demo evaluation scripts.

These tests verify that the test suite creation and evaluation scripts
work correctly with the CanonSafe API.
"""

import pytest
import sys
import os

# Add scripts directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))


def test_peppa_test_suite_structure():
    """Verify Peppa Pig test suite has correct structure."""
    from create_demo_test_suites import PEPPA_PIG_CORE_TRAITS

    assert "name" in PEPPA_PIG_CORE_TRAITS
    assert "description" in PEPPA_PIG_CORE_TRAITS
    assert "test_cases" in PEPPA_PIG_CORE_TRAITS
    assert len(PEPPA_PIG_CORE_TRAITS["test_cases"]) == 10

    # Check first test case has required fields
    test_case = PEPPA_PIG_CORE_TRAITS["test_cases"][0]
    assert "name" in test_case
    assert "category" in test_case
    assert "prompt" in test_case
    assert "expected_behavior" in test_case
    assert "tags" in test_case


def test_george_test_suite_structure():
    """Verify George Pig test suite has correct structure."""
    from create_demo_test_suites import GEORGE_PIG_CORE_TRAITS

    assert "name" in GEORGE_PIG_CORE_TRAITS
    assert len(GEORGE_PIG_CORE_TRAITS["test_cases"]) == 5

    # Verify dinosaur-related test exists
    test_names = [tc["name"] for tc in GEORGE_PIG_CORE_TRAITS["test_cases"]]
    assert any("Dinosaur" in name for name in test_names)


def test_suzy_test_suite_structure():
    """Verify Suzy Sheep test suite has correct structure."""
    from create_demo_test_suites import SUZY_SHEEP_CORE_TRAITS

    assert "name" in SUZY_SHEEP_CORE_TRAITS
    assert len(SUZY_SHEEP_CORE_TRAITS["test_cases"]) == 5

    # Verify best friend test exists
    test_names = [tc["name"] for tc in SUZY_SHEEP_CORE_TRAITS["test_cases"]]
    assert any("Best Friend" in name for name in test_names)


def test_all_test_cases_have_categories():
    """Verify all test cases have valid categories."""
    from create_demo_test_suites import (
        PEPPA_PIG_CORE_TRAITS,
        PEPPA_PIG_VOICE_CONSISTENCY,
        PEPPA_PIG_SAFETY_BOUNDARIES,
        GEORGE_PIG_CORE_TRAITS,
        SUZY_SHEEP_CORE_TRAITS,
    )

    valid_categories = {"canon", "voice", "safety", "refusal", "edge_case"}

    all_suites = [
        PEPPA_PIG_CORE_TRAITS,
        PEPPA_PIG_VOICE_CONSISTENCY,
        PEPPA_PIG_SAFETY_BOUNDARIES,
        GEORGE_PIG_CORE_TRAITS,
        SUZY_SHEEP_CORE_TRAITS,
    ]

    for suite in all_suites:
        for test_case in suite["test_cases"]:
            assert test_case["category"] in valid_categories, \
                f"Invalid category: {test_case['category']} in {test_case['name']}"


def test_peppa_responses_coverage():
    """Verify we have responses for Peppa's test cases."""
    from create_demo_test_suites import PEPPA_PIG_CORE_TRAITS
    from run_demo_evaluations import PEPPA_RESPONSES

    # Check we have responses for most prompts
    prompts = [tc["prompt"] for tc in PEPPA_PIG_CORE_TRAITS["test_cases"]]
    response_coverage = sum(1 for p in prompts if p in PEPPA_RESPONSES)

    # Should have at least 80% coverage
    assert response_coverage >= len(prompts) * 0.8


def test_george_responses_have_dinosaur_references():
    """Verify George's responses mention dinosaurs appropriately."""
    from run_demo_evaluations import GEORGE_RESPONSES

    # George's signature trait is loving dinosaurs
    dinosaur_count = sum(
        1 for response in GEORGE_RESPONSES.values()
        if "dinosaur" in response.lower()
    )

    # Most responses should reference dinosaurs
    assert dinosaur_count >= 3


def test_response_getter_function():
    """Test the get_response_for_prompt function."""
    from run_demo_evaluations import get_response_for_prompt

    # Test valid character and prompt
    peppa_response = get_response_for_prompt(
        "Peppa Pig",
        "Who is your best friend?"
    )
    assert peppa_response is not None
    assert "Suzy" in peppa_response

    # Test invalid character
    invalid_response = get_response_for_prompt(
        "Invalid Character",
        "test prompt"
    )
    assert invalid_response is None

    # Test invalid prompt
    no_response = get_response_for_prompt(
        "Peppa Pig",
        "This prompt doesn't exist"
    )
    assert no_response is None


def test_evaluation_runner_initialization():
    """Test EvaluationRunner can be initialized."""
    from run_demo_evaluations import EvaluationRunner

    runner = EvaluationRunner(
        api_url="https://test.example.com/api/v1",
        email="test@example.com",
        password="test123"
    )

    assert runner.api_url == "https://test.example.com/api/v1"
    assert runner.email == "test@example.com"
    assert runner.token is None
    assert runner.characters == {}


def test_test_suite_creator_initialization():
    """Test TestSuiteCreator can be initialized."""
    from create_demo_test_suites import TestSuiteCreator

    creator = TestSuiteCreator(
        api_url="https://test.example.com/api/v1",
        email="test@example.com",
        password="test123"
    )

    assert creator.api_url == "https://test.example.com/api/v1"
    assert creator.email == "test@example.com"
    assert creator.token is None
    assert creator.characters == {}


def test_safety_test_cases_exist():
    """Verify safety-focused test cases are present."""
    from create_demo_test_suites import PEPPA_PIG_SAFETY_BOUNDARIES

    safety_categories = [
        tc["category"] for tc in PEPPA_PIG_SAFETY_BOUNDARIES["test_cases"]
    ]

    # All should be safety-related
    assert all(cat in ["safety", "refusal"] for cat in safety_categories)

    # Should have refusal tests
    test_names = [tc["name"] for tc in PEPPA_PIG_SAFETY_BOUNDARIES["test_cases"]]
    assert any("Refusal" in name for name in test_names)


def test_test_case_tags():
    """Verify test cases have appropriate tags."""
    from create_demo_test_suites import PEPPA_PIG_CORE_TRAITS

    for test_case in PEPPA_PIG_CORE_TRAITS["test_cases"]:
        assert isinstance(test_case["tags"], list)
        assert len(test_case["tags"]) > 0, \
            f"Test case '{test_case['name']}' has no tags"


def test_total_test_case_count():
    """Verify we have the expected total number of test cases."""
    from create_demo_test_suites import (
        PEPPA_PIG_CORE_TRAITS,
        PEPPA_PIG_VOICE_CONSISTENCY,
        PEPPA_PIG_SAFETY_BOUNDARIES,
        GEORGE_PIG_CORE_TRAITS,
        SUZY_SHEEP_CORE_TRAITS,
    )

    total_count = (
        len(PEPPA_PIG_CORE_TRAITS["test_cases"]) +
        len(PEPPA_PIG_VOICE_CONSISTENCY["test_cases"]) +
        len(PEPPA_PIG_SAFETY_BOUNDARIES["test_cases"]) +
        len(GEORGE_PIG_CORE_TRAITS["test_cases"]) +
        len(SUZY_SHEEP_CORE_TRAITS["test_cases"])
    )

    assert total_count == 30, f"Expected 30 test cases, got {total_count}"
