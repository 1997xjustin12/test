"use client";

import { createContext, useContext } from "react";

/**
 * Makes the store's Redis-backed settings available to client components.
 *
 * Settings are read on the server (they need Redis) and handed down through
 * this provider, so client code gets them without a fetch. Prefer this over
 * importing the env constants directly — env is only the fallback layer now.
 *
 *   const { contact, name } = useStoreSettings();
 */
const StoreSettingsContext = createContext(null);

export function StoreSettingsProvider({ settings, children }) {
  return (
    <StoreSettingsContext.Provider value={settings || {}}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

/**
 * Returns the resolved settings object. Falls back to an empty object rather
 * than throwing, so a component rendered outside the provider degrades to the
 * same behaviour it had before settings existed.
 */
export function useStoreSettings() {
  return useContext(StoreSettingsContext) || {};
}
