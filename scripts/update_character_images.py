#!/usr/bin/env python3
"""
Update character images via API.
"""

import requests
import sys

API_BASE = "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1"
EMAIL = "peppapig@demo.canonsafe.com"
PASSWORD = "Peppa"

IMAGES = {
    "Peppa Pig": "https://upload.wikimedia.org/wikipedia/en/c/c2/Peppa_Pig_character.png",
    "George Pig": "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/George_Pig.png/200px-George_Pig.png",
    "Mummy Pig": "https://static.wikia.nocookie.net/peppapedia/images/8/8f/Mummy_Pig.png",
    "Daddy Pig": "https://static.wikia.nocookie.net/peppapedia/images/4/42/Daddy_Pig.png",
    "Suzy Sheep": "https://static.wikia.nocookie.net/peppapedia/images/f/f8/Suzy_Sheep.png",
}


def main():
    print("=" * 70)
    print("Updating Character Images")
    print("=" * 70)
    print()

    # Login
    print("Authenticating...")
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json={"email": EMAIL, "password": PASSWORD}
        )
        response.raise_for_status()
        token = response.json()["access_token"]
        print("✓ Logged in successfully")
        print()
    except Exception as e:
        print(f"✗ Login failed: {e}")
        return 1

    headers = {"Authorization": f"Bearer {token}"}

    # Get all characters
    print("Fetching characters...")
    try:
        response = requests.get(f"{API_BASE}/characters", headers=headers)
        response.raise_for_status()
        characters = response.json()
        print(f"✓ Found {len(characters)} character(s)")
        print()
    except Exception as e:
        print(f"✗ Failed to fetch characters: {e}")
        return 1

    # Update each character with image
    print("Updating character images...")
    updated = 0

    for char in characters:
        char_name = char["name"]
        char_id = char["id"]

        if char_name in IMAGES:
            image_url = IMAGES[char_name]

            try:
                response = requests.put(
                    f"{API_BASE}/characters/{char_id}",
                    headers=headers,
                    json={"image_url": image_url}
                )
                response.raise_for_status()
                print(f"  ✓ Updated {char_name}")
                updated += 1
            except Exception as e:
                print(f"  ✗ Failed to update {char_name}: {e}")

    print()
    print("=" * 70)
    print(f"✓ Successfully updated {updated} character(s)")
    print("=" * 70)

if __name__ == "__main__":
    sys.exit(main() or 0)
