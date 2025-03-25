import { useState, useEffect, useCallback } from "react";
import { useUserSession } from "@/app/context/session"; // 🔁 Make sure this points to your actual session hook

export default function useFetchCustomer() {
  const { userSession, loading: loadingSession } = useUserSession();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomer = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      setCustomer(null);

      const customerToken = userSession?.token;
      if (!customerToken) {
        setError("Missing customer access token");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/customer`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${customerToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch customer");
        }

        const data = await res.json();
        setCustomer(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [userSession?.token]
  );

  useEffect(() => {
    if (loadingSession || !userSession?.token) return;

    const controller = new AbortController();
    fetchCustomer(controller.signal);

    return () => controller.abort();
  }, [fetchCustomer, loadingSession, userSession?.token]);

  const refetch = () => {
    const controller = new AbortController();
    fetchCustomer(controller.signal);
  };

  return {
    customer,
    loading,
    error,
    refetch,
  };
}
