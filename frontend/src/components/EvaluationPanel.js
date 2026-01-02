import React from 'react';

function EvaluationPanel({
  prompt,
  setPrompt,
  response,
  setResponse,
  onEvaluate,
  isEvaluating,
  samplePrompts,
  onSamplePrompt,
  selectedPrompt,
  onSampleResponse
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Evaluate AI Response
      </h3>

      {/* Sample Prompts */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Try a sample prompt:
        </label>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onSamplePrompt(sample)}
              className={`text-xs px-3 py-1.5 rounded-full transition ${
                selectedPrompt === sample
                  ? 'bg-mash-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sample.length > 30 ? sample.substring(0, 30) + '...' : sample}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          User Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter the prompt that was sent to the AI..."
          className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mash-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Response Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            AI Response to Evaluate
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => onSampleResponse('good')}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
            >
              Good Example
            </button>
            <button
              onClick={() => onSampleResponse('bad')}
              className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
            >
              Bad Example
            </button>
            <button
              onClick={() => onSampleResponse('unsafe')}
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            >
              Unsafe Example
            </button>
          </div>
        </div>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Paste the AI's response here for evaluation..."
          className="w-full h-36 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mash-500 focus:border-transparent resize-none font-mono text-sm"
        />
      </div>

      {/* Evaluate Button */}
      <button
        onClick={onEvaluate}
        disabled={!prompt.trim() || !response.trim() || isEvaluating}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          isEvaluating
            ? 'bg-gray-400 cursor-wait'
            : !prompt.trim() || !response.trim()
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-mash-600 hover:bg-mash-700'
        }`}
      >
        {isEvaluating ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Evaluating...</span>
          </span>
        ) : (
          'Evaluate Response'
        )}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Response will be scored against the Woody Character Card across 4 dimensions
      </p>
    </div>
  );
}

export default EvaluationPanel;
