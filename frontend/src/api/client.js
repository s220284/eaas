import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://mash-ai-backend-611530284830.us-central1.run.app');

/**
 * Axios instance configured for CanonSafe API
 * Includes automatic token injection and response/error handling
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Request interceptor - adds auth token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles token expiration and common errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        // Only redirect if not already on auth pages
        if (!window.location.pathname.startsWith('/login') &&
            !window.location.pathname.startsWith('/register')) {
          window.location.href = '/login';
        }
      }

      // Format error message
      const message = data?.detail || data?.message || 'An error occurred';
      error.message = message;
    } else if (error.request) {
      error.message = 'Network error - please check your connection';
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  /**
   * Register a new user and organization
   */
  register: async (data) => {
    const response = await apiClient.post('/api/v1/auth/register', {
      email: data.email,
      password: data.password,
      name: data.name,
      organization_name: data.organizationName,
      organization_slug: data.organizationSlug,
    });
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (email, password) => {
    const response = await apiClient.post('/api/v1/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
  },

  /**
   * Logout - clears local storage
   */
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};

// ============================================================================
// Characters API
// ============================================================================

export const charactersApi = {
  /**
   * Get all characters with optional filters
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/v1/characters/', { params });
    return response.data;
  },

  /**
   * Get a single character by ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/api/v1/characters/${id}`);
    return response.data;
  },

  /**
   * Create a new character
   */
  create: async (data) => {
    const response = await apiClient.post('/api/v1/characters', data);
    return response.data;
  },

  /**
   * Update an existing character
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/api/v1/characters/${id}`, data);
    return response.data;
  },

  /**
   * Delete a character
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/api/v1/characters/${id}`);
    return response.data;
  },
};

// ============================================================================
// Franchises API
// ============================================================================

export const franchisesApi = {
  /**
   * Get all franchises
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/v1/characters/franchises/', { params });
    return response.data;
  },

  /**
   * Get a single franchise by ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/api/v1/characters/franchises/${id}`);
    return response.data;
  },

  /**
   * Create a new franchise
   */
  create: async (data) => {
    const response = await apiClient.post('/api/v1/characters/franchises', data);
    return response.data;
  },

  /**
   * Update an existing franchise
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/api/v1/characters/franchises/${id}`, data);
    return response.data;
  },

  /**
   * Delete a franchise
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/api/v1/characters/franchises/${id}`);
    return response.data;
  },
};

// ============================================================================
// Evaluations API
// ============================================================================

export const evaluationsApi = {
  /**
   * Run a quick evaluation
   */
  evaluate: async (data) => {
    const response = await apiClient.post('/api/v1/evaluations/evaluate', data);
    return response.data;
  },

  /**
   * Get all evaluations with optional filters
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/v1/evaluations/', { params });
    return response.data;
  },

  /**
   * Get evaluation by ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/api/v1/evaluations/${id}`);
    return response.data;
  },
};

// ============================================================================
// Test Suites API
// ============================================================================

export const testSuitesApi = {
  /**
   * Get all test suites
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/v1/test-suites/', { params });
    return response.data;
  },

  /**
   * Get a single test suite by ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/api/v1/test-suites/${id}`);
    return response.data;
  },

  /**
   * Create a new test suite
   */
  create: async (data) => {
    const response = await apiClient.post('/api/v1/test-suites', data);
    return response.data;
  },

  /**
   * Update an existing test suite
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/api/v1/test-suites/${id}`, data);
    return response.data;
  },

  /**
   * Delete a test suite
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/api/v1/test-suites/${id}`);
    return response.data;
  },

  /**
   * Run a test suite
   */
  run: async (id) => {
    const response = await apiClient.post(`/api/v1/test-suites/${id}/run`);
    return response.data;
  },
};

// ============================================================================
// Data Quality API
// ============================================================================

export const dataQualityApi = {
  /**
   * Get data quality overview
   */
  getOverview: async () => {
    const response = await apiClient.get('/api/v1/data-quality/overview');
    return response.data;
  },

  /**
   * Get character quality list with filters
   */
  getCharacters: async (params = {}) => {
    const response = await apiClient.get('/api/v1/data-quality/characters', { params });
    return response.data;
  },

  /**
   * Get detailed quality info for a character
   */
  getCharacterQuality: async (id) => {
    const response = await apiClient.get(`/api/v1/data-quality/characters/${id}/quality`);
    return response.data;
  },

  /**
   * Get data quality issues
   */
  getIssues: async (params = {}) => {
    const response = await apiClient.get('/api/v1/data-quality/issues', { params });
    return response.data;
  },
};

// ============================================================================
// Dashboard/Stats API
// ============================================================================

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const response = await apiClient.get('/api/v1/dashboard/stats');
    return response.data;
  },

  /**
   * Get recent activity
   */
  getRecentActivity: async (limit = 10) => {
    const response = await apiClient.get('/api/v1/dashboard/activity', {
      params: { limit },
    });
    return response.data;
  },
};

export default apiClient;
