"""
Data Quality Dashboard API routes.

Provides endpoints for viewing data quality metrics, validation issues,
and character quality scores.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from src.database import get_db
from src.models import CharacterCard, CardVersion, Franchise, EvalRun, EvalResult
from src.services.auth import get_current_user
from src.models.organization import User

router = APIRouter()


@router.get("/overview")
async def get_quality_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get overall data quality metrics for the organization.

    Returns:
        - Total characters by status
        - Average evaluation scores
        - Characters needing attention
        - Recent activity
    """
    # Get all franchise IDs for this organization
    org_franchise_ids = [
        f.id for f in db.query(Franchise.id).filter(
            Franchise.organization_id == current_user.organization_id
        ).all()
    ]

    # Character counts by status
    character_stats = db.query(
        CharacterCard.status,
        func.count(CharacterCard.id).label('count')
    ).filter(
        CharacterCard.franchise_id.in_(org_franchise_ids)
    ).group_by(CharacterCard.status).all()

    status_counts = {stat.status: stat.count for stat in character_stats}
    total_characters = sum(status_counts.values())

    # Get characters without versions (incomplete)
    incomplete_characters = db.query(CharacterCard).filter(
        CharacterCard.franchise_id.in_(org_franchise_ids),
        CharacterCard.current_version_id == None
    ).count()

    # Get recent evaluation runs
    recent_runs = db.query(EvalRun).join(
        CharacterCard, EvalRun.character_card_id == CharacterCard.id
    ).filter(
        CharacterCard.franchise_id.in_(org_franchise_ids),
        EvalRun.status == 'completed'
    ).order_by(EvalRun.completed_at.desc()).limit(10).all()

    # Calculate average scores from recent runs
    avg_scores = {
        'canon_fidelity': 0,
        'voice_consistency': 0,
        'brand_safety': 0,
        'legal_compliance': 0,
        'total': 0
    }

    if recent_runs:
        for run in recent_runs:
            avg_scores['canon_fidelity'] += float(run.avg_canon_fidelity or 0)
            avg_scores['voice_consistency'] += float(run.avg_voice_consistency or 0)
            avg_scores['brand_safety'] += float(run.avg_brand_safety or 0)
            avg_scores['legal_compliance'] += float(run.avg_legal_compliance or 0)
            avg_scores['total'] += float(run.avg_total_score or 0)

        count = len(recent_runs)
        avg_scores = {k: round(v / count, 1) for k, v in avg_scores.items()}

    # Characters with low quality (no version or failed evals)
    needs_attention = incomplete_characters

    # Get low-performing characters from recent evaluations
    low_performers = db.query(CharacterCard).join(
        EvalRun, EvalRun.character_card_id == CharacterCard.id
    ).filter(
        CharacterCard.franchise_id.in_(org_franchise_ids),
        EvalRun.status == 'completed',
        EvalRun.avg_total_score < 70
    ).distinct().count()

    needs_attention += low_performers

    return {
        "summary": {
            "total_characters": total_characters,
            "by_status": status_counts,
            "incomplete_characters": incomplete_characters,
            "needs_attention": needs_attention
        },
        "average_scores": avg_scores,
        "recent_evaluations": len(recent_runs),
        "certification_rate": round(
            (sum(1 for r in recent_runs if r.avg_total_score >= 85) / len(recent_runs) * 100)
            if recent_runs else 0,
            1
        )
    }


