"""
Taxonomy API - Manage system-wide categorization and tagging.

Provides CRUD operations for taxonomy categories and tags.
Supports centralized taxonomy for ingestion, embeddings, evaluations, and filtering.
"""

from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from src.database import get_db
from src.models import User, TaxonomyCategory, TaxonomyTag
from src.services.auth import get_current_user
from src.schemas.taxonomy import (
    TaxonomyCategoryCreate,
    TaxonomyCategoryUpdate,
    TaxonomyCategoryResponse,
    TaxonomyTagCreate,
    TaxonomyTagUpdate,
    TaxonomyTagResponse,
    TaxonomyExport,
)

router = APIRouter()


# ============================================================================
# Category Endpoints
# ============================================================================

@router.get("/categories", response_model=List[TaxonomyCategoryResponse])
async def list_categories(
    active_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all taxonomy categories for the organization.

    Returns categories with their tags included.
    """
    query = db.query(TaxonomyCategory).filter(
        TaxonomyCategory.organization_id == str(current_user.organization_id)
    )

    if active_only:
        query = query.filter(TaxonomyCategory.active == True)

    categories = query.order_by(TaxonomyCategory.display_order).all()
    return categories


@router.get("/categories/{category_id}", response_model=TaxonomyCategoryResponse)
async def get_category(
    category_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific taxonomy category."""
    category = db.query(TaxonomyCategory).filter(
        TaxonomyCategory.id == category_id,
        TaxonomyCategory.organization_id == str(current_user.organization_id),
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


@router.post("/categories", response_model=TaxonomyCategoryResponse)
async def create_category(
    category_data: TaxonomyCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new taxonomy category."""
    # Check if key already exists
    existing = db.query(TaxonomyCategory).filter(
        TaxonomyCategory.organization_id == str(current_user.organization_id),
        TaxonomyCategory.key == category_data.key,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Category key already exists")

    category = TaxonomyCategory(
        organization_id=str(current_user.organization_id),
        key=category_data.key,
        name=category_data.name,
        description=category_data.description,
        icon=category_data.icon,
        color=category_data.color,
        display_order=category_data.display_order,
        active=category_data.active,
        created_by=str(current_user.id),
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


@router.patch("/categories/{category_id}", response_model=TaxonomyCategoryResponse)
async def update_category(
    category_id: str,
    category_data: TaxonomyCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a taxonomy category."""
    category = db.query(TaxonomyCategory).filter(
        TaxonomyCategory.id == category_id,
        TaxonomyCategory.organization_id == str(current_user.organization_id),
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    if category.system_managed:
        raise HTTPException(status_code=403, detail="Cannot modify system-managed category")

    # Update fields
    update_data = category_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)

    return category


@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a taxonomy category and all its tags."""
    category = db.query(TaxonomyCategory).filter(
        TaxonomyCategory.id == category_id,
        TaxonomyCategory.organization_id == str(current_user.organization_id),
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    if category.system_managed:
        raise HTTPException(status_code=403, detail="Cannot delete system-managed category")

    db.delete(category)
    db.commit()

    return {"message": "Category deleted successfully"}


# ============================================================================
# Tag Endpoints
# ============================================================================

@router.get("/categories/{category_id}/tags", response_model=List[TaxonomyTagResponse])
async def list_tags(
    category_id: str,
    active_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all tags for a category."""
    # Verify category exists and belongs to user's org
    category = db.query(TaxonomyCategory).filter(
        TaxonomyCategory.id == category_id,
        TaxonomyCategory.organization_id == str(current_user.organization_id),
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    query = db.query(TaxonomyTag).filter(TaxonomyTag.category_id == category_id)

    if active_only:
        query = query.filter(TaxonomyTag.active == True)

    tags = query.order_by(TaxonomyTag.name).all()
    return tags


@router.post("/categories/{category_id}/tags", response_model=TaxonomyTagResponse)
async def create_tag(
    category_id: str,
    tag_data: TaxonomyTagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new tag in a category."""
    # Verify category exists and belongs to user's org
    category = db.query(TaxonomyCategory).filter(
        TaxonomyCategory.id == category_id,
        TaxonomyCategory.organization_id == str(current_user.organization_id),
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Check if tag name already exists in this category
    existing = db.query(TaxonomyTag).filter(
        TaxonomyTag.category_id == category_id,
        TaxonomyTag.name == tag_data.name,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Tag name already exists in this category")

    tag = TaxonomyTag(
        category_id=category_id,
        name=tag_data.name,
        description=tag_data.description,
        severity=tag_data.severity,
        tag_metadata=tag_data.tag_metadata or {},
        active=tag_data.active,
        created_by=str(current_user.id),
    )

    db.add(tag)
    db.commit()
    db.refresh(tag)

    return tag


@router.patch("/tags/{tag_id}", response_model=TaxonomyTagResponse)
async def update_tag(
    tag_id: str,
    tag_data: TaxonomyTagUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a taxonomy tag."""
    # Get tag with category to verify org ownership
    tag = db.query(TaxonomyTag).join(TaxonomyCategory).filter(
        TaxonomyTag.id == tag_id,
        TaxonomyCategory.organization_id == str(current_user.organization_id),
    ).first()

    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    if tag.system_managed:
        raise HTTPException(status_code=403, detail="Cannot modify system-managed tag")

    # Update fields
    update_data = tag_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tag, field, value)

    db.commit()
    db.refresh(tag)

    return tag


@router.delete("/tags/{tag_id}")
async def delete_tag(
    tag_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a taxonomy tag."""
    # Get tag with category to verify org ownership
    tag = db.query(TaxonomyTag).join(TaxonomyCategory).filter(
        TaxonomyTag.id == tag_id,
        TaxonomyCategory.organization_id == str(current_user.organization_id),
    ).first()

    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    if tag.system_managed:
        raise HTTPException(status_code=403, detail="Cannot delete system-managed tag")

    if tag.usage_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete tag that is in use ({tag.usage_count} usages). Deactivate instead."
        )

    db.delete(tag)
    db.commit()

    return {"message": "Tag deleted successfully"}


# ============================================================================
# Utility Endpoints
# ============================================================================

@router.get("/export", response_model=TaxonomyExport)
async def export_taxonomy(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Export the complete taxonomy for the organization."""
    categories = db.query(TaxonomyCategory).filter(
        TaxonomyCategory.organization_id == str(current_user.organization_id),
        TaxonomyCategory.active == True,
    ).order_by(TaxonomyCategory.display_order).all()

    return TaxonomyExport(
        categories=categories,
        exported_at=datetime.utcnow(),
    )


@router.get("/search")
async def search_tags(
    q: str,
    category_key: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Search for tags across all categories or within a specific category.

    Useful for autocomplete and tag selection interfaces.
    """
    query = db.query(TaxonomyTag).join(TaxonomyCategory).filter(
        TaxonomyCategory.organization_id == str(current_user.organization_id),
        TaxonomyTag.active == True,
    )

    if category_key:
        query = query.filter(TaxonomyCategory.key == category_key)

    # Search in name and description
    search_term = f"%{q}%"
    query = query.filter(
        (TaxonomyTag.name.ilike(search_term)) |
        (TaxonomyTag.description.ilike(search_term))
    )

    tags = query.limit(20).all()
    return tags


@router.post("/initialize")
async def initialize_taxonomy(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Initialize default taxonomy. Only run once per organization."""
    existing = db.query(TaxonomyCategory).filter(
        TaxonomyCategory.organization_id == str(current_user.organization_id)
    ).first()

    if existing:
        count = db.query(TaxonomyCategory).filter(
            TaxonomyCategory.organization_id == str(current_user.organization_id)
        ).count()
        return {"message": "Taxonomy already initialized", "categories_count": count}

    DEFAULT_TAXONOMY = {
        "prohibited_content": {
            "name": "Prohibited Content", "icon": "🚫", "color": "red",
            "tags": [
                {"name": "violence", "description": "Physical harm, fighting", "severity": "high"},
                {"name": "adult_themes", "description": "Mature content", "severity": "high"},
                {"name": "profanity", "description": "Vulgar language", "severity": "medium"},
                {"name": "hate_speech", "description": "Discriminatory content", "severity": "high"},
                {"name": "drugs", "description": "Drug use", "severity": "high"},
            ]
        },
        "character_traits": {
            "name": "Character Traits", "icon": "👤", "color": "blue",
            "tags": [
                {"name": "friendly", "description": "Warm and approachable"},
                {"name": "loyal", "description": "Faithful and devoted"},
                {"name": "brave", "description": "Courageous"},
            ]
        },
        "content_rating": {
            "name": "Content Ratings", "icon": "🎬", "color": "yellow",
            "tags": [
                {"name": "g", "description": "General Audiences"},
                {"name": "pg", "description": "Parental Guidance"},
                {"name": "pg13", "description": "Parents Cautioned"},
                {"name": "r", "description": "Restricted"},
            ]
        },
        "relationship_types": {
            "name": "Relationship Types", "icon": "🔗", "color": "purple",
            "tags": [
                {"name": "family", "description": "Family member"},
                {"name": "friend", "description": "Friend"},
                {"name": "romantic", "description": "Love interest"},
            ]
        },
    }

    created_categories = []
    for key, cat_data in DEFAULT_TAXONOMY.items():
        category = TaxonomyCategory(
            organization_id=str(current_user.organization_id),
            key=key,
            name=cat_data["name"],
            icon=cat_data["icon"],
            color=cat_data["color"],
            display_order=len(created_categories),
            system_managed=True,
            active=True,
            created_by=str(current_user.id),
        )
        db.add(category)
        db.flush()

        for tag_data in cat_data["tags"]:
            tag = TaxonomyTag(
                category_id=category.id,
                name=tag_data["name"],
                description=tag_data.get("description", ""),
                severity=tag_data.get("severity", "neutral"),
                tag_metadata={},
                system_managed=True,
                active=True,
                created_by=str(current_user.id),
            )
            db.add(tag)

        created_categories.append(category)

    db.commit()
    return {"message": "Taxonomy initialized", "categories_count": len(created_categories)}
