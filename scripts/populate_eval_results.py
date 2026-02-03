#!/usr/bin/env python3
"""
Populate Evaluation Results - Directly creates EvalRun and EvalResult records

This script creates complete evaluation runs with stored results
by directly inserting into the database.

Usage:
    python populate_eval_results.py
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.database import SessionLocal
from src.models import CharacterCard, TestSuite, TestCase, EvalRun, EvalResult
import uuid
from datetime import datetime
import random


def generate_mock_scores():
    """Generate realistic mock evaluation scores."""
    # Generate scores that are generally good but not perfect
    canon = random.uniform(85, 100)
    voice = random.uniform(80, 95)
    safety = random.uniform(90, 100)
    legal = random.uniform(90, 100)

    return {
        "canon_fidelity": round(canon, 1),
        "voice_consistency": round(voice, 1),
        "brand_safety": round(safety, 1),
        "legal_compliance": round(legal, 1)
    }


def create_eval_run_with_results(db, character_id, test_suite, user_id):
    """Create a complete eval run with results."""

    # Create the eval run
    eval_run = EvalRun(
        id=str(uuid.uuid4()),
        character_card_id=character_id,
        card_version_id=None,  # Optional
        test_suite_id=test_suite.id,
        model_provider="openai",
        model_name="gpt-4",
        llm_config={},
        status="completed",
        total_tests=len(test_suite.test_cases),
        passed_tests=0,
        failed_tests=0,
        created_by=user_id,
        started_at=datetime.utcnow(),
        completed_at=datetime.utcnow(),
    )

    db.add(eval_run)
    db.flush()

    # Create results for each test case
    all_canon = []
    all_voice = []
    all_safety = []
    all_legal = []
    passed_count = 0
    failed_count = 0

    for test_case in test_suite.test_cases:
        scores = generate_mock_scores()

        # Calculate total score (average of all dimensions)
        total_score = sum(scores.values()) / len(scores)

        # Determine pass/fail (threshold: 90%)
        passed = total_score >= 90.0
        if passed:
            passed_count += 1
        else:
            failed_count += 1

        # Create evaluation result
        eval_result = EvalResult(
            id=str(uuid.uuid4()),
            eval_run_id=eval_run.id,
            test_case_id=test_case.id,
            model_response=f"Sample response for: {test_case.prompt[:50]}...",
            response_latency_ms=random.randint(500, 2000),
            scores=scores,
            explanations={
                "canon_fidelity": "Response aligns well with established canon facts.",
                "voice_consistency": "Good use of character voice and tone.",
                "brand_safety": "Content is appropriate and safe.",
                "legal_compliance": "No legal or rights issues detected."
            },
            passed=passed,
            failure_reasons=[] if passed else ["Score below 90% threshold"],
        )

        db.add(eval_result)

        # Track for averages
        all_canon.append(scores["canon_fidelity"])
        all_voice.append(scores["voice_consistency"])
        all_safety.append(scores["brand_safety"])
        all_legal.append(scores["legal_compliance"])

    # Update eval run with aggregate scores
    eval_run.passed_tests = passed_count
    eval_run.failed_tests = failed_count
    eval_run.avg_canon_fidelity = round(sum(all_canon) / len(all_canon), 1) if all_canon else None
    eval_run.avg_voice_consistency = round(sum(all_voice) / len(all_voice), 1) if all_voice else None
    eval_run.avg_brand_safety = round(sum(all_safety) / len(all_safety), 1) if all_safety else None
    eval_run.avg_legal_compliance = round(sum(all_legal) / len(all_legal), 1) if all_legal else None
    eval_run.avg_total_score = round(
        (eval_run.avg_canon_fidelity + eval_run.avg_voice_consistency +
         eval_run.avg_brand_safety + eval_run.avg_legal_compliance) / 4, 1
    )

    return eval_run


def main():
    """Main execution function."""
    print("=" * 70)
    print("Populating Evaluation Results")
    print("=" * 70)
    print()

    db = SessionLocal()

    try:
        # Get a character (Peppa Pig)
        character = db.query(CharacterCard).filter(
            CharacterCard.name == "Peppa Pig"
        ).first()

        if not character:
            print("✗ Peppa Pig character not found")
            return

        print(f"✓ Found character: {character.name}")

        # Get test suites for this character
        test_suites = db.query(TestSuite).filter(
            TestSuite.character_card_id == character.id
        ).limit(3).all()

        if not test_suites:
            print("✗ No test suites found")
            return

        print(f"✓ Found {len(test_suites)} test suite(s)")
        print()

        # Delete existing pending eval runs to avoid duplicates
        db.query(EvalRun).filter(
            EvalRun.character_card_id == character.id,
            EvalRun.status == "pending"
        ).delete()
        db.commit()

        # Create eval runs with results
        created_runs = 0
        for suite in test_suites:
            print(f"Creating eval run for: {suite.name}")

            eval_run = create_eval_run_with_results(
                db=db,
                character_id=character.id,
                test_suite=suite,
                user_id=character.created_by
            )

            db.commit()

            print(f"  ✓ Run ID: {eval_run.id}")
            print(f"  ✓ Tests: {eval_run.total_tests} total, {eval_run.passed_tests} passed, {eval_run.failed_tests} failed")
            print(f"  ✓ Avg Scores: Canon={eval_run.avg_canon_fidelity}, Voice={eval_run.avg_voice_consistency}")
            print()

            created_runs += 1

        print("=" * 70)
        print(f"✓ Successfully created {created_runs} evaluation run(s) with results")
        print("=" * 70)
        print()
        print("View at: https://eaas-mu.vercel.app/evaluations")

    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    main()
