import React, { useState, useEffect, useCallback } from 'react';
import { franchisesApi, charactersApi } from '../api/client';

/**
 * Franchise Editor Modal
 */
const FranchiseModal = ({ franchise, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    content_rating: 'G',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (franchise) {
      setFormData({
        name: franchise.name || '',
        description: franchise.description || '',
        owner: franchise.owner || '',
        content_rating: franchise.content_rating || 'G',
        tags: franchise.tags || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        owner: '',
        content_rating: 'G',
        tags: [],
      });
    }
  }, [franchise]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Franchise name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving franchise:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto z-50">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {franchise ? 'Edit Franchise' : 'Create Franchise'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Franchise Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-mash-500 focus:border-mash-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Toy Story"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
                  placeholder="Brief description of the franchise..."
                />
              </div>

              {/* Owner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner/Copyright Holder
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
                  placeholder="e.g., Disney/Pixar"
                />
              </div>

              {/* Content Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Content Rating
                </label>
                <select
                  value={formData.content_rating}
                  onChange={(e) => setFormData({ ...formData, content_rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mash-500 focus:border-mash-500"
                >
                  <option value="G">G - General</option>
                  <option value="PG">PG - Parental Guidance</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R - Restricted</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-mash-100 text-mash-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 text-mash-600 hover:text-mash-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
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
                {isSaving ? 'Saving...' : franchise ? 'Save Changes' : 'Create Franchise'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Franchise Card Component
 */
const FranchiseCard = ({ franchise, characterCount, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-mash-500 to-mash-700 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {franchise.name?.charAt(0) || '?'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{franchise.name}</h3>
              <p className="text-sm text-gray-500">{franchise.owner || 'No owner specified'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(franchise)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {franchise.description && (
          <p className="mt-4 text-sm text-gray-600 line-clamp-2">{franchise.description}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {franchise.content_rating || 'G'}
            </span>
            <span className="text-sm text-gray-500">
              {characterCount} character{characterCount !== 1 ? 's' : ''}
            </span>
          </div>
          {franchise.tags && franchise.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              {franchise.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {franchise.tags.length > 2 && (
                <span className="text-xs text-gray-400">+{franchise.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="p-4 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-800 mb-3">
            Are you sure you want to delete this franchise? This action cannot be undone.
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
                onDelete(franchise.id);
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
 * Franchises Page
 */
const Franchises = () => {
  const [franchises, setFranchises] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [franchisesData, charactersData] = await Promise.all([
        franchisesApi.getAll(),
        charactersApi.getAll(),
      ]);
      setFranchises(Array.isArray(franchisesData) ? franchisesData : franchisesData.items || []);
      setCharacters(Array.isArray(charactersData) ? charactersData : charactersData.items || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCharacterCount = (franchiseId) => {
    return characters.filter((c) => c.franchise_id === franchiseId).length;
  };

  const handleCreate = () => {
    setEditingFranchise(null);
    setIsModalOpen(true);
  };

  const handleEdit = (franchise) => {
    setEditingFranchise(franchise);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    if (editingFranchise) {
      await franchisesApi.update(editingFranchise.id, data);
    } else {
      await franchisesApi.create(data);
    }
    await fetchData();
  };

  const handleDelete = async (id) => {
    try {
      await franchisesApi.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting franchise:', error);
    }
  };

  const filteredFranchises = franchises.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.owner && f.owner.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Franchises</h1>
          <p className="text-gray-500 mt-1">Organize your characters by franchise</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Franchise
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
            placeholder="Search franchises..."
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mash-600"></div>
        </div>
      ) : filteredFranchises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFranchises.map((franchise) => (
            <FranchiseCard
              key={franchise.id}
              franchise={franchise}
              characterCount={getCharacterCount(franchise.id)}
              onEdit={handleEdit}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchTerm ? 'No franchises found' : 'No franchises yet'}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchTerm
              ? 'Try a different search term'
              : 'Get started by creating your first franchise.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreate}
              className="mt-4 px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
            >
              Create Franchise
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <FranchiseModal
        franchise={editingFranchise}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Franchises;
