"""
Pydantic schemas for Taxonomy API.
"""

from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field


# ============================================================================
# Taxonomy Tag Schemas
# ============================================================================

class TaxonomyTagBase(BaseModel):
    name: str = Field(..., description="Tag identifier (e.g., 'violence', 'friendly')")
    description: Optional[str] = Field(None, description="Human-readable description")
    severity: Optional[str] = Field("neutral", description="Severity level: neutral, low, medium, high")
    tag_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")
    active: bool = Field(True, description="Whether tag is active")


class TaxonomyTagCreate(TaxonomyTagBase):
    """Schema for creating a new tag"""
    pass


class TaxonomyTagUpdate(BaseModel):
    """Schema for updating a tag (all fields optional)"""
    name: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    tag_metadata: Optional[Dict[str, Any]] = None
    active: Optional[bool] = None


class TaxonomyTagResponse(TaxonomyTagBase):
    """Schema for tag responses"""
    id: str
    category_id: str
    usage_count: int
    system_managed: bool
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]

    class Config:
        from_attributes = True


# ============================================================================
# Taxonomy Category Schemas
# ============================================================================

class TaxonomyCategoryBase(BaseModel):
    key: str = Field(..., description="Category key (e.g., 'prohibited_content')")
    name: str = Field(..., description="Display name")
    description: Optional[str] = Field(None, description="Category description")
    icon: Optional[str] = Field(None, description="Emoji or icon")
    color: Optional[str] = Field(None, description="Color theme")
    display_order: int = Field(0, description="Display order")
    active: bool = Field(True, description="Whether category is active")


class TaxonomyCategoryCreate(TaxonomyCategoryBase):
    """Schema for creating a new category"""
    pass


class TaxonomyCategoryUpdate(BaseModel):
    """Schema for updating a category (all fields optional)"""
    key: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    display_order: Optional[int] = None
    active: Optional[bool] = None


class TaxonomyCategoryResponse(TaxonomyCategoryBase):
    """Schema for category responses"""
    id: str
    organization_id: str
    system_managed: bool
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    tags: List[TaxonomyTagResponse] = []

    class Config:
        from_attributes = True


# ============================================================================
# Composite Schemas
# ============================================================================

class TaxonomyExport(BaseModel):
    """Schema for exporting full taxonomy"""
    categories: List[TaxonomyCategoryResponse]
    exported_at: datetime
    version: str = "1.0"
