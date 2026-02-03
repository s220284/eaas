#!/usr/bin/env python3
"""
Add image_url column to production database.
"""

import os
import sys
from google.cloud.sql.connector import Connector
import sqlalchemy
import pg8000

def main():
    print("=" * 70)
    print("Adding image_url Column to Production Database")
    print("=" * 70)
    print()

    # Cloud SQL connection details
    instance_connection_name = "mash-ai-prod:us-central1:mash-ai-db"
    db_user = "postgres"
    db_pass = os.environ.get("DB_PASSWORD", "T0p_S3cr3t!mash")
    db_name = "mash-ai-prod"

    print(f"Connecting to {instance_connection_name}...")

    try:
        # Initialize Cloud SQL Python Connector
        connector = Connector()

        def getconn():
            conn = connector.connect(
                instance_connection_name,
                "pg8000",
                user=db_user,
                password=db_pass,
                db=db_name
            )
            return conn

        # Create SQLAlchemy engine
        pool = sqlalchemy.create_engine(
            "postgresql+pg8000://",
            creator=getconn,
        )

        with pool.connect() as conn:
            # Add column if not exists
            print("Adding image_url column...")
            conn.execute(sqlalchemy.text(
                "ALTER TABLE character_cards ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)"
            ))
            conn.commit()
            print("✓ Column added successfully")

            # Check current values
            print("\nChecking existing characters...")
            result = conn.execute(sqlalchemy.text(
                "SELECT id, name, image_url FROM character_cards LIMIT 10"
            ))
            chars = result.fetchall()
            print(f"✓ Found {len(chars)} characters")
            for char_id, name, image_url in chars:
                status = image_url if image_url else "(no image)"
                print(f"  - {name}: {status}")

        connector.close()

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
