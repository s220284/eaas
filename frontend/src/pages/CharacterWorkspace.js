import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { charactersApi, evaluationsApi } from '../api/client';

/**
 * Character Workspace - Full data editing interface
 *
 * Design Philosophy: "Research Laboratory"
 * - Monospaced typography for data precision
 * - Grid-based layout with clear sections
 * - Inline editing with visual feedback
 * - Version control UI inspired by Git
 */

const CharacterWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [character, setCharacter] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [versions, setVersions] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('canon');
  const [editMode, setEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Editable state
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    loadCharacter();
    loadEvaluations();
    loadAllCharacters();
  }, [id]);

  const loadCharacter = async () => {
    try {
      const data = await charactersApi.getById(id);
      setCharacter(data);
      setEditedData(data.current_version);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load character:', error);
      setLoading(false);
    }
  };

  const loadEvaluations = async () => {
    try {
      const data = await evaluationsApi.getAll({ character_id: id });
      setEvaluations(data.slice(0, 10)); // Last 10 evaluations
    } catch (error) {
      console.error('Failed to load evaluations:', error);
    }
  };

  const loadAllCharacters = async () => {
    try {
      const data = await charactersApi.getAll();
      setAllCharacters(data);
    } catch (error) {
      console.error('Failed to load all characters:', error);
    }
  };

  const handleFieldChange = (section, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Create new version with edited data
      await charactersApi.update(id, {
        initial_version: editedData
      });
      setHasChanges(false);
      await loadCharacter();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-mono text-sm">LOADING CHARACTER DATA...</p>
        </div>
      </div>
    );
  }

  if (!character || !character.current_version) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-mono text-sm">CHARACTER NOT FOUND</p>
          <button
            onClick={() => navigate('/characters')}
            className="mt-4 px-4 py-2 bg-gray-800 text-white font-mono text-xs hover:bg-gray-900"
          >
            ← BACK TO CHARACTERS
          </button>
        </div>
      </div>
    );
  }

  const version = editedData || character.current_version;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: '"IBM Plex Mono", "SF Mono", Monaco, monospace' }}>
      {/* Fixed Header */}
      <div className="sticky top-0 z-30 bg-white border-b-2 border-gray-900 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/characters')}
                className="text-gray-500 hover:text-gray-900 font-mono text-xs uppercase tracking-wider"
              >
                ← Characters
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{character.name}</h1>
                <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">
                  Character #{character.id.slice(0, 8)} • Version {version.version_number || 1}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={character.status} />
                <ContentRatingBadge rating={version.safety_content_rating} />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {hasChanges && (
                <span className="text-xs text-orange-600 font-mono uppercase tracking-wider animate-pulse">
                  • Unsaved Changes
                </span>
              )}
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border-2 transition-all ${
                  editMode
                    ? 'bg-orange-50 text-orange-700 border-orange-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                }`}
              >
                {editMode ? '✓ Edit Mode' : 'Edit'}
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className={`px-6 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                  hasChanges
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {saving ? 'Saving...' : 'Save Version'}
              </button>
              <button
                className="px-4 py-2 bg-cyan-600 text-white font-mono text-xs uppercase tracking-wider hover:bg-cyan-700 transition-all"
              >
                Run Eval →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8">

          {/* Left Sidebar - Section Navigation */}
          <div className="col-span-2">
            <div className="sticky top-24 space-y-1">
              <SectionButton
                id="canon"
                label="Canon Pack"
                icon="◆"
                active={activeSection === 'canon'}
                onClick={() => setActiveSection('canon')}
              />
              <SectionButton
                id="voice"
                label="Voice Pack"
                icon="◇"
                active={activeSection === 'voice'}
                onClick={() => setActiveSection('voice')}
              />
              <SectionButton
                id="safety"
                label="Safety Pack"
                icon="◈"
                active={activeSection === 'safety'}
                onClick={() => setActiveSection('safety')}
              />
              <SectionButton
                id="legal"
                label="Legal Pack"
                icon="◉"
                active={activeSection === 'legal'}
                onClick={() => setActiveSection('legal')}
              />

              <div className="pt-6 mt-6 border-t border-gray-300">
                <SectionButton
                  id="evaluations"
                  label="Evaluations"
                  icon="◎"
                  active={activeSection === 'evaluations'}
                  onClick={() => setActiveSection('evaluations')}
                />
                <SectionButton
                  id="versions"
                  label="Versions"
                  icon="◐"
                  active={activeSection === 'versions'}
                  onClick={() => setActiveSection('versions')}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-7">
            {activeSection === 'canon' && (
              <CanonPack data={version} editMode={editMode} onChange={handleFieldChange} allCharacters={allCharacters} />
            )}
            {activeSection === 'voice' && (
              <VoicePack data={version} editMode={editMode} onChange={handleFieldChange} />
            )}
            {activeSection === 'safety' && (
              <SafetyPack data={version} editMode={editMode} onChange={handleFieldChange} />
            )}
            {activeSection === 'legal' && (
              <LegalPack data={version} editMode={editMode} onChange={handleFieldChange} />
            )}
            {activeSection === 'evaluations' && (
              <EvaluationsSection evaluations={evaluations} />
            )}
            {activeSection === 'versions' && (
              <VersionsSection versions={versions} currentVersion={version.version_number || 1} />
            )}
          </div>

          {/* Right Sidebar - Quick Stats */}
          <div className="col-span-3">
            <div className="sticky top-24 space-y-6">
              <QuickStatsCard character={character} version={version} />
              <DataQualityCard version={version} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Component: Section Navigation Button
// ============================================================================

const SectionButton = ({ id, label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-l-4 ${
      active
        ? 'bg-gray-900 text-white border-cyan-500'
        : 'bg-white text-gray-600 border-transparent hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

// ============================================================================
// Component: Status Badge
// ============================================================================

const StatusBadge = ({ status }) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    pending_approval: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    approved: 'bg-green-100 text-green-700 border-green-300',
    archived: 'bg-gray-100 text-gray-500 border-gray-200'
  };

  return (
    <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest border ${colors[status] || colors.draft}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

// ============================================================================
// Component: Content Rating Badge
// ============================================================================

const ContentRatingBadge = ({ rating }) => (
  <span className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-indigo-600 text-white border-2 border-indigo-800">
    {rating}
  </span>
);

// ============================================================================
// Section: Canon Pack
// ============================================================================

const CanonPack = ({ data, editMode, onChange, allCharacters }) => {
  const facts = data.canon_facts || {};
  const relationships = data.canon_relationships || [];
  const voice = data.canon_voice || {};

  return (
    <div className="space-y-8">
      <SectionHeader title="Canon Pack" subtitle="Canonical character facts and relationships" icon="◆" />

      {/* Canon Facts */}
      <DataBlock title="Canon Facts" count={Object.keys(facts).length}>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(facts).map(([key, fact]) => (
            <FactCard key={key} factId={key} fact={fact} editMode={editMode} />
          ))}
        </div>
      </DataBlock>

      {/* Relationships */}
      <DataBlock title="Relationships" count={relationships.length}>
        <div className="space-y-3">
          {relationships.map((rel, idx) => (
            <RelationshipCard key={idx} relationship={rel} editMode={editMode} allCharacters={allCharacters} />
          ))}
        </div>
      </DataBlock>
    </div>
  );
};

// ============================================================================
// Section: Voice Pack
// ============================================================================

const VoicePack = ({ data, editMode, onChange }) => {
  const voice = data.canon_voice || {};

  return (
    <div className="space-y-8">
      <SectionHeader title="Voice Pack" subtitle="Character voice and personality profile" icon="◇" />

      {/* Personality Traits */}
      <DataBlock title="Personality Traits" count={voice.personality_traits?.length || 0}>
        <div className="flex flex-wrap gap-2">
          {voice.personality_traits?.map((trait, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-mono border border-purple-200">
              {trait}
            </span>
          ))}
        </div>
      </DataBlock>

      {/* Tone & Style */}
      <DataBlock title="Tone & Speech Style">
        <div className="space-y-4">
          <DataField label="Tone" value={voice.tone} />
          <DataField label="Speech Style" value={voice.speech_style} />
          <DataField label="Vocabulary Level" value={voice.vocabulary_level} />
          <DataField label="Emotional Range" value={voice.emotional_range} />
        </div>
      </DataBlock>

      {/* Catchphrases */}
      <DataBlock title="Catchphrases" count={voice.catchphrases?.length || 0}>
        <div className="space-y-3">
          {voice.catchphrases?.map((phrase, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-400">
              <p className="text-sm font-medium text-gray-900">"{phrase.phrase}"</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                Frequency: {phrase.frequency}
              </p>
            </div>
          ))}
        </div>
      </DataBlock>
    </div>
  );
};

// ============================================================================
// Section: Safety Pack
// ============================================================================

const SafetyPack = ({ data, editMode, onChange }) => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Safety Pack" subtitle="Content safety and age-appropriateness" icon="◈" />

      {/* Content Rating */}
      <DataBlock title="Content Rating">
        <div className="flex items-center space-x-4">
          <div className="px-6 py-3 bg-indigo-600 text-white text-2xl font-bold border-4 border-indigo-800">
            {data.safety_content_rating}
          </div>
          <p className="text-sm text-gray-600">MPAA-style content rating</p>
        </div>
      </DataBlock>

      {/* Prohibited Topics */}
      <DataBlock title="Prohibited Topics" count={data.safety_prohibited_topics?.length || 0}>
        <div className="flex flex-wrap gap-2">
          {data.safety_prohibited_topics?.map((topic, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-mono border border-red-200 uppercase">
              ⚠ {topic}
            </span>
          ))}
        </div>
      </DataBlock>

      {/* Required Disclosures */}
      <DataBlock title="Required Disclosures" count={data.safety_required_disclosures?.length || 0}>
        <div className="space-y-2">
          {data.safety_required_disclosures?.map((disclosure, idx) => (
            <div key={idx} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-gray-700">
              {disclosure}
            </div>
          ))}
        </div>
      </DataBlock>

      {/* Age Gating */}
      <DataBlock title="Age Gating">
        <div className="p-4 bg-gray-50 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Enabled</span>
            <span className={`text-xs font-mono px-2 py-1 ${
              data.safety_age_gating?.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {data.safety_age_gating?.enabled ? 'YES' : 'NO'}
            </span>
          </div>
          {data.safety_age_gating?.enabled && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Minimum Age</p>
              <p className="text-lg font-bold text-gray-900">{data.safety_age_gating.minimum_age}+</p>
            </div>
          )}
        </div>
      </DataBlock>
    </div>
  );
};

