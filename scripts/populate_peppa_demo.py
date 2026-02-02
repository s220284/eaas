#!/usr/bin/env python3
"""
Manual population of Peppa Pig characters for demo.
Workaround for API bug until it's fixed.
"""

import json
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.database import SessionLocal
from src.models import CharacterCard, CardVersion, Franchise, User
import uuid


def main():
    """Populate Peppa Pig characters."""

    print("="*80)
    print("Populating Peppa Pig Demo Characters")
    print("="*80)

    db = SessionLocal()

    try:
        # Get user and franchise
        user = db.query(User).filter(User.email == 'peppapig@demo.canonsafe.com').first()
        if not user:
            print("ERROR: Demo user not found!")
            return

        print(f"✓ Found user: {user.email}")

        # Get latest Peppa Pig franchise
        franchise = db.query(Franchise).filter(
            Franchise.name == 'Peppa Pig',
            Franchise.organization_id == user.organization_id
        ).order_by(Franchise.created_at.desc()).first()

        if not franchise:
            print("ERROR: Peppa Pig franchise not found!")
            return

        print(f"✓ Found franchise: {franchise.name} (ID: {franchise.id})")

        # Load curated character data
        data_file = Path(__file__).parent / 'bulk_upload/brands/peppa_pig_curated_data.json'
        with open(data_file) as f:
            characters_data = json.load(f)

        print(f"✓ Loaded {len(characters_data)} characters from curated data")
        print()

        # Create each character
        for char_data in characters_data:
            char_name = char_data['name']
            print(f"Creating: {char_name}...")

            # Check if already exists
            existing = db.query(CharacterCard).filter(
                CharacterCard.name == char_name,
                CharacterCard.franchise_id == franchise.id
            ).first()

            if existing:
                print(f"  ⚠ Character already exists (ID: {existing.id}), skipping")
                continue

            # Generate slug
            slug = char_name.lower().replace(' ', '-').replace('.', '')

            # Create character card
            card = CharacterCard(
                id=str(uuid.uuid4()),
                franchise_id=franchise.id,
                name=char_name,
                slug=slug,
                status='approved',  # Set to approved for demo
                created_by=user.id
            )
            db.add(card)
            db.flush()

            # Create initial version
            canon_pack = char_data['canon_pack']

            # Convert facts list to dict
            canon_facts = {}
            for fact in canon_pack.get('facts', []):
                fact_id = fact['fact_id']
                canon_facts[fact_id] = {
                    'value': fact['value'],
                    'source': fact.get('source', ''),
                    'confidence': fact.get('confidence', 1.0)
                }

            # Keep relationships as a list (don't convert to dict)
            canon_relationships = [
                {
                    'character_name': rel['character_name'],
                    'relationship_type': rel['relationship_type'],
                    'description': rel.get('description', '')
                }
                for rel in canon_pack.get('relationships', [])
            ]

            # Legal pack (from config)
            legal_rights = {
                'name': 'Entertainment One / Hasbro',
                'territories': ['Worldwide']
            }

            legal_performer_consent = {
                'type': 'AI_VOICE_REFERENCE',
                'performer_name': 'Various voice actors',
                'scope': 'Character portrayal for educational and entertainment purposes',
                'restrictions': [
                    'No impersonation of voice actors',
                    'AI disclosure required',
                    'Must maintain character integrity'
                ]
            }

            # Safety pack (from config)
            safety_prohibited_topics = [
                {'topic': 'violence', 'severity': 'strict', 'rationale': 'Preschool audience'},
                {'topic': 'weapons', 'severity': 'strict', 'rationale': 'Not age-appropriate'},
                {'topic': 'scary_content', 'severity': 'strict', 'rationale': 'May frighten children'},
                {'topic': 'adult_themes', 'severity': 'strict', 'rationale': 'Preschool content only'},
                {'topic': 'profanity', 'severity': 'strict', 'rationale': 'Family-friendly'},
                {'topic': 'bullying', 'severity': 'strict', 'rationale': 'Promotes positive relationships'},
                {'topic': 'dangerous_activities', 'severity': 'strict', 'rationale': 'Safety concern'},
            ]

            # Keep safety_prohibited_topics as a list (don't convert to dict)

            version = CardVersion(
                id=str(uuid.uuid4()),
                character_card_id=card.id,
                version_number=1,
                canon_facts=canon_facts,
                canon_voice=canon_pack.get('voice', {}),
                canon_relationships=canon_relationships,
                legal_rights=legal_rights,
                legal_performer_consent=legal_performer_consent,
                safety_content_rating='G',
                safety_prohibited_topics=safety_prohibited_topics,
                safety_required_disclosures=['This is an AI-generated character experience'],
                safety_age_gating={'enabled': False, 'minimum_age': 0},
                change_summary='Initial version',
                created_by=user.id
            )
            db.add(version)
            db.flush()

            # Set current version
            card.current_version_id = version.id

            print(f"  ✓ Created character: {char_name} (ID: {card.id})")

        # Commit all changes
        db.commit()

        print()
        print("="*80)
        print("SUCCESS! All characters created")
        print("="*80)
        print()
        print("Demo Account:")
        print(f"  Organization: Hasbro")
        print(f"  Franchise: Peppa Pig")
        print(f"  Login: peppapig@demo.canonsafe.com / Peppa")
        print(f"  Characters: {len(characters_data)}")
        print()
        print("You can now:")
        print("  1. Login to the frontend at http://localhost:3003")
        print("  2. View characters in the Characters page")
        print("  3. Run evaluations on Peppa Pig characters")
        print("="*80)

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == '__main__':
    main()
