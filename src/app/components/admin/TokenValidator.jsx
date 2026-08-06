"use client";

import { useTokenValidation } from '@/app/hooks/useTokenValidation';

/**
 * TokenValidator Component
 * Validates access token and shows appropriate UI based on validation state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to show when token is valid
 * @param {React.ReactNode} props.loadingComponent - Optional custom loading component
 * @param {React.ReactNode} props.errorComponent - Optional custom error component
 */
export default function TokenValidator({ 
  children, 
  loadingComponent = null,
  errorComponent = null 
}) {
  const { loading, error, isValid, storeData } = useTokenValidation();

  // Loading state
  if (loading) {
    if (loadingComponent) {
      return loadingComponent;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
            Validating Access...
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Please wait while we verify your credentials.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !isValid) {
    if (errorComponent) {
      return errorComponent;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center p-8 max-w-md">
          <div className="bg-red-100 dark:bg-red-500/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Access Denied
          </h1>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            {error || 'Invalid or expired authentication token'}
          </p>
          <div className="bg-zinc-100 dark:bg-white/5 rounded-lg p-4 text-left">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              <strong>Possible reasons:</strong>
            </p>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside space-y-1">
              <li>The access link has expired (tokens are valid for 24 hours)</li>
              <li>The token has been tampered with</li>
              <li>You don't have permission to access this page</li>
            </ul>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            Please request a new access link from your administrator.
          </p>
        </div>
      </div>
    );
  }

  // Valid state - render children (storeData is available via sessionStorage)
  return (
    <div data-store-id={storeData?.storeId}>
      {children}
    </div>
  );
}
