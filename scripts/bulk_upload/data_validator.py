"""
Data validation and conflict detection module.
"""

import logging
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass

from config import BulkUploadConfig

logger = logging.getLogger(__name__)


@dataclass
class ValidationIssue:
    """Represents a data validation issue."""

    severity: str  # 'error', 'warning', 'info'
    field: str
    message: str
    character_name: str
    suggested_fix: str = ""


@dataclass
class ConflictReport:
    """Represents a conflict between data sources."""

    field: str
    values: List[Dict[str, Any]]  # List of {value, source, confidence}
    character_name: str
    resolution: str = "manual_review"  # 'auto_resolved', 'manual_review'
    resolved_value: Any = None


class DataValidator:
    """Validate character data and detect conflicts."""

    def __init__(self, config: BulkUploadConfig):
        """
        Initialize data validator.

        Args:
            config: Bulk upload configuration
        """
        self.config = config
        self.issues: List[ValidationIssue] = []
        self.conflicts: List[ConflictReport] = []

    def validate_character(self, character_data: Dict[str, Any]) -> Tuple[bool, List[ValidationIssue]]:
        """
        Validate a single character's data.

        Args:
            character_data: Character data dictionary

        Returns:
            Tuple of (is_valid, issues_list)
        """
        issues = []
        character_name = character_data.get('name', 'Unknown')

        # Required fields validation
        if not character_data.get('name'):
            issues.append(ValidationIssue(
                severity='error',
                field='name',
                message='Character name is required',
                character_name=character_name
            ))

        if not character_data.get('slug'):
            issues.append(ValidationIssue(
                severity='error',
                field='slug',
                message='Character slug is required',
                character_name=character_name
            ))

        # Canon pack validation
        canon_pack = character_data.get('canon_pack', {})

        # Facts validation
        facts = canon_pack.get('facts', [])
        if len(facts) < self.config.min_facts_required:
            issues.append(ValidationIssue(
                severity='warning',
                field='canon_pack.facts',
                message=f'Only {len(facts)} facts found, minimum {self.config.min_facts_required} recommended',
                character_name=character_name,
                suggested_fix='Add more character facts from additional sources'
            ))

        # Relationships validation
        relationships = canon_pack.get('relationships', [])
        if len(relationships) < self.config.min_relationships_required:
            issues.append(ValidationIssue(
                severity='warning',
                field='canon_pack.relationships',
                message=f'Only {len(relationships)} relationships found, minimum {self.config.min_relationships_required} required',
                character_name=character_name,
                suggested_fix='Add family and friend relationships'
            ))

        # Voice profile validation
        voice = canon_pack.get('voice', {})
        if not voice.get('personality_traits'):
            issues.append(ValidationIssue(
                severity='warning',
                field='canon_pack.voice.personality_traits',
                message='No personality traits defined',
                character_name=character_name,
                suggested_fix='Extract personality traits from character description'
            ))

        # Check for duplicate facts
        fact_ids = [f.get('fact_id') for f in facts if f.get('fact_id')]
        if len(fact_ids) != len(set(fact_ids)):
            issues.append(ValidationIssue(
                severity='warning',
                field='canon_pack.facts',
                message='Duplicate fact IDs found',
                character_name=character_name,
                suggested_fix='Remove duplicate facts or merge them'
            ))

        # Determine if validation passed
        has_errors = any(issue.severity == 'error' for issue in issues)

        return (not has_errors, issues)

    def detect_conflicts(
        self,
        character_data: Dict[str, Any],
        additional_sources: List[Dict[str, Any]] = None
    ) -> List[ConflictReport]:
        """
        Detect conflicts in character data from multiple sources.

        Args:
            character_data: Primary character data
            additional_sources: Optional list of data from other sources

        Returns:
            List of conflict reports
        """
        conflicts = []
        character_name = character_data.get('name', 'Unknown')

        if not additional_sources:
            return conflicts

        # Check facts conflicts
        primary_facts = {f['fact_id']: f for f in character_data.get('canon_pack', {}).get('facts', [])}

        for source in additional_sources:
            source_facts = {f['fact_id']: f for f in source.get('canon_pack', {}).get('facts', [])}

            for fact_id, primary_fact in primary_facts.items():
                if fact_id in source_facts:
                    source_fact = source_facts[fact_id]

                    # Compare values
                    if primary_fact['value'] != source_fact['value']:
                        # Check confidence delta
                        conf_delta = abs(primary_fact.get('confidence', 0.8) - source_fact.get('confidence', 0.8))

                        if conf_delta > self.config.conflict_delta_threshold:
                            # Significant conflict
                            conflict = ConflictReport(
                                field=f'facts.{fact_id}',
                                values=[
                                    {
                                        'value': primary_fact['value'],
                                        'source': primary_fact.get('source', 'unknown'),
                                        'confidence': primary_fact.get('confidence', 0.8)
                                    },
                                    {
                                        'value': source_fact['value'],
                                        'source': source_fact.get('source', 'unknown'),
                                        'confidence': source_fact.get('confidence', 0.8)
                                    }
                                ],
                                character_name=character_name
                            )

                            # Auto-resolve if one source has significantly higher confidence
                            if primary_fact.get('confidence', 0) > source_fact.get('confidence', 0) + 0.2:
                                conflict.resolution = 'auto_resolved'
                                conflict.resolved_value = primary_fact['value']
                            elif source_fact.get('confidence', 0) > primary_fact.get('confidence', 0) + 0.2:
                                conflict.resolution = 'auto_resolved'
                                conflict.resolved_value = source_fact['value']

                            conflicts.append(conflict)

        return conflicts

    def calculate_data_quality_score(self, character_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate overall data quality score for a character.

        Args:
            character_data: Character data dictionary

        Returns:
            Dictionary with quality metrics
        """
        canon_pack = character_data.get('canon_pack', {})
        facts = canon_pack.get('facts', [])
        relationships = canon_pack.get('relationships', [])
        voice = canon_pack.get('voice', {})

        # Completeness score (0-100)
        completeness_factors = {
            'has_name': 10 if character_data.get('name') else 0,
            'has_species': 5 if character_data.get('species') else 0,
            'has_age_group': 5 if character_data.get('age_group') else 0,
            'facts_count': min(len(facts) * 2, 30),  # Up to 30 points
            'relationships_count': min(len(relationships) * 3, 20),  # Up to 20 points
            'has_personality': 10 if voice.get('personality_traits') else 0,
            'has_catchphrases': 10 if voice.get('catchphrases') else 0,
            'has_voice_profile': 10 if voice.get('tone') else 0,
        }

        completeness_score = sum(completeness_factors.values())

        # Confidence score (average confidence of all facts)
        if facts:
            avg_confidence = sum(f.get('confidence', 0.5) for f in facts) / len(facts)
            confidence_score = avg_confidence * 100
        else:
            confidence_score = 0

        # Richness score (depth of information)
        richness_factors = {
            'detailed_facts': len([f for f in facts if len(f.get('value', '')) > 50]),
            'personality_traits': len(voice.get('personality_traits', [])),
            'catchphrases': len(voice.get('catchphrases', [])),
            'relationships': len(relationships),
        }

        richness_score = min(sum(richness_factors.values()) * 5, 100)

        # Overall quality score (weighted average)
        overall_score = (
            completeness_score * 0.4 +
            confidence_score * 0.3 +
            richness_score * 0.3
        )

        return {
            'overall_score': round(overall_score, 2),
            'completeness_score': round(completeness_score, 2),
            'confidence_score': round(confidence_score, 2),
            'richness_score': round(richness_score, 2),
            'breakdown': completeness_factors,
            'metrics': {
                'facts_count': len(facts),
                'relationships_count': len(relationships),
                'personality_traits_count': len(voice.get('personality_traits', [])),
                'catchphrases_count': len(voice.get('catchphrases', []))
            }
        }

    def get_all_issues(self) -> List[ValidationIssue]:
        """Get all validation issues collected."""
        return self.issues

    def get_all_conflicts(self) -> List[ConflictReport]:
        """Get all conflicts detected."""
        return self.conflicts

    def generate_data_quality_report(
        self,
        all_characters: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate comprehensive data quality report for all characters.

        Args:
            all_characters: List of all character data dictionaries

        Returns:
            Data quality report dictionary
        """
        all_issues = []
        all_conflicts = []
        quality_scores = []

        for character in all_characters:
            # Validate
            is_valid, issues = self.validate_character(character)
            all_issues.extend(issues)

            # Calculate quality score
            quality_score = self.calculate_data_quality_score(character)
            quality_scores.append({
                'character_name': character.get('name'),
                **quality_score
            })

        # Aggregate statistics
        total_characters = len(all_characters)
        characters_with_errors = len([c for c in all_characters if not self.validate_character(c)[0]])
        characters_with_warnings = len([c for c in all_characters if any(
            i.severity == 'warning' for i in self.validate_character(c)[1]
        )])

        avg_quality_score = sum(q['overall_score'] for q in quality_scores) / len(quality_scores) if quality_scores else 0

        return {
            'summary': {
                'total_characters': total_characters,
                'characters_with_errors': characters_with_errors,
                'characters_with_warnings': characters_with_warnings,
                'average_quality_score': round(avg_quality_score, 2),
                'total_issues': len(all_issues),
                'total_conflicts': len(all_conflicts)
            },
            'issues_by_severity': {
                'error': [i for i in all_issues if i.severity == 'error'],
                'warning': [i for i in all_issues if i.severity == 'warning'],
                'info': [i for i in all_issues if i.severity == 'info']
            },
            'conflicts': all_conflicts,
            'quality_scores': quality_scores,
            'top_issues': self._get_top_issues(all_issues),
            'low_quality_characters': [
                q for q in quality_scores if q['overall_score'] < 50
            ]
        }

    def _get_top_issues(self, issues: List[ValidationIssue], limit: int = 10) -> List[Dict[str, Any]]:
        """Get most common issues."""
        issue_counts = {}

        for issue in issues:
            key = f"{issue.field}: {issue.message}"
            if key not in issue_counts:
                issue_counts[key] = {
                    'field': issue.field,
                    'message': issue.message,
                    'severity': issue.severity,
                    'count': 0,
                    'characters_affected': []
                }
            issue_counts[key]['count'] += 1
            issue_counts[key]['characters_affected'].append(issue.character_name)

        # Sort by count
        sorted_issues = sorted(issue_counts.values(), key=lambda x: x['count'], reverse=True)
        return sorted_issues[:limit]
