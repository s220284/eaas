import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { charactersApi, evaluationsApi, taxonomyApi } from '../api/client';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * Character Workspace - Production-grade editing interface
 *
 * Design Philosophy: "Editorial Workbench"
 * - Refined typography with clear hierarchy
 * - Three-column layout: versions, content, evaluations
 * - Inline editing with visual feedback
 * - Version control with full history
 * - Sophisticated color coding per data type
 */

const CharacterWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [character, setCharacter] = useState(null);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('canon');
  const [editedData, setEditedData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [taxonomy, setTaxonomy] = useState({
    prohibitedContent: [],
    characterTraits: [],
    contentRatings: [],
    relationshipTypes: [],
  });

  // Load taxonomy data from backend
  const loadTaxonomy = useCallback(async () => {
    try {
      const categories = await taxonomyApi.getCategories(true); // Only active categories
      const taxonomyData = {
        prohibitedContent: [],
        characterTraits: [],
        contentRatings: [],
        relationshipTypes: [],
      };

      categories.forEach(category => {
        if (category.key === 'prohibited_content') {
          taxonomyData.prohibitedContent = category.tags.map(tag => ({
            name: tag.name,
            description: tag.description,
            severity: tag.severity,
          }));
        } else if (category.key === 'character_traits') {
          taxonomyData.characterTraits = category.tags.map(tag => ({
            name: tag.name,
            description: tag.description,
          }));
        } else if (category.key === 'content_rating') {
          taxonomyData.contentRatings = category.tags.map(tag => ({
            name: tag.name,
            description: tag.description,
          }));
        } else if (category.key === 'relationship_types') {
          taxonomyData.relationshipTypes = category.tags.map(tag => ({
            name: tag.name,
            description: tag.description,
          }));
        }
      });

      setTaxonomy(taxonomyData);
    } catch (error) {
      console.error('Failed to load taxonomy:', error);
      // Continue with empty taxonomy if load fails
    }
  }, []);

  // Fetch character and related data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const charData = await charactersApi.getById(id);

      let versionsData = [];
      try {
        versionsData = await charactersApi.getVersions(id);
      } catch (versionError) {
        console.error('Failed to load versions:', versionError);
        // Continue even if versions fail to load
      }

      let evalsData = [];
      try {
        evalsData = await evaluationsApi.getAll({ character_card_id: id });
      } catch (evalError) {
        console.error('Failed to load evaluations:', evalError);
        // Continue even if evaluations fail to load
      }

      setCharacter(charData);
      setVersions(versionsData || []);
      setEvaluations(Array.isArray(evalsData) ? evalsData : []);

      // Use character's current_version if available, otherwise use versions list, or create default
      let currentVer = charData.current_version ||
                       versionsData?.find((v) => v.id === charData.current_version_id) ||
                       versionsData?.[0];

      // If still no version, create a default empty version structure
      if (!currentVer) {
        currentVer = {
          id: 'new',
          character_card_id: charData.id,
          version_number: 1,
          canon_facts: {},
          canon_voice: {},
          canon_relationships: [],
          legal_rights: {},
          legal_performer_consent: {},
          safety_content_rating: 'PG',
          safety_prohibited_topics: [],
          safety_required_disclosures: [],
          safety_age_gating: { enabled: false },
          change_summary: 'Initial version',
          created_at: new Date().toISOString(),
        };
      }

      setSelectedVersion(currentVer);
      setEditedData(transformVersionToEditData(currentVer));
    } catch (error) {
      console.error('Failed to load character:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    loadTaxonomy();
  }, [loadTaxonomy]);

  // Transform version data to editable format
  const transformVersionToEditData = (version) => {
    // Transform relationships to support both old and new formats
    let relationships = version.canon_relationships || [];
    if (Array.isArray(relationships)) {
      relationships = relationships.map(rel => {
        // Handle both formats:
        // Old: {character_name, relationship_type, description}
        // New: {entity, relationship}
        if (rel.character_name) {
          return {
            entity: rel.character_name,
            relationship: rel.description || rel.relationship_type || ''
          };
        }
        return rel;
      });
    }

    return {
    // Canon Pack
    canon_facts: version.canon_facts || {},
    canon_voice: version.canon_voice || {},
    canon_relationships: relationships,
    // Legal Pack
    legal_rights: version.legal_rights || {},
    legal_performer_consent: version.legal_performer_consent || {},
    // Safety Pack
    safety_content_rating: version.safety_content_rating || 'PG',
    safety_prohibited_topics: version.safety_prohibited_topics || [],
    safety_required_disclosures: version.safety_required_disclosures || [],
    safety_age_gating: version.safety_age_gating || {},
  };
};

  // Handle field changes
  const updateField = (path, value) => {
    setEditedData((prev) => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
    setHasChanges(true);
  };

  // Save as new version
  const handleSave = async () => {
    if (!hasChanges || !editedData) return;

    const changeSummary = prompt('Describe the changes in this version:');
    if (!changeSummary) return;

    setIsSaving(true);
    try {
      await charactersApi.createVersion(id, {
        ...editedData,
        change_summary: changeSummary,
      });
      await fetchData();
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save version:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Switch version
  const handleVersionSwitch = (version) => {
    if (hasChanges) {
      if (!window.confirm('You have unsaved changes. Discard them?')) {
        return;
      }
    }
    setSelectedVersion(version);
    setEditedData(transformVersionToEditData(version));
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mash-600"></div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Character not found</p>
          <button
            onClick={() => navigate('/characters')}
            className="mt-4 text-mash-600 hover:text-mash-700"
          >
            ← Back to Characters
          </button>
        </div>
      </div>
    );
  }

  // If still no selected version after loading, show error with debug info
  if (!isLoading && !selectedVersion && character) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Workspace</h2>
          <p className="text-gray-600 mb-4">
            Character data is incomplete. Please try creating a new character or contact support.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/characters')}
              className="w-full px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
            >
              ← Back to Characters
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we have editedData before rendering workspace
  if (!isLoading && character && selectedVersion && !editedData) {
    setEditedData(transformVersionToEditData(selectedVersion));
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mash-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/characters')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-mash-500 to-mash-600 flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-white">
                  {character.name?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  {character.name}
                </h1>
                <p className="text-sm text-gray-500">
                  Version {selectedVersion.version_number} • {character.franchise?.name || 'No franchise'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {hasChanges && (
                <span className="text-sm text-amber-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Unsaved changes
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  hasChanges
                    ? 'bg-mash-600 text-white hover:bg-mash-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save as New Version'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Version History */}
          <div className="col-span-3">
            <div className="sticky top-28">
              <VersionHistory
                versions={versions}
                selectedVersion={selectedVersion}
                onVersionSelect={handleVersionSwitch}
              />
            </div>
          </div>

          {/* Main Content - Editable Packs */}
          <div className="col-span-6">
            <Tabs activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-6 space-y-6">
              {editedData && activeTab === 'canon' && (
                <CanonPackEditor data={editedData} onChange={updateField} taxonomy={taxonomy} />
              )}
              {editedData && activeTab === 'voice' && (
                <VoicePackEditor data={editedData} onChange={updateField} />
              )}
              {editedData && activeTab === 'safety' && (
                <SafetyPackEditor data={editedData} onChange={updateField} taxonomy={taxonomy} />
              )}
              {editedData && activeTab === 'legal' && (
                <LegalPackEditor data={editedData} onChange={updateField} />
              )}
              {!editedData && (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mash-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Evaluation Summary */}
          <div className="col-span-3">
            <div className="sticky top-28">
              <EvaluationSummary evaluations={evaluations} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
};

// ============================================================================
// Version History Component
// ============================================================================

const VersionHistory = ({ versions, selectedVersion, onVersionSelect }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Version History
        </h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {versions.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            No versions yet
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => onVersionSelect(version)}
                className={`w-full px-5 py-4 text-left transition-colors ${
                  selectedVersion?.id === version.id
                    ? 'bg-mash-50 border-l-4 border-mash-500'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">
                        v{version.version_number}
                      </span>
                      {selectedVersion?.id === version.id && (
                        <span className="text-xs px-2 py-0.5 bg-mash-100 text-mash-700 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {version.change_summary || 'No description'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(version.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Tabs Component
// ============================================================================

const TABS = [
  { id: 'canon', name: 'Canon Pack', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'text-blue-600' },
  { id: 'voice', name: 'Voice Pack', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', color: 'text-purple-600' },
  { id: 'safety', name: 'Safety Pack', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'text-red-600' },
  { id: 'legal', name: 'Legal Pack', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', color: 'text-amber-600' },
];

const Tabs = ({ activeTab, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-4">
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-6 py-4 text-center transition-all ${
              activeTab === tab.id
                ? 'bg-white'
                : 'bg-gray-50 hover:bg-gray-100'
            } ${index > 0 ? 'border-l border-gray-200' : ''}`}
          >
            <div className={`flex flex-col items-center space-y-2 ${
              activeTab === tab.id ? tab.color : 'text-gray-400'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              <span className={`text-xs font-medium ${
                activeTab === tab.id ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {tab.name}
              </span>
            </div>
            {activeTab === tab.id && (
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${tab.color.replace('text-', 'bg-')}`} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Canon Pack Editor
// ============================================================================

const CanonPackEditor = ({ data, onChange, taxonomy = { prohibitedContent: [], characterTraits: [], contentRatings: [], relationshipTypes: [] } }) => {
  const [newFactKey, setNewFactKey] = useState('');
  const [newFactValue, setNewFactValue] = useState('');
  const [newFactSource, setNewFactSource] = useState('');

  // Ensure data exists
  if (!data) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  const addFact = () => {
    if (!newFactKey.trim()) return;

    const facts = { ...(data.canon_facts || {}) };
    facts[newFactKey.trim()] = {
      value: newFactValue.trim(),
      source: newFactSource.trim(),
      confidence: 100,
    };

    onChange('canon_facts', facts);
    setNewFactKey('');
    setNewFactValue('');
    setNewFactSource('');
  };

  const removeFact = (key) => {
    const facts = { ...(data.canon_facts || {}) };
    delete facts[key];
    onChange('canon_facts', facts);
  };

  const updateFact = (key, field, value) => {
    const facts = { ...(data.canon_facts || {}) };
    if (!facts[key]) facts[key] = {};
    if (typeof facts[key] === 'string') {
      // Convert old format to new format
      facts[key] = { value: facts[key], source: '', confidence: 100 };
    }
    facts[key][field] = value;
    onChange('canon_facts', facts);
  };

  return (
    <div className="space-y-6">
      {/* Canon Facts Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Canon Facts</h3>
            <p className="text-sm text-gray-500 mt-1">
              Immutable truths about this character from source material
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(data.canon_facts || {}).map(([key, factData]) => {
            const fact = typeof factData === 'string' ? { value: factData, source: '', confidence: 100 } : factData;
            return (
              <div key={key} className="group p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{key}</span>
                  <button
                    onClick={() => removeFact(key)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={fact.value || ''}
                  onChange={(e) => updateFact(key, 'value', e.target.value)}
                  className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Fact value"
                />
                <input
                  type="text"
                  value={fact.source || ''}
                  onChange={(e) => updateFact(key, 'source', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Source (e.g., Episode 3, Season 1)"
                />
              </div>
            );
          })}
        </div>

        {/* Add New Fact */}
        <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={newFactKey}
              onChange={(e) => setNewFactKey(e.target.value)}
              className="px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Fact name"
            />
            <input
              type="text"
              value={newFactValue}
              onChange={(e) => setNewFactValue(e.target.value)}
              className="px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Value"
            />
            <input
              type="text"
              value={newFactSource}
              onChange={(e) => setNewFactSource(e.target.value)}
              className="px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Source"
            />
          </div>
          <button
            onClick={addFact}
            className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Fact
          </button>
        </div>
      </div>

      {/* Relationships Section */}
      <RelationshipsEditor
        relationships={data.canon_relationships || []}
        onChange={(rels) => onChange('canon_relationships', rels)}
        relationshipTypes={taxonomy.relationshipTypes}
      />

      {/* Voice Profile Section */}
      <VoiceProfileSection
        voice={data.canon_voice || {}}
        onChange={(voice) => onChange('canon_voice', voice)}
        characterTraits={taxonomy.characterTraits}
      />
    </div>
  );
};

// Relationships Editor Component
const RelationshipsEditor = ({ relationships, onChange, relationshipTypes = [] }) => {
  const navigate = useNavigate();
  const [newEntity, setNewEntity] = useState('');
  const [newRelType, setNewRelType] = useState('');
  const [searchingCharacter, setSearchingCharacter] = useState(null);

  // Ensure relationships is always an array
  const relationshipsArray = Array.isArray(relationships) ? relationships : [];

  const addRelationship = () => {
    if (!newEntity.trim() || !newRelType.trim()) return;
    onChange([...relationshipsArray, { entity: newEntity.trim(), relationship: newRelType.trim() }]);
    setNewEntity('');
    setNewRelType('');
  };

  const removeRelationship = (index) => {
    onChange(relationshipsArray.filter((_, i) => i !== index));
  };

  const handleEntityClick = async (entityName) => {
    setSearchingCharacter(entityName);
    try {
      // Search for character by name
      const characters = await charactersApi.getAll();
      const matchedCharacter = characters.find(
        char => char.name.toLowerCase() === entityName.toLowerCase()
      );

      if (matchedCharacter) {
        // Navigate to the character's workspace
        navigate(`/characters/${matchedCharacter.id}/workspace`);
      } else {
        alert(`Character "${entityName}" not found. You may need to create this character first.`);
      }
    } catch (error) {
      console.error('Failed to search for character:', error);
      alert('Failed to search for character');
    } finally {
      setSearchingCharacter(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Relationships</h3>
          <p className="text-sm text-gray-500 mt-1">
            Character connections and dynamics
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        {relationshipsArray.map((rel, index) => (
          <div key={index} className="group flex items-center space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
            <button
              onClick={() => handleEntityClick(rel.entity)}
              disabled={searchingCharacter === rel.entity}
              className="flex-1 text-left text-sm font-medium text-purple-700 hover:text-purple-900 hover:underline cursor-pointer transition-colors disabled:opacity-50"
              title={`Click to view ${rel.entity}'s workspace`}
            >
              {searchingCharacter === rel.entity ? '🔍 Searching...' : rel.entity}
            </button>
            <span className="text-xs text-purple-600">→</span>
            <span className="flex-1 text-sm text-gray-600">{rel.relationship}</span>
            <button
              onClick={() => removeRelationship(index)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex space-x-3">
        <input
          type="text"
          value={newEntity}
          onChange={(e) => setNewEntity(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Entity name"
        />
        <input
          type="text"
          value={newRelType}
          onChange={(e) => setNewRelType(e.target.value)}
          list="relationship-types"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Relationship type (e.g., family, friend)"
        />
        {relationshipTypes.length > 0 && (
          <datalist id="relationship-types">
            {relationshipTypes.map((type, index) => (
              <option key={index} value={type.name}>
                {type.description}
              </option>
            ))}
          </datalist>
        )}
        <button
          onClick={addRelationship}
          className="px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};

// Voice Profile Section
const VoiceProfileSection = ({ voice, onChange, characterTraits = [] }) => {
  const updateVoice = (field, value) => {
    onChange({ ...voice, [field]: value });
  };

  const addArrayItem = (field, value) => {
    if (!value.trim()) return;
    const arr = voice[field] || [];
    updateVoice(field, [...arr, value.trim()]);
  };

  const removeArrayItem = (field, index) => {
    const arr = voice[field] || [];
    updateVoice(field, arr.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Voice Profile</h3>
          <p className="text-sm text-gray-500 mt-1">
            Personality traits, tone, and speech patterns
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personality Traits
          </label>
          <TaxonomyField
            items={voice.traits || []}
            onAdd={(val) => addArrayItem('traits', val)}
            onRemove={(idx) => removeArrayItem('traits', idx)}
            placeholder="Search traits or add custom..."
            color="indigo"
            suggestions={characterTraits}
          />
        </div>
        <ArrayField
          label="Tone Descriptors"
          items={voice.tone || []}
          onAdd={(val) => addArrayItem('tone', val)}
          onRemove={(idx) => removeArrayItem('tone', idx)}
          placeholder="e.g., Warm, Encouraging, Fatherly"
          color="purple"
        />
        <ArrayField
          label="Catchphrases"
          items={(voice.catchphrases || []).map(c => typeof c === 'string' ? c : c.phrase || '')}
          onAdd={(val) => addArrayItem('catchphrases', val)}
          onRemove={(idx) => removeArrayItem('catchphrases', idx)}
          placeholder="e.g., There's a snake in my boot!"
          color="pink"
        />
      </div>
    </div>
  );
};

// ============================================================================
// Voice Pack Editor
// ============================================================================

const VoicePackEditor = ({ data, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Voice Configuration</h3>
          <p className="text-sm text-gray-500 mt-1">
            Extended voice and personality configuration
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>

      <div className="prose prose-sm max-w-none">
        <p className="text-gray-600">
          Voice configuration is managed through the Canon Pack's Voice Profile section.
          Switch to the Canon Pack tab to edit personality traits, tone, and catchphrases.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// Safety Pack Editor
// ============================================================================

const SafetyPackEditor = ({ data, onChange, taxonomy = { prohibitedContent: [], contentRatings: [] } }) => {
  // Ensure data exists
  if (!data) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  const addTopic = (value) => {
    if (!value.trim()) return;
    const topics = Array.isArray(data.safety_prohibited_topics) ? data.safety_prohibited_topics : [];
    onChange('safety_prohibited_topics', [...topics, value.trim()]);
  };

  const removeTopic = (index) => {
    const topics = Array.isArray(data.safety_prohibited_topics) ? data.safety_prohibited_topics : [];
    onChange('safety_prohibited_topics', topics.filter((_, i) => i !== index));
  };

  const addDisclosure = (value) => {
    if (!value.trim()) return;
    const disclosures = Array.isArray(data.safety_required_disclosures) ? data.safety_required_disclosures : [];
    onChange('safety_required_disclosures', [...disclosures, value.trim()]);
  };

  const removeDisclosure = (index) => {
    const disclosures = Array.isArray(data.safety_required_disclosures) ? data.safety_required_disclosures : [];
    onChange('safety_required_disclosures', disclosures.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Content Rating */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Content Rating</h3>
            <p className="text-sm text-gray-500 mt-1">
              Age-appropriate content classification
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <select
          value={data.safety_content_rating || 'PG'}
          onChange={(e) => onChange('safety_content_rating', e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
        >
          {taxonomy.contentRatings.length > 0 ? (
            taxonomy.contentRatings.map((rating, index) => (
              <option key={index} value={rating.name}>
                {rating.name.toUpperCase()} {rating.description ? `- ${rating.description}` : ''}
              </option>
            ))
          ) : (
            <>
              <option value="G">G - General Audiences</option>
              <option value="PG">PG - Parental Guidance</option>
              <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
              <option value="R">R - Restricted</option>
              <option value="NC-17">NC-17 - Adults Only</option>
            </>
          )}
        </select>
      </div>

      {/* Prohibited Topics */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Prohibited Topics</h3>
            <p className="text-sm text-gray-500 mt-1">
              Content this character must avoid
            </p>
          </div>
          <div className="px-3 py-1 bg-red-50 rounded-lg">
            <span className="text-xs font-medium text-red-700">
              {(data.safety_prohibited_topics || []).length} topics
            </span>
          </div>
        </div>

        <TaxonomyField
          items={data.safety_prohibited_topics || []}
          onAdd={addTopic}
          onRemove={removeTopic}
          placeholder="Type to search or add custom topic..."
          color="red"
          suggestions={taxonomy.prohibitedContent}
        />
      </div>

      {/* Required Disclosures */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Required Disclosures</h3>
            <p className="text-sm text-gray-500 mt-1">
              Mandatory disclaimers for interactions
            </p>
          </div>
        </div>

        <ArrayField
          items={data.safety_required_disclosures || []}
          onAdd={addDisclosure}
          onRemove={removeDisclosure}
          placeholder="e.g., This is an AI-generated character experience"
          color="orange"
        />
      </div>

      {/* Age Gating */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Age Gating</h3>
            <p className="text-sm text-gray-500 mt-1">
              Minimum age requirements
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data.safety_age_gating?.enabled || false}
              onChange={(e) => onChange('safety_age_gating', {
                ...data.safety_age_gating,
                enabled: e.target.checked
              })}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable age verification</span>
          </label>

          {data.safety_age_gating?.enabled && (
            <input
              type="number"
              value={data.safety_age_gating?.minimum_age || 13}
              onChange={(e) => onChange('safety_age_gating', {
                ...data.safety_age_gating,
                minimum_age: parseInt(e.target.value)
              })}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
              placeholder="Minimum age"
              min="0"
              max="100"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Legal Pack Editor
// ============================================================================

const LegalPackEditor = ({ data, onChange }) => {
  // Ensure data exists
  if (!data) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  const updateRights = (field, value) => {
    onChange('legal_rights', { ...(data.legal_rights || {}), [field]: value });
  };

  const updateConsent = (field, value) => {
    onChange('legal_performer_consent', { ...(data.legal_performer_consent || {}), [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Legal Rights */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rights & Ownership</h3>
            <p className="text-sm text-gray-500 mt-1">
              IP ownership and licensing information
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rights Holder</label>
            <input
              type="text"
              value={data.legal_rights?.owner || ''}
              onChange={(e) => updateRights('owner', e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., Disney/Pixar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Type</label>
            <select
              value={data.legal_rights?.license_type || ''}
              onChange={(e) => updateRights('license_type', e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select license type</option>
              <option value="proprietary">Proprietary</option>
              <option value="licensed">Licensed</option>
              <option value="public_domain">Public Domain</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Territories</label>
            <textarea
              value={Array.isArray(data.legal_rights?.territories) ? data.legal_rights.territories.join(', ') : ''}
              onChange={(e) => updateRights('territories', e.target.value.split(',').map(t => t.trim()))}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
              rows={2}
              placeholder="e.g., Worldwide, North America, Europe"
            />
          </div>
        </div>
      </div>

      {/* Performer Consent */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performer Consent</h3>
            <p className="text-sm text-gray-500 mt-1">
              SAG-AFTRA compliance and performer rights
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Performer Name</label>
            <input
              type="text"
              value={data.legal_performer_consent?.performer || ''}
              onChange={(e) => updateConsent('performer', e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., Tom Hanks"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Consent Type</label>
            <select
              value={data.legal_performer_consent?.consent_type || ''}
              onChange={(e) => updateConsent('consent_type', e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select consent type</option>
              <option value="AI_DIGITAL_REPLICA">AI Digital Replica</option>
              <option value="VOICE_CLONING">Voice Cloning</option>
              <option value="LIKENESS_RIGHTS">Likeness Rights</option>
              <option value="NONE">No Performer Consent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Consent Status</label>
            <select
              value={data.legal_performer_consent?.status || ''}
              onChange={(e) => updateConsent('status', e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select status</option>
              <option value="granted">Granted</option>
              <option value="pending">Pending</option>
              <option value="denied">Denied</option>
              <option value="not_required">Not Required</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Evaluation Summary Component
// ============================================================================

const EvaluationSummary = ({ evaluations }) => {
  const recentEvals = evaluations.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Recent Evaluations
        </h3>
      </div>

      {recentEvals.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-sm text-gray-500">No evaluations yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {recentEvals.map((evaluation) => (
            <div key={evaluation.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {evaluation.test_suite_name || 'Evaluation'}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    evaluation.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : evaluation.status === 'running'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {evaluation.status}
                </span>
              </div>

              {evaluation.score !== undefined && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        evaluation.score >= 90
                          ? 'bg-green-500'
                          : evaluation.score >= 75
                          ? 'bg-blue-500'
                          : evaluation.score >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${evaluation.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {evaluation.score}
                  </span>
                </div>
              )}

              <p className="text-xs text-gray-400">
                {new Date(evaluation.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Shared Array Field Component
// ============================================================================

// Taxonomy Field with autocomplete for prohibited topics
const TaxonomyField = ({ items, onAdd, onRemove, placeholder, color = 'red', suggestions = [] }) => {
  const [newValue, setNewValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const itemsArray = Array.isArray(items) ? items : [];

  // Normalize items to strings (handles both string items and {topic/name} objects)
  const getLabel = (item) => typeof item === 'string' ? item : (item.topic || item.name || String(item));
  const itemLabels = itemsArray.map(getLabel);

  // Extract tag names from taxonomy suggestions
  const availableTags = suggestions.map(s => typeof s === 'string' ? s : s.name);

  const filteredSuggestions = availableTags.filter(topic =>
    topic.toLowerCase().includes(newValue.toLowerCase()) &&
    !itemLabels.includes(topic)
  );

  const handleAdd = (value) => {
    const trimmedValue = (value || newValue).trim();
    if (trimmedValue && !itemLabels.includes(trimmedValue)) {
      onAdd(trimmedValue);
      setNewValue('');
      setShowSuggestions(false);
    }
  };

  const colorClasses = {
    red: { bg: 'bg-red-100', text: 'text-red-800', button: 'bg-red-600 hover:bg-red-700', border: 'border-red-300', hover: 'hover:bg-red-50' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', button: 'bg-indigo-600 hover:bg-indigo-700', border: 'border-indigo-300', hover: 'hover:bg-indigo-50' },
  };

  const colors = colorClasses[color] || colorClasses.red;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {itemsArray.map((item, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${colors.bg} ${colors.text} font-medium`}
          >
            {getLabel(item)}
            <button
              onClick={() => onRemove(index)}
              className="ml-2 hover:opacity-70 transition-opacity"
              title="Remove topic"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              } else if (e.key === 'Escape') {
                setShowSuggestions(false);
              }
            }}
            onFocus={() => newValue && setShowSuggestions(true)}
            className={`flex-1 px-3 py-2 text-sm border ${colors.border} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
            placeholder={placeholder}
          />
          <button
            onClick={() => handleAdd()}
            className={`px-5 py-2 text-white text-sm font-medium rounded-lg ${colors.button} transition-colors`}
          >
            Add
          </button>
        </div>

        {/* Autocomplete suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => {
              const suggestionObj = suggestions.find(s => (typeof s === 'string' ? s : s.name) === suggestion);
              const description = suggestionObj?.description;
              const severity = suggestionObj?.severity;

              return (
                <button
                  key={index}
                  onClick={() => handleAdd(suggestion)}
                  className={`w-full text-left px-4 py-2.5 text-sm ${colors.hover} transition-colors border-b border-gray-100 last:border-0`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{suggestion}</span>
                        {severity && severity !== 'neutral' && (
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                            severity === 'high' ? 'bg-red-100 text-red-700' :
                            severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {severity}
                          </span>
                        )}
                      </div>
                      {description && (
                        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Popular topics quick-add */}
      {availableTags.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Quick add from taxonomy:</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 10).filter(topic => !itemLabels.includes(topic)).map((topic, index) => {
              const suggestionObj = suggestions.find(s => (typeof s === 'string' ? s : s.name) === topic);
              const severity = suggestionObj?.severity;

              return (
                <button
                  key={index}
                  onClick={() => handleAdd(topic)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    severity === 'high' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                    severity === 'medium' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={suggestionObj?.description || ''}
                >
                  + {topic}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ArrayField = ({ label, items, onAdd, onRemove, placeholder, color = 'gray' }) => {
  const [newValue, setNewValue] = useState('');

  // Ensure items is always an array
  const itemsArray = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    onAdd(newValue);
    setNewValue('');
  };

  const colorClasses = {
    gray: { bg: 'bg-gray-100', text: 'text-gray-800', button: 'bg-gray-600 hover:bg-gray-700', border: 'border-gray-300' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-800', button: 'bg-blue-600 hover:bg-blue-700', border: 'border-blue-300' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-800', button: 'bg-purple-600 hover:bg-purple-700', border: 'border-purple-300' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', button: 'bg-indigo-600 hover:bg-indigo-700', border: 'border-indigo-300' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-800', button: 'bg-pink-600 hover:bg-pink-700', border: 'border-pink-300' },
    red: { bg: 'bg-red-100', text: 'text-red-800', button: 'bg-red-600 hover:bg-red-700', border: 'border-red-300' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-800', button: 'bg-orange-600 hover:bg-orange-700', border: 'border-orange-300' },
  };

  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div className="flex flex-wrap gap-2 mb-3">
        {itemsArray.map((item, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${colors.bg} ${colors.text}`}
          >
            {item}
            <button
              onClick={() => onRemove(index)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className={`flex-1 px-3 py-2 text-sm border ${colors.border} rounded-lg focus:ring-2 focus:ring-${color}-500`}
          placeholder={placeholder}
        />
        <button
          onClick={handleAdd}
          className={`px-4 py-2 ${colors.button} text-white text-sm font-medium rounded-lg transition-colors`}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CharacterWorkspace;
