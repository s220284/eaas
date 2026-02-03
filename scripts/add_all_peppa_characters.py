#!/usr/bin/env python3
"""Add all Peppa Pig characters with placeholder images."""

import json
import requests
import sys
from urllib.parse import quote

API_BASE = "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1"

def get_token():
    """Get authentication token."""
    response = requests.post(
        f"{API_BASE}/auth/login",
        json={"email": "peppapig@demo.canonsafe.com", "password": "Peppa"}
    )
    response.raise_for_status()
    return response.json()["access_token"]

def get_headers(token):
    """Get headers with auth token."""
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

def get_avatar_url(name):
    """Generate UI Avatars URL for a character name."""
    # UI Avatars service - generates colorful avatars from names
    # Format: https://ui-avatars.com/api/?name=Name&size=200&background=random
    encoded_name = quote(name)
    return f"https://ui-avatars.com/api/?name={encoded_name}&size=200&background=random&bold=true"

def get_franchise_id(token):
    """Get the Peppa Pig franchise ID."""
    headers = get_headers(token)
    response = requests.get(f"{API_BASE}/characters/franchises", headers=headers)
    response.raise_for_status()
    franchises = response.json()

    for f in franchises:
        if f["name"] == "Peppa Pig":
            return f["id"]

    raise Exception("Peppa Pig franchise not found")

def get_existing_characters(token):
    """Get list of existing character names."""
    headers = get_headers(token)
    response = requests.get(f"{API_BASE}/characters/", headers=headers)
    response.raise_for_status()
    return {char["name"] for char in response.json()}

def create_character(token, franchise_id, char_data):
    """Create a character with minimal data."""
    headers = get_headers(token)

    # Generate slug from name
    slug = char_data["name"].lower().replace(" ", "-").replace(".", "").replace("&", "and")

    # Create character payload
    payload = {
        "franchise_id": franchise_id,
        "name": char_data["name"],
        "slug": slug,
        "image_url": get_avatar_url(char_data["name"]),
        "status": "draft",
        "canon_pack": {
            "facts": [
                {
                    "fact_id": "species",
                    "value": char_data.get("section", "Unknown"),
                    "source": "Peppa Pig Fandom Wiki",
                    "confidence": 0.9
                }
            ],
            "relationships": []
        },
        "voice_pack": {
            "personality_traits": [],
            "tone": "",
            "speech_style": "",
            "vocabulary_level": "simple",
            "catchphrases": []
        },
        "safety_pack": {
            "content_rating": "G",
            "prohibited_topics": [],
            "required_disclosures": ["AI-generated character content"],
            "age_gating": False
        },
        "legal_pack": {
            "rights_holder": "Hasbro Entertainment / Entertainment One",
            "performer_consent": "Reference only - no voice impersonation",
            "usage_restrictions": "Character reference for educational purposes",
            "territories": ["worldwide"]
        }
    }

    response = requests.post(
        f"{API_BASE}/characters/",
        headers=headers,
        json=payload
    )

    if response.status_code == 200:
        return response.json()
    else:
        print(f"  Error: {response.status_code} - {response.text[:200]}")
        return None

def update_franchise_image(token, franchise_id):
    """Update franchise with a logo image."""
    headers = get_headers(token)

    # Use Peppa Pig logo image URL
    logo_url = "https://ui-avatars.com/api/?name=Peppa+Pig&size=400&background=e91e63&color=fff&bold=true&font-size=0.5"

    response = requests.put(
        f"{API_BASE}/characters/franchises/{franchise_id}",
        headers=headers,
        json={"image_url": logo_url}
    )

    if response.status_code == 200:
        print(f"✓ Updated franchise with logo image")
    else:
        print(f"✗ Failed to update franchise: {response.status_code}")

def main():
    """Main function."""
    try:
        print("Getting auth token...")
        token = get_token()
        print("✓ Authenticated\n")

        print("Getting franchise ID...")
        franchise_id = get_franchise_id(token)
        print(f"✓ Franchise ID: {franchise_id}\n")

        print("Updating franchise with logo...")
        update_franchise_image(token, franchise_id)
        print()

        print("Loading character data...")
        with open("scripts/peppa_characters_raw.json", "r") as f:
            all_characters = json.load(f)
        print(f"✓ Loaded {len(all_characters)} characters\n")

        print("Getting existing characters...")
        existing = get_existing_characters(token)
        print(f"✓ Found {len(existing)} existing characters\n")

        print("Adding new characters...")
        added = 0
        skipped = 0
        failed = 0

        for char in all_characters:
            if char["name"] in existing:
                print(f"  - {char['name']}: already exists")
                skipped += 1
                continue

            print(f"  + {char['name']}")
            result = create_character(token, franchise_id, char)
            if result:
                added += 1
            else:
                failed += 1

        print(f"\n{'='*50}")
        print(f"✓ Added: {added} characters")
        print(f"- Skipped: {skipped} (already exist)")
        if failed > 0:
            print(f"✗ Failed: {failed}")
        print(f"{'='*50}")

    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
