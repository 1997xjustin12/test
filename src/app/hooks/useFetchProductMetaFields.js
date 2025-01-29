import { useState, useEffect, useCallback } from "react";

export default function useFetchProductMetaFields(initialParams = {}) {
  const { id } = initialParams;
  const [productMetaFields, setProductMetaFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams); // State for query params
  const [noResult, setNoResult] = useState(false);
  const fetchProductMetaFields = useCallback(
    async (signal, customParams = null) => {
      setLoading(true);
      setError(null);
      setProductMetaFields([]);
      const queryParams = new URLSearchParams(
        customParams || params
      ).toString();
      const url = `/api/product/metafields/${id}/?${queryParams}`; // Replace with your API endpoint

      try {
        const res = await fetch(url, {
          signal,
          cache: "force-cache",
          next: { revalidate: 3600 },
        }); // Pass the signal to fetch
        if (!res.ok) {
          throw new Error("Failed to fetch product metafields");
        }
        const data = await res.json();
        setProductMetaFields(
          data.data.map((i) => ({ ...i, value: JSON.parse(i.value) }))
        );
        setPagination(data.meta.pagination);
        setFilters(data.meta.filters);
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
      await fetchProductMetaFields(signal);
    };

    performFetch(); // Trigger fetch on mount or param change

    return () => {
      controller.abort(); // Cleanup: Abort ongoing request on unmount or dependency change
    };
  }, [fetchProductMetaFields]);

  // Refetch with new parameters
  const refetch = (newParams = {}) => {
    setParams(newParams); // Update query params
  };

  return {
    productMetaFields,
    loading,
    pagination,
    noResult,
    error,
    refetch,
    setParams,
  };
}
