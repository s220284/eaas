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

        # Prepare character card data
        slug = char_name.lower().replace(' ', '-').replace('.', '')
        character_payload = {
            "name": char_name,
            "slug": slug,
            "franchise_id": franchise_id,
            "canon_facts": char_data.get('canon_facts', []),
            "relationships": char_data.get('relationships', []),
            "personality_traits": char_data.get('voice_profile', {}).get('personality', []),
            "tone_tags": char_data.get('voice_profile', {}).get('tone', []),
            "speech_style_notes": char_data.get('voice_profile', {}).get('speech_style', ''),
            "catchphrases": char_data.get('voice_profile', {}).get('catchphrases', []),
            "legal_owner": char_data.get('legal_pack', {}).get('rights_holder', ''),
            "performer_consent_status": char_data.get('legal_pack', {}).get('performer_consent', '')
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
