import React from 'react';

/**
 * Confirmation Modal Component
 *
 * Generic modal for confirming destructive actions
 */
const ConfirmModal = ({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel, type = 'danger' }) => {
  if (!isOpen) return null;

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 border-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700 border-blue-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-3 font-mono">
            {title}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {message}
          </p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-[#21262d] border border-[#30363d] text-gray-300 hover:bg-[#30363d] transition-colors text-sm font-mono rounded"
            >
              {cancelText || 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${buttonColors[type]} text-white transition-colors text-sm font-mono rounded border`}
            >
              {confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
