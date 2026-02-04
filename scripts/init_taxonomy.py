"""
Initialize default taxonomy for all organizations.

Run this script to populate the taxonomy tables with default categories and tags.
"""

import sys
sys.path.insert(0, '/Users/shellypalmer/s220284/EaaS')

from src.database import SessionLocal
from src.models import Organization, TaxonomyCategory, TaxonomyTag

# Default taxonomy structure
DEFAULT_TAXONOMY = {
    "prohibited_content": {
        "name": "Prohibited Content",
        "description": "Content types that characters must avoid",
        "icon": "🚫",
        "color": "red",
        "display_order": 1,
        "tags": [
            {"name": "violence", "description": "Physical harm, fighting, weapons", "severity": "high"},
            {"name": "adult_themes", "description": "Sexual content, mature themes", "severity": "high"},
            {"name": "profanity", "description": "Cursing, inappropriate language", "severity": "medium"},
            {"name": "scary_content", "description": "Horror, frightening imagery", "severity": "medium"},
            {"name": "bullying", "description": "Harassment, intimidation", "severity": "high"},
            {"name": "dangerous_activities", "description": "Unsafe behaviors, risk-taking", "severity": "high"},
            {"name": "hate_speech", "description": "Discriminatory or hateful language", "severity": "high"},
            {"name": "drugs", "description": "Drug use or references", "severity": "high"},
            {"name": "alcohol", "description": "Alcohol consumption or references", "severity": "medium"},
            {"name": "gambling", "description": "Betting or gambling content", "severity": "medium"},
        ]
    },
    "character_traits": {
        "name": "Character Traits",
        "description": "Personality and behavioral characteristics",
        "icon": "👤",
        "color": "blue",
        "display_order": 2,
        "tags": [
            {"name": "friendly", "description": "Warm, welcoming, approachable", "severity": "neutral"},
            {"name": "loyal", "description": "Faithful, devoted, trustworthy", "severity": "neutral"},
            {"name": "brave", "description": "Courageous, fearless, heroic", "severity": "neutral"},
            {"name": "funny", "description": "Humorous, comedic, entertaining", "severity": "neutral"},
            {"name": "intelligent", "description": "Smart, clever, analytical", "severity": "neutral"},
            {"name": "caring", "description": "Compassionate, empathetic, nurturing", "severity": "neutral"},
            {"name": "adventurous", "description": "Bold, daring, exploratory", "severity": "neutral"},
            {"name": "shy", "description": "Reserved, timid, introverted", "severity": "neutral"},
        ]
    },
    "content_rating": {
        "name": "Content Ratings",
        "description": "Age-appropriate content classifications",
        "icon": "🎬",
        "color": "yellow",
        "display_order": 3,
        "tags": [
            {"name": "g", "description": "G (General Audiences) - All ages admitted", "severity": "neutral"},
            {"name": "pg", "description": "PG (Parental Guidance) - Some material may not be suitable for children", "severity": "neutral"},
            {"name": "pg13", "description": "PG-13 - Parents strongly cautioned, some material may be inappropriate for children under 13", "severity": "neutral"},
            {"name": "r", "description": "R (Restricted) - Under 17 requires accompanying parent or guardian", "severity": "neutral"},
        ]
    },
    "relationship_types": {
        "name": "Relationship Types",
        "description": "Character connection classifications",
        "icon": "🔗",
        "color": "purple",
        "display_order": 4,
        "tags": [
            {"name": "family", "description": "Parent, sibling, child, relative", "severity": "neutral"},
            {"name": "friend", "description": "Friendship, companionship", "severity": "neutral"},
            {"name": "romantic", "description": "Love interest, partner", "severity": "neutral"},
            {"name": "rival", "description": "Competitor, adversary", "severity": "neutral"},
            {"name": "mentor", "description": "Teacher, guide, advisor", "severity": "neutral"},
            {"name": "enemy", "description": "Antagonist, villain", "severity": "neutral"},
        ]
    },
    "evaluation_criteria": {
        "name": "Evaluation Criteria",
        "description": "Assessment dimensions for character outputs",
        "icon": "📊",
        "color": "green",
        "display_order": 5,
        "tags": [
            {"name": "canon_accuracy", "description": "Adherence to established character facts", "severity": "neutral"},
            {"name": "voice_consistency", "description": "Speech patterns and personality alignment", "severity": "neutral"},
            {"name": "safety_compliance", "description": "Avoidance of prohibited content", "severity": "neutral"},
            {"name": "legal_compliance", "description": "Rights and consent adherence", "severity": "neutral"},
        ]
    },
    "data_quality": {
        "name": "Data Quality",
        "description": "Character data completeness indicators",
        "icon": "✅",
        "color": "indigo",
        "display_order": 6,
        "tags": [
            {"name": "complete", "description": "All required fields populated", "severity": "neutral"},
            {"name": "incomplete", "description": "Missing required information", "severity": "neutral"},
            {"name": "needs_review", "description": "Requires manual verification", "severity": "neutral"},
            {"name": "verified", "description": "Human-verified accuracy", "severity": "neutral"},
        ]
    },
}


def init_taxonomy():
    """Initialize default taxonomy for all organizations."""
    db = SessionLocal()

    try:
        # Get all organizations
        orgs = db.query(Organization).all()

        for org in orgs:
            print(f"\nInitializing taxonomy for: {org.name}")

            # Check if org already has taxonomy
            existing = db.query(TaxonomyCategory).filter(
                TaxonomyCategory.organization_id == org.id
            ).first()

            if existing:
                print(f"  ⚠️  Taxonomy already exists, skipping")
                continue

            # Create categories and tags
            for cat_key, cat_data in DEFAULT_TAXONOMY.items():
                print(f"  Creating category: {cat_data['name']}")

                category = TaxonomyCategory(
                    organization_id=org.id,
                    key=cat_key,
                    name=cat_data["name"],
                    description=cat_data["description"],
                    icon=cat_data["icon"],
                    color=cat_data["color"],
                    display_order=cat_data["display_order"],
                    system_managed=True,
                    active=True,
                )

                db.add(category)
                db.flush()  # Get the category ID

                # Create tags
                for tag_data in cat_data["tags"]:
                    tag = TaxonomyTag(
                        category_id=category.id,
                        name=tag_data["name"],
                        description=tag_data["description"],
                        severity=tag_data["severity"],
                        system_managed=True,
                        active=True,
                    )
                    db.add(tag)

                print(f"    ✓ Created {len(cat_data['tags'])} tags")

            db.commit()
            print(f"  ✅ Successfully initialized taxonomy")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("Initializing Default Taxonomy")
    print("=" * 60)
    init_taxonomy()
    print("\n✅ Done!")
