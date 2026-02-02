"""
Data extraction module for scraping character information from various sources.
"""

import re
import time
import logging
from typing import Dict, List, Optional, Any
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

from config import BulkUploadConfig, CONFIDENCE_SCORES

logger = logging.getLogger(__name__)


class DataExtractor:
    """Extract character data from web sources."""

    def __init__(self, config: BulkUploadConfig):
        """
        Initialize data extractor.

        Args:
            config: Bulk upload configuration
        """
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'CanonSafe-BulkUpload/1.0 (Educational Purpose)'
        })

    def extract_character_data(
        self,
        character_name: str,
        character_url: str,
        species: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Extract comprehensive character data from wiki page.

        Args:
            character_name: Name of the character
            character_url: URL to character wiki page
            species: Species/type of character

        Returns:
            Structured character data dictionary
        """
        logger.info(f"Extracting data for {character_name} from {character_url}")

        try:
            # Fetch page content
            html = self._fetch_url(character_url)
            if not html:
                return self._create_minimal_character(character_name, species)

            soup = BeautifulSoup(html, 'html.parser')

            # Extract data from different sections
            facts = self._extract_facts(soup, character_url)
            voice_profile = self._extract_voice_profile(soup)
            relationships = self._extract_relationships(soup, character_name)

            # Build character data structure
            character_data = {
                "name": character_name,
                "slug": self._generate_slug(character_name),
                "species": species or self._extract_species(soup),
                "age_group": self._infer_age_group(character_name, facts),
                "role": self._infer_role(character_name),
                "source_url": character_url,
                "canon_pack": {
                    "facts": facts,
                    "voice": voice_profile,
                    "relationships": relationships
                }
            }

            logger.info(f"Successfully extracted {len(facts)} facts for {character_name}")
            return character_data

        except Exception as e:
            logger.error(f"Error extracting data for {character_name}: {e}")
            return self._create_minimal_character(character_name, species)

    def _fetch_url(self, url: str, retries: int = 0) -> Optional[str]:
        """
        Fetch URL content with retry logic.

        Args:
            url: URL to fetch
            retries: Current retry attempt

        Returns:
            HTML content or None if failed
        """
        try:
            time.sleep(self.config.scrape_delay)
            response = self.session.get(url, timeout=self.config.api_timeout)
            response.raise_for_status()
            return response.text

        except requests.RequestException as e:
            if retries < self.config.max_retries:
                logger.warning(f"Fetch failed, retrying ({retries + 1}/{self.config.max_retries}): {e}")
                time.sleep(self.config.retry_delay)
                return self._fetch_url(url, retries + 1)
            else:
                logger.error(f"Failed to fetch {url} after {self.config.max_retries} retries: {e}")
                return None

    def _extract_facts(self, soup: BeautifulSoup, source_url: str) -> List[Dict[str, Any]]:
        """Extract character facts from wiki page."""
        facts = []

        # Extract from infobox
        infobox = soup.find('aside', class_='portable-infobox')
        if infobox:
            for row in infobox.find_all('div', class_='pi-item'):
                label_elem = row.find('h3', class_='pi-data-label')
                value_elem = row.find('div', class_='pi-data-value')

                if label_elem and value_elem:
                    label = label_elem.get_text(strip=True).lower().replace(' ', '_')
                    value = value_elem.get_text(strip=True)

                    if value:
                        facts.append({
                            "fact_id": label,
                            "value": value,
                            "source": source_url,
                            "confidence": CONFIDENCE_SCORES["licensed_wiki"]
                        })

        # Extract from content sections
        content = soup.find('div', class_='mw-parser-output')
        if content:
            # Look for personality section
            for heading in content.find_all(['h2', 'h3']):
                heading_text = heading.get_text(strip=True).lower()

                if 'personality' in heading_text or 'character' in heading_text:
                    # Get next paragraph
                    next_elem = heading.find_next_sibling()
                    while next_elem and next_elem.name == 'p':
                        text = next_elem.get_text(strip=True)
                        if text:
                            facts.append({
                                "fact_id": "personality_description",
                                "value": text,
                                "source": source_url,
                                "confidence": CONFIDENCE_SCORES["licensed_wiki"]
                            })
                        next_elem = next_elem.find_next_sibling('p')
                        break  # Take first paragraph

                if 'appearance' in heading_text or 'physical' in heading_text:
                    next_elem = heading.find_next_sibling('p')
                    if next_elem:
                        text = next_elem.get_text(strip=True)
                        if text:
                            facts.append({
                                "fact_id": "appearance_description",
                                "value": text,
                                "source": source_url,
                                "confidence": CONFIDENCE_SCORES["licensed_wiki"]
                            })

        return facts

    def _extract_voice_profile(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract voice and personality profile."""
        personality_traits = []
        catchphrases = []

        # Look for personality traits in content
        content = soup.find('div', class_='mw-parser-output')
        if content:
            # Extract adjectives and personality descriptions
            text = content.get_text()

            # Common personality trait patterns
            trait_patterns = [
                r'\bis\s+(very\s+)?(\w+)\s+and\s+(\w+)',
                r'\bappears?\s+(to\s+be\s+)?(\w+)',
                r'\bknown\s+for\s+being\s+(\w+)',
            ]

            for pattern in trait_patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    for group in match.groups():
                        if group and len(group) > 3 and group.isalpha():
                            trait = group.lower()
                            if trait not in ['very', 'appears', 'known', 'being']:
                                personality_traits.append(trait)

        # Look for quotes section
        for heading in soup.find_all(['h2', 'h3']):
            if 'quote' in heading.get_text(strip=True).lower():
                # Get list items after heading
                next_elem = heading.find_next_sibling()
                while next_elem and next_elem.name in ['ul', 'ol']:
                    for li in next_elem.find_all('li'):
                        quote = li.get_text(strip=True)
                        if quote:
                            catchphrases.append({
                                "phrase": quote,
                                "frequency": "sometimes"
                            })
                    next_elem = next_elem.find_next_sibling()

        # Remove duplicates from personality traits
        personality_traits = list(set(personality_traits))[:10]

        return {
            "personality_traits": personality_traits if personality_traits else ["friendly", "cheerful"],
            "tone": "age-appropriate and friendly",
            "speech_style": "simple, clear language",
            "vocabulary_level": "simple",
            "catchphrases": catchphrases[:10] if catchphrases else [],
            "emotional_range": "Expresses joy, curiosity, and occasional frustration"
        }

    def _extract_relationships(self, soup: BeautifulSoup, character_name: str) -> List[Dict[str, Any]]:
        """Extract character relationships."""
        relationships = []

        # Look for family section
        content = soup.find('div', class_='mw-parser-output')
        if content:
            for heading in content.find_all(['h2', 'h3']):
                heading_text = heading.get_text(strip=True).lower()

                if 'family' in heading_text or 'relationship' in heading_text or 'friends' in heading_text:
                    # Get list after heading
                    next_elem = heading.find_next_sibling()
                    while next_elem and next_elem.name in ['ul', 'ol']:
                        for li in next_elem.find_all('li'):
                            text = li.get_text(strip=True)
                            # Extract character names (links)
                            for link in li.find_all('a'):
                                rel_name = link.get_text(strip=True)
                                if rel_name and rel_name != character_name:
                                    rel_type = self._infer_relationship_type(text, heading_text)
                                    relationships.append({
                                        "character_name": rel_name,
                                        "relationship_type": rel_type,
                                        "description": text[:100]  # Truncate long descriptions
                                    })
                        next_elem = next_elem.find_next_sibling()

        return relationships[:20]  # Limit to 20 relationships

    def _extract_species(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract species from infobox or content."""
        infobox = soup.find('aside', class_='portable-infobox')
        if infobox:
            for row in infobox.find_all('div', class_='pi-item'):
                label_elem = row.find('h3', class_='pi-data-label')
                if label_elem and 'species' in label_elem.get_text(strip=True).lower():
                    value_elem = row.find('div', class_='pi-data-value')
                    if value_elem:
                        return value_elem.get_text(strip=True).lower()
        return None

    def _infer_age_group(self, name: str, facts: List[Dict]) -> str:
        """Infer age group from name and facts."""
        name_lower = name.lower()

        if 'baby' in name_lower or 'alexander' in name_lower:
            return 'baby'
        elif 'granny' in name_lower or 'grandpa' in name_lower or 'granddad' in name_lower:
            return 'elder'
        elif 'mummy' in name_lower or 'daddy' in name_lower or 'mr' in name_lower or 'mrs' in name_lower:
            return 'adult'
        else:
            # Check facts for age
            for fact in facts:
                if 'age' in fact['fact_id']:
                    age_str = fact['value'].lower()
                    if 'year' in age_str:
                        # Extract number
                        match = re.search(r'(\d+)', age_str)
                        if match:
                            age = int(match.group(1))
                            if age < 3:
                                return 'baby'
                            elif age < 13:
                                return 'child'
                            elif age < 18:
                                return 'teen'
                            else:
                                return 'adult'

            # Default to child for main characters
            return 'child'

    def _infer_role(self, name: str) -> str:
        """Infer character role from name."""
        # Main characters (Peppa Pig universe)
        main_characters = ['peppa', 'george', 'mummy pig', 'daddy pig']

        if any(main in name.lower() for main in main_characters):
            return 'main'
        elif 'mr' in name.lower() or 'mrs' in name.lower() or 'miss' in name.lower():
            return 'supporting'
        else:
            return 'recurring'

    def _infer_relationship_type(self, text: str, heading: str) -> str:
        """Infer relationship type from context."""
        text_lower = text.lower()
        heading_lower = heading.lower()

        if 'family' in heading_lower:
            if 'mother' in text_lower or 'mum' in text_lower or 'mummy' in text_lower:
                return 'parent'
            elif 'father' in text_lower or 'dad' in text_lower or 'daddy' in text_lower:
                return 'parent'
            elif 'brother' in text_lower or 'sister' in text_lower:
                return 'sibling'
            elif 'granny' in text_lower or 'grandpa' in text_lower:
                return 'grandparent'
            elif 'uncle' in text_lower or 'auntie' in text_lower or 'aunt' in text_lower:
                return 'extended_family'
            else:
                return 'family'
        elif 'friend' in heading_lower:
            return 'friend'
        else:
            return 'acquaintance'

    def _generate_slug(self, name: str) -> str:
        """Generate URL-friendly slug from name."""
        # Convert to lowercase, replace spaces with hyphens
        slug = name.lower()
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        slug = re.sub(r'\s+', '-', slug)
        return slug

    def _create_minimal_character(self, name: str, species: Optional[str]) -> Dict[str, Any]:
        """Create minimal character data when extraction fails."""
        return {
            "name": name,
            "slug": self._generate_slug(name),
            "species": species or "unknown",
            "age_group": "unknown",
            "role": "recurring",
            "canon_pack": {
                "facts": [
                    {
                        "fact_id": "name",
                        "value": name,
                        "source": "character_list",
                        "confidence": 1.0
                    }
                ],
                "voice": {
                    "personality_traits": ["friendly"],
                    "tone": "age-appropriate",
                    "speech_style": "simple language",
                    "vocabulary_level": "simple",
                    "catchphrases": [],
                    "emotional_range": "Varied"
                },
                "relationships": []
            }
        }
