import React, { useEffect } from 'react';

/**
 * Toast Notification Component
 *
 * Displays temporary notifications for user actions
 * Auto-dismisses after a timeout
 */
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 min-w-[300px] max-w-md`}>
        <div className="text-2xl font-bold">{icons[type]}</div>
        <div className="flex-1 font-mono text-sm">{message}</div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-xl font-bold leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
