import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { charactersApi, franchisesApi } from '../api/client';

// ============================================================================
// Character Card Editor Component
// ============================================================================

const TABS = [
  { id: 'canon', name: 'Canon', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'voice', name: 'Voice', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { id: 'safety', name: 'Safety', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: 'legal', name: 'Legal', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
];

/**
 * Character Card Editor with tabs
 */
const CharacterEditor = ({ character, onSave, onCancel, isNew = false }) => {
  const [activeTab, setActiveTab] = useState('canon');
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    franchise_id: '',
    status: 'draft',
    content_rating: 'G',
    version: 1,

    // Canon data
    canon_facts: {},
    relationships: [],

    // Voice data
    personality: '',
    tone: '',
    catchphrases: [],
    vocabulary: [],
    speech_patterns: [],

    // Safety data
    prohibited_topics: [],
    sensitive_topics: [],
    age_restrictions: [],
    content_warnings: [],

    // Legal data
    copyright_holder: '',
    license_type: '',
    usage_restrictions: [],
    attribution_required: false,
    performer_rights: '',
  });
  const [franchises, setFranchises] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Load character data
  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name || '',
        franchise_id: character.franchise_id || '',
        status: character.status || 'draft',
        content_rating: character.content_rating || 'G',
        version: character.version || 1,
        canon_facts: character.canon_facts || {},
        relationships: character.relationships || [],
        personality: character.voice?.personality || '',
        tone: character.voice?.tone || '',
        catchphrases: character.voice?.catchphrases || [],
        vocabulary: character.voice?.vocabulary || [],
        speech_patterns: character.voice?.speech_patterns || [],
        prohibited_topics: character.safety?.prohibited_topics || [],
        sensitive_topics: character.safety?.sensitive_topics || [],
        age_restrictions: character.safety?.age_restrictions || [],
        content_warnings: character.safety?.content_warnings || [],
        copyright_holder: character.legal?.copyright_holder || '',
        license_type: character.legal?.license_type || '',
        usage_restrictions: character.legal?.usage_restrictions || [],
        attribution_required: character.legal?.attribution_required || false,
        performer_rights: character.legal?.performer_rights || '',
      });
    }
  }, [character]);

  // Fetch franchises
  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const data = await franchisesApi.getAll();
        setFranchises(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        console.error('Error fetching franchises:', error);
      }
    };
    fetchFranchises();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleArrayAdd = (field, value) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()],
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleFactAdd = (key, value) => {
    if (key.trim() && value.trim()) {
      setFormData((prev) => ({
        ...prev,
        canon_facts: {
          ...prev.canon_facts,
          [key.trim()]: value.trim(),
        },
      }));
    }
  };

  const handleFactRemove = (key) => {
    setFormData((prev) => {
      const newFacts = { ...prev.canon_facts };
      delete newFacts[key];
      return { ...prev, canon_facts: newFacts };
    });
  };

  const handleRelationshipAdd = (entity, relationship) => {
    if (entity.trim() && relationship.trim()) {
      setFormData((prev) => ({
        ...prev,
        relationships: [
          ...prev.relationships,
          { entity: entity.trim(), relationship: relationship.trim() },
        ],
      }));
    }
  };

  const handleRelationshipRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      relationships: prev.relationships.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        franchise_id: formData.franchise_id || null,
        status: formData.status,
        content_rating: formData.content_rating,
        version: formData.version,
        canon_facts: formData.canon_facts,
        relationships: formData.relationships,
        voice: {
          personality: formData.personality,
          tone: formData.tone,
          catchphrases: formData.catchphrases,
          vocabulary: formData.vocabulary,
          speech_patterns: formData.speech_patterns,
        },
        safety: {
          prohibited_topics: formData.prohibited_topics,
          sensitive_topics: formData.sensitive_topics,
          age_restrictions: formData.age_restrictions,
          content_warnings: formData.content_warnings,
        },
        legal: {
          copyright_holder: formData.copyright_holder,
          license_type: formData.license_type,
          usage_restrictions: formData.usage_restrictions,
          attribution_required: formData.attribution_required,
          performer_rights: formData.performer_rights,
        },
      };

      await onSave(payload);
    } catch (error) {
      console.error('Error saving character:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isNew ? 'Create Character' : `Edit: ${character?.name || 'Character'}`}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure all aspects of your character card
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : isNew ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Basic info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Character Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-mash-500 focus:border-mash-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Woody"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Franchise
            </label>
            <select
              value={formData.franchise_id}
              onChange={(e) => handleChange('franchise_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
            >
              <option value="">No franchise</option>
              {franchises.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Rating
            </label>
            <select
              value={formData.content_rating}
              onChange={(e) => handleChange('content_rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
            >
              <option value="G">G - General</option>
              <option value="PG">PG - Parental Guidance</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R - Restricted</option>
              <option value="NC-17">NC-17</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-mash-500 text-mash-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={tab.icon}
                  />
                </svg>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'canon' && (
          <CanonTab
            formData={formData}
            onFactAdd={handleFactAdd}
            onFactRemove={handleFactRemove}
            onRelationshipAdd={handleRelationshipAdd}
            onRelationshipRemove={handleRelationshipRemove}
          />
        )}
        {activeTab === 'voice' && (
          <VoiceTab
            formData={formData}
            onChange={handleChange}
            onArrayAdd={handleArrayAdd}
            onArrayRemove={handleArrayRemove}
          />
        )}
        {activeTab === 'safety' && (
          <SafetyTab
            formData={formData}
            onArrayAdd={handleArrayAdd}
            onArrayRemove={handleArrayRemove}
          />
        )}
        {activeTab === 'legal' && (
          <LegalTab
            formData={formData}
            onChange={handleChange}
            onArrayAdd={handleArrayAdd}
            onArrayRemove={handleArrayRemove}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Tab Components
// ============================================================================

const CanonTab = ({ formData, onFactAdd, onFactRemove, onRelationshipAdd, onRelationshipRemove }) => {
  const [newFactKey, setNewFactKey] = useState('');
  const [newFactValue, setNewFactValue] = useState('');
  const [newEntity, setNewEntity] = useState('');
  const [newRelationship, setNewRelationship] = useState('');

  return (
    <div className="space-y-8">
      {/* Canon Facts */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Canon Facts</h3>
        <p className="text-sm text-gray-500 mb-4">
          Define the factual information about this character that must remain consistent.
        </p>

        <div className="space-y-3">
          {Object.entries(formData.canon_facts || {}).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <span className="font-medium text-gray-700 min-w-32">{key}:</span>
              <span className="flex-1 text-gray-600">{value}</span>
              <button
                onClick={() => onFactRemove(key)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end space-x-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fact Name</label>
            <input
              type="text"
              value={newFactKey}
              onChange={(e) => setNewFactKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Full Name"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input
              type="text"
              value={newFactValue}
              onChange={(e) => setNewFactValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Sheriff Woody Pride"
            />
          </div>
          <button
            onClick={() => {
              onFactAdd(newFactKey, newFactValue);
              setNewFactKey('');
              setNewFactValue('');
            }}
            className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Relationships */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Relationships</h3>
        <p className="text-sm text-gray-500 mb-4">
          Define the character's relationships with other entities.
        </p>

        <div className="space-y-3">
          {(formData.relationships || []).map((rel, index) => (
            <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <span className="font-medium text-gray-700">{rel.entity}</span>
              <span className="text-gray-400">-</span>
              <span className="flex-1 text-gray-600">{rel.relationship}</span>
              <button
                onClick={() => onRelationshipRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end space-x-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity</label>
            <input
              type="text"
              value={newEntity}
              onChange={(e) => setNewEntity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Buzz Lightyear"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
            <input
              type="text"
              value={newRelationship}
              onChange={(e) => setNewRelationship(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Best friend"
            />
          </div>
          <button
            onClick={() => {
              onRelationshipAdd(newEntity, newRelationship);
              setNewEntity('');
              setNewRelationship('');
            }}
            className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const VoiceTab = ({ formData, onChange, onArrayAdd, onArrayRemove }) => {
  const [newCatchphrase, setNewCatchphrase] = useState('');
  const [newVocab, setNewVocab] = useState('');
  const [newPattern, setNewPattern] = useState('');

  return (
    <div className="space-y-8">
      {/* Personality & Tone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
          <textarea
            value={formData.personality}
            onChange={(e) => onChange('personality', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Describe the character's personality traits..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
          <textarea
            value={formData.tone}
            onChange={(e) => onChange('tone', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Describe how the character speaks..."
          />
        </div>
      </div>

      {/* Catchphrases */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Catchphrases</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {(formData.catchphrases || []).map((phrase, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              "{phrase}"
              <button
                onClick={() => onArrayRemove('catchphrases', index)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newCatchphrase}
            onChange={(e) => setNewCatchphrase(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add a catchphrase..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onArrayAdd('catchphrases', newCatchphrase);
                setNewCatchphrase('');
              }
            }}
          />
          <button
            onClick={() => {
              onArrayAdd('catchphrases', newCatchphrase);
              setNewCatchphrase('');
            }}
            className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Vocabulary */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vocabulary</h3>
        <p className="text-sm text-gray-500 mb-4">
          Words and phrases characteristic of this character.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(formData.vocabulary || []).map((word, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {word}
              <button
                onClick={() => onArrayRemove('vocabulary', index)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newVocab}
            onChange={(e) => setNewVocab(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add vocabulary..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onArrayAdd('vocabulary', newVocab);
                setNewVocab('');
              }
            }}
          />
          <button
            onClick={() => {
              onArrayAdd('vocabulary', newVocab);
              setNewVocab('');
            }}
            className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Speech Patterns */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Speech Patterns</h3>
        <p className="text-sm text-gray-500 mb-4">
          Patterns in how the character speaks (e.g., "Uses Western slang").
        </p>
        <div className="space-y-2 mb-4">
          {(formData.speech_patterns || []).map((pattern, index) => (
            <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <span className="flex-1 text-gray-700">{pattern}</span>
              <button
                onClick={() => onArrayRemove('speech_patterns', index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add a speech pattern..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onArrayAdd('speech_patterns', newPattern);
                setNewPattern('');
              }
            }}
          />
          <button
            onClick={() => {
              onArrayAdd('speech_patterns', newPattern);
              setNewPattern('');
            }}
            className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const SafetyTab = ({ formData, onArrayAdd, onArrayRemove }) => {
  const [newProhibited, setNewProhibited] = useState('');
  const [newSensitive, setNewSensitive] = useState('');
  const [newAgeRestriction, setNewAgeRestriction] = useState('');
  const [newWarning, setNewWarning] = useState('');

  const TagList = ({ items, field, color, onRemove }) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {(items || []).map((item, index) => (
        <span
          key={index}
          className={`inline-flex items-center px-3 py-1 ${color} rounded-full text-sm`}
        >
          {item}
          <button
            onClick={() => onRemove(field, index)}
            className="ml-2 opacity-60 hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Prohibited Topics */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Prohibited Topics</h3>
        <p className="text-sm text-gray-500 mb-4">
          Topics this character should never discuss or engage with.
        </p>
        <TagList
          items={formData.prohibited_topics}
          field="prohibited_topics"
          color="bg-red-100 text-red-800"
          onRemove={onArrayRemove}
        />
        <div className="flex space-x-3">
          <input
            type="text"
            value={newProhibited}
            onChange={(e) => setNewProhibited(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add prohibited topic..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onArrayAdd('prohibited_topics', newProhibited);
                setNewProhibited('');
              }
            }}
          />
          <button
            onClick={() => {
              onArrayAdd('prohibited_topics', newProhibited);
              setNewProhibited('');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Sensitive Topics */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sensitive Topics</h3>
        <p className="text-sm text-gray-500 mb-4">
          Topics that require careful handling but aren't prohibited.
        </p>
        <TagList
          items={formData.sensitive_topics}
          field="sensitive_topics"
          color="bg-yellow-100 text-yellow-800"
          onRemove={onArrayRemove}
        />
        <div className="flex space-x-3">
          <input
            type="text"
            value={newSensitive}
            onChange={(e) => setNewSensitive(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add sensitive topic..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onArrayAdd('sensitive_topics', newSensitive);
                setNewSensitive('');
              }
            }}
          />
          <button
            onClick={() => {
              onArrayAdd('sensitive_topics', newSensitive);
              setNewSensitive('');
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Age Restrictions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Age Restrictions</h3>
        <p className="text-sm text-gray-500 mb-4">
          Content restrictions based on audience age.
        </p>
        <TagList
          items={formData.age_restrictions}
          field="age_restrictions"
          color="bg-orange-100 text-orange-800"
          onRemove={onArrayRemove}
        />
        <div className="flex space-x-3">
          <input
            type="text"
            value={newAgeRestriction}
            onChange={(e) => setNewAgeRestriction(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add age restriction..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onArrayAdd('age_restrictions', newAgeRestriction);
                setNewAgeRestriction('');
              }
            }}
          />
          <button
            onClick={() => {
              onArrayAdd('age_restrictions', newAgeRestriction);
              setNewAgeRestriction('');
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Content Warnings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Content Warnings</h3>
        <p className="text-sm text-gray-500 mb-4">
          Warnings that should be displayed before certain content.
        </p>
        <TagList
          items={formData.content_warnings}
          field="content_warnings"
          color="bg-purple-100 text-purple-800"
          onRemove={onArrayRemove}
        />
        <div className="flex space-x-3">
          <input
            type="text"
            value={newWarning}
            onChange={(e) => setNewWarning(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add content warning..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onArrayAdd('content_warnings', newWarning);
                setNewWarning('');
              }
            }}
          />
          <button
            onClick={() => {
              onArrayAdd('content_warnings', newWarning);
              setNewWarning('');
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const LegalTab = ({ formData, onChange, onArrayAdd, onArrayRemove }) => {
  const [newRestriction, setNewRestriction] = useState('');

  return (
    <div className="space-y-8">
      {/* Copyright & License */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Holder</label>
          <input
            type="text"
            value={formData.copyright_holder}
            onChange={(e) => onChange('copyright_holder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Disney/Pixar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
          <select
            value={formData.license_type}
            onChange={(e) => onChange('license_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select license type</option>
            <option value="proprietary">Proprietary</option>
            <option value="licensed">Licensed</option>
            <option value="public_domain">Public Domain</option>
            <option value="creative_commons">Creative Commons</option>
          </select>
        </div>
      </div>

      {/* Performer Rights */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Performer Rights</label>
        <textarea
          value={formData.performer_rights}
          onChange={(e) => onChange('performer_rights', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Notes about voice actor rights, likeness rights, etc."
        />
      </div>

      {/* Attribution Required */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="attribution_required"
          checked={formData.attribution_required}
          onChange={(e) => onChange('attribution_required', e.target.checked)}
          className="h-4 w-4 text-mash-600 focus:ring-mash-500 border-gray-300 rounded"
        />
        <label htmlFor="attribution_required" className="text-sm font-medium text-gray-700">
          Attribution required when using this character
        </label>
      </div>

      {/* Usage Restrictions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Restrictions</h3>
        <p className="text-sm text-gray-500 mb-4">
          Specific restrictions on how this character can be used.
        </p>
        <div className="space-y-2 mb-4">
          {(formData.usage_restrictions || []).map((restriction, index) => (
            <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="flex-1 text-gray-700">{restriction}</span>
              <button
                onClick={() => onArrayRemove('usage_restrictions', index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newRestriction}
            onChange={(e) => setNewRestriction(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add usage restriction..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onArrayAdd('usage_restrictions', newRestriction);
                setNewRestriction('');
              }
            }}
          />
          <button
            onClick={() => {
              onArrayAdd('usage_restrictions', newRestriction);
              setNewRestriction('');
            }}
            className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Character List Component
// ============================================================================

const CharacterList = ({ characters, isLoading, onSelect, onCreate }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mash-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Characters</h1>
          <p className="text-gray-500 mt-1">Manage your character cards</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Character
        </button>
      </div>

      {/* Character Grid */}
      {characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => onSelect(character)}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 hover:border-mash-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-mash-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-mash-600">
                    {character.name?.charAt(0) || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {character.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {character.franchise?.name || 'No franchise'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    character.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : character.status === 'draft'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {character.status || 'draft'}
                </span>
                <span className="text-xs text-gray-400">
                  v{character.version || 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No characters yet</h3>
          <p className="mt-2 text-gray-500">Get started by creating your first character card.</p>
          <button
            onClick={onCreate}
            className="mt-4 px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
          >
            Create Character
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Characters Page
// ============================================================================

const Characters = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();

  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Fetch characters
  const fetchCharacters = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await charactersApi.getAll();
      setCharacters(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Handle URL params
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      setIsNew(true);
      setIsEditing(true);
      setSelectedCharacter(null);
    }
  }, [searchParams]);

  // Fetch single character if ID in URL
  useEffect(() => {
    if (id) {
      const fetchCharacter = async () => {
        try {
          const data = await charactersApi.getById(id);
          setSelectedCharacter(data);
          setIsEditing(true);
        } catch (error) {
          console.error('Error fetching character:', error);
          navigate('/characters');
        }
      };
      fetchCharacter();
    }
  }, [id, navigate]);

  const handleCreate = () => {
    setIsNew(true);
    setIsEditing(true);
    setSelectedCharacter(null);
    navigate('/characters?action=new');
  };

  const handleSelect = (character) => {
    // Navigate to full workspace instead of opening modal
    navigate(`/characters/${character.id}/workspace`);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsNew(false);
    setSelectedCharacter(null);
    navigate('/characters');
  };

  const handleSave = async (data) => {
    try {
      if (isNew) {
        await charactersApi.create(data);
      } else {
        await charactersApi.update(selectedCharacter.id, data);
      }
      await fetchCharacters();
      handleCancel();
    } catch (error) {
      console.error('Error saving character:', error);
      throw error;
    }
  };

  if (isEditing) {
    return (
      <CharacterEditor
        character={selectedCharacter}
        onSave={handleSave}
        onCancel={handleCancel}
        isNew={isNew}
      />
    );
  }

  return (
    <CharacterList
      characters={characters}
      isLoading={isLoading}
      onSelect={handleSelect}
      onCreate={handleCreate}
    />
  );
};

export default Characters;
