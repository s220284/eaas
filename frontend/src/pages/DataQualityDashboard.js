import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataQualityApi, franchisesApi } from '../api/client';
import { useApi } from '../hooks/useApi';

/**
 * Data Quality Dashboard
 *
 * A sophisticated data monitoring interface that provides:
 * - Quality metrics overview
 * - Character quality list with inline scores
 * - Issue tracking and resolution
 * - Multi-dimensional filtering
 */
export default function DataQualityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    franchise_id: null,
    status: null,
    needs_review: false,
    min_score: null,
    max_score: null,
  });

  // Fetch data
  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useApi(
    () => dataQualityApi.getOverview(),
    [],
    { immediate: true }
  );

  const { data: charactersData, isLoading: charactersLoading, refetch: refetchCharacters } = useApi(
    () => dataQualityApi.getCharacters(filters),
    [filters],
    { immediate: true }
  );

  const { data: issuesData, isLoading: issuesLoading, refetch: refetchIssues } = useApi(
    () => dataQualityApi.getIssues(filters),
    [filters],
    { immediate: true }
  );

  const { data: franchises } = useApi(
    () => franchisesApi.getAll(),
    [],
    { immediate: true }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      franchise_id: null,
      status: null,
      needs_review: false,
      min_score: null,
      max_score: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                    Data Quality Observatory
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Real-time character data monitoring and validation</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                refetchOverview();
                refetchCharacters();
                refetchIssues();
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-8 mt-8 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'characters', label: 'Characters', icon: '👥' },
              { id: 'issues', label: 'Issues', icon: '⚠️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab overview={overview} isLoading={overviewLoading} />
        )}

        {activeTab === 'characters' && (
          <CharactersTab
            charactersData={charactersData}
            isLoading={charactersLoading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            franchises={franchises}
          />
        )}

        {activeTab === 'issues' && (
          <IssuesTab issuesData={issuesData} isLoading={issuesLoading} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab({ overview, isLoading }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!overview) {
    return <EmptyState message="Unable to load overview data" />;
  }

  const { summary, average_scores, recent_evaluations, certification_rate } = overview;

  return (
    <div className="space-y-6">
      {/* Alert for characters needing attention */}
      {summary.needs_attention > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-800 font-medium">
                {summary.needs_attention} character{summary.needs_attention !== 1 ? 's' : ''} need{summary.needs_attention === 1 ? 's' : ''} attention
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Characters */}
        <MetricCard
          title="Total Characters"
          value={summary.total_characters}
          subtitle="Across all franchises"
          color="indigo"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />

        {/* Certification Rate */}
        <MetricCard
          title="Certification Rate"
          value={`${certification_rate}%`}
          subtitle={`${recent_evaluations} recent evaluations`}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Incomplete Characters */}
        <MetricCard
          title="Incomplete"
          value={summary.incomplete_characters}
          subtitle="Missing version data"
          color="amber"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Needs Attention */}
        <MetricCard
          title="Needs Attention"
          value={summary.needs_attention}
          subtitle="Requires review"
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Character Status Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Status Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(summary.by_status || {}).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusBadge status={status} />
                <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      status === 'approved' ? 'bg-green-500' :
                      status === 'draft' ? 'bg-gray-400' :
                      status === 'pending_approval' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${(count / summary.total_characters) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-semibold text-gray-900 w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Average Scores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Average Evaluation Scores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScoreMeter label="Canon Fidelity" score={average_scores.canon_fidelity} color="green" />
          <ScoreMeter label="Voice Consistency" score={average_scores.voice_consistency} color="purple" />
          <ScoreMeter label="Brand Safety" score={average_scores.brand_safety} color="orange" />
          <ScoreMeter label="Legal Compliance" score={average_scores.legal_compliance} color="blue" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Characters Tab
// ============================================================================

function CharactersTab({ charactersData, isLoading, filters, onFilterChange, onResetFilters, franchises }) {
  if (isLoading) {
    return <LoadingState />;
  }

  const characters = charactersData?.characters || [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
            Filters
          </h3>
          <button
            onClick={onResetFilters}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Reset all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Franchise Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Franchise</label>
            <select
              value={filters.franchise_id || ''}
              onChange={(e) => onFilterChange('franchise_id', e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Franchises</option>
              {franchises?.map(franchise => (
                <option key={franchise.id} value={franchise.id}>{franchise.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange('status', e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Needs Review Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Show Only</label>
            <label className="flex items-center space-x-3 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={filters.needs_review}
                onChange={(e) => onFilterChange('needs_review', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">Needs Review</span>
            </label>
          </div>
        </div>
      </div>

      {/* Characters List */}
      {characters.length === 0 ? (
        <EmptyState message="No characters found matching your filters" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Character</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {characters.map(character => (
                  <CharacterRow key={character.id} character={character} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Issues Tab
// ============================================================================

function IssuesTab({ issuesData, isLoading }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!issuesData) {
    return <EmptyState message="Unable to load issues data" />;
  }

  const { summary, top_issues, issues } = issuesData;

  return (
    <div className="space-y-6">
      {/* Issue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Issues"
          value={summary.total_issues}
          subtitle={`${summary.affected_characters} characters affected`}
          color="gray"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <MetricCard
          title="Errors"
          value={summary.by_severity.error}
          subtitle="Critical issues"
          color="red"
          icon={<span className="text-2xl">🔴</span>}
        />
        <MetricCard
          title="Warnings"
          value={summary.by_severity.warning}
          subtitle="Attention needed"
          color="amber"
          icon={<span className="text-2xl">🟡</span>}
        />
        <MetricCard
          title="Info"
          value={summary.by_severity.info}
          subtitle="Suggestions"
          color="blue"
          icon={<span className="text-2xl">🔵</span>}
        />
      </div>

      {/* Top Issues */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Top Issues
        </h3>
        <div className="space-y-3">
          {top_issues.map((issue, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <SeverityBadge severity={issue.severity} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatIssueType(issue.type)}</p>
                  <p className="text-xs text-gray-500">{issue.count} character{issue.count !== 1 ? 's' : ''} affected</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-semibold text-gray-900">{issue.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Issues List */}
      {issues.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              All Issues ({issues.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {issues.slice(0, 50).map((issue, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <SeverityBadge severity={issue.severity} />
                    <div>
                      <Link
                        to={`/characters/${issue.character_id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        {issue.character_name}
                      </Link>
                      <p className="text-sm text-gray-900 mt-1">{issue.message}</p>
                      <p className="text-xs text-gray-500 mt-1">Field: {issue.field}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Reusable Components
// ============================================================================

function MetricCard({ title, value, subtitle, color, icon }) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    gray: 'from-gray-500 to-gray-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    blue: 'from-blue-500 to-blue-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center shadow-sm`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{value}</p>
        <p className="text-sm font-medium text-gray-700 mt-1">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function ScoreMeter({ label, score, color }) {
  const colorClasses = {
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    blue: 'text-blue-600',
  };

  const bgColorClasses = {
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-2xl font-bold ${colorClasses[color]}`} style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${bgColorClasses[color]} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    draft: { color: 'gray', label: 'Draft' },
    pending_approval: { color: 'yellow', label: 'Pending' },
    approved: { color: 'green', label: 'Approved' },
    archived: { color: 'gray', label: 'Archived' },
  };

  const config = statusConfig[status] || { color: 'gray', label: status };
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
      {config.label}
    </span>
  );
}

function SeverityBadge({ severity }) {
  const severityConfig = {
    error: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Error' },
    warning: { color: 'bg-amber-100 text-amber-800', icon: '🟡', label: 'Warning' },
    info: { color: 'bg-blue-100 text-blue-800', icon: '🔵', label: 'Info' },
  };

  const config = severityConfig[severity] || severityConfig.warning;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}

function CharacterRow({ character }) {
  const latestEval = character.latest_evaluation;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link to={`/characters/${character.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          {character.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={character.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {latestEval ? (
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {latestEval.scores.total.toFixed(0)}
            </span>
            <div className="flex-1 w-24 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  latestEval.scores.total >= 85 ? 'bg-green-500' :
                  latestEval.scores.total >= 70 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${latestEval.scores.total}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-400">No evaluation</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {latestEval ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs">✓ {latestEval.passed_tests}/{latestEval.total_tests} passed</span>
            </div>
            {latestEval.certified && (
              <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Certified
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {character.needs_review ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Needs Review
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link to={`/characters/${character.id}`} className="text-indigo-600 hover:text-indigo-900">
          View
        </Link>
      </td>
    </tr>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="mt-4 text-sm font-medium text-gray-900">{message}</h3>
    </div>
  );
}

function formatIssueType(type) {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
