"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, TriangleAlert } from "lucide-react";
import { BASE_URL } from "@/app/lib/helpers";
import Button from "@/app/components/admin/Button";
import { useMenuEditor } from "./MenuEditorContext";
import TabNav from "./TabNav";

export default function MenuEditorShell({ children }) {
  const { menu_id, menuItem, status, dirty, isSaving, alert, save } =
    useMenuEditor();

  // Ctrl/Cmd+S saves from anywhere in the form.
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!isSaving) save();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [save, isSaving]);

  if (status === "missing") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Menu item not found
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          No menu item matches <code className="font-mono">{menu_id}</code>.
        </p>
        <Link
          href="/admin/menu-builder"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Menu Builder
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/menu-builder"
          prefetch={false}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Menu Builder
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              {menuItem?.name || (status === "loading" ? "Loading…" : "Menu item")}
            </h2>
            {menuItem?.url && (
              <p className="mt-0.5 truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
                /{menuItem.url}
              </p>
            )}
          </div>

          {menuItem?.url && (
            <a
              href={`${BASE_URL}/${menuItem.url}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Preview page in a new tab"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Preview
            </a>
          )}
        </div>
      </div>

      {/* Save bar - sticks under the admin top bar (h-16) */}
      <div className="sticky top-16 z-10 -mx-4 flex flex-wrap items-center gap-3 border-y border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border sm:px-4 dark:border-white/10 dark:bg-zinc-900/85">
        <div className="w-auto">
          <Button onClick={save} loading={isSaving}>
            Save
          </Button>
        </div>

        {dirty ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Unsaved changes
          </span>
        ) : (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Changes are only applied once you save.
          </span>
        )}

        <kbd className="hidden rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline dark:border-white/10 dark:text-zinc-400">
          Ctrl/⌘ + S
        </kbd>

        {alert && (
          <span
            role="status"
            className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
              alert.type === "success"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {alert.message}
          </span>
        )}
      </div>

      <TabNav menu_id={menu_id} />

      <div className="pb-10">
        {status === "loading" ? (
          <div className="space-y-3">
            <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
            <div className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-white/10" />
            <div className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-white/10" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
