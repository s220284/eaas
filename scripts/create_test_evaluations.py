#!/usr/bin/env python3
"""
Create 10 Test Evaluations - Production API

Creates 10 evaluation runs using existing test suites to demonstrate
the evaluation history feature.
"""

import requests
import sys

API_BASE = "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1"
EMAIL = "peppapig@demo.canonsafe.com"
PASSWORD = "Peppa"


def login():
    """Authenticate with the API."""
    response = requests.post(
        f"{API_BASE}/auth/login",
        json={"email": EMAIL, "password": PASSWORD}
    )
    response.raise_for_status()
    return response.json()["access_token"]


def get_test_suites(token):
    """Get all test suites."""
    response = requests.get(
        f"{API_BASE}/evaluations/test-suites",
        headers={"Authorization": f"Bearer {token}"}
    )
    response.raise_for_status()
    return response.json()


def create_eval_run(token, character_id, test_suite_id):
    """Create an evaluation run."""
    response = requests.post(
        f"{API_BASE}/evaluations/runs",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "character_card_id": character_id,
            "test_suite_id": test_suite_id,
            "model_provider": "openai",
            "model_name": "gpt-4",
            "llm_config": {}
        }
    )
    response.raise_for_status()
    return response.json()


def main():
    print("=" * 70)
    print("Creating 10 Test Evaluations")
    print("=" * 70)
    print()

    # Login
    print("Authenticating...")
    token = login()
    print("✓ Logged in successfully")
    print()

    # Get test suites
    print("Fetching test suites...")
    test_suites = get_test_suites(token)
    print(f"✓ Found {len(test_suites)} test suite(s)")
    print()

    if len(test_suites) == 0:
        print("✗ No test suites found")
        return

    # Create 10 evaluation runs
    print("Creating evaluation runs...")
    print("-" * 70)

    created = 0
    target = min(10, len(test_suites))

    for i, suite in enumerate(test_suites[:target], 1):
        suite_name = suite.get("name", f"Suite {i}")
        character_id = suite["character_card_id"]
        suite_id = suite["id"]

        print(f"[{i}/{target}] {suite_name}...", end=" ")

        try:
            run = create_eval_run(token, character_id, suite_id)
            run_id = run["id"]
            status = run.get("status", "unknown")
            passed = run.get("passed_tests", 0)
            failed = run.get("failed_tests", 0)
            avg_score = run.get("avg_total_score", 0.0)

            print(f"✓ Created")
            print(f"    ID: {run_id}")
            print(f"    Status: {status}")
            print(f"    Results: {passed} passed, {failed} failed")
            print(f"    Avg Score: {avg_score}%")
            created += 1

        except Exception as e:
            print(f"✗ Failed: {e}")

    print()
    print("=" * 70)
    print(f"✓ Successfully created {created} evaluation run(s)")
    print("=" * 70)
    print()
    print("View at: https://eaas-mu.vercel.app/evaluations")


if __name__ == "__main__":
    main()
