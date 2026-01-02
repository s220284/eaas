import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client';

/**
 * Authentication context for CanonSafe
 * Manages user authentication state across the application
 */
const AuthContext = createContext(null);

/**
 * Custom hook to access auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication provider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching profile
          const profile = await authApi.getProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (err) {
          // Token invalid, clear storage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.register(data);

      // If registration returns a token, log user in automatically
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);

        // Fetch user profile
        const profile = await authApi.getProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      }

      return { success: true, data: response };
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(async (email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.login(email, password);

      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);

        // Fetch user profile
        const profile = await authApi.getProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));

        return { success: true };
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Refresh user profile from server
   */
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (err) {
      // If refresh fails, log out user
      logout();
      throw err;
    }
  }, [logout]);

  /**
   * Clear any auth errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    refreshProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