// ============================================================================
// Section: Legal Pack
// ============================================================================

const LegalPack = ({ data, editMode, onChange }) => {
  const rights = data.legal_rights || {};
  const consent = data.legal_performer_consent || {};

  return (
    <div className="space-y-8">
      <SectionHeader title="Legal Pack" subtitle="Rights management and performer consent" icon="◉" />

      {/* Rights Holder */}
      <DataBlock title="Rights Holder">
        <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <p className="text-xs text-amber-700 uppercase tracking-widest mb-2">Copyright Owner</p>
          <p className="text-lg font-bold text-gray-900">{rights.name}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {rights.territories?.map((territory, idx) => (
              <span key={idx} className="px-2 py-1 bg-white text-amber-700 text-xs font-mono border border-amber-300">
                {territory}
              </span>
            ))}
          </div>
        </div>
      </DataBlock>

      {/* Performer Consent */}
      <DataBlock title="Performer Consent">
        <div className="space-y-4">
          <DataField label="Type" value={consent.type} />
          <DataField label="Performer Name" value={consent.performer_name} />
          <DataField label="Scope" value={consent.scope} />

          {consent.restrictions && consent.restrictions.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Restrictions</p>
              <div className="space-y-2">
                {consent.restrictions.map((restriction, idx) => (
                  <div key={idx} className="p-3 bg-red-50 border-l-4 border-red-400 text-sm text-gray-700">
                    • {restriction}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DataBlock>
    </div>
  );
};

// ============================================================================
// Section: Evaluations
// ============================================================================

const EvaluationsSection = ({ evaluations }) => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Evaluation History" subtitle="Past evaluation runs and scores" icon="◎" />

      {evaluations.length === 0 ? (
        <div className="p-12 text-center bg-white border-2 border-dashed border-gray-300">
          <p className="text-gray-500 font-mono text-sm mb-4">NO EVALUATIONS YET</p>
          <button className="px-6 py-3 bg-cyan-600 text-white font-mono text-xs uppercase tracking-wider hover:bg-cyan-700">
            Run First Evaluation →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((evalItem) => (
            <EvaluationCard key={evalItem.id} evaluation={evalItem} />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Section: Versions
// ============================================================================

const VersionsSection = ({ versions, currentVersion }) => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Version History" subtitle="Character card version control" icon="◐" />

      <div className="p-12 text-center bg-white border-2 border-dashed border-gray-300">
        <p className="text-gray-500 font-mono text-sm">VERSION HISTORY COMING SOON</p>
      </div>
    </div>
  );
};

// ============================================================================
// Reusable Components
// ============================================================================

const SectionHeader = ({ title, subtitle, icon }) => (
  <div className="border-b-2 border-gray-900 pb-4 mb-6">
    <h2 className="text-xl font-bold text-gray-900 flex items-center">
      <span className="text-cyan-600 mr-3 text-2xl">{icon}</span>
      {title}
    </h2>
    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{subtitle}</p>
  </div>
);

const DataBlock = ({ title, count, children }) => (
  <div className="bg-white border-2 border-gray-200 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{title}</h3>
      {count !== undefined && (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-mono">
          {count}
        </span>
      )}
    </div>
    {children}
  </div>
);

const DataField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-gray-900">{value || <span className="text-gray-400 italic">Not specified</span>}</p>
  </div>
);

const FactCard = ({ factId, fact, editMode }) => (
  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-cyan-500">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs text-cyan-700 uppercase tracking-widest mb-1 font-mono">{factId}</p>
        <p className="text-sm font-medium text-gray-900">{fact.value}</p>
        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
          <span>Source: {fact.source}</span>
          <span>•</span>
          <span>Confidence: {(fact.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div className="ml-4">
        <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
          <span className="text-lg font-bold text-cyan-600">{(fact.confidence * 100).toFixed(0)}</span>
        </div>
      </div>
    </div>
  </div>
);

const RelationshipCard = ({ relationship, editMode, allCharacters }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Find character by name
    const relatedChar = allCharacters?.find(
      c => c.name.toLowerCase() === relationship.character_name.toLowerCase()
    );
    if (relatedChar) {
      navigate(`/characters/${relatedChar.id}/workspace`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 bg-white border border-gray-200 flex items-center justify-between cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
    >
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">{relationship.character_name}</p>
        <p className="text-xs text-gray-500 mt-1">{relationship.description}</p>
      </div>
      <span className="ml-4 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-mono uppercase border border-indigo-200">
        {relationship.relationship_type}
      </span>
    </div>
  );
};

const EvaluationCard = ({ evaluation }) => {
  const evalScores = evaluation.scores || {};
  const avgScore = (
    (evalScores.canon_fidelity || 0) +
    (evalScores.voice_consistency || 0) +
    (evalScores.brand_safety || 0) +
    (evalScores.legal_compliance || 0)
  ) / 4;

  return (
    <div className="p-5 bg-white border-2 border-gray-200 hover:border-cyan-500 transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-gray-900">Evaluation #{evaluation.id.slice(0, 8)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(evaluation.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-cyan-600">{avgScore.toFixed(1)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Score</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <ScorePill label="Canon" score={evalScores.canon_fidelity || 0} color="blue" />
        <ScorePill label="Voice" score={evalScores.voice_consistency || 0} color="purple" />
        <ScorePill label="Safety" score={evalScores.brand_safety || 0} color="green" />
        <ScorePill label="Legal" score={evalScores.legal_compliance || 0} color="amber" />
      </div>
    </div>
  );
};

const ScorePill = ({ label, score, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className={`p-2 border ${colors[color]} text-center`}>
      <p className="text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold">{score.toFixed(1)}</p>
    </div>
  );
};

const QuickStatsCard = ({ character, version }) => {
  const factCount = Object.keys(version.canon_facts || {}).length;
  const relationshipCount = (version.canon_relationships || []).length;
  const catchphraseCount = (version.canon_voice?.catchphrases || []).length;

  return (
    <div className="bg-white border-2 border-gray-900 p-5 shadow-lg">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-300 pb-2">
        Quick Stats
      </h3>
      <div className="space-y-3">
        <StatRow label="Canon Facts" value={factCount} />
        <StatRow label="Relationships" value={relationshipCount} />
        <StatRow label="Catchphrases" value={catchphraseCount} />
        <StatRow label="Content Rating" value={version.safety_content_rating} />
      </div>
    </div>
  );
};

const DataQualityCard = ({ version }) => {
  const hasAllData =
    Object.keys(version.canon_facts || {}).length > 0 &&
    (version.canon_relationships || []).length > 0 &&
    version.canon_voice?.personality_traits?.length > 0 &&
    version.legal_rights?.name;

  const completeness = hasAllData ? 95 : 60;

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 p-5">
      <h3 className="text-xs font-bold text-cyan-900 uppercase tracking-wider mb-4">
        Data Quality
      </h3>
      <div className="relative h-3 bg-cyan-100 rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 left-0 h-full bg-cyan-600 transition-all duration-1000"
          style={{ width: `${completeness}%` }}
        ></div>
      </div>
      <p className="text-xs text-cyan-700 font-mono">{completeness}% Complete</p>
    </div>
  );
};

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-600 font-mono">{label}</span>
    <span className="font-bold text-gray-900 font-mono">{value}</span>
  </div>
);

export default CharacterWorkspace;
