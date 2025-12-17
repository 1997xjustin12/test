"use client";

import { useState, useEffect } from "react";
import { validateToken } from "@/app/lib/api";

/**
 * Custom hook for token validation
 * Validates the token from URL parameters on mount
 * If no token is provided, allows access (optional validation mode)
 *
 * @returns {Object} { loading, error, isValid, storeData }
 */
export const useTokenValidation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [storeData, setStoreData] = useState(null);

  useEffect(() => {
    console.log("STEP1");
    // Ensure we're on the client side before running validation
    if (typeof window === "undefined") {
      return;
    }

    const validateAccessToken = async () => {
      console.log("[TOKEN VALIDATION] Starting validation...");
      try {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        console.log(
          "[TOKEN VALIDATION] Token from URL:",
          token ? "present" : "missing"
        );

        if (!token) {
          // In development mode, bypass token validation
          if (process.env.NODE_ENV === "development") {
            console.log(
              "[TOKEN VALIDATION] Development mode - bypassing token validation"
            );
            setIsValid(true);
            setStoreData({
              storeId: "dev-store",
              storeName: "Development Store",
              storeDomain: "localhost",
            });
            setError(null);
            setLoading(false);
            return;
          }

          console.log("[TOKEN VALIDATION] No token provided");
          setError("No authentication token provided");
          setIsValid(false);
          setLoading(false);
          return;
        }

        // Validate token with backend
        console.log("[TOKEN VALIDATION] Calling validateToken API...");
        const result = await validateToken(token);
        console.log("[TOKEN VALIDATION] API result:", result);

        if (result.success && result.valid) {
          console.log("[TOKEN VALIDATION] Token is valid");
          setIsValid(true);
          setStoreData({
            storeId: result.storeId,
            storeName: result.storeName,
            storeDomain: result.storeDomain,
          });
          setError(null);

          // Store data in sessionStorage for later use
          if (typeof window !== "undefined") {
            sessionStorage.setItem("storeId", result.storeId);
            sessionStorage.setItem("storeName", result.storeName || "");
            sessionStorage.setItem("storeDomain", result.storeDomain || "");
          }
        } else {
          console.log("[TOKEN VALIDATION] Token is invalid:", result.error);
          setError(result.error || "Invalid or expired token");
          setIsValid(false);
        }
      } catch (err) {
        console.error("[TOKEN VALIDATION] Hook error:", err);
        setError("Failed to validate token");
        setIsValid(false);
      } finally {
        console.log(
          "[TOKEN VALIDATION] Validation complete, setting loading to false"
        );
        setLoading(false);
      }
    };

    validateAccessToken();
  }, []);

  return { loading, error, isValid, storeData };
};
