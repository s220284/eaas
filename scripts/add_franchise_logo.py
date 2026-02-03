#!/usr/bin/env python3
"""Add franchise logo support by adding image_url column."""

import os
from sqlalchemy import create_engine, text

# Get database URL from environment or use production
db_url = os.getenv("DATABASE_URL", "postgresql://mash_user:MashUser2026!@127.0.0.1:5433/mash_ai")

print("Connecting to database...")
engine = create_engine(db_url)

with engine.connect() as conn:
    # Add column if it doesn't exist
    print("Adding image_url column to franchises table...")
    conn.execute(text("""
        ALTER TABLE franchises
        ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
    """))
    conn.commit()
    print("✓ Column added")

    # Update Peppa Pig franchise with logo
    print("Setting Peppa Pig franchise logo...")
    result = conn.execute(text("""
        UPDATE franchises
        SET image_url = 'https://api.dicebear.com/7.x/shapes/svg?seed=PeppaPig&backgroundColor=ff6b9d&scale=80'
        WHERE name = 'Peppa Pig';
    """))
    conn.commit()
    print(f"✓ Updated {result.rowcount} franchise(s)")

print("\n✓ Migration complete!")
