"""
Organization and User models for multi-tenant support.
"""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from src.database import Base


# Use String for UUID to be portable across databases
def generate_uuid():
    return str(uuid.uuid4())


class Organization(Base):
    """
    Organization represents a tenant (studio, brand, developer).

    Each organization has its own franchises, characters, and users.
    """

    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    settings = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="organization")
    franchises = relationship("Franchise", back_populates="organization")

    def __repr__(self):
        return f"<Organization(name='{self.name}', slug='{self.slug}')>"


class User(Base):
    """
    User account within an organization.

    Roles: admin, member, viewer
    """

    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255))
    role = Column(String(50), default="member")  # admin, member, viewer
    hashed_password = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="users")

    def __repr__(self):
        return f"<User(email='{self.email}', role='{self.role}')>"
