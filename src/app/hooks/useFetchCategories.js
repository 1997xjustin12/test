import { useState, useEffect, useCallback } from 'react';

export default function useFetcCategories(initialParams = {}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams); // State for query params

  // Function to fetch categories
  const fetctCategories = useCallback(async (customParams = null) => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams(customParams || params).toString();
    const url = `/api/category?${queryParams}`; // Replace with your API endpoint

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await res.json();
      setCategories(data.data.sort((a, b) => a.name.localeCompare(b.name)));
      setPagination(data.meta)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Fetch categories on mount or when params change
  useEffect(() => {
    fetctCategories();
  }, [fetctCategories]);

  // Refetch with new parameters
  const refetch = (newParams = {}) => {
    setParams((prevParams) => ({ ...prevParams, ...newParams })); // Update query params
    fetctCategories(newParams);
  };

  return { categories, loading, pagination, error, refetch, setParams };
}