#!/usr/bin/env python3
"""
Add complete version data to existing production characters.
"""

import json
import os
import requests
from pathlib import Path
import sys

# Production API base URL
API_BASE = "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1"

# Get password from environment
DEMO_PASSWORD = os.environ.get("DEMO_PASSWORD", "Peppa")


def main():
    """Add version data to existing characters."""

    print("="*80)
    print("Adding Version Data to Production Characters")
    print("="*80)
    print()

    # Step 1: Login
    print("Step 1: Logging in...")
    login_response = requests.post(
        f"{API_BASE}/auth/login",
        json={"email": "peppapig@demo.canonsafe.com", "password": DEMO_PASSWORD}
    )
    if login_response.status_code != 200:
        print(f"✗ Login failed: {login_response.text}")
        return

    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✓ Logged in successfully")
    print()

    # Step 2: Get existing characters
    print("Step 2: Fetching existing characters...")
    response = requests.get(f"{API_BASE}/characters/", headers=headers)
    if response.status_code != 200:
        print(f"✗ Failed to fetch characters: {response.text}")
        return

    characters = response.json()
    print(f"✓ Found {len(characters)} characters")
    print()

    # Step 3: Load character data
    print("Step 3: Loading curated character data...")
    data_file = Path(__file__).parent / 'bulk_upload/brands/peppa_pig_curated_data.json'
    with open(data_file) as f:
        characters_data = json.load(f)

    print(f"✓ Loaded {len(characters_data)} character definitions")
    print()

    # Step 4: Add versions to characters
    print("Step 4: Adding version data...")
    for char in characters:
        char_name = char['name']
        char_id = char['id']

        # Skip if already has version
        if char.get('current_version_id'):
            print(f"  {char_name}: ⚠ Already has version, skipping")
            continue

        # Find matching character data
        char_data = next((c for c in characters_data if c['name'] == char_name), None)
        if not char_data:
            print(f"  {char_name}: ⚠ No data found, skipping")
            continue

        print(f"  {char_name}: Adding version...", end=" ")

        # Build version payload
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

        # Safety pack - simplified to strings for now
        safety_prohibited_topics = [
            'violence',
            'weapons',
            'scary_content',
            'adult_themes',
            'profanity',
            'bullying',
            'dangerous_activities'
        ]

        version_payload = {
            "canon_facts": canon_facts,
            "canon_voice": canon_voice,
            "canon_relationships": canon_relationships,
            "legal_rights": legal_rights,
            "legal_performer_consent": legal_performer_consent,
            "safety_content_rating": "G",
            "safety_prohibited_topics": safety_prohibited_topics,
            "safety_required_disclosures": ["This is an AI-generated character experience"],
            "safety_age_gating": {"enabled": False, "minimum_age": 0},
            "change_summary": "Initial version with complete canon/voice/safety/legal data"
        }

        response = requests.post(
            f"{API_BASE}/characters/{char_id}/versions",
            json=version_payload,
            headers=headers
        )

        if response.status_code == 200:
            print("✓")
        else:
            print(f"✗ ({response.status_code}: {response.text[:100]})")

    print()
    print("="*80)
    print("✓ Version data update complete!")
    print("="*80)


if __name__ == "__main__":
    main()
