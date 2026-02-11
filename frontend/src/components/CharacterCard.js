import React, { useState } from 'react';

function CharacterCard({ character }) {
  const [activeTab, setActiveTab] = useState('canon');

  const tabs = [
    { id: 'canon', label: 'Canon', color: 'canon' },
    { id: 'voice', label: 'Voice', color: 'voice' },
    { id: 'safety', label: 'Safety', color: 'safety' },
    { id: 'legal', label: 'Legal', color: 'legal' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6">
        <div className="flex items-center space-x-4">
          {character.image_url ? (
            <img
              src={character.image_url}
              alt={character.name}
              className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white"
            />
          ) : (
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
              {character.name?.charAt(0) || 'C'}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white">{character.name}</h2>
            <p className="text-yellow-100">{character.franchise}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-3">
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {character.status}
          </span>
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
            Rated {character.contentRating}
          </span>
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
            v{character.version}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? `text-${tab.color} border-b-2 border-${tab.color}`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === tab.id ? {
                color: tab.color === 'canon' ? '#22c55e' :
                       tab.color === 'voice' ? '#8b5cf6' :
                       tab.color === 'safety' ? '#f59e0b' : '#3b82f6',
                borderBottomColor: tab.color === 'canon' ? '#22c55e' :
                       tab.color === 'voice' ? '#8b5cf6' :
                       tab.color === 'safety' ? '#f59e0b' : '#3b82f6',
              } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'canon' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Character Facts
              </h4>
              <dl className="space-y-2">
                {Object.entries(character.facts).map(([key, value]) => (
                  <div key={key} className="flex">
                    <dt className="text-sm text-gray-500 w-24 flex-shrink-0">{key}:</dt>
                    <dd className="text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Relationships
              </h4>
              <div className="space-y-2">
                {character.relationships.map((rel, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-900 font-medium">{rel.entity}</span>
                    <span className="text-gray-400">-</span>
                    <span className="text-gray-600">{rel.relationship}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Personality
              </h4>
              <p className="text-sm text-gray-700">{character.voice.personality}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Tone
              </h4>
              <p className="text-sm text-gray-700">{character.voice.tone}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Catchphrases
              </h4>
              <ul className="space-y-1">
                {character.voice.catchphrases.map((phrase, idx) => (
                  <li key={idx} className="text-sm text-gray-700 italic">"{phrase}"</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Content Rating
              </h4>
              <span className="inline-block bg-green-100 text-green-800 text-lg font-bold px-3 py-1 rounded">
                {character.contentRating}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Prohibited Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {character.prohibitedTopics.map((topic, idx) => (
                  <span key={idx} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                    {typeof topic === 'string' ? topic : topic.topic || topic.name || JSON.stringify(topic)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Rights Holder
              </h4>
              <p className="text-sm text-gray-700">Disney / Pixar</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Performer
              </h4>
              <p className="text-sm text-gray-700">Tom Hanks (voice reference only)</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Territories
              </h4>
              <p className="text-sm text-gray-700">Worldwide</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                AI-generated content must include disclosure. Voice should reference character,
                not impersonate actor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterCard;
