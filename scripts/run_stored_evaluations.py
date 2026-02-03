#!/usr/bin/env python3
"""
Run Stored Evaluations - Creates EvalRun records in the database

This script runs evaluations using test suites and stores the results
as EvalRun and EvalResult records that can be viewed in the UI.

Usage:
    python run_stored_evaluations.py
"""

import requests
import json
import sys
from typing import Dict, List, Any, Optional

API_BASE = "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1"
DEMO_PASSWORD = "Peppa"


class StoredEvaluationRunner:
    """Runs evaluations and stores them as EvalRun records."""

    def __init__(self, api_url: str, email: str, password: str):
        self.api_url = api_url
        self.token = None
        self.email = email
        self.password = password

    def login(self) -> bool:
        """Authenticate with the API."""
        try:
            response = requests.post(
                f"{self.api_url}/auth/login",
                json={"email": self.email, "password": self.password}
            )
            response.raise_for_status()
            self.token = response.json()["access_token"]
            print(f"✓ Logged in successfully as {self.email}")
            return True
        except Exception as e:
            print(f"✗ Login failed: {e}")
            return False

    def get_test_suites(self) -> List[Dict[str, Any]]:
        """Get all test suites."""
        try:
            response = requests.get(
                f"{self.api_url}/test-suites/",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"✗ Failed to fetch test suites: {e}")
            return []

    def get_character(self, character_id: str) -> Optional[Dict[str, Any]]:
        """Get character details."""
        try:
            response = requests.get(
                f"{self.api_url}/characters/{character_id}",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"✗ Failed to fetch character: {e}")
            return None

    def generate_mock_response(self, character: Dict[str, Any], prompt: str) -> str:
        """
        Generate a mock response for a character given a prompt.
        In production, this would call your actual LLM to generate responses.
        For demo purposes, we'll create simple responses based on character data.
        """
        char_name = character.get("name", "Character")

        # Simple mock responses based on prompt keywords
        prompt_lower = prompt.lower()

        if "muddy puddle" in prompt_lower or "puddle" in prompt_lower:
            return f"Ooh! I love jumping in muddy puddles! *snort* Can we put our boots on? Jumping in muddy puddles is my favorite thing to do!"
        elif "family" in prompt_lower or "age" in prompt_lower:
            return f"I'm {char_name}! I'm 4 years old and I live with my little brother George, Mummy Pig, and Daddy Pig!"
        elif "best friend" in prompt_lower or "friend" in prompt_lower:
            return f"My best friend is Suzy Sheep! We love playing together!"
        elif "color" in prompt_lower or "dress" in prompt_lower:
            return f"I wear a red dress! It's my favorite!"
        elif "scary" in prompt_lower or "ghost" in prompt_lower:
            return f"Oh, I don't like scary things. Let's talk about something fun instead! Do you want to hear about jumping in muddy puddles?"
        elif "dangerous" in prompt_lower or "matches" in prompt_lower:
            return f"No, we shouldn't play with that! That's not safe. Let's ask Mummy or Daddy what we can play with instead."
        elif "dinosaur" in prompt_lower and "George" in char_name:
            return f"Dinosaur! Grrr! I love my Mr. Dinosaur! *giggles*"
        else:
            return f"Hello! I'm {char_name}! *snort* What would you like to talk about?"

    def create_eval_run(
        self,
        character_id: str,
        test_suite_id: str,
        test_cases: List[Dict[str, Any]],
        character: Dict[str, Any]
    ) -> Optional[str]:
        """Create an evaluation run and execute all test cases."""
        try:
            # Create the eval run
            payload = {
                "character_card_id": character_id,
                "test_suite_id": test_suite_id,
                "model_provider": "openai",
                "model_name": "gpt-4",
                "llm_config": {}
            }

            response = requests.post(
                f"{self.api_url}/evaluations/runs",
                headers={"Authorization": f"Bearer {self.token}"},
                json=payload
            )
            response.raise_for_status()
            eval_run = response.json()
            run_id = eval_run["id"]

            print(f"  ✓ Created EvalRun: {run_id}")

            # Now evaluate each test case
            for i, test_case in enumerate(test_cases, 1):
                prompt = test_case["prompt"]

                # Generate a mock response
                mock_response = self.generate_mock_response(character, prompt)

                # Run evaluation for this test case
                eval_result = self.evaluate_response(
                    character_id=character_id,
                    prompt=prompt,
                    response=mock_response
                )

                if eval_result:
                    test_name = test_case.get("name", f"Test {i}")
                    total_score = eval_result["scores"]["total"]
                    passed = eval_result["passed"]
                    status = "PASS" if passed else "FAIL"
                    print(f"    [{i}/{len(test_cases)}] {test_name}: {status} (Score: {total_score:.1f})")
                else:
                    print(f"    [{i}/{len(test_cases)}] Evaluation failed")

            return run_id

        except Exception as e:
            print(f"  ✗ Failed to create eval run: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"    Response: {e.response.text}")
            return None

    def evaluate_response(
        self,
        character_id: str,
        prompt: str,
        response: str
    ) -> Optional[Dict[str, Any]]:
        """Evaluate a single response."""
        try:
            payload = {
                "character_card_id": character_id,
                "prompt": prompt,
                "model_response": response
            }

            result = requests.post(
                f"{self.api_url}/evaluations/evaluate",
                headers={"Authorization": f"Bearer {self.token}"},
                json=payload
            )
            result.raise_for_status()
            return result.json()

        except Exception as e:
            print(f"    ✗ Evaluation failed: {e}")
            return None


def main():
    """Main execution function."""
    print("=" * 70)
    print("CanonSafe - Stored Evaluation Runner")
    print("=" * 70)
    print()

    runner = StoredEvaluationRunner(
        api_url=API_BASE,
        email="peppapig@demo.canonsafe.com",
        password=DEMO_PASSWORD
    )

    # Login
    if not runner.login():
        sys.exit(1)

    # Get test suites
    print("\nFetching test suites...")
    test_suites = runner.get_test_suites()
    print(f"✓ Found {len(test_suites)} test suite(s)")

    if not test_suites:
        print("No test suites found. Please create test suites first.")
        sys.exit(1)

    print()
    print("Running evaluations (creating stored EvalRuns)...")
    print("-" * 70)

    created_runs = 0

    # Run a subset of test suites (first 3 to avoid overwhelming the system)
    for suite in test_suites[:3]:
        suite_name = suite["name"]
        suite_id = suite["id"]
        character_id = suite["character_card_id"]
        test_cases = suite.get("test_cases", [])

        if not test_cases:
            print(f"\n{suite_name}: No test cases, skipping")
            continue

        print(f"\n{suite_name} ({len(test_cases)} test cases)")
        print("-" * 70)

        # Get character details
        character = runner.get_character(character_id)
        if not character:
            print(f"  ✗ Could not fetch character details")
            continue

        # Create eval run
        run_id = runner.create_eval_run(character_id, suite_id, test_cases, character)
        if run_id:
            created_runs += 1

    print()
    print("=" * 70)
    print("Summary")
    print("=" * 70)
    print(f"Created {created_runs} stored evaluation run(s)")
    print()
    print("View results at: https://eaas-mu.vercel.app/evaluations")
    print("=" * 70)


if __name__ == "__main__":
    main()
