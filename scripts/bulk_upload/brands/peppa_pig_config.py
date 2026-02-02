"""
Peppa Pig brand-specific configuration for bulk upload.
"""

from typing import Dict, Any


# Organization and franchise details
ORGANIZATION_NAME = "Hasbro"
FRANCHISE_NAME = "Peppa Pig"
FRANCHISE_DESCRIPTION = "Peppa Pig is a British preschool animated television series featuring Peppa, an anthropomorphic pig, and her family and friends."

# Demo account credentials
DEMO_EMAIL = "peppapig@demo.canonsafe.com"
DEMO_PASSWORD = "Peppa"
DEMO_USER_NAME = "Peppa Pig"

# Data sources
CHARACTER_LIST_FILE = "../peppa_characters_raw.json"

# Legal pack configuration (Hasbro/Entertainment One)
LEGAL_PACK = {
    "rights_holder": {
        "name": "Entertainment One / Hasbro",
        "territories": ["Worldwide"]
    },
    "performer_consent": {
        "type": "AI_VOICE_REFERENCE",
        "performer_name": "Various voice actors",
        "scope": "Character portrayal for educational and entertainment purposes",
        "restrictions": [
            "No impersonation of voice actors",
            "AI disclosure required",
            "Must maintain character integrity",
            "No adult or inappropriate content"
        ]
    },
    "usage_restrictions": {
        "commercial_use": False,
        "attribution_required": True,
        "derivative_works": False
    }
}

# Safety pack configuration (G-rated preschool content)
SAFETY_PACK = {
    "content_rating": "G",  # Also: TV-Y
    "prohibited_topics": [
        {"topic": "violence", "severity": "strict", "rationale": "Preschool audience - no violent content"},
        {"topic": "weapons", "severity": "strict", "rationale": "Not age-appropriate for preschoolers"},
        {"topic": "scary_content", "severity": "strict", "rationale": "May frighten young children"},
        {"topic": "adult_themes", "severity": "strict", "rationale": "Preschool content only"},
        {"topic": "sexual_content", "severity": "strict", "rationale": "Not age-appropriate"},
        {"topic": "drugs_alcohol", "severity": "strict", "rationale": "Not age-appropriate"},
        {"topic": "profanity", "severity": "strict", "rationale": "Family-friendly content"},
        {"topic": "bullying", "severity": "strict", "rationale": "Promotes positive relationships"},
        {"topic": "dangerous_activities", "severity": "strict", "rationale": "Safety concern for young audience"},
        {"topic": "death_dying", "severity": "moderate", "rationale": "Handle very sensitively if needed"},
        {"topic": "politics", "severity": "moderate", "rationale": "Keep content neutral and age-appropriate"},
        {"topic": "religion", "severity": "moderate", "rationale": "Keep content neutral and inclusive"},
        {"topic": "medical_advice", "severity": "strict", "rationale": "Not qualified to provide"},
        {"topic": "stranger_danger", "severity": "moderate", "rationale": "Handle sensitively if safety education needed"},
        {"topic": "competition_winning_losing", "severity": "flexible", "rationale": "Show good sportsmanship"},
        {"topic": "body_image", "severity": "moderate", "rationale": "Promote positive self-image"},
        {"topic": "separation_anxiety", "severity": "moderate", "rationale": "Handle with care"},
        {"topic": "nightmares_fears", "severity": "moderate", "rationale": "Provide reassurance, not fear"},
    ],
    "required_disclosures": [
        "This is an AI-generated character experience",
        "Always watch Peppa Pig with adult supervision"
    ],
    "age_gating": {
        "enabled": False,  # Available to all, but intended for ages 2-5
        "minimum_age": 0,
        "recommended_age": "2-5 years"
    }
}

# Character extraction rules
EXTRACTION_RULES = {
    # Species mapping from wiki sections
    "species_mapping": {
        "Pigs": "pig",
        "Rabbits": "rabbit",
        "Sheep": "sheep",
        "Cats": "cat",
        "Dogs": "dog",
        "Horses": "pony",
        "Zebras": "zebra",
        "Elephants": "elephant",
        "Donkeys": "donkey",
        "Foxes": "fox",
        "Kangaroos": "kangaroo",
        "Wolves": "wolf",
        "Cattle": "cow",
        "Rhinoceroses": "rhinoceros",
        "Goats": "goat",
        "Bears": "bear",
        "Giraffes": "giraffe",
        "Moles": "mole",
        "Lions": "lion",
        "Pandas": "panda",
        "Mice": "mouse",
        "Polar Bears": "polar bear",
        "Llamas": "llama",
        "Squirrels": "squirrel",
        "Gazelles": "gazelle",
        "Hamsters": "hamster",
        "Badgers": "badger",
    },

    # Age group patterns
    "age_group_patterns": {
        "baby": ["baby", "alexander", "rosie", "robbie"],
        "elder": ["granny", "grandpa", "granddad", "grampy"],
        "adult": ["mummy", "daddy", "mr", "mrs", "miss", "madame", "monsieur", "doctor", "captain"],
    },

    # Role patterns
    "role_patterns": {
        "main": ["peppa", "george", "mummy pig", "daddy pig"],
        "supporting": ["suzy sheep", "rebecca rabbit", "danny dog", "pedro pony", "emily elephant"],
    },

    # Relationship patterns
    "relationship_patterns": {
        "parent": ["mummy", "daddy", "mother", "father"],
        "grandparent": ["granny", "grandpa", "granddad", "grampy"],
        "sibling": ["brother", "sister"],
        "extended_family": ["uncle", "auntie", "aunt", "cousin"],
    }
}

# Batch processing settings
BATCH_SIZE = 20  # Process 20 characters at a time
PRIORITY_CHARACTERS = [
    # Process these first for demo
    "Peppa Pig",
    "George Pig",
    "Mummy Pig",
    "Daddy Pig",
    "Granny Pig",
    "Grandpa Pig",
    "Suzy Sheep",
    "Rebecca Rabbit",
    "Danny Dog",
    "Pedro Pony",
    "Emily Elephant",
    "Candy Cat",
    "Zoë Zebra",
    "Freddy Fox",
    "Delphine Donkey",
]
