import { useState, useEffect, useCallback } from "react";

export default function useFetchProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams); // State for query params
  const [noResult, setNoResult] = useState(false);
  const fetchProducts = useCallback(
    async (signal, customParams = null) => {
      setLoading(true);
      setError(null);
      setProducts([]);
      const queryParams = new URLSearchParams(
        customParams || params
      ).toString();
      const url = `/api/products?${queryParams}`; // Replace with your API endpoint

      try {
        const res = await fetch(url, {
          signal,
          cache: "force-cache",
          next: { revalidate: 3600 },
        }); // Pass the signal to fetch
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data.data);
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

  return { products, loading, pagination, noResult, error, refetch, setParams };
}
