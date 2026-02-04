import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Breadcrumbs navigation component
 *
 * Automatically generates breadcrumbs based on current route
 * with custom labels for known routes.
 */

const routeLabels = {
  '': 'Home',
  'dashboard': 'Dashboard',
  'characters': 'Characters',
  'workspace': 'Workspace',
  'franchises': 'Franchises',
  'test-suites': 'Test Suites',
  'evaluations': 'Evaluations',
  'configure': 'Configure Critic',
  'data-quality': 'Data Quality',
  'settings': 'Settings',
  'user-manual': 'User Manual',
};

const Breadcrumbs = () => {
  const location = useLocation();

  // Don't show breadcrumbs on login/register pages
  if (location.pathname.startsWith('/login') || location.pathname.startsWith('/register')) {
    return null;
  }

  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs if on root/dashboard
  if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'dashboard')) {
    return null;
  }

  const breadcrumbs = [];
  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Skip UUIDs (character/franchise IDs)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);

    if (!isUuid) {
      breadcrumbs.push({
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath,
        isLast: index === pathSegments.length - 1,
      });
    }
  });

  // Always add Home as first breadcrumb
  if (breadcrumbs.length > 0 && breadcrumbs[0].path !== '/dashboard') {
    breadcrumbs.unshift({
      label: 'Dashboard',
      path: '/dashboard',
      isLast: false,
    });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          {index > 0 && (
            <svg
              className="w-4 h-4 mx-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {crumb.isLast ? (
            <span className="font-medium text-gray-900">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
