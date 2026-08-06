"use client";

import React from "react";
import { GripVertical } from "lucide-react";

/** Shared control styling so every panel's inputs match. */
export const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500";

export const checkboxClass =
  "h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-white/20 dark:bg-zinc-900";

export const cardClass =
  "rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900";

export function Field({ label, htmlFor, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      )}
    </div>
  );
}

export function Section({ title, description, children }) {
  return (
    <section className="flex flex-col gap-4">
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function Divider() {
  return <hr className="border-zinc-200 dark:border-white/10" />;
}

export function Toggle({ label, hint, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="inline-flex w-fit cursor-pointer items-center gap-2.5">
        <input type="checkbox" className={checkboxClass} {...inputProps} />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
      </label>
      {hint && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      )}
    </div>
  );
}

/** Pill used for collection / filter-type pickers. */
export function Pill({ active, children, className = "", ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      {...props}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function DragHandle(props) {
  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      className="cursor-grab touch-none rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 active:cursor-grabbing dark:hover:bg-white/5 dark:hover:text-zinc-300"
      {...props}
    >
      <GripVertical className="pointer-events-none h-5 w-5" aria-hidden="true" />
    </button>
  );
}
