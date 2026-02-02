#!/usr/bin/env python3
"""
Main bulk upload orchestrator for CanonSafe.

Usage:
    python bulk_uploader.py --brand peppa_pig --env local
    python bulk_uploader.py --brand peppa_pig --env production --dry-run
"""

import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Dict, List, Any
import time
from datetime import datetime

from config import get_config, DEFAULT_LEGAL_PACK, DEFAULT_SAFETY_PACK
from data_extractor import DataExtractor
from data_validator import DataValidator
from api_client import CanonSafeAPIClient
from test_generator import TestGenerator

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bulk_upload.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class BulkUploader:
    """Main orchestrator for bulk character uploads."""

    def __init__(self, brand_config: Any, env: str, dry_run: bool = False):
        """
        Initialize bulk uploader.

        Args:
            brand_config: Brand-specific configuration module
            env: Environment (local/production)
            dry_run: If True, don't make actual API calls
        """
        self.brand_config = brand_config
        self.config = get_config(env)
        self.dry_run = dry_run

        self.extractor = DataExtractor(self.config)
        self.validator = DataValidator(self.config)
        self.api_client = CanonSafeAPIClient(self.config) if not dry_run else None
        self.test_generator = TestGenerator(self.config)

        self.stats = {
            'total_characters': 0,
            'characters_processed': 0,
            'characters_created': 0,
            'characters_failed': 0,
            'test_suites_created': 0,
            'start_time': None,
            'end_time': None
        }

    def run(self) -> Dict[str, Any]:
        """
        Run the complete bulk upload process.

        Returns:
            Statistics and results dictionary
        """
        logger.info("="*80)
        logger.info(f"Starting Bulk Upload for {self.brand_config.FRANCHISE_NAME}")
        logger.info(f"Environment: {self.config.api_base_url}")
        logger.info(f"Dry Run: {self.dry_run}")
        logger.info("="*80)

        self.stats['start_time'] = datetime.now()

        try:
            # Step 1: Load character list
            characters = self._load_character_list()
            self.stats['total_characters'] = len(characters)

            logger.info(f"Loaded {len(characters)} characters")

            # Step 2: Register/Login
            if not self.dry_run:
                self._register_and_login()

            # Step 3: Create franchise
            franchise_id = None
            if not self.dry_run:
                franchise_id = self._create_franchise()

            # Step 4: Extract and process characters
            all_character_data = []

            # Prioritize main characters
            priority_chars = set(self.brand_config.PRIORITY_CHARACTERS)
            priority_list = [c for c in characters if c['name'] in priority_chars]
            remaining_list = [c for c in characters if c['name'] not in priority_chars]

            ordered_characters = priority_list + remaining_list

            logger.info(f"Processing {len(priority_list)} priority characters first")

            for i, character in enumerate(ordered_characters, 1):
                logger.info(f"\nProcessing character {i}/{len(ordered_characters)}: {character['name']}")

                try:
                    # Extract data
                    species = self._map_species(character.get('section', ''))
                    char_data = self.extractor.extract_character_data(
                        character['name'],
                        character['url'],
                        species
                    )

                    # Validate data
                    is_valid, issues = self.validator.validate_character(char_data)

                    if issues:
                        logger.warning(f"Validation issues for {character['name']}:")
                        for issue in issues:
                            logger.warning(f"  [{issue.severity}] {issue.field}: {issue.message}")

                    # Calculate quality score
                    quality_score = self.validator.calculate_data_quality_score(char_data)
                    logger.info(f"Quality score: {quality_score['overall_score']}/100")

                    all_character_data.append(char_data)

                    # Create character via API
                    if not self.dry_run and is_valid:
                        character_id = self._create_character(franchise_id, char_data)

                        if character_id:
                            self.stats['characters_created'] += 1

                            # Generate and create test suite
                            self._create_test_suite(character_id, char_data)

                    self.stats['characters_processed'] += 1

                except Exception as e:
                    logger.error(f"Failed to process {character['name']}: {e}")
                    self.stats['characters_failed'] += 1

                # Rate limiting
                if not self.dry_run:
                    time.sleep(0.5)

            # Step 5: Generate data quality report
            quality_report = self.validator.generate_data_quality_report(all_character_data)

            # Step 6: Save results
            self._save_results(all_character_data, quality_report)

            self.stats['end_time'] = datetime.now()
            duration = (self.stats['end_time'] - self.stats['start_time']).total_seconds()

            logger.info("\n" + "="*80)
            logger.info("BULK UPLOAD COMPLETE")
            logger.info("="*80)
            logger.info(f"Total characters: {self.stats['total_characters']}")
            logger.info(f"Characters processed: {self.stats['characters_processed']}")
            logger.info(f"Characters created: {self.stats['characters_created']}")
            logger.info(f"Characters failed: {self.stats['characters_failed']}")
            logger.info(f"Test suites created: {self.stats['test_suites_created']}")
            logger.info(f"Duration: {duration:.2f} seconds")
            logger.info(f"Average quality score: {quality_report['summary']['average_quality_score']}/100")
            logger.info("="*80)

            return {
                'stats': self.stats,
                'quality_report': quality_report
            }

        except Exception as e:
            logger.error(f"Bulk upload failed: {e}", exc_info=True)
            raise

    def _load_character_list(self) -> List[Dict[str, Any]]:
        """Load character list from file."""
        char_file = Path(__file__).parent / self.brand_config.CHARACTER_LIST_FILE

        if not char_file.exists():
            raise FileNotFoundError(f"Character list file not found: {char_file}")

        with open(char_file, 'r') as f:
            characters = json.load(f)

        return characters

    def _register_and_login(self):
        """Register organization and login."""
        logger.info(f"Registering/logging in as {self.brand_config.DEMO_EMAIL}")

        try:
            self.api_client.register_and_login(
                org_name=self.brand_config.ORGANIZATION_NAME,
                email=self.brand_config.DEMO_EMAIL,
                password=self.brand_config.DEMO_PASSWORD,
                user_name=self.brand_config.DEMO_USER_NAME
            )
        except Exception as e:
            logger.warning(f"Registration failed, trying login: {e}")
            self.api_client.login(
                email=self.brand_config.DEMO_EMAIL,
                password=self.brand_config.DEMO_PASSWORD
            )

    def _create_franchise(self) -> str:
        """Create franchise and return ID."""
        logger.info(f"Creating franchise: {self.brand_config.FRANCHISE_NAME}")

        franchise = self.api_client.create_franchise(
            name=self.brand_config.FRANCHISE_NAME,
            description=self.brand_config.FRANCHISE_DESCRIPTION
        )

        return franchise.get('id')

    def _create_character(self, franchise_id: str, character_data: Dict[str, Any]) -> str:
        """Create character and return ID."""
        logger.info(f"Creating character: {character_data['name']}")

        try:
            character = self.api_client.create_character(
                franchise_id=franchise_id,
                character_data=character_data,
                legal_pack=self.brand_config.LEGAL_PACK,
                safety_pack=self.brand_config.SAFETY_PACK
            )

            return character.get('id')

        except Exception as e:
            logger.error(f"Failed to create character {character_data['name']}: {e}")
            return None

    def _create_test_suite(self, character_id: str, character_data: Dict[str, Any]):
        """Generate and create test suite for character."""
        character_name = character_data.get('name')
        logger.info(f"Generating test suite for {character_name}")

        try:
            # Generate test cases
            test_cases = self.test_generator.generate_test_suite(character_data)

            # Create test suite via API
            if test_cases:
                self.api_client.create_test_suite(
                    character_id=character_id,
                    suite_name=f"{character_name} Test Suite",
                    test_cases=test_cases
                )
                self.stats['test_suites_created'] += 1

        except Exception as e:
            logger.error(f"Failed to create test suite for {character_name}: {e}")

    def _map_species(self, section: str) -> str:
        """Map wiki section to species."""
        for section_name, species in self.brand_config.EXTRACTION_RULES['species_mapping'].items():
            if section_name in section:
                return species
        return "unknown"

    def _save_results(self, character_data: List[Dict], quality_report: Dict):
        """Save results to files."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_dir = Path(__file__).parent / "output"
        output_dir.mkdir(exist_ok=True)

        # Save character data
        char_file = output_dir / f"characters_{timestamp}.json"
        with open(char_file, 'w') as f:
            json.dump(character_data, f, indent=2)
        logger.info(f"Saved character data to {char_file}")

        # Save quality report
        report_file = output_dir / f"quality_report_{timestamp}.json"
        with open(report_file, 'w') as f:
            json.dump(quality_report, f, indent=2, default=str)
        logger.info(f"Saved quality report to {report_file}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Bulk upload characters to CanonSafe')
    parser.add_argument('--brand', required=True, help='Brand config name (e.g., peppa_pig)')
    parser.add_argument('--env', default='local', choices=['local', 'production'], help='Environment')
    parser.add_argument('--dry-run', action='store_true', help='Run without API calls')
    parser.add_argument('--limit', type=int, help='Limit number of characters to process')

    args = parser.parse_args()

    # Import brand config
    try:
        brand_module = __import__(f'brands.{args.brand}_config', fromlist=[''])
    except ImportError:
        logger.error(f"Brand config not found: {args.brand}")
        sys.exit(1)

    # Run bulk upload
    uploader = BulkUploader(brand_module, args.env, args.dry_run)
    results = uploader.run()

    logger.info("Bulk upload process completed successfully!")


if __name__ == '__main__':
    main()
