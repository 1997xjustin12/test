"use client";

import React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import useAdminTheme from "@/app/hooks/useAdminTheme";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
];

/**
 * Colour-scheme switcher.
 * `collapsed` renders a single cycling button for the icon-only rail.
 */
export default function ThemeToggle({ collapsed = false }) {
  const { theme, setTheme, mounted } = useAdminTheme();

  if (collapsed) {
    const index = OPTIONS.findIndex((o) => o.value === theme);
    const current = OPTIONS[index === -1 ? 1 : index];
    const next = OPTIONS[(index === -1 ? 1 : index + 1) % OPTIONS.length];
    const Icon = current.Icon;

    return (
      <button
        type="button"
        onClick={() => setTheme(next.value)}
        title={`Theme: ${current.label} — switch to ${next.label}`}
        aria-label={`Theme: ${current.label}. Switch to ${next.label}.`}
        className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-white/5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        // Before hydration we don't know the stored value, so nothing is
        // marked active - avoids a mismatched highlight flashing on load.
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => setTheme(value)}
            className={`flex flex-1 items-center justify-center rounded-lg py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              active
                ? "bg-white text-zinc-900 shadow-sm dark:bg-white/10 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
