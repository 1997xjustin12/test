import { useState, useEffect, useCallback } from "react";

export default function useESFetchProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams); // State for query params
  const [noResult, setNoResult] = useState(false);
  const [filters, setFilters] = useState({});
//   const [url, setUrl] = useState(`/api/es/categorized/products`);
  const fetchProducts = useCallback(
    async (signal, customParams = null) => {
      setLoading(true);
      setError(null);
      setProducts([]);
      //   const queryParams = new URLSearchParams(
      //     customParams || params
      //   )

      try {
        const res = await fetch(`/api/es/categorized/products`, {
          cache:"no-store",
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customParams || params),
          signal,
        });
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data.data);
        setPagination(data.meta.pagination);
        // setFilters(data.meta.filters);
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
      await fetchProducts(signal);
    };

    performFetch(); // Trigger fetch on mount or param change

    return () => {
      controller.abort(); // Cleanup: Abort ongoing request on unmount or dependency change
    };
  }, [fetchProducts]);

  // Refetch with new parameters
  const refetch = (newParams = {}) => {
    setParams(newParams); // Update query params
  };

  return {
    products,
    loading,
    pagination,
    filters,
    noResult,
    error,
    refetch,
    setParams,
  };
}
