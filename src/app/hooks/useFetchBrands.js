import { useState, useEffect, useCallback } from "react";

export default function useFetchBrands(initialParams = {}) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams); // State for query params
  const [noResult, setNoResult] = useState(false);
  const fetchBrands = useCallback(
    async (signal, customParams = null) => {
      setLoading(true);
      setError(null);
      setBrands([]);
      const queryParams = new URLSearchParams(
        customParams || params
      ).toString();
      const url = `/api/brands?${queryParams}`; // Replace with your API endpoint

      try {
        const res = await fetch(url, {
          signal,
          cache: "force-cache",
          next: { revalidate: 3600 },
        }); // Pass the signal to fetch
        if (!res.ok) {
          throw new Error("Failed to fetch brands");
        }
        const data = await res.json();
        setBrands(data.data);
        setPagination(data.meta.pagination);
        setLoading(false);
        setNoResult(data.data.length === 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          setLoading(false);
          setError(err.message); // Handle only non-abort errors
        }
      }
    },
    [params]
  );

  useEffect(() => {
    const controller = new AbortController(); // Create a controller for this fetch
    const { signal } = controller;

    // Define the function to perform the fetch
    const performFetch = async () => {
      await fetchBrands(signal);
    };

    performFetch(); // Trigger fetch on mount or param change

    return () => {
      controller.abort(); // Cleanup: Abort ongoing request on unmount or dependency change
    };
  }, [fetchBrands]);

  // Refetch with new parameters
  const refetch = (newParams = {}) => {
    setParams(newParams); // Update query params
  };

  return {
    brands,
    loading,
    pagination,
    filters,
    noResult,
    error,
    refetch,
    setParams,
  };
}
