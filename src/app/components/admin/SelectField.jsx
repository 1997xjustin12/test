"use client";

import React, { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronsUpDown, X } from "lucide-react";

/**
 * Searchable single-select.
 *
 * Options are `{ value, label, group?, raw? }`. `onChange` hands back the whole
 * option (or null when cleared) so callers can store whatever shape they need.
 */
export default function SelectField({
  id,
  value = null,
  options = [],
  onChange,
  placeholder = "Select…",
  disabled = false,
  allowClear = true,
  emptyMessage = "No matches.",
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  // Preserve source order while inserting a header row per group.
  const rows = useMemo(() => {
    const out = [];
    let lastGroup;
    filtered.forEach((option) => {
      if (option.group && option.group !== lastGroup) {
        out.push({ type: "group", label: option.group });
        lastGroup = option.group;
      }
      out.push({ type: "option", option });
    });
    return out;
  }, [filtered]);

  return (
    <Combobox
      value={value}
      onChange={onChange}
      onClose={() => setQuery("")}
      disabled={disabled}
      by={(a, b) => a?.value === b?.value}
    >
      <div className="relative">
        <ComboboxInput
          id={id}
          autoComplete="off"
          placeholder={placeholder}
          // ComboboxInput seeds its text from `defaultValue` and afterwards only
          // reacts to *changes* in `value`. Without this, a value that was
          // already present at mount (the common case here — the draft lives in
          // the layout and is loaded before any tab mounts) renders blank.
          defaultValue={value?.label ?? ""}
          displayValue={(option) => option?.label ?? ""}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-3 pr-16 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
        />

        <div className="absolute inset-y-0 right-0 flex items-center gap-0.5 pr-1.5">
          {allowClear && value && !disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              title="Clear selection"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Clear selection</span>
            </button>
          )}
          <ComboboxButton className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200">
            <ChevronsUpDown className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Toggle options</span>
          </ComboboxButton>
        </div>
      </div>

      {/* `anchor` portals the list, so it can't be clipped by a scroll parent. */}
      <ComboboxOptions
        anchor="bottom start"
        transition
        className="z-50 max-h-72 w-[var(--input-width)] origin-top overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-lg transition duration-100 ease-out [--anchor-gap:4px] empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0 dark:border-white/10 dark:bg-zinc-900"
      >
        {rows.length === 0 && (
          <p className="px-3 py-2.5 text-sm text-zinc-500 dark:text-zinc-400">
            {emptyMessage}
          </p>
        )}

        {rows.map((row, index) =>
          row.type === "group" ? (
            <p
              key={`group-${row.label}-${index}`}
              className="px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500"
            >
              {row.label}
            </p>
          ) : (
            <ComboboxOption
              key={row.option.value}
              value={row.option}
              className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 data-[focus]:bg-indigo-50 data-[focus]:text-indigo-700 dark:text-zinc-300 dark:data-[focus]:bg-indigo-500/10 dark:data-[focus]:text-indigo-300"
            >
              <span className="truncate">{row.option.label}</span>
              <Check
                className="hidden h-4 w-4 shrink-0 text-indigo-600 group-data-[selected]:block dark:text-indigo-400"
                aria-hidden="true"
              />
            </ComboboxOption>
          ),
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
