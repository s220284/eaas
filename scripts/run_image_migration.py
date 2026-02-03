#!/usr/bin/env python3
"""
Run image_url migration on production database.
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

# Set environment to production
os.environ['DATABASE_URL'] = os.environ.get('DATABASE_URL',
    'postgresql://postgres:T0p_S3cr3t!mash@/cloudsql/mash-ai-prod:us-central1:mash-ai-db/mash-ai-prod')

from sqlalchemy import create_engine, text

def main():
    """Run the migration."""
    print("=" * 70)
    print("Running image_url Migration")
    print("=" * 70)
    print()

    # Get database URL from environment
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("✗ DATABASE_URL not set")
        return

    print(f"Connecting to database...")

    try:
        engine = create_engine(database_url)

        with engine.connect() as conn:
            # Add column
            print("Adding image_url column...")
            conn.execute(text(
                "ALTER TABLE character_cards ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)"
            ))
            conn.commit()
            print("✓ Column added")

            # Update Peppa Pig characters with images
            updates = [
                ("Peppa Pig", "https://upload.wikimedia.org/wikipedia/en/c/c2/Peppa_Pig_character.png"),
                ("George Pig", "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/George_Pig.png/200px-George_Pig.png"),
                ("Mummy Pig", "https://static.wikia.nocookie.net/peppapedia/images/8/8f/Mummy_Pig.png"),
                ("Daddy Pig", "https://static.wikia.nocookie.net/peppapedia/images/4/42/Daddy_Pig.png"),
                ("Suzy Sheep", "https://static.wikia.nocookie.net/peppapedia/images/f/f8/Suzy_Sheep.png"),
            ]

            print("\nUpdating character images...")
            for name, url in updates:
                result = conn.execute(
                    text("UPDATE character_cards SET image_url = :url WHERE name = :name"),
                    {"url": url, "name": name}
                )
                count = result.rowcount
                print(f"  ✓ Updated {count} record(s) for {name}")

            conn.commit()

        print()
        print("=" * 70)
        print("✓ Migration completed successfully")
        print("=" * 70)

    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main() or 0)
