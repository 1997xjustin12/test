import { useState, useEffect, useCallback } from "react";

export default function useFetchProduct(initialParams = {}) {
  const { id } = initialParams;
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams); // State for query params

  const fetchProduct = useCallback(
    async (signal, customParams = null) => {
      setLoading(true);
      setError(null);
      setProduct({});
      const queryParams = new URLSearchParams(customParams || params);
      queryParams.delete("id");
      const url = `/api/product/${id}/?${queryParams.toString()}`; // Replace with your API endpoint
      console.log(url);
      try {
        const res = await fetch(url, { signal }); // Pass the signal to fetch
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data.data);
        setPagination(data.meta);
        setLoading(false);
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
      await fetchProduct(signal);
    };

    performFetch(); // Trigger fetch on mount or param change

    return () => {
      controller.abort(); // Cleanup: Abort ongoing request on unmount or dependency change
    };
  }, [fetchProduct]);

  return { product, loading, error };
}
