import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API data fetching with loading and error states
 *
 * @param {Function} fetchFn - The API function to call
 * @param {Array} deps - Dependencies array for useEffect
 * @param {Object} options - Additional options
 * @returns {Object} - { data, isLoading, error, refetch }
 */
export const useApi = (fetchFn, deps = [], options = {}) => {
  const { immediate = true, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) {
      fetch().catch(() => {
        // Error is already set in state
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
    setData,
  };
};

/**
 * Custom hook for mutations (POST, PUT, DELETE)
 *
 * @param {Function} mutationFn - The API mutation function
 * @returns {Object} - { mutate, isLoading, error, data }
 */
export const useMutation = (mutationFn) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(...args);
        setData(result);
        return { success: true, data: result };
      } catch (err) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    isLoading,
    error,
    data,
    reset,
  };
};

/**
 * Custom hook for paginated data fetching
 *
 * @param {Function} fetchFn - The API function to call (should accept page param)
 * @param {Object} options - Additional options
 * @returns {Object} - { data, isLoading, error, page, setPage, hasMore, loadMore }
 */
export const usePagination = (fetchFn, options = {}) => {
  const { initialPage = 1, pageSize = 20 } = options;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(
    async (pageNum, append = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchFn({ page: pageNum, limit: pageSize });
        const items = Array.isArray(result) ? result : result.items || [];

        if (append) {
          setData((prev) => [...prev, ...items]);
        } else {
          setData(items);
        }

        setHasMore(items.length === pageSize);
        return items;
      } catch (err) {
        setError(err.message || 'An error occurred');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, pageSize]
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      return fetchPage(nextPage, true);
    }
  }, [isLoading, hasMore, page, fetchPage]);

  const refresh = useCallback(() => {
    setPage(initialPage);
    return fetchPage(initialPage, false);
  }, [initialPage, fetchPage]);

  useEffect(() => {
    fetchPage(initialPage).catch(() => {
      // Error is already set in state
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
    error,
    page,
    setPage,
    hasMore,
    loadMore,
    refresh,
  };
};

export default useApi;
