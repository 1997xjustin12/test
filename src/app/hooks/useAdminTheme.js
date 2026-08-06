"use client";

import { useCallback, useEffect, useState } from "react";

export const THEME_STORAGE_KEY = "admin-theme";
export const THEMES = ["light", "system", "dark"];

/**
 * Applies the theme by toggling classes on <html>.
 *
 * Tailwind is configured (see tailwind.config.ts `darkMode`) so that:
 *  - no class      -> follow the OS `prefers-color-scheme`
 *  - `.dark`       -> force dark
 *  - `.light`      -> force light, even when the OS asks for dark
 */
function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  if (theme === "dark") root.classList.add("dark");
  if (theme === "light") root.classList.add("light");
}

/**
 * Admin colour-scheme preference, persisted to localStorage.
 * The initial paint is handled by the inline script in the admin layout,
 * so this hook only has to keep React in sync after hydration.
 */
export default function useAdminTheme() {
  const [theme, setThemeState] = useState("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      // storage blocked (private mode / embedded) - fall back to system
    }
    setThemeState(THEMES.includes(stored) ? stored : "system");
    setMounted(true);
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) {
      // ignore - the choice just won't survive a reload
    }
  }, []);

  return { theme, setTheme, mounted };
}
