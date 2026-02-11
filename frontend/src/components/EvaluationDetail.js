import React, { useState } from 'react';

/**
 * Full evaluation detail view with export capabilities
 */
const EvaluationDetail = ({ evaluation, character, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Extract scores - handle both formats
  const scores = evaluation.scores || {
    canon_fidelity: evaluation.avg_canon_fidelity,
    voice_consistency: evaluation.avg_voice_consistency,
    brand_safety: evaluation.avg_brand_safety,
    legal_compliance: evaluation.avg_legal_compliance,
    total: evaluation.avg_total_score,
  };

  // Extract explanations
  const explanations = evaluation.explanations || {};
  const results = evaluation.results || [];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Export to PDF (using browser print)
  const handlePrint = () => {
    window.print();
  };

  // Copy full text to clipboard
  const handleCopyToClipboard = () => {
    const text = generateFullText();
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Generate full text for export
  const generateFullText = () => {
    let text = `CANONSAFE™ EVALUATION REPORT\n`;
    text += `${'='.repeat(80)}\n\n`;
    text += `Character: ${character?.name || 'Unknown'}\n`;
    text += `Date: ${formatDate(evaluation.created_at)}\n`;
    text += `Evaluation ID: ${evaluation.id}\n`;
    text += `\n${'='.repeat(80)}\n\n`;

    text += `PROMPT:\n${evaluation.prompt || 'N/A'}\n\n`;
    text += `AI RESPONSE:\n${evaluation.model_response || 'N/A'}\n\n`;
    text += `${'='.repeat(80)}\n\n`;

    text += `SCORES:\n`;
    text += `Overall Score: ${scores.total?.toFixed(1) || 'N/A'}%\n`;
    text += `Canon Fidelity: ${scores.canon_fidelity?.toFixed(1) || 'N/A'}%\n`;
    text += `Voice Consistency: ${scores.voice_consistency?.toFixed(1) || 'N/A'}%\n`;
    text += `Brand Safety: ${scores.brand_safety?.toFixed(1) || 'N/A'}%\n`;
    text += `Legal Compliance: ${scores.legal_compliance?.toFixed(1) || 'N/A'}%\n`;
    text += `\n${'='.repeat(80)}\n\n`;

    text += `DETAILED ANALYSIS:\n\n`;
    Object.entries(explanations).forEach(([key, value]) => {
      const label = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      text += `${label.toUpperCase()}:\n${value}\n\n`;
    });

    return text;
  };

  // Download as text file
  const handleDownload = () => {
    const text = generateFullText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation-${character?.name || 'report'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!evaluation) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto print:shadow-none">
          {/* Header - hide on print */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl print:hidden z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Evaluation Details</h2>
                <p className="text-sm text-gray-500 mt-1">{character?.name || 'Unknown Character'}</p>
              </div>
              <div className="flex items-center space-x-2">
                {/* Action buttons */}
                <button
                  onClick={handleCopyToClipboard}
                  className={`px-3 py-2 text-sm font-medium border rounded-lg ${
                    copySuccess
                      ? 'text-green-700 bg-green-50 border-green-300'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Copy to clipboard"
                >
                  {copySuccess ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  title="Download as text file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  title="Print"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 print:p-8">
            {/* Print header - only show on print */}
            <div className="hidden print:block mb-6">
              <h1 className="text-2xl font-bold text-gray-900">CanonSafe™ Evaluation Report</h1>
              <p className="text-sm text-gray-600 mt-2">Character: {character?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-600">Date: {formatDate(evaluation.created_at)}</p>
              <p className="text-sm text-gray-600">Evaluation ID: {evaluation.id}</p>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Character:</span>
                  <span className="ml-2 text-gray-900">{character?.name || 'Unknown'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="ml-2 text-gray-900">{formatDate(evaluation.created_at)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 font-medium ${scores.total >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                    {scores.total >= 80 ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Overall Score:</span>
                  <span className="ml-2 text-gray-900 font-semibold">{scores.total?.toFixed(1) || 'N/A'}%</span>
                </div>
              </div>
            </div>

            {/* Prompt & Response */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Prompt</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{evaluation.prompt || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">AI Response</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{evaluation.model_response || 'N/A'}</p>
                </div>
              </div>

            </div>

            {/* Scores */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Score Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries({
                  'Canon Fidelity': scores.canon_fidelity,
                  'Voice Consistency': scores.voice_consistency,
                  'Brand Safety': scores.brand_safety,
                  'Legal Compliance': scores.legal_compliance,
                }).map(([label, score]) => (
                  <div key={label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{score?.toFixed(1) || 'N/A'}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Analysis */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Detailed Analysis</h3>
              <div className="space-y-4">
                {Object.entries(explanations).map(([key, value]) => {
                  const label = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  return (
                    <div key={key} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{label}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <p className="text-xs text-gray-500 text-center">
                Generated by CanonSafe™ • Evaluation ID: {evaluation.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetail;
