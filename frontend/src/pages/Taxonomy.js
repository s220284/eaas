import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Taxonomy Management System
 *
 * Central source of truth for all categorization, tagging, and classification
 * in the system. Informs:
 * - Content ingestion and parsing
 * - Vector embeddings and semantic search
 * - Character evaluation criteria
 * - Safety and compliance filtering
 * - Data quality assessment
 *
 * Best Practices:
 * - Hierarchical structure (Categories > Tags)
 * - Rich metadata for each tag
 * - Version control for taxonomy changes
 * - Usage tracking across the system
 */

const Taxonomy = () => {
  const navigate = useNavigate();

  // State
  const [activeCategory, setActiveCategory] = useState('prohibited_content');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  // Taxonomy structure - this would come from backend in production
  const [taxonomy, setTaxonomy] = useState({
    prohibited_content: {
      name: 'Prohibited Content',
      description: 'Content types that characters must avoid',
      icon: '🚫',
      color: 'red',
      tags: [
        { id: 'violence', name: 'violence', description: 'Physical harm, fighting, weapons', severity: 'high', usage_count: 12 },
        { id: 'adult_themes', name: 'adult_themes', description: 'Sexual content, mature themes', severity: 'high', usage_count: 8 },
        { id: 'profanity', name: 'profanity', description: 'Cursing, inappropriate language', severity: 'medium', usage_count: 15 },
        { id: 'scary_content', name: 'scary_content', description: 'Horror, frightening imagery', severity: 'medium', usage_count: 6 },
        { id: 'bullying', name: 'bullying', description: 'Harassment, intimidation', severity: 'high', usage_count: 9 },
        { id: 'dangerous_activities', name: 'dangerous_activities', description: 'Unsafe behaviors, risk-taking', severity: 'high', usage_count: 4 },
      ]
    },
    character_traits: {
      name: 'Character Traits',
      description: 'Personality and behavioral characteristics',
      icon: '👤',
      color: 'blue',
      tags: [
        { id: 'friendly', name: 'friendly', description: 'Warm, welcoming, approachable', severity: 'neutral', usage_count: 45 },
        { id: 'loyal', name: 'loyal', description: 'Faithful, devoted, trustworthy', severity: 'neutral', usage_count: 38 },
        { id: 'brave', name: 'brave', description: 'Courageous, fearless, heroic', severity: 'neutral', usage_count: 22 },
        { id: 'funny', name: 'funny', description: 'Humorous, comedic, entertaining', severity: 'neutral', usage_count: 31 },
        { id: 'intelligent', name: 'intelligent', description: 'Smart, clever, analytical', severity: 'neutral', usage_count: 19 },
      ]
    },
    content_rating: {
      name: 'Content Ratings',
      description: 'Age-appropriate content classifications',
      icon: '🎬',
      color: 'yellow',
      tags: [
        { id: 'g', name: 'G (General Audiences)', description: 'All ages admitted', severity: 'neutral', usage_count: 25 },
        { id: 'pg', name: 'PG (Parental Guidance)', description: 'Some material may not be suitable for children', severity: 'neutral', usage_count: 42 },
        { id: 'pg13', name: 'PG-13', description: 'Parents strongly cautioned', severity: 'neutral', usage_count: 18 },
        { id: 'r', name: 'R (Restricted)', description: 'Under 17 requires parent/guardian', severity: 'neutral', usage_count: 3 },
      ]
    },
    relationship_types: {
      name: 'Relationship Types',
      description: 'Character connection classifications',
      icon: '🔗',
      color: 'purple',
      tags: [
        { id: 'family', name: 'family', description: 'Parent, sibling, child, relative', severity: 'neutral', usage_count: 67 },
        { id: 'friend', name: 'friend', description: 'Friendship, companionship', severity: 'neutral', usage_count: 89 },
        { id: 'romantic', name: 'romantic', description: 'Love interest, partner', severity: 'neutral', usage_count: 23 },
        { id: 'rival', name: 'rival', description: 'Competitor, adversary', severity: 'neutral', usage_count: 15 },
        { id: 'mentor', name: 'mentor', description: 'Teacher, guide, advisor', severity: 'neutral', usage_count: 12 },
        { id: 'enemy', name: 'enemy', description: 'Antagonist, villain', severity: 'neutral', usage_count: 8 },
      ]
    },
    evaluation_criteria: {
      name: 'Evaluation Criteria',
      description: 'Assessment dimensions for character outputs',
      icon: '📊',
      color: 'green',
      tags: [
        { id: 'canon_accuracy', name: 'canon_accuracy', description: 'Adherence to established character facts', severity: 'neutral', usage_count: 156 },
        { id: 'voice_consistency', name: 'voice_consistency', description: 'Speech patterns and personality alignment', severity: 'neutral', usage_count: 156 },
        { id: 'safety_compliance', name: 'safety_compliance', description: 'Avoidance of prohibited content', severity: 'neutral', usage_count: 156 },
        { id: 'legal_compliance', name: 'legal_compliance', description: 'Rights and consent adherence', severity: 'neutral', usage_count: 156 },
      ]
    },
    data_quality: {
      name: 'Data Quality',
      description: 'Character data completeness indicators',
      icon: '✅',
      color: 'indigo',
      tags: [
        { id: 'complete', name: 'complete', description: 'All required fields populated', severity: 'neutral', usage_count: 23 },
        { id: 'incomplete', name: 'incomplete', description: 'Missing required information', severity: 'neutral', usage_count: 12 },
        { id: 'needs_review', name: 'needs_review', description: 'Requires manual verification', severity: 'neutral', usage_count: 8 },
        { id: 'verified', name: 'verified', description: 'Human-verified accuracy', severity: 'neutral', usage_count: 34 },
      ]
    },
  });

  const categories = Object.keys(taxonomy);
  const currentCategory = taxonomy[activeCategory];

  const filteredTags = currentCategory?.tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalTags = Object.values(taxonomy).reduce((sum, cat) => sum + cat.tags.length, 0);
  const totalUsage = Object.values(taxonomy).reduce(
    (sum, cat) => sum + cat.tags.reduce((tagSum, tag) => tagSum + tag.usage_count, 0),
    0
  );

  const handleAddTag = () => {
    const newTag = {
      id: `new_tag_${Date.now()}`,
      name: 'new_tag',
      description: 'New tag description',
      severity: 'neutral',
      usage_count: 0,
    };

    setTaxonomy(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        tags: [...prev[activeCategory].tags, newTag],
      },
    }));

    setSelectedTag(newTag);
    setIsEditing(true);
  };

  const handleDeleteTag = (tagId) => {
    if (!window.confirm('Delete this tag? This may affect existing character data.')) return;

    setTaxonomy(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        tags: prev[activeCategory].tags.filter(t => t.id !== tagId),
      },
    }));

    if (selectedTag?.id === tagId) {
      setSelectedTag(null);
      setIsEditing(false);
    }
  };

  const handleUpdateTag = (updates) => {
    setTaxonomy(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        tags: prev[activeCategory].tags.map(t =>
          t.id === selectedTag.id ? { ...t, ...updates } : t
        ),
      },
    }));

    setSelectedTag(prev => ({ ...prev, ...updates }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(taxonomy, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taxonomy-export.json';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Taxonomy Management</h1>
              <p className="text-sm text-gray-600 mt-2">
                Central source of truth for system-wide categorization, tagging, and classification
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Export JSON
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 font-medium">Total Categories</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">{categories.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium">Total Tags</div>
              <div className="text-2xl font-bold text-green-900 mt-1">{totalTags}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium">Total Usage</div>
              <div className="text-2xl font-bold text-purple-900 mt-1">{totalUsage}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">

          {/* Category Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Categories
              </h2>
              <div className="space-y-1">
                {categories.map(catKey => {
                  const cat = taxonomy[catKey];
                  return (
                    <button
                      key={catKey}
                      onClick={() => {
                        setActiveCategory(catKey);
                        setSelectedTag(null);
                        setIsEditing(false);
                      }}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                        activeCategory === catKey
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{cat.name}</div>
                          <div className={`text-xs truncate ${
                            activeCategory === catKey ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {cat.tags.length} tags
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tags List */}
          <div className="col-span-5">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{currentCategory?.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{currentCategory?.description}</p>
                  </div>
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    + Add Tag
                  </button>
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      setSelectedTag(tag);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
                      selectedTag?.id === tag.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <code className="text-sm font-mono font-medium text-gray-900">
                            {tag.name}
                          </code>
                          {tag.severity && tag.severity !== 'neutral' && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              tag.severity === 'high' ? 'bg-red-100 text-red-800' :
                              tag.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {tag.severity}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{tag.description}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          Used in {tag.usage_count} characters
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tag Editor */}
          <div className="col-span-4">
            {selectedTag ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Tag Details</h2>
                  <div className="flex items-center space-x-2">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            // Reload from taxonomy state
                            const cat = taxonomy[activeCategory];
                            const original = cat.tags.find(t => t.id === selectedTag.id);
                            setSelectedTag(original);
                          }}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Save
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteTag(selectedTag.id)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tag ID</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={selectedTag.name}
                        onChange={(e) => handleUpdateTag({ name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                    ) : (
                      <code className="block px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono">
                        {selectedTag.name}
                      </code>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    {isEditing ? (
                      <textarea
                        value={selectedTag.description}
                        onChange={(e) => handleUpdateTag({ description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{selectedTag.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                    {isEditing ? (
                      <select
                        value={selectedTag.severity}
                        onChange={(e) => handleUpdateTag({ severity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="neutral">Neutral</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        selectedTag.severity === 'high' ? 'bg-red-100 text-red-800' :
                        selectedTag.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        selectedTag.severity === 'low' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedTag.severity}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage Statistics</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">{selectedTag.usage_count}</div>
                      <div className="text-xs text-gray-500 mt-1">characters using this tag</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System Usage</label>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Ingestion</span>
                        <span className="text-green-600 font-medium">✓ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Embeddings</span>
                        <span className="text-green-600 font-medium">✓ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Evaluations</span>
                        <span className="text-green-600 font-medium">✓ Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tag Selected</h3>
                <p className="text-sm text-gray-500">
                  Select a tag from the list to view and edit its details
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Taxonomy;
