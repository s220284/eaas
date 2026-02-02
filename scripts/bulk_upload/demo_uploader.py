#!/usr/bin/env python3
"""
Simplified demo uploader using curated data.
Creates Hasbro organization with Peppa Pig characters.
"""

import json
import logging
import sys
from pathlib import Path

from config import get_config
from api_client import CanonSafeAPIClient
from test_generator import TestGenerator
from brands import peppa_pig_config

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Run demo upload."""
    logger.info("="*80)
    logger.info("Peppa Pig Demo Upload - Creating Hasbro Organization")
    logger.info("="*80)

    # Load configuration
    config = get_config('local')
    api_client = CanonSafeAPIClient(config)
    test_generator = TestGenerator(config)

    # Load curated data
    data_file = Path(__file__).parent / 'brands/peppa_pig_curated_data.json'
    with open(data_file) as f:
        characters_data = json.load(f)

    logger.info(f"Loaded {len(characters_data)} curated characters")

    # Register/Login
    logger.info(f"Registering organization: {peppa_pig_config.ORGANIZATION_NAME}")
    try:
        api_client.register_and_login(
            org_name=peppa_pig_config.ORGANIZATION_NAME,
            email=peppa_pig_config.DEMO_EMAIL,
            password=peppa_pig_config.DEMO_PASSWORD,
            user_name=peppa_pig_config.DEMO_USER_NAME
        )
        logger.info("✓ Successfully registered and logged in")
    except Exception as e:
        logger.info(f"Registration failed (may already exist), trying login: {e}")
        try:
            api_client.login(
                email=peppa_pig_config.DEMO_EMAIL,
                password=peppa_pig_config.DEMO_PASSWORD
            )
            logger.info("✓ Successfully logged in")
        except Exception as e2:
            logger.error(f"Login failed: {e2}")
            sys.exit(1)

    # Create franchise
    logger.info(f"Creating franchise: {peppa_pig_config.FRANCHISE_NAME}")
    franchise = api_client.create_franchise(
        name=peppa_pig_config.FRANCHISE_NAME,
        description=peppa_pig_config.FRANCHISE_DESCRIPTION
    )
    franchise_id = franchise.get('id')
    logger.info(f"✓ Created franchise (ID: {franchise_id})")

    # Create characters
    characters_created = 0
    test_suites_created = 0

    for char_data in characters_data:
        char_name = char_data.get('name')
        logger.info(f"\n{'='*60}")
        logger.info(f"Creating character: {char_name}")

        try:
            # Create character
            character = api_client.create_character(
                franchise_id=franchise_id,
                character_data=char_data,
                legal_pack=peppa_pig_config.LEGAL_PACK,
                safety_pack=peppa_pig_config.SAFETY_PACK
            )

            if character:
                character_id = character.get('id')
                logger.info(f"✓ Created character: {char_name} (ID: {character_id})")
                characters_created += 1

                # Generate and create test suite
                logger.info(f"  Generating test cases...")
                test_cases = test_generator.generate_test_suite(char_data)
                logger.info(f"  Generated {len(test_cases)} test cases")

                suite = api_client.create_test_suite(
                    character_id=character_id,
                    suite_name=f"{char_name} Test Suite",
                    test_cases=test_cases
                )

                if suite:
                    logger.info(f"✓ Created test suite")
                    test_suites_created += 1

        except Exception as e:
            logger.error(f"✗ Failed to create character {char_name}: {e}")

    # Summary
    logger.info("\n" + "="*80)
    logger.info("DEMO UPLOAD COMPLETE")
    logger.info("="*80)
    logger.info(f"Organization: {peppa_pig_config.ORGANIZATION_NAME}")
    logger.info(f"Franchise: {peppa_pig_config.FRANCHISE_NAME}")
    logger.info(f"Characters created: {characters_created}/{len(characters_data)}")
    logger.info(f"Test suites created: {test_suites_created}")
    logger.info("")
    logger.info("Demo Account Credentials:")
    logger.info(f"  Username: {peppa_pig_config.DEMO_EMAIL}")
    logger.info(f"  Password: {peppa_pig_config.DEMO_PASSWORD}")
    logger.info("="*80)


if __name__ == '__main__':
    main()
