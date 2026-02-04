import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluationVersionsApi } from '../api/client';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

/**
 * Evaluation Configurator
 *
 * Manage evaluation prompt templates (critic JSON files) with version control
 * and continuous improvement tracking.
 *
 * Allows users to:
 * - Create and edit evaluation prompt templates
 * - Store multiple versions with A/B testing
 * - Track performance metrics per version
 * - Continuously improve evaluation accuracy
 *
 * Design: Technical documentation aesthetic with code editor vibes
 */

const EvaluationConfigurator = () => {
  const navigate = useNavigate();

  // State
  const [versions, setVersions] = useState([]);
  const [activeVersion, setActiveVersion] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState('canon');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Toast and Modal state
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  // Editable state for current version
  const [editData, setEditData] = useState({
    version_name: '',
    description: '',
    canon_prompt_template: '',
    voice_prompt_template: '',
    safety_prompt_template: '',
    legal_prompt_template: '',
    scoring_criteria: {},
    thresholds: {
      passing_score: 80,
      excellent_score: 95,
    },
  });

  // Load versions on mount
  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      const data = await evaluationVersionsApi.getAll();
      setVersions(Array.isArray(data) ? data : []);

      // Set active version if exists
      const active = data.find(v => v.active);
      if (active) {
        setActiveVersion(active);
        setEditData(active);
      } else if (data.length > 0) {
        setActiveVersion(data[0]);
        setEditData(data[0]);
      }
    } catch (error) {
      console.error('Failed to load evaluation versions:', error);
      // Set empty state
      setVersions([]);
    }
  };

  const handleCreateNewVersion = () => {
    setEditMode(true);
    setEditData({
      version_name: `Version ${versions.length + 1}`,
      description: '',
      canon_prompt_template: editData.canon_prompt_template || '',
      voice_prompt_template: editData.voice_prompt_template || '',
      safety_prompt_template: editData.safety_prompt_template || '',
      legal_prompt_template: editData.legal_prompt_template || '',
      scoring_criteria: editData.scoring_criteria || {},
      thresholds: editData.thresholds || { passing_score: 80, excellent_score: 95 },
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editData.id && !editMode) {
        // Update existing version
        await evaluationVersionsApi.update(editData.id, editData);
      } else {
        // Create new version
        await evaluationVersionsApi.create(editData);
      }

      setHasChanges(false);
      setEditMode(false);
      await loadVersions();
    } catch (error) {
      console.error('Failed to save version:', error);
      alert('Failed to save version: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (activeVersion) {
      setEditData(activeVersion);
    }
    setHasChanges(false);
    setEditMode(false);
  };

  const updateField = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSetActive = async (versionId) => {
    try {
      await evaluationVersionsApi.activate(versionId);
      await loadVersions();
      showToast('Version activated successfully', 'success');
    } catch (error) {
      console.error('Failed to activate version:', error);
      showToast('Failed to activate version: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleDelete = (version) => {
    setConfirmModal({
      title: 'Delete Version?',
      message: `Are you sure you want to delete "${version.version_name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await evaluationVersionsApi.delete(version.id);
          await loadVersions();
          showToast('Version deleted successfully', 'success');
          if (activeVersion?.id === version.id) {
            setActiveVersion(null);
            setEditData({
              version_name: '',
              description: '',
              canon_prompt_template: '',
              voice_prompt_template: '',
              safety_prompt_template: '',
              legal_prompt_template: '',
              scoring_criteria: {},
              thresholds: { passing_score: 80, excellent_score: 95 },
            });
          }
        } catch (error) {
          console.error('Failed to delete version:', error);
          showToast('Failed to delete version: ' + (error.message || 'Unknown error'), 'error');
        }
        setConfirmModal(null);
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  const handleDuplicate = async (version) => {
    try {
      const newName = prompt('Enter name for duplicated version:', `${version.version_name} (Copy)`);
      if (!newName) return;

      await evaluationVersionsApi.duplicate(version.id, newName);
      await loadVersions();
      showToast('Version duplicated successfully', 'success');
    } catch (error) {
      console.error('Failed to duplicate version:', error);
      showToast('Failed to duplicate version: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          setEditData({
            ...json,
            version_name: json.version_name || `Imported ${new Date().toISOString().split('T')[0]}`,
          });
          setEditMode(true);
          setHasChanges(true);
          showToast('JSON imported successfully', 'success');
        } catch (error) {
          console.error('Failed to parse JSON:', error);
          showToast('Invalid JSON file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const updateScoringCriteria = (key, field, value) => {
    setEditData(prev => ({
      ...prev,
      scoring_criteria: {
        ...prev.scoring_criteria,
        [key]: {
          ...prev.scoring_criteria[key],
          [field]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const addScoringCriteria = () => {
    const key = prompt('Enter criteria key (e.g., canon_accuracy):');
    if (!key || editData.scoring_criteria[key]) {
      if (editData.scoring_criteria[key]) {
        showToast('Criteria key already exists', 'error');
      }
      return;
    }

    setEditData(prev => ({
      ...prev,
      scoring_criteria: {
        ...prev.scoring_criteria,
        [key]: {
          weight: 0.25,
          description: 'New criteria description',
        },
      },
    }));
    setHasChanges(true);
    showToast('Scoring criteria added', 'success');
  };

  const removeScoringCriteria = (key) => {
    setConfirmModal({
      title: 'Remove Criteria?',
      message: `Remove "${key}" scoring criteria?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: () => {
        setEditData(prev => {
          const newCriteria = { ...prev.scoring_criteria };
          delete newCriteria[key];
          return {
            ...prev,
            scoring_criteria: newCriteria,
          };
        });
        setHasChanges(true);
        showToast('Scoring criteria removed', 'success');
        setConfirmModal(null);
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  const updateThreshold = (key, value) => {
    setEditData(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: parseInt(value) || 0,
      },
    }));
    setHasChanges(true);
  };

  const dimensions = [
    { id: 'canon', label: 'Canon Fidelity', color: '#3b82f6', field: 'canon_prompt_template' },
    { id: 'voice', label: 'Voice Consistency', color: '#8b5cf6', field: 'voice_prompt_template' },
    { id: 'safety', label: 'Brand Safety', color: '#ef4444', field: 'safety_prompt_template' },
    { id: 'legal', label: 'Legal Compliance', color: '#f59e0b', field: 'legal_prompt_template' },
  ];

  const currentDimension = dimensions.find(d => d.id === selectedDimension);

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100" style={{ fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", monospace' }}>
      {/* Header */}
      <div className="border-b border-[#30363d] bg-[#0d1117]">
        <div className="max-w-[1800px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <span className="text-[#58a6ff] mr-3">⚙</span>
                EVALUATION CONFIGURATOR
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-mono">
                Manage critic prompts, scoring criteria, and continuous improvement
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {hasChanges && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-900/20 border border-yellow-600/40 rounded">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 text-xs font-mono">UNSAVED</span>
                </div>
              )}

              <button
                onClick={handleImportJSON}
                className="px-4 py-2 bg-transparent border border-[#30363d] text-gray-400 hover:bg-[#21262d] hover:text-white transition-colors text-sm font-mono"
                title="Import JSON configuration"
              >
                IMPORT JSON
              </button>

              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#21262d] border border-[#30363d] text-gray-300 hover:bg-[#30363d] transition-colors text-sm font-mono disabled:opacity-50"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="px-6 py-2 bg-[#238636] border border-[#2ea043] text-white hover:bg-[#2ea043] transition-colors text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'SAVING...' : 'SAVE VERSION'}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCreateNewVersion}
                  className="px-6 py-2 bg-[#238636] border border-[#2ea043] text-white hover:bg-[#2ea043] transition-colors text-sm font-mono"
                >
                  + NEW VERSION
                </button>
              )}

              <button
                onClick={() => navigate('/evaluations')}
                className="px-4 py-2 bg-transparent border border-[#30363d] text-gray-400 hover:bg-[#21262d] hover:text-white transition-colors text-sm font-mono"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">

          {/* Left Sidebar - Version List */}
          <div className="col-span-3">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
              <div className="border-b border-[#30363d] bg-[#0d1117] px-4 py-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  VERSIONS
                </h2>
              </div>

              <div className="p-2 space-y-1">
                {versions.map((version) => (
                  <div key={version.id} className="relative group">
                    <button
                      onClick={() => {
                        setActiveVersion(version);
                        setEditData(version);
                        setEditMode(false);
                        setHasChanges(false);
                      }}
                      className={`w-full text-left px-3 py-3 rounded transition-colors ${
                        activeVersion?.id === version.id
                          ? 'bg-[#1f6feb] text-white'
                          : 'text-gray-400 hover:bg-[#21262d] hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold font-mono">
                          v{version.version_number}
                        </span>
                        {version.active && (
                          <span className="px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 mb-2 truncate">
                        {version.version_name}
                      </div>
                      <div className="flex items-center space-x-3 text-[10px]">
                        <span className="text-gray-500">{version.total_uses} uses</span>
                        <span className="text-yellow-500">★ {version.avg_accuracy_rating?.toFixed(1)}</span>
                      </div>
                    </button>

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(version);
                        }}
                        className="p-1 bg-[#0d1117] border border-[#30363d] text-gray-400 hover:text-white hover:border-blue-500 rounded text-xs"
                        title="Duplicate version"
                      >
                        ⎘
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(version);
                        }}
                        className="p-1 bg-[#0d1117] border border-[#30363d] text-gray-400 hover:text-red-500 hover:border-red-500 rounded text-xs"
                        title="Delete version"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            {activeVersion && (
              <div className="mt-6 bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-[#30363d] pb-2">
                  PERFORMANCE
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Total Uses</span>
                    <span className="text-white font-bold font-mono">{activeVersion.total_uses}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Accuracy Rating</span>
                    <span className="text-yellow-500 font-bold font-mono">
                      ★ {activeVersion.avg_accuracy_rating?.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-bold font-mono ${activeVersion.active ? 'text-green-400' : 'text-gray-500'}`}>
                      {activeVersion.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                {!activeVersion.active && (
                  <button
                    onClick={() => handleSetActive(activeVersion.id)}
                    className="w-full mt-4 px-4 py-2 bg-[#238636] border border-[#2ea043] text-white hover:bg-[#2ea043] transition-colors text-xs font-mono"
                  >
                    SET AS ACTIVE
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Main Editor Area */}
          <div className="col-span-9 space-y-6">

            {/* Version Metadata */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    VERSION NAME
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.version_name || ''}
                      onChange={(e) => updateField('version_name', e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm text-white rounded focus:border-[#58a6ff] focus:outline-none font-mono"
                      placeholder="e.g., Improved Canon v2"
                    />
                  ) : (
                    <div className="text-lg font-bold text-white font-mono">
                      {editData.version_name || 'Unnamed Version'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    DESCRIPTION
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm text-white rounded focus:border-[#58a6ff] focus:outline-none font-mono"
                      placeholder="Brief description of changes"
                    />
                  ) : (
                    <div className="text-sm text-gray-400 font-mono">
                      {editData.description || 'No description'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dimension Tabs */}
            <div className="flex space-x-2 border-b border-[#30363d]">
              {dimensions.map((dim) => (
                <button
                  key={dim.id}
                  onClick={() => setSelectedDimension(dim.id)}
                  className={`px-6 py-3 font-bold text-xs transition-all relative ${
                    selectedDimension === dim.id
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                  style={{
                    borderBottom: selectedDimension === dim.id ? `3px solid ${dim.color}` : '3px solid transparent',
                  }}
                >
                  {dim.label.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Prompt Editor */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
              <div className="border-b border-[#30363d] bg-[#0d1117] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentDimension?.color }}
                  ></div>
                  <h2 className="text-sm font-bold text-white font-mono">
                    {currentDimension?.label.toUpperCase()} PROMPT TEMPLATE
                  </h2>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  Use {'{{variables}}'} for dynamic content
                </div>
              </div>

              <div className="p-0">
                {editMode ? (
                  <textarea
                    value={editData[currentDimension?.field] || ''}
                    onChange={(e) => updateField(currentDimension?.field, e.target.value)}
                    rows={16}
                    className="w-full bg-[#0d1117] text-gray-300 p-6 text-sm font-mono leading-relaxed focus:outline-none resize-none"
                    style={{
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                      lineHeight: '1.6',
                    }}
                    placeholder="Enter prompt template..."
                    spellCheck={false}
                  />
                ) : (
                  <pre className="bg-[#0d1117] text-gray-300 p-6 text-sm font-mono leading-relaxed overflow-x-auto">
                    {editData[currentDimension?.field] || 'No prompt template defined'}
                  </pre>
                )}
              </div>

              {/* Syntax Highlighting Helper */}
              <div className="border-t border-[#30363d] bg-[#0d1117] px-4 py-3">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="font-mono">Available variables:</span>
                  {selectedDimension === 'canon' && (
                    <>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{character_name}}'}</code>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{canon_facts}}'}</code>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{ai_response}}'}</code>
                    </>
                  )}
                  {selectedDimension === 'voice' && (
                    <>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{voice_profile}}'}</code>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{personality}}'}</code>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{ai_response}}'}</code>
                    </>
                  )}
                  {selectedDimension === 'safety' && (
                    <>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{prohibited_topics}}'}</code>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{content_rating}}'}</code>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{ai_response}}'}</code>
                    </>
                  )}
                  {selectedDimension === 'legal' && (
                    <>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{legal_rights}}'}</code>
                      <code className="px-2 py-1 bg-[#161b22] text-[#58a6ff] rounded">{'{{performer_consent}}'}</code>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Scoring Criteria */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4 border-b border-[#30363d] pb-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  SCORING CRITERIA & WEIGHTS
                </h2>
                {editMode && (
                  <button
                    onClick={addScoringCriteria}
                    className="px-3 py-1 bg-[#238636] border border-[#2ea043] text-white hover:bg-[#2ea043] transition-colors text-xs font-mono rounded"
                  >
                    + ADD CRITERIA
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {Object.entries(editData.scoring_criteria || {}).map(([key, criteria]) => (
                  <div key={key} className="bg-[#0d1117] border border-[#30363d] p-4 rounded relative group">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        {key.replace(/_/g, ' ')}
                      </h3>
                      {editMode ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={(criteria.weight * 100).toFixed(0)}
                            onChange={(e) => updateScoringCriteria(key, 'weight', parseFloat(e.target.value) / 100)}
                            className="w-16 bg-[#0d1117] border border-[#30363d] px-2 py-1 text-sm text-[#58a6ff] font-mono rounded focus:border-[#58a6ff] focus:outline-none text-right"
                          />
                          <span className="text-sm text-[#58a6ff] font-mono">%</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-[#58a6ff] font-mono">
                          {(criteria.weight * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    {editMode ? (
                      <textarea
                        value={criteria.description}
                        onChange={(e) => updateScoringCriteria(key, 'description', e.target.value)}
                        rows={3}
                        className="w-full bg-[#0d1117] border border-[#30363d] px-2 py-1 text-xs text-gray-300 font-mono rounded focus:border-[#58a6ff] focus:outline-none resize-none"
                      />
                    ) : (
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {criteria.description}
                      </p>
                    )}

                    {editMode && (
                      <button
                        onClick={() => removeScoringCriteria(key)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-[#0d1117] border border-[#30363d] text-gray-400 hover:text-red-500 hover:border-red-500 rounded text-xs"
                        title="Remove criteria"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Thresholds */}
              <div className="mt-6 pt-6 border-t border-[#30363d]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  SCORE THRESHOLDS
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#0d1117] border border-yellow-900/30 p-4 rounded">
                    <div className="text-xs text-yellow-500 uppercase tracking-wider mb-2">
                      Passing Score
                    </div>
                    {editMode ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editData.thresholds?.passing_score || 80}
                        onChange={(e) => updateThreshold('passing_score', e.target.value)}
                        className="w-full bg-[#0d1117] border border-yellow-900/50 px-3 py-2 text-3xl text-white font-mono rounded focus:border-yellow-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-3xl font-bold text-white font-mono">
                        {editData.thresholds?.passing_score || 80}
                      </div>
                    )}
                  </div>
                  <div className="bg-[#0d1117] border border-green-900/30 p-4 rounded">
                    <div className="text-xs text-green-500 uppercase tracking-wider mb-2">
                      Excellent Score
                    </div>
                    {editMode ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editData.thresholds?.excellent_score || 95}
                        onChange={(e) => updateThreshold('excellent_score', e.target.value)}
                        className="w-full bg-[#0d1117] border border-green-900/50 px-3 py-2 text-3xl text-white font-mono rounded focus:border-green-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-3xl font-bold text-white font-mono">
                        {editData.thresholds?.excellent_score || 95}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Export JSON */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  EXPORT CRITIC JSON
                </h2>
                <button
                  onClick={() => {
                    const json = JSON.stringify(editData, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `critic-${editData.version_name || 'config'}.json`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-[#21262d] border border-[#30363d] text-gray-300 hover:bg-[#30363d] transition-colors text-xs font-mono"
                >
                  DOWNLOAD JSON
                </button>
              </div>

              <pre className="bg-[#0d1117] border border-[#30363d] p-4 text-xs text-gray-400 font-mono overflow-x-auto rounded max-h-48 overflow-y-auto">
                {JSON.stringify(editData, null, 2)}
              </pre>
            </div>

          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={true}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          type={confirmModal.type}
          onConfirm={confirmModal.onConfirm}
          onCancel={confirmModal.onCancel}
        />
      )}
    </div>
  );
};

export default EvaluationConfigurator;
