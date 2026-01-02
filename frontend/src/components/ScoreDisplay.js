import React from 'react';

function ScoreGauge({ score, label, color, weight }) {
  const getColorClass = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGaugeColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(${color} ${score * 3.6}deg, #e5e7eb ${score * 3.6}deg)`,
        }}
      >
        <div className="absolute w-20 h-20 bg-white rounded-full flex items-center justify-center">
          <span className={`text-2xl font-bold ${getColorClass(score)}`}>
            {Math.round(score)}
          </span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
      <span className="text-xs text-gray-500">{weight}% weight</span>
    </div>
  );
}

function ScoreDisplay({ scores }) {
  const dimensions = [
    { key: 'canon_fidelity', label: 'Canon Fidelity', color: '#22c55e', weight: 30 },
    { key: 'voice_consistency', label: 'Voice', color: '#8b5cf6', weight: 25 },
    { key: 'brand_safety', label: 'Brand Safety', color: '#f59e0b', weight: 30 },
    { key: 'legal_compliance', label: 'Legal', color: '#3b82f6', weight: 15 },
  ];

  const getTotalColor = (score) => {
    if (score >= 85) return 'from-green-400 to-green-600';
    if (score >= 70) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header with Total Score */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Evaluation Results</h3>
          <p className="text-sm text-gray-500">Scored against Woody Character Card</p>
        </div>
        <div className={`bg-gradient-to-r ${getTotalColor(scores.total)} text-white px-6 py-3 rounded-xl`}>
          <div className="text-3xl font-bold">{scores.total}</div>
          <div className="text-xs opacity-90">Total Score</div>
        </div>
      </div>

      {/* Certification Badge */}
      <div className="mb-6">
        {scores.canonsafe_certified ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-800">CanonSafe Certified</h4>
              <p className="text-sm text-green-700">This response meets all character fidelity and safety requirements.</p>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-red-800">Not Certified</h4>
              <p className="text-sm text-red-700">This response does not meet certification requirements. See details below.</p>
            </div>
          </div>
        )}
      </div>

      {/* Score Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {dimensions.map((dim) => (
          <ScoreGauge
            key={dim.key}
            score={scores[dim.key]}
            label={dim.label}
            color={dim.color}
            weight={dim.weight}
          />
        ))}
      </div>

      {/* Explanations */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Detailed Analysis</h4>
        {dimensions.map((dim) => {
          const score = scores[dim.key];
          const explanation = scores.explanations[dim.key];
          const isPassing = dim.key === 'canon_fidelity' ? score >= 80 :
                           dim.key === 'voice_consistency' ? score >= 70 :
                           dim.key === 'brand_safety' ? score >= 95 :
                           score >= 100;

          return (
            <div
              key={dim.key}
              className={`p-4 rounded-lg border ${
                isPassing ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">{dim.label}</span>
                <span
                  className={`text-sm font-semibold ${
                    isPassing ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {Math.round(score)}/100
                </span>
              </div>
              <p className="text-sm text-gray-600">{explanation}</p>
            </div>
          );
        })}
      </div>

      {/* Pass/Fail Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            <span className="font-medium">Thresholds:</span> Canon 80+ | Voice 70+ | Safety 95+ | Legal 100
          </span>
          <span className={`text-sm font-semibold ${scores.passed ? 'text-green-600' : 'text-red-600'}`}>
            {scores.passed ? 'PASSED' : 'FAILED'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScoreDisplay;
