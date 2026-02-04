"""
Evaluation Versions API - Manage critic prompt templates and version control.

Allows users to:
- Create and edit evaluation prompt templates (critic JSON)
- Track performance metrics per version
- A/B test different evaluation approaches
- Continuously improve evaluation accuracy
"""

from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from src.database import get_db
from src.models import User, EvaluationVersion
from src.services.auth import get_current_user
from src.schemas.evaluation_version import (
    EvaluationVersionCreate,
    EvaluationVersionUpdate,
    EvaluationVersionResponse,
)

router = APIRouter()


@router.get("/", response_model=List[EvaluationVersionResponse])
async def list_evaluation_versions(
    active_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all evaluation versions for the organization.

    Optionally filter to only show active versions.
    Sorted by version_number descending (newest first).
    """
    query = db.query(EvaluationVersion).filter(
        EvaluationVersion.organization_id == str(current_user.organization_id)
    )

    if active_only:
        query = query.filter(EvaluationVersion.active == True)

    versions = query.order_by(desc(EvaluationVersion.version_number)).all()
    return versions


@router.get("/{version_id}", response_model=EvaluationVersionResponse)
async def get_evaluation_version(
    version_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific evaluation version by ID."""
    version = db.query(EvaluationVersion).filter(
        EvaluationVersion.id == version_id,
        EvaluationVersion.organization_id == str(current_user.organization_id),
    ).first()

    if not version:
        raise HTTPException(status_code=404, detail="Evaluation version not found")

    return version


@router.get("/active/current", response_model=EvaluationVersionResponse)
async def get_active_version(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the currently active evaluation version."""
    version = db.query(EvaluationVersion).filter(
        EvaluationVersion.organization_id == str(current_user.organization_id),
        EvaluationVersion.active == True,
    ).first()

    if not version:
        raise HTTPException(status_code=404, detail="No active evaluation version found")

    return version


@router.post("/", response_model=EvaluationVersionResponse)
async def create_evaluation_version(
    version_data: EvaluationVersionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new evaluation version.

    Automatically increments version number.
    New versions are created as inactive by default.
    """
    # Get highest version number
    max_version = db.query(EvaluationVersion).filter(
        EvaluationVersion.organization_id == str(current_user.organization_id)
    ).order_by(desc(EvaluationVersion.version_number)).first()

    next_version_number = (max_version.version_number + 1) if max_version else 1

    # Create new version
    new_version = EvaluationVersion(
        organization_id=str(current_user.organization_id),
        version_number=next_version_number,
        version_name=version_data.version_name,
        description=version_data.description,
        canon_prompt_template=version_data.canon_prompt_template,
        voice_prompt_template=version_data.voice_prompt_template,
        safety_prompt_template=version_data.safety_prompt_template,
        legal_prompt_template=version_data.legal_prompt_template,
        scoring_criteria=version_data.scoring_criteria or {},
        thresholds=version_data.thresholds or {},
        active=False,  # New versions start inactive
        created_by=str(current_user.id),
    )

    db.add(new_version)
    db.commit()
    db.refresh(new_version)

    return new_version


@router.patch("/{version_id}", response_model=EvaluationVersionResponse)
async def update_evaluation_version(
    version_id: str,
    version_data: EvaluationVersionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update an evaluation version.

    Can update prompts, criteria, thresholds, name, and description.
    Cannot update version_number or active status (use activate endpoint).
    """
    version = db.query(EvaluationVersion).filter(
        EvaluationVersion.id == version_id,
        EvaluationVersion.organization_id == str(current_user.organization_id),
    ).first()

    if not version:
        raise HTTPException(status_code=404, detail="Evaluation version not found")

    # Update fields if provided
    update_data = version_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(version, field, value)

    db.commit()
    db.refresh(version)

    return version


@router.post("/{version_id}/activate", response_model=EvaluationVersionResponse)
async def activate_evaluation_version(
    version_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Set a version as active.

    Deactivates all other versions for the organization.
    Only one version can be active at a time.
    """
    # Verify version exists and belongs to user's org
    version = db.query(EvaluationVersion).filter(
        EvaluationVersion.id == version_id,
        EvaluationVersion.organization_id == str(current_user.organization_id),
    ).first()

    if not version:
        raise HTTPException(status_code=404, detail="Evaluation version not found")

    # Deactivate all versions for this org
    db.query(EvaluationVersion).filter(
        EvaluationVersion.organization_id == str(current_user.organization_id)
    ).update({"active": False})

    # Activate the requested version
    version.active = True

    db.commit()
    db.refresh(version)

    return version


@router.delete("/{version_id}")
async def delete_evaluation_version(
    version_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete an evaluation version.

    Cannot delete the currently active version.
    """
    version = db.query(EvaluationVersion).filter(
        EvaluationVersion.id == version_id,
        EvaluationVersion.organization_id == str(current_user.organization_id),
    ).first()

    if not version:
        raise HTTPException(status_code=404, detail="Evaluation version not found")

    if version.active:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete the active version. Activate another version first."
        )

    db.delete(version)
    db.commit()

    return {"message": "Evaluation version deleted successfully"}


@router.post("/{version_id}/duplicate", response_model=EvaluationVersionResponse)
async def duplicate_evaluation_version(
    version_id: str,
    new_name: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Duplicate an existing version as a starting point for a new version.

    Useful for iterating on existing prompts.
    """
    # Get source version
    source_version = db.query(EvaluationVersion).filter(
        EvaluationVersion.id == version_id,
        EvaluationVersion.organization_id == str(current_user.organization_id),
    ).first()

    if not source_version:
        raise HTTPException(status_code=404, detail="Evaluation version not found")

    # Get next version number
    max_version = db.query(EvaluationVersion).filter(
        EvaluationVersion.organization_id == str(current_user.organization_id)
    ).order_by(desc(EvaluationVersion.version_number)).first()

    next_version_number = (max_version.version_number + 1) if max_version else 1

    # Create duplicate
    new_version = EvaluationVersion(
        organization_id=str(current_user.organization_id),
        version_number=next_version_number,
        version_name=new_name or f"{source_version.version_name} (Copy)",
        description=f"Duplicated from v{source_version.version_number}",
        canon_prompt_template=source_version.canon_prompt_template,
        voice_prompt_template=source_version.voice_prompt_template,
        safety_prompt_template=source_version.safety_prompt_template,
        legal_prompt_template=source_version.legal_prompt_template,
        scoring_criteria=source_version.scoring_criteria,
        thresholds=source_version.thresholds,
        active=False,
        created_by=str(current_user.id),
    )

    db.add(new_version)
    db.commit()
    db.refresh(new_version)

    return new_version
