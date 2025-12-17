"use client";

import { createContext, useContext } from 'react';

/**
 * Store Context
 * Provides store data from token validation to child components
 */
const StoreContext = createContext(null);

/**
 * Hook to access store data from context
 * @returns {Object|null} Store data object with storeId, storeName, storeDomain
 */
export const useStore = () => {
  const context = useContext(StoreContext);
  return context;
};

export default StoreContext;
