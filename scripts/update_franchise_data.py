#!/usr/bin/env python3
"""
Update Peppa Pig franchise with comprehensive information.
"""

import requests
import json
import os

API_BASE = "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1"
DEMO_PASSWORD = os.environ.get("DEMO_PASSWORD", "Peppa")

def main():
    print("="*80)
    print("Updating Peppa Pig Franchise Data")
    print("="*80)
    print()

    # Login
    print("Logging in...")
    response = requests.post(
        f"{API_BASE}/auth/login",
        json={"email": "peppapig@demo.canonsafe.com", "password": DEMO_PASSWORD}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✓ Logged in")
    print()

    # Get Peppa Pig franchise
    print("Finding Peppa Pig franchise...")
    response = requests.get(f"{API_BASE}/characters/franchises", headers=headers)
    franchises = response.json()
    peppa_franchise = next((f for f in franchises if f["name"] == "Peppa Pig"), None)

    if not peppa_franchise:
        print("✗ Peppa Pig franchise not found!")
        return

    franchise_id = peppa_franchise["id"]
    print(f"✓ Found franchise (ID: {franchise_id})")
    print()

    # Comprehensive franchise data
    franchise_data = {
        "description": "British preschool animated television series about Peppa Pig and her family and friends",
        "extra_data": {
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
                {
                    "name": "Peppa Pig",
                    "role": "Protagonist",
                    "description": "4-year-old pig who loves jumping in muddy puddles"
                },
                {
                    "name": "George Pig",
                    "role": "Peppa's younger brother",
                    "description": "2-year-old pig who loves dinosaurs"
                },
                {
                    "name": "Mummy Pig",
                    "role": "Mother",
                    "description": "Works from home on her computer"
                },
                {
                    "name": "Daddy Pig",
                    "role": "Father",
                    "description": "Loves reading newspapers and is a bit clumsy"
                }
            ],
            "production": {
                "animation_style": "Simple 2D animation with bright colors",
                "voice_direction": "Child voice actors for child characters, adults for adult characters",
                "episode_structure": "5-minute standalone episodes with consistent formula",
                "sound_design": "Simple sound effects, narrator voiceovers, character snorts",
                "music": "Original theme song and incidental music"
            },
            "brand_values": {
                "core_values": [
                    "Family togetherness",
                    "Kindness and friendship",
                    "Learning through play",
                    "Positive role models",
                    "Age-appropriate content",
                    "Gentle humor"
                ],
                "educational_goals": [
                    "Social skills development",
                    "Emotional intelligence",
                    "Basic problem-solving",
                    "Family dynamics understanding",
                    "Everyday life preparation"
                ],
                "safety_standards": {
                    "content_rating": "G (General Audiences)",
                    "violence": "None - strictly no violence",
                    "scary_content": "None - designed to be comforting",
                    "language": "Simple, age-appropriate vocabulary only",
                    "themes": "Positive, educational, family-friendly"
                }
            },
            "global_reach": {
                "broadcast_territories": "180+ countries",
                "languages": "40+ languages dubbed",
                "key_markets": [
                    "United Kingdom (origin)",
                    "United States",
                    "China",
                    "Australia",
                    "Italy",
                    "France",
                    "Spain",
                    "Latin America"
                ],
                "cultural_adaptations": "Minimal - show maintains British identity globally"
            },
            "merchandise": {
                "categories": [
                    "Toys and plush",
                    "Books and publishing",
                    "Apparel and accessories",
                    "Home goods",
                    "Party supplies",
                    "Digital games and apps",
                    "Theme park attractions"
                ],
                "licensing_strategy": "Extensive global licensing program managed by Hasbro",
                "retail_presence": "Major retailers worldwide"
            },
            "awards_recognition": {
                "awards": [
                    "British Academy Children's Awards",
                    "International Emmy Kids Awards",
                    "Kidscreen Awards",
                    "Multiple Annie Award nominations"
                ],
                "industry_recognition": "One of the most successful preschool properties globally",
                "commercial_success": "Multi-billion dollar franchise"
            },
            "voice_guidelines": {
                "general_principles": [
                    "Characters speak with British accents",
                    "Simple, clear pronunciation",
                    "Age-appropriate vocabulary for each character",
                    "Emotional authenticity",
                    "No shouting or aggressive tones"
                ],
                "character_voices": {
                    "children": "Actual child voice actors (rotate as they age)",
                    "adults": "Adult voice actors with warm, friendly tones",
                    "signature_sounds": "Snorting for pigs, appropriate animal sounds for others"
                }
            },
            "content_guidelines": {
                "always_allowed": [
                    "Family activities",
                    "Playing games",
                    "Learning experiences",
                    "Visiting friends",
                    "Everyday routines",
                    "Gentle humor"
                ],
                "never_allowed": [
                    "Violence or fighting",
                    "Scary or threatening situations",
                    "Inappropriate language",
                    "Adult themes",
                    "Dangerous activities without safety context",
                    "Bullying or meanness"
                ],
                "special_considerations": [
                    "All conflicts resolved quickly and positively",
                    "Parents shown as loving and patient",
                    "Mistakes are learning opportunities",
                    "Diversity represented in friend characters",
                    "Gender stereotypes avoided or subverted"
                ]
            },
            "rights_information": {
                "copyright_holder": "Astley Baker Davies Ltd",
                "distribution_rights": "Entertainment One (Hasbro Entertainment)",
                "licensing_administrator": "Hasbro",
                "trademark_status": "Registered trademarks worldwide",
                "licensing_contact": "Hasbro licensing division",
                "usage_restrictions": [
                    "No alteration of character designs",
                    "No adult-oriented content",
                    "Quality standards must be maintained",
                    "Brand guidelines must be followed",
                    "Approval required for all commercial uses"
                ]
            },
            "canonical_sources": {
                "primary": "Original television episodes",
                "secondary": [
                    "Official books published by Penguin Random House",
                    "Official website content",
                    "Licensed games and apps"
                ],
                "non_canonical": [
                    "Fan fiction",
                    "Unofficial merchandise",
                    "Parody content",
                    "User-generated content"
                ],
                "style_guide": "Official Peppa Pig Brand Guidelines (Hasbro proprietary)"
            },
            "technical_specs": {
                "animation_resolution": "HD (1080p)",
                "aspect_ratio": "16:9",
                "frame_rate": "25 fps (PAL) / 30 fps (NTSC)",
                "audio_format": "Stereo",
                "file_formats": "Various (broadcast and streaming optimized)",
                "color_palette": "Bright, primary colors with high saturation"
            }
        }
    }

    # Update franchise
    print("Updating franchise data...")
    response = requests.put(
        f"{API_BASE}/characters/franchises/{franchise_id}",
        json=franchise_data,
        headers=headers
    )

    if response.status_code == 200:
        print("✓ Franchise updated successfully!")
        print()
        print("="*80)
        print("SUCCESS!")
        print("="*80)
        print()
        print("Peppa Pig franchise now includes:")
        print("  • Overview (genre, creator, production details)")
        print("  • Premise and themes")
        print("  • Main characters")
        print("  • Production information")
        print("  • Brand values and educational goals")
        print("  • Global reach (180+ countries, 40+ languages)")
        print("  • Merchandise and licensing")
        print("  • Awards and recognition")
        print("  • Voice guidelines")
        print("  • Content guidelines (allowed/not allowed)")
        print("  • Rights information")
        print("  • Canonical sources")
        print("  • Technical specifications")
        print()
        print("View at: https://eaas-mu.vercel.app/franchises")
        print("="*80)
    else:
        print(f"✗ Update failed: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    main()
