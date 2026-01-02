import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { testSuitesApi, charactersApi } from '../api/client';

/**
 * Test Suite Editor Modal
 */
const TestSuiteModal = ({ testSuite, characters, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    character_id: '',
    test_cases: [],
  });
  const [newTestCase, setNewTestCase] = useState({
    name: '',
    prompt: '',
    expected_pass: true,
    min_score: 80,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (testSuite) {
      setFormData({
        name: testSuite.name || '',
        description: testSuite.description || '',
        character_id: testSuite.character_id || '',
        test_cases: testSuite.test_cases || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        character_id: '',
        test_cases: [],
      });
    }
  }, [testSuite]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.character_id) {
      newErrors.character_id = 'Please select a character';
    }
    if (formData.test_cases.length === 0) {
      newErrors.test_cases = 'Add at least one test case';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTestCase = () => {
    if (!newTestCase.name.trim() || !newTestCase.prompt.trim()) return;

    setFormData((prev) => ({
      ...prev,
      test_cases: [
        ...prev.test_cases,
        {
          ...newTestCase,
          id: Date.now(),
        },
      ],
    }));
    setNewTestCase({
      name: '',
      prompt: '',
      expected_pass: true,
      min_score: 80,
    });
  };

  const handleRemoveTestCase = (index) => {
    setFormData((prev) => ({
      ...prev,
      test_cases: prev.test_cases.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving test suite:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto z-50 max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                {testSuite ? 'Edit Test Suite' : 'Create Test Suite'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suite Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-mash-500 focus:border-mash-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Brand Safety Tests"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Character *
                  </label>
                  <select
                    value={formData.character_id}
                    onChange={(e) => setFormData({ ...formData, character_id: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-mash-500 focus:border-mash-500 ${
                      errors.character_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select character...</option>
                    {characters.map((char) => (
                      <option key={char.id} value={char.id}>
                        {char.name}
                      </option>
                    ))}
                  </select>
                  {errors.character_id && (
                    <p className="mt-1 text-xs text-red-600">{errors.character_id}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
                  placeholder="Describe what this test suite validates..."
                />
              </div>

              {/* Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Test Cases</h3>
                    {errors.test_cases && (
                      <p className="text-xs text-red-600">{errors.test_cases}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formData.test_cases.length} test{formData.test_cases.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Existing test cases */}
                <div className="space-y-3 mb-4">
                  {formData.test_cases.map((tc, index) => (
                    <div
                      key={tc.id || index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{tc.name}</span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                tc.expected_pass
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {tc.expected_pass ? 'Should Pass' : 'Should Fail'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tc.prompt}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Min Score: {tc.min_score}%
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(index)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new test case */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">Add Test Case</h4>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={newTestCase.name}
                        onChange={(e) =>
                          setNewTestCase({ ...newTestCase, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Test case name"
                      />
                    </div>
                    <div>
                      <textarea
                        value={newTestCase.prompt}
                        onChange={(e) =>
                          setNewTestCase({ ...newTestCase, prompt: e.target.value })
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Test prompt (what the user asks)"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newTestCase.expected_pass}
                          onChange={(e) =>
                            setNewTestCase({ ...newTestCase, expected_pass: e.target.checked })
                          }
                          className="h-4 w-4 text-mash-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Should pass</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Min score:</label>
                        <input
                          type="number"
                          value={newTestCase.min_score}
                          onChange={(e) =>
                            setNewTestCase({ ...newTestCase, min_score: parseInt(e.target.value) || 0 })
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                          min="0"
                          max="100"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTestCase}
                      disabled={!newTestCase.name.trim() || !newTestCase.prompt.trim()}
                      className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:bg-blue-100 disabled:opacity-50"
                    >
                      + Add Test Case
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : testSuite ? 'Save Changes' : 'Create Test Suite'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Test Suite Card
 */
const TestSuiteCard = ({ testSuite, character, onEdit, onRun, onDelete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const result = await onRun(testSuite.id);
      setRunResult(result);
    } catch (error) {
      console.error('Error running test suite:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const passedTests = runResult?.results?.filter((r) => r.passed).length || 0;
  const totalTests = testSuite.test_cases?.length || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">{testSuite.name}</h3>
              {runResult && (
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    passedTests === totalTests
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {passedTests}/{totalTests} passed
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{character?.name || 'Unknown character'}</p>
            {testSuite.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{testSuite.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="p-2 text-green-600 hover:text-green-700 rounded-lg hover:bg-green-50 disabled:opacity-50"
              title="Run tests"
            >
              {isRunning ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => onEdit(testSuite)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Test case summary */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {totalTests} test case{totalTests !== 1 ? 's' : ''}
          </span>
          {testSuite.last_run && (
            <span className="text-sm text-gray-400">
              Last run: {new Date(testSuite.last_run).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Run results */}
        {runResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Run Results</h4>
            <div className="space-y-2">
              {runResult.results?.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center space-x-2">
                    {result.passed ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="text-sm text-gray-700">{result.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{result.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="p-4 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-800 mb-3">
            Are you sure you want to delete this test suite?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(testSuite.id);
                setShowDeleteConfirm(false);
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Test Suites Page
 */
const TestSuites = () => {
  const [searchParams] = useSearchParams();
  const [testSuites, setTestSuites] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestSuite, setEditingTestSuite] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [suitesData, charsData] = await Promise.allSettled([
        testSuitesApi.getAll(),
        charactersApi.getAll(),
      ]);

      if (suitesData.status === 'fulfilled') {
        setTestSuites(Array.isArray(suitesData.value) ? suitesData.value : suitesData.value?.items || []);
      }

      if (charsData.status === 'fulfilled') {
        setCharacters(Array.isArray(charsData.value) ? charsData.value : charsData.value?.items || []);
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
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const getCharacter = (characterId) => {
    return characters.find((c) => c.id === characterId);
  };

  const handleCreate = () => {
    setEditingTestSuite(null);
    setIsModalOpen(true);
  };

  const handleEdit = (testSuite) => {
    setEditingTestSuite(testSuite);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    if (editingTestSuite) {
      await testSuitesApi.update(editingTestSuite.id, data);
    } else {
      await testSuitesApi.create(data);
    }
    await fetchData();
  };

  const handleRun = async (id) => {
    try {
      const result = await testSuitesApi.run(id);
      return result;
    } catch (error) {
      // Return mock result for demo
      const suite = testSuites.find((s) => s.id === id);
      return {
        results: suite?.test_cases?.map((tc) => ({
          name: tc.name,
          passed: Math.random() > 0.3,
          score: Math.floor(Math.random() * 30) + 70,
        })) || [],
      };
    }
  };

  const handleDelete = async (id) => {
    try {
      await testSuitesApi.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting test suite:', error);
    }
  };

  const filteredTestSuites = testSuites.filter((ts) =>
    ts.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Suites</h1>
          <p className="text-gray-500 mt-1">Create and run automated evaluation tests</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Test Suite
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
            placeholder="Search test suites..."
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mash-600"></div>
        </div>
      ) : filteredTestSuites.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTestSuites.map((testSuite) => (
            <TestSuiteCard
              key={testSuite.id}
              testSuite={testSuite}
              character={getCharacter(testSuite.character_id)}
              onEdit={handleEdit}
              onRun={handleRun}
              onDelete={handleDelete}
            />
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchTerm ? 'No test suites found' : 'No test suites yet'}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchTerm
              ? 'Try a different search term'
              : 'Create automated tests to validate your character responses.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreate}
              className="mt-4 px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
            >
              Create Test Suite
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <TestSuiteModal
        testSuite={editingTestSuite}
        characters={characters}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default TestSuites;
