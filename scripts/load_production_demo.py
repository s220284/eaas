#!/usr/bin/env python3
"""
Load Peppa Pig demo data into production via API.

Usage:
    DEMO_PASSWORD=<password> python load_production_demo.py
"""

import json
import os
import requests
from pathlib import Path
import sys

# Production API base URL
API_BASE = "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1"

# Get password from environment
DEMO_PASSWORD = os.environ.get("DEMO_PASSWORD")
if not DEMO_PASSWORD:
    print("ERROR: DEMO_PASSWORD environment variable not set")
    print("Usage: DEMO_PASSWORD=<password> python load_production_demo.py")
    sys.exit(1)

def main():
    """Load demo data into production."""

    print("="*80)
    print("Loading Peppa Pig Demo Data into Production")
    print("="*80)
    print()

    # Step 1: Register Hasbro organization admin
    print("Step 1: Creating Hasbro organization and admin user...")
    register_data = {
        "email": "peppapig@demo.canonsafe.com",
        "password": DEMO_PASSWORD,
        "name": "Peppa Pig",
        "organization_name": "Hasbro",
        "organization_slug": "hasbro"
    }

    response = requests.post(f"{API_BASE}/auth/register", json=register_data)
    if response.status_code == 200:
        print("✓ Created Hasbro organization and demo user")
        token = response.json()["access_token"]
    elif "already registered" in response.text.lower():
        print("⚠ User already exists, logging in...")
        login_response = requests.post(
            f"{API_BASE}/auth/login",
            json={"email": "peppapig@demo.canonsafe.com", "password": DEMO_PASSWORD}
        )
        if login_response.status_code == 200:
            token = login_response.json()["access_token"]
            print("✓ Logged in successfully")
        else:
            print(f"✗ Login failed: {login_response.text}")
            return
    else:
        print(f"✗ Registration failed: {response.text}")
        return

    headers = {"Authorization": f"Bearer {token}"}
    print()

    # Step 2: Create Peppa Pig franchise
    print("Step 2: Creating Peppa Pig franchise...")
    franchise_data = {
        "name": "Peppa Pig",
        "description": "British preschool animated television series about Peppa Pig and her family and friends."
    }

    response = requests.post(f"{API_BASE}/characters/franchises", json=franchise_data, headers=headers)
    if response.status_code == 200:
        franchise_id = response.json()["id"]
        print(f"✓ Created franchise (ID: {franchise_id})")
    else:
        # Try to get existing franchise
        response = requests.get(f"{API_BASE}/characters/franchises", headers=headers)
        if response.status_code == 200:
            franchises = response.json()
            if isinstance(franchises, list):
                peppa_franchise = next((f for f in franchises if f["name"] == "Peppa Pig"), None)
                if peppa_franchise:
                    franchise_id = peppa_franchise["id"]
                    print(f"⚠ Using existing franchise (ID: {franchise_id})")
                else:
                    print(f"✗ Peppa Pig franchise not found")
                    return
            else:
                print(f"✗ Unexpected franchise response: {franchises}")
                return
        else:
            print(f"✗ Failed to create/find franchise: {response.text}")
            return
    print()

    # Step 3: Load character data
    print("Step 3: Loading character data...")
    data_file = Path(__file__).parent / 'bulk_upload/brands/peppa_pig_curated_data.json'
    with open(data_file) as f:
        characters_data = json.load(f)

    print(f"✓ Loaded {len(characters_data)} characters from curated data")
    print()

    # Step 4: Create characters
    print("Step 4: Creating characters...")
    created_count = 0
    skipped_count = 0

    for char_data in characters_data:
        char_name = char_data['name']
        print(f"  Creating: {char_name}...", end=" ")

        # Prepare character card data with complete version
        slug = char_name.lower().replace(' ', '-').replace('.', '')
        canon_pack = char_data.get('canon_pack', {})

        # Convert facts list to dict
        canon_facts = {}
        for fact in canon_pack.get('facts', []):
            fact_id = fact['fact_id']
            canon_facts[fact_id] = {
                'value': fact['value'],
                'source': fact.get('source', ''),
                'confidence': fact.get('confidence', 1.0)
            }

        # Keep relationships as list
        canon_relationships = [
            {
                'character_name': rel['character_name'],
                'relationship_type': rel['relationship_type'],
                'description': rel.get('description', '')
            }
            for rel in canon_pack.get('relationships', [])
        ]

        # Canon voice
        voice = canon_pack.get('voice', {})
        canon_voice = {
            'personality_traits': voice.get('personality_traits', []),
            'tone': voice.get('tone', ''),
            'speech_style': voice.get('speech_style', ''),
            'vocabulary_level': voice.get('vocabulary_level', ''),
            'catchphrases': voice.get('catchphrases', []),
            'emotional_range': voice.get('emotional_range', '')
        }

        # Legal pack
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

        # Safety pack
        safety_prohibited_topics = [
            {'topic': 'violence', 'severity': 'strict', 'rationale': 'Preschool audience'},
            {'topic': 'weapons', 'severity': 'strict', 'rationale': 'Not age-appropriate'},
            {'topic': 'scary_content', 'severity': 'strict', 'rationale': 'May frighten children'},
            {'topic': 'adult_themes', 'severity': 'strict', 'rationale': 'Preschool content only'},
            {'topic': 'profanity', 'severity': 'strict', 'rationale': 'Family-friendly'},
            {'topic': 'bullying', 'severity': 'strict', 'rationale': 'Promotes positive relationships'},
            {'topic': 'dangerous_activities', 'severity': 'strict', 'rationale': 'Safety concern'},
        ]

        character_payload = {
            "name": char_name,
            "slug": slug,
            "franchise_id": franchise_id,
            "initial_version": {
                "canon_facts": canon_facts,
                "canon_voice": canon_voice,
                "canon_relationships": canon_relationships,
                "legal_rights": legal_rights,
                "legal_performer_consent": legal_performer_consent,
                "safety_content_rating": "G",
                "safety_prohibited_topics": safety_prohibited_topics,
                "safety_required_disclosures": ["This is an AI-generated character experience"],
                "safety_age_gating": {"enabled": False, "minimum_age": 0},
                "change_summary": "Initial version"
            }
        }

        response = requests.post(
            f"{API_BASE}/characters/",
            json=character_payload,
            headers=headers
        )

        if response.status_code == 200:
            print("✓")
            created_count += 1
        elif "already exists" in response.text.lower():
            print("⚠ (already exists)")
            skipped_count += 1
        else:
            print(f"✗ ({response.status_code}: {response.text[:100]})")

    print()
    print("="*80)
    print(f"✓ Demo data loading complete!")
    print(f"  - Created: {created_count} characters")
    print(f"  - Skipped: {skipped_count} characters (already existed)")
    print()
    print("Demo Account Credentials:")
    print("  Email: peppapig@demo.canonsafe.com")
    print("  Password: (same as DEMO_PASSWORD env var)")
    print("="*80)


if __name__ == "__main__":
    main()
