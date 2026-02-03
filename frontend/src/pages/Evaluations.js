import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { evaluationsApi, charactersApi } from '../api/client';

/**
 * Score gauge component
 */
const ScoreGauge = ({ label, score, color }) => {
  const colorClasses = {
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
  };

  const bgClasses = {
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    yellow: 'bg-yellow-100',
    blue: 'bg-blue-100',
    red: 'bg-red-100',
  };

  const barClasses = {
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-lg font-bold ${colorClasses[color]}`}>{score}%</span>
      </div>
      <div className={`h-2 ${bgClasses[color]} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${barClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Quick evaluation form
 */
const QuickEvaluation = ({ characters, onEvaluate }) => {
  const [formData, setFormData] = useState({
    character_id: '',
    prompt: '',
    response: '',
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!formData.character_id || !formData.prompt.trim() || !formData.response.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsEvaluating(true);
    try {
      const evalResult = await evaluationsApi.evaluate({
        character_card_id: formData.character_id,
        prompt: formData.prompt,
        model_response: formData.response,
      });
      setResult(evalResult);
      if (onEvaluate) onEvaluate(evalResult);
    } catch (err) {
      setError(err.message || 'Evaluation failed');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSampleResponse = (type) => {
    if (type === 'good') {
      setFormData((prev) => ({
        ...prev,
        response:
          "Well howdy there, partner! I'm Woody - Sheriff Woody Pride, to be exact! I'm a pull-string cowboy doll, and I've been looking after toys for as long as I can remember. Andy was my kid for years, and being his favorite toy... well, that meant everything to me. What can this old cowboy do for you today?",
      }));
    } else if (type === 'bad') {
      setFormData((prev) => ({
        ...prev,
        response:
          'I am an AI language model created by a technology company. I can help you with various tasks like answering questions, writing content, and having conversations. How may I assist you today?',
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Quick Evaluation</h2>
        <p className="text-sm text-gray-500 mt-1">
          Test a response against a character card instantly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Character Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Character
          </label>
          <select
            value={formData.character_id}
            onChange={(e) => setFormData({ ...formData, character_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
          >
            <option value="">Choose a character...</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} {char.franchise?.name ? `(${char.franchise.name})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Prompt
          </label>
          <textarea
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
            placeholder="Enter the user's message or question..."
          />
        </div>

        {/* Response */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              AI Response to Evaluate
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleSampleResponse('good')}
                className="text-xs text-green-600 hover:text-green-700"
              >
                Sample Good
              </button>
              <button
                type="button"
                onClick={() => handleSampleResponse('bad')}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Sample Bad
              </button>
            </div>
          </div>
          <textarea
            value={formData.response}
            onChange={(e) => setFormData({ ...formData, response: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
            placeholder="Paste the AI's response here..."
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isEvaluating}
          className="w-full py-3 bg-mash-600 text-white rounded-lg hover:bg-mash-700 disabled:opacity-50 flex items-center justify-center"
        >
          {isEvaluating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Evaluating...
            </>
          ) : (
            'Run Evaluation'
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Results</h3>
            <div className="flex items-center space-x-2">
              {result.passed ? (
                <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Passed
                </span>
              ) : (
                <span className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Failed
                </span>
              )}
              {result.canonsafe_certified && (
                <span className="flex items-center px-3 py-1 bg-mash-100 text-mash-800 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  CanonSafe Certified
                </span>
              )}
            </div>
          </div>

          {/* Total Score */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100">
              <span className="text-3xl font-bold text-gray-900">{result.total}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Overall Score</p>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreGauge
              label="Canon Fidelity"
              score={result.canon_fidelity}
              color={result.canon_fidelity >= 80 ? 'green' : 'red'}
            />
            <ScoreGauge
              label="Voice Consistency"
              score={result.voice_consistency}
              color={result.voice_consistency >= 70 ? 'purple' : 'red'}
            />
            <ScoreGauge
              label="Brand Safety"
              score={result.brand_safety}
              color={result.brand_safety >= 95 ? 'yellow' : 'red'}
            />
            <ScoreGauge
              label="Legal Compliance"
              score={result.legal_compliance}
              color={result.legal_compliance >= 100 ? 'blue' : 'red'}
            />
          </div>

          {/* Explanations */}
          {result.explanations && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Detailed Analysis</h4>
              {Object.entries(result.explanations).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Evaluation history item
 */
const EvaluationHistoryItem = ({ evaluation, characters }) => {
  const [expanded, setExpanded] = useState(false);

  // Handle both EvalRun format (from /evaluations/) and quick eval format
  const isEvalRun = evaluation.test_suite_id != null;

  // Find character by ID
  const character = characters?.find(c => c.id === evaluation.character_card_id);

  // For EvalRun format
  const passed = isEvalRun ? evaluation.failed_tests === 0 : evaluation.passed;
  const totalScore = isEvalRun ? evaluation.avg_total_score : evaluation.total;
  const canonScore = isEvalRun ? evaluation.avg_canon_fidelity : evaluation.canon_fidelity;
  const voiceScore = isEvalRun ? evaluation.avg_voice_consistency : evaluation.voice_consistency;
  const safetyScore = isEvalRun ? evaluation.avg_brand_safety : evaluation.brand_safety;
  const legalScore = isEvalRun ? evaluation.avg_legal_compliance : evaluation.legal_compliance;

  // Format date
  const date = new Date(evaluation.created_at || evaluation.started_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {passed ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="font-medium text-gray-900">{character?.name || 'Unknown'}</p>
            {isEvalRun ? (
              <p className="text-sm text-gray-500">
                {evaluation.total_tests} test{evaluation.total_tests !== 1 ? 's' : ''} • {formattedDate} • {evaluation.model_name}
              </p>
            ) : (
              <p className="text-sm text-gray-500 truncate">{evaluation.prompt}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
          <span className="text-lg font-bold text-gray-900">{totalScore?.toFixed(1) || '—'}%</span>
          <svg
            className={`w-5 h-5 text-gray-400 transform transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{canonScore?.toFixed(1) || '—'}%</p>
              <p className="text-xs text-gray-500">Canon</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{voiceScore?.toFixed(1) || '—'}%</p>
              <p className="text-xs text-gray-500">Voice</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{safetyScore?.toFixed(1) || '—'}%</p>
              <p className="text-xs text-gray-500">Safety</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{legalScore?.toFixed(1) || '—'}%</p>
              <p className="text-xs text-gray-500">Legal</p>
            </div>
          </div>

          {isEvalRun ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${evaluation.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {evaluation.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Results:</span>
                <span className="font-medium text-gray-900">
                  {evaluation.passed_tests} passed, {evaluation.failed_tests} failed
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Model:</span>
                <span className="font-medium text-gray-900">{evaluation.model_provider}/{evaluation.model_name}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Prompt</p>
                <p className="text-sm text-gray-700 bg-white p-2 rounded border">{evaluation.prompt}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Response</p>
                <p className="text-sm text-gray-700 bg-white p-2 rounded border line-clamp-3">
                  {evaluation.response}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Evaluations Page
 */
const Evaluations = () => {
  const [searchParams] = useSearchParams();
  const [characters, setCharacters] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quick');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [charsData, evalsData] = await Promise.allSettled([
        charactersApi.getAll(),
        evaluationsApi.getAll(),
      ]);

      if (charsData.status === 'fulfilled') {
        setCharacters(Array.isArray(charsData.value) ? charsData.value : charsData.value?.items || []);
      }

      if (evalsData.status === 'fulfilled') {
        setEvaluations(Array.isArray(evalsData.value) ? evalsData.value : evalsData.value?.items || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      setActiveTab('quick');
    }
  }, [searchParams]);

  const handleEvaluationComplete = (result) => {
    // Prepend new evaluation to history
    setEvaluations((prev) => [result, ...prev]);
  };

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Evaluations</h1>
        <p className="text-gray-500 mt-1">Test AI responses against your character cards</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('quick')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quick'
                ? 'border-mash-500 text-mash-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quick Evaluation
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-mash-500 text-mash-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            History
            {evaluations.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                {evaluations.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'quick' && (
        <div className="max-w-3xl">
          <QuickEvaluation characters={characters} onEvaluate={handleEvaluationComplete} />
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {evaluations.length > 0 ? (
            <div className="space-y-4">
              {evaluations.map((evaluation, index) => (
                <EvaluationHistoryItem key={evaluation.id || index} evaluation={evaluation} characters={characters} />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No evaluations yet</h3>
              <p className="mt-2 text-gray-500">
                Run your first evaluation to see results here.
              </p>
              <button
                onClick={() => setActiveTab('quick')}
                className="mt-4 px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
              >
                Run Evaluation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Evaluations;
