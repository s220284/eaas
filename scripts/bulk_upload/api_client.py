"""
CanonSafe API client for bulk upload operations.
"""

import logging
import time
from typing import Dict, List, Optional, Any
import requests

from config import BulkUploadConfig

logger = logging.getLogger(__name__)


class CanonSafeAPIClient:
    """Client for interacting with CanonSafe API."""

    def __init__(self, config: BulkUploadConfig):
        """
        Initialize API client.

        Args:
            config: Bulk upload configuration
        """
        self.config = config
        self.base_url = config.api_base_url
        self.session = requests.Session()
        self.token: Optional[str] = None

    def register_and_login(
        self,
        org_name: str,
        email: str,
        password: str,
        user_name: str
    ) -> Dict[str, Any]:
        """
        Register organization and login.

        Args:
            org_name: Organization name
            email: User email
            password: User password
            user_name: User display name

        Returns:
            Registration response including token
        """
        logger.info(f"Registering organization: {org_name}")

        # Generate slug from org name
        org_slug = org_name.lower().replace(' ', '-').replace('&', 'and')

        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/register",
                json={
                    "organization_name": org_name,
                    "organization_slug": org_slug,
                    "email": email,
                    "password": password,
                    "name": user_name
                },
                timeout=self.config.api_timeout
            )

            if response.status_code == 200:
                data = response.json()
                self.token = data.get('access_token')
                self.session.headers.update({
                    'Authorization': f'Bearer {self.token}'
                })
                logger.info(f"Successfully registered and logged in as {email}")
                return data
            else:
                logger.error(f"Registration failed: {response.status_code} - {response.text}")
                # Try login if already registered
                return self.login(email, password)

        except requests.RequestException as e:
            logger.error(f"Registration request failed: {e}")
            raise

    def login(self, email: str, password: str) -> Dict[str, Any]:
        """
        Login to existing account.

        Args:
            email: User email
            password: User password

        Returns:
            Login response including token
        """
        logger.info(f"Logging in as {email}")

        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/login",
                json={
                    "email": email,
                    "password": password
                },
                timeout=self.config.api_timeout
            )
            response.raise_for_status()

            data = response.json()
            self.token = data.get('access_token')
            self.session.headers.update({
                'Authorization': f'Bearer {self.token}'
            })
            logger.info(f"Successfully logged in as {email}")
            return data

        except requests.RequestException as e:
            logger.error(f"Login failed: {e}")
            raise

    def create_franchise(self, name: str, description: str = "") -> Dict[str, Any]:
        """
        Create a franchise.

        Args:
            name: Franchise name
            description: Franchise description

        Returns:
            Created franchise data
        """
        logger.info(f"Creating franchise: {name}")

        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/characters/franchises",
                json={
                    "name": name,
                    "description": description
                },
                timeout=self.config.api_timeout
            )

            if response.status_code == 200:
                data = response.json()
                logger.info(f"Successfully created franchise: {name} (ID: {data.get('id')})")
                return data
            else:
                logger.error(f"Failed to create franchise: {response.status_code} - {response.text}")
                raise Exception(f"Failed to create franchise: {response.text}")

        except requests.RequestException as e:
            logger.error(f"Create franchise request failed: {e}")
            raise

    def create_character(
        self,
        franchise_id: str,
        character_data: Dict[str, Any],
        legal_pack: Dict[str, Any],
        safety_pack: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create a character card.

        Args:
            franchise_id: Parent franchise ID
            character_data: Character canon data
            legal_pack: Legal pack data
            safety_pack: Safety pack data

        Returns:
            Created character data
        """
        name = character_data.get('name', 'Unknown')
        logger.info(f"Creating character: {name}")

        canon_pack = character_data.get('canon_pack', {})

        # Build character card payload with nested initial_version
        payload = {
            "franchise_id": franchise_id,
            "name": name,
            "slug": character_data.get('slug', name.lower().replace(' ', '-')),
            "initial_version": {
                # Canon pack
                "canon_facts": {
                    fact['fact_id']: {
                        "value": fact['value'],
                        "source": fact.get('source', ''),
                        "confidence": fact.get('confidence', 0.8)
                    }
                    for fact in canon_pack.get('facts', [])
                },
                "canon_voice": canon_pack.get('voice', {}),
                "canon_relationships": [
                    {
                        "entity": rel['character_name'],
                        "relationship": rel['relationship_type'],
                        "notes": rel.get('description', '')
                    }
                    for rel in canon_pack.get('relationships', [])
                ],

                # Legal pack
                "legal_rights": legal_pack.get('rights_holder', {}),
                "legal_performer_consent": legal_pack.get('performer_consent', {}),

                # Safety pack
                "safety_content_rating": safety_pack.get('content_rating', 'G'),
                "safety_prohibited_topics": [
                    topic.get('topic') if isinstance(topic, dict) else topic
                    for topic in safety_pack.get('prohibited_topics', [])
                ],
                "safety_required_disclosures": safety_pack.get('required_disclosures', []),
                "safety_age_gating": safety_pack.get('age_gating', {}),
                "change_summary": "Initial version"
            }
        }

        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/characters/",
                json=payload,
                timeout=self.config.api_timeout
            )

            if response.status_code == 200:
                data = response.json()
                logger.info(f"Successfully created character: {name} (ID: {data.get('id')})")
                return data
            else:
                logger.error(f"Failed to create character {name}: {response.status_code} - {response.text}")
                raise Exception(f"Failed to create character: {response.text}")

        except requests.RequestException as e:
            logger.error(f"Create character request failed for {name}: {e}")
            raise

    def create_test_suite(
        self,
        character_id: str,
        suite_name: str,
        test_cases: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Create a test suite for a character.

        Args:
            character_id: Character ID
            suite_name: Test suite name
            test_cases: List of test case dictionaries

        Returns:
            Created test suite data
        """
        logger.info(f"Creating test suite '{suite_name}' with {len(test_cases)} test cases")

        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/evaluations/test-suites",
                json={
                    "character_card_id": character_id,
                    "name": suite_name,
                    "description": f"Automated test suite for {suite_name}"
                },
                timeout=self.config.api_timeout
            )

            if response.status_code == 200:
                suite_data = response.json()
                suite_id = suite_data.get('id')

                # Create test cases
                for test_case in test_cases:
                    self._create_test_case(suite_id, test_case)

                logger.info(f"Successfully created test suite: {suite_name}")
                return suite_data
            else:
                logger.error(f"Failed to create test suite: {response.status_code} - {response.text}")
                return {}

        except requests.RequestException as e:
            logger.error(f"Create test suite request failed: {e}")
            return {}

    def _create_test_case(self, suite_id: str, test_case: Dict[str, Any]) -> Dict[str, Any]:
        """Create a single test case."""
        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/evaluations/test-suites/{suite_id}/test-cases",
                json=test_case,
                timeout=self.config.api_timeout
            )

            if response.status_code == 200:
                return response.json()
            else:
                logger.warning(f"Failed to create test case: {response.status_code}")
                return {}

        except requests.RequestException as e:
            logger.warning(f"Create test case request failed: {e}")
            return {}

    def get_characters(self, franchise_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get list of characters.

        Args:
            franchise_id: Optional franchise ID to filter by

        Returns:
            List of character data dictionaries
        """
        try:
            params = {}
            if franchise_id:
                params['franchise_id'] = franchise_id

            response = self.session.get(
                f"{self.base_url}/api/v1/characters/",
                params=params,
                timeout=self.config.api_timeout
            )
            response.raise_for_status()

            data = response.json()
            # Handle both list and paginated response
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and 'items' in data:
                return data['items']
            else:
                return []

        except requests.RequestException as e:
            logger.error(f"Get characters request failed: {e}")
            return []

    def health_check(self) -> bool:
        """
        Check if API is accessible.

        Returns:
            True if API is healthy, False otherwise
        """
        try:
            response = self.session.get(
                f"{self.base_url}/health",
                timeout=5
            )
            return response.status_code == 200

        except requests.RequestException:
            return False
