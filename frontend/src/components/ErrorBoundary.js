import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.state = { hasError: true, error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something Went Wrong
            </h1>
            <p className="text-gray-600 mb-4">
              The workspace encountered an error while rendering. Details:
            </p>
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 overflow-auto">
              <p className="text-sm font-mono text-red-900 mb-2">
                <strong>Error:</strong> {this.state.error?.toString()}
              </p>
              <pre className="text-xs text-red-800 overflow-auto">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.href = '/characters'}
                className="px-4 py-2 bg-mash-600 text-white rounded-lg hover:bg-mash-700"
              >
                ← Back to Characters
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
