import { useState, useEffect, useCallback } from "react";

export default function useESFetchProducts(initialParams = {}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResult, setNoResult] = useState(false);
  const fetchProducts = async (signal) => {
    setLoading(true);
    setError(null);
    setProduct(null);
    const product_url = initialParams?.product_url;
    if (!product_url || product_url.trim() === "") {
      throw new Error("product_url needed.");
    }
    const url = `/api/es/product`; // Replace with your API endpoint

    const fetchConfig = {
      method: "POST",
      signal,
      body: JSON.stringify({ product_url: `/${product_url}/` }),
    };

    try {
      const res = await fetch(url, fetchConfig);
      
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setProduct(data?.data);
      setLoading(false);
      setNoResult(data.data.length === 0);
    } catch (err) {
      if (err.name !== "AbortError") {
        setLoading(false);
        setError(err.message); // Handle only non-abort errors
      }
    }
  };

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
  }, []);


  return {
    product,
    loading,
    noResult,
    error,
  };
}
