"use client";

import { useState, useEffect } from 'react';
import { validateToken } from '@/app/lib/api';

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
    const validateAccessToken = async () => {
      try {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setError('No authentication token provided');
          setIsValid(false);
          setLoading(false);
          return;
        }

        // Validate token with backend
        const result = await validateToken(token);

        if (result.success && result.valid) {
          setIsValid(true);
          setStoreData({
            storeId: result.storeId,
            storeName: result.storeName,
            storeDomain: result.storeDomain,
          });
          setError(null);

          // Store data in sessionStorage for later use
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('storeId', result.storeId);
            sessionStorage.setItem('storeName', result.storeName || '');
            sessionStorage.setItem('storeDomain', result.storeDomain || '');
          }
        } else {
          setError(result.error || 'Invalid or expired token');
          setIsValid(false);
        }
      } catch (err) {
        console.error('[TOKEN VALIDATION] Hook error:', err);
        setError('Failed to validate token');
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateAccessToken();
  }, []);

  return { loading, error, isValid, storeData };
};