@router.get("/characters")
async def get_character_quality_list(
    franchise_id: Optional[UUID] = Query(None),
    min_score: Optional[float] = Query(None, ge=0, le=100),
    max_score: Optional[float] = Query(None, ge=0, le=100),
    status: Optional[str] = Query(None),
    needs_review: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get list of characters with quality metrics.

    Filters:
        - franchise_id: Filter by franchise
        - min_score/max_score: Filter by evaluation score
        - status: Filter by character status
        - needs_review: Show only characters needing attention
    """
    # Get all franchise IDs for this organization
    org_franchise_ids = [
        f.id for f in db.query(Franchise.id).filter(
            Franchise.organization_id == current_user.organization_id
        ).all()
    ]

    # Base query
    query = db.query(CharacterCard).filter(
        CharacterCard.franchise_id.in_(org_franchise_ids)
    )

    # Apply filters
    if franchise_id:
        query = query.filter(CharacterCard.franchise_id == str(franchise_id))

    if status:
        query = query.filter(CharacterCard.status == status)

    if needs_review:
        # Characters without versions or with low scores
        query = query.filter(
            CharacterCard.current_version_id == None
        )

    # Get characters
    characters = query.offset(skip).limit(limit).all()

    # Enrich with quality data
    results = []
    for char in characters:
        # Get latest eval run for this character
        latest_eval = db.query(EvalRun).filter(
            EvalRun.character_card_id == char.id,
            EvalRun.status == 'completed'
        ).order_by(EvalRun.completed_at.desc()).first()

        quality_data = {
            "id": char.id,
            "name": char.name,
            "slug": char.slug,
            "status": char.status,
            "franchise_id": char.franchise_id,
            "has_version": char.current_version_id is not None,
            "created_at": char.created_at.isoformat(),
            "updated_at": char.updated_at.isoformat(),
        }

        if latest_eval:
            quality_data["latest_evaluation"] = {
                "run_id": latest_eval.id,
                "completed_at": latest_eval.completed_at.isoformat() if latest_eval.completed_at else None,
                "scores": {
                    "canon_fidelity": float(latest_eval.avg_canon_fidelity or 0),
                    "voice_consistency": float(latest_eval.avg_voice_consistency or 0),
                    "brand_safety": float(latest_eval.avg_brand_safety or 0),
                    "legal_compliance": float(latest_eval.avg_legal_compliance or 0),
                    "total": float(latest_eval.avg_total_score or 0)
                },
                "passed_tests": latest_eval.passed_tests,
                "total_tests": latest_eval.total_tests,
                "certified": latest_eval.avg_total_score >= 85 if latest_eval.avg_total_score else False
            }

            # Apply score filters
            if min_score is not None and latest_eval.avg_total_score < min_score:
                continue
            if max_score is not None and latest_eval.avg_total_score > max_score:
                continue
        else:
            quality_data["latest_evaluation"] = None

        # Check if needs review
        needs_review_flag = (
            not char.current_version_id or
            char.status == 'draft' or
            (latest_eval and latest_eval.avg_total_score and latest_eval.avg_total_score < 70)
        )
        quality_data["needs_review"] = needs_review_flag

        results.append(quality_data)

    return {
        "characters": results,
        "total": len(results),
        "skip": skip,
        "limit": limit
    }


@router.get("/characters/{character_id}/quality")
async def get_character_quality_details(
    character_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get detailed quality information for a specific character.

    Returns:
        - Character metadata
        - Current version completeness
        - Evaluation history
        - Validation issues
    """
    # Get character
    character = db.query(CharacterCard).filter(
        CharacterCard.id == str(character_id)
    ).first()

    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    # Verify access
    franchise = db.query(Franchise).filter(
        Franchise.id == character.franchise_id,
        Franchise.organization_id == current_user.organization_id
    ).first()

    if not franchise:
        raise HTTPException(status_code=404, detail="Character not found")

    # Get current version
    version = None
    version_quality = None

    if character.current_version_id:
        version = db.query(CardVersion).filter(
            CardVersion.id == character.current_version_id
        ).first()

        if version:
            # Calculate version completeness
            facts_count = len(version.canon_facts) if version.canon_facts else 0
            relationships_count = len(version.canon_relationships) if version.canon_relationships else 0

            voice_completeness = 0
            if version.canon_voice:
                voice = version.canon_voice
                if voice.get('personality_traits'): voice_completeness += 25
                if voice.get('tone'): voice_completeness += 25
                if voice.get('speech_style'): voice_completeness += 25
                if voice.get('catchphrases'): voice_completeness += 25

            version_quality = {
                "facts_count": facts_count,
                "relationships_count": relationships_count,
                "voice_completeness": voice_completeness,
                "has_legal_rights": bool(version.legal_rights),
                "has_performer_consent": bool(version.legal_performer_consent),
                "safety_rating": version.safety_content_rating,
                "prohibited_topics_count": len(version.safety_prohibited_topics) if version.safety_prohibited_topics else 0,
                "completeness_score": min(100, (
                    (min(facts_count * 10, 30)) +  # Up to 30 points
                    (min(relationships_count * 10, 20)) +  # Up to 20 points
                    (voice_completeness * 0.2) +  # Up to 20 points
                    (15 if version.legal_rights else 0) +
                    (15 if version.legal_performer_consent else 0)
                ))
            }

    # Get evaluation history
    eval_runs = db.query(EvalRun).filter(
        EvalRun.character_card_id == character.id,
        EvalRun.status == 'completed'
    ).order_by(EvalRun.completed_at.desc()).limit(10).all()

    eval_history = []
    for run in eval_runs:
        eval_history.append({
            "id": run.id,
            "completed_at": run.completed_at.isoformat() if run.completed_at else None,
            "scores": {
                "canon_fidelity": float(run.avg_canon_fidelity or 0),
                "voice_consistency": float(run.avg_voice_consistency or 0),
                "brand_safety": float(run.avg_brand_safety or 0),
                "legal_compliance": float(run.avg_legal_compliance or 0),
                "total": float(run.avg_total_score or 0)
            },
            "tests": {
                "passed": run.passed_tests,
                "total": run.total_tests,
                "failed": run.failed_tests
            },
            "certified": run.avg_total_score >= 85 if run.avg_total_score else False
        })

    # Build validation issues
    issues = []

    if not character.current_version_id:
        issues.append({
            "severity": "error",
            "field": "version",
            "message": "Character has no version data",
            "suggested_fix": "Create an initial version with canon, legal, and safety information"
        })

    if version and version_quality:
        if version_quality["facts_count"] < 5:
            issues.append({
                "severity": "warning",
                "field": "canon_facts",
                "message": f"Only {version_quality['facts_count']} facts defined (minimum 5 recommended)",
                "suggested_fix": "Add more canonical facts about the character"
            })

        if version_quality["relationships_count"] < 1:
            issues.append({
                "severity": "warning",
                "field": "canon_relationships",
                "message": "No relationships defined",
                "suggested_fix": "Add at least one character relationship"
            })

        if version_quality["voice_completeness"] < 75:
            issues.append({
                "severity": "warning",
                "field": "canon_voice",
                "message": f"Voice profile incomplete ({version_quality['voice_completeness']}%)",
                "suggested_fix": "Complete personality traits, tone, speech style, and catchphrases"
            })

        if not version_quality["has_legal_rights"]:
            issues.append({
                "severity": "error",
                "field": "legal_rights",
                "message": "No legal rights information defined",
                "suggested_fix": "Add rights holder and territory information"
            })

    return {
        "character": {
            "id": character.id,
            "name": character.name,
            "slug": character.slug,
            "status": character.status,
            "franchise_id": character.franchise_id,
            "created_at": character.created_at.isoformat(),
            "updated_at": character.updated_at.isoformat()
        },
        "version_quality": version_quality,
        "evaluation_history": eval_history,
        "issues": issues,
        "needs_review": len([i for i in issues if i["severity"] == "error"]) > 0
    }


@router.get("/issues")
async def get_data_quality_issues(
    severity: Optional[str] = Query(None, regex="^(error|warning|info)$"),
    franchise_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get aggregated data quality issues across all characters.

    Returns:
        - Issues grouped by type
        - Top issues affecting multiple characters
        - Recommendations for improvement
    """
    # Get all franchise IDs for this organization
    org_franchise_ids = [
        f.id for f in db.query(Franchise.id).filter(
            Franchise.organization_id == current_user.organization_id
        ).all()
    ]

    if franchise_id:
        org_franchise_ids = [str(franchise_id)]

    # Get all characters
    characters = db.query(CharacterCard).filter(
        CharacterCard.franchise_id.in_(org_franchise_ids)
    ).all()

    # Collect issues
    all_issues = []
    issue_counts = {}

    for char in characters:
        # Check for missing version
        if not char.current_version_id:
            issue = {
                "character_id": char.id,
                "character_name": char.name,
                "franchise_id": char.franchise_id,
                "severity": "error",
                "field": "version",
                "message": "No version data",
                "issue_type": "missing_version"
            }
            all_issues.append(issue)
            issue_counts["missing_version"] = issue_counts.get("missing_version", 0) + 1
            continue

        # Get version
        version = db.query(CardVersion).filter(
            CardVersion.id == char.current_version_id
        ).first()

        if not version:
            continue

        # Check facts
        facts_count = len(version.canon_facts) if version.canon_facts else 0
        if facts_count < 5:
            issue = {
                "character_id": char.id,
                "character_name": char.name,
                "franchise_id": char.franchise_id,
                "severity": "warning",
                "field": "canon_facts",
                "message": f"Insufficient facts ({facts_count}/5 minimum)",
                "issue_type": "insufficient_facts"
            }
            all_issues.append(issue)
            issue_counts["insufficient_facts"] = issue_counts.get("insufficient_facts", 0) + 1

        # Check relationships
        rel_count = len(version.canon_relationships) if version.canon_relationships else 0
        if rel_count < 1:
            issue = {
                "character_id": char.id,
                "character_name": char.name,
                "franchise_id": char.franchise_id,
                "severity": "warning",
                "field": "canon_relationships",
                "message": "No relationships defined",
                "issue_type": "missing_relationships"
            }
            all_issues.append(issue)
            issue_counts["missing_relationships"] = issue_counts.get("missing_relationships", 0) + 1

        # Check legal rights
        if not version.legal_rights:
            issue = {
                "character_id": char.id,
                "character_name": char.name,
                "franchise_id": char.franchise_id,
                "severity": "error",
                "field": "legal_rights",
                "message": "No legal rights information",
                "issue_type": "missing_legal_rights"
            }
            all_issues.append(issue)
            issue_counts["missing_legal_rights"] = issue_counts.get("missing_legal_rights", 0) + 1

    # Filter by severity
    if severity:
        all_issues = [i for i in all_issues if i["severity"] == severity]

    # Get top issues
    top_issues = sorted(
        [{"type": k, "count": v, "severity": next((i["severity"] for i in all_issues if i["issue_type"] == k), "warning")}
         for k, v in issue_counts.items()],
        key=lambda x: x["count"],
        reverse=True
    )[:10]

    return {
        "summary": {
            "total_issues": len(all_issues),
            "by_severity": {
                "error": len([i for i in all_issues if i["severity"] == "error"]),
                "warning": len([i for i in all_issues if i["severity"] == "warning"]),
                "info": len([i for i in all_issues if i["severity"] == "info"])
            },
            "affected_characters": len(set(i["character_id"] for i in all_issues))
        },
        "top_issues": top_issues,
        "issues": all_issues[:100]  # Limit to 100 for performance
    }
