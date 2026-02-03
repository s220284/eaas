#!/usr/bin/env python3
"""
Update Peppa Pig franchise data directly in database.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.database import SessionLocal
from src.models import Franchise
import json

def main():
    print("="*80)
    print("Updating Peppa Pig Franchise Data in Database")
    print("="*80)
    print()

    db = SessionLocal()

    try:
        # Find Peppa Pig franchise
        franchise = db.query(Franchise).filter(Franchise.name == "Peppa Pig").first()

        if not franchise:
            print("✗ Peppa Pig franchise not found!")
            return

        print(f"✓ Found franchise: {franchise.name} (ID: {franchise.id})")
        print()

        # Comprehensive franchise data
        franchise_extra_data = {
            "overview": {
                "genre": "Children's animated television series",
                "target_audience": "Preschool children (ages 2-5)",
                "first_aired": "May 31, 2004",
                "creator": "Neville Astley and Mark Baker",
                "production_company": "Astley Baker Davies",
                "distributor": "Entertainment One (now Hasbro Entertainment)",
                "format": "5-minute episodes",
                "total_episodes": "400+ episodes (as of 2024)",
                "seasons": "9+ seasons"
            },
            "premise": {
                "summary": "Peppa Pig follows the adventures of Peppa, a lovable but slightly bossy little pig, and her family and friends. Each episode features everyday activities such as playing games, visiting grandparents, going swimming, visiting the playground, riding bikes and going to playgroup.",
                "setting": "A world of anthropomorphic animals living in houses and driving cars, similar to human society",
                "themes": [
                    "Family relationships",
                    "Friendship",
                    "Learning through play",
                    "Everyday adventures",
                    "Problem-solving",
                    "Emotional development"
                ]
            },
            "main_characters": [
                {"name": "Peppa Pig", "role": "Protagonist", "age": "4 years old"},
                {"name": "George Pig", "role": "Younger brother", "age": "2 years old"},
                {"name": "Mummy Pig", "role": "Mother"},
                {"name": "Daddy Pig", "role": "Father"},
                {"name": "Suzy Sheep", "role": "Best friend"}
            ],
            "production": {
                "animation_style": "Simple 2D animation with bright colors",
                "voice_direction": "Child voice actors for child characters",
                "episode_structure": "5-minute standalone episodes",
                "signature_sounds": "Character snorts and animal sounds"
            },
            "brand_values": {
                "core_values": [
                    "Family togetherness",
                    "Kindness and friendship",
                    "Learning through play",
                    "Positive role models",
                    "Age-appropriate content"
                ],
                "safety_standards": {
                    "content_rating": "G (General Audiences)",
                    "violence": "None",
                    "language": "Simple, age-appropriate only"
                }
            },
            "global_reach": {
                "broadcast_territories": "180+ countries",
                "languages": "40+ languages",
                "key_markets": ["UK", "USA", "China", "Australia"]
            },
            "rights_information": {
                "copyright_holder": "Astley Baker Davies Ltd",
                "distributor": "Hasbro Entertainment",
                "usage_restrictions": [
                    "No character design alterations",
                    "No adult content",
                    "Quality standards required",
                    "Approval for commercial use"
                ]
            }
        }

        # Update franchise
        franchise.description = "British preschool animated television series about Peppa Pig and her family and friends. Created by Neville Astley and Mark Baker, the show has become one of the most successful preschool properties globally, broadcast in 180+ countries and dubbed in 40+ languages."
        franchise.extra_data = franchise_extra_data

        db.commit()

        print("✓ Franchise updated successfully!")
        print()
        print("="*80)
        print("Updated Information:")
        print("="*80)
        print(f"Description: {franchise.description[:100]}...")
        print()
        print("Extra Data Sections:")
        for key in franchise_extra_data.keys():
            print(f"  • {key}")
        print()
        print("="*80)

    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
