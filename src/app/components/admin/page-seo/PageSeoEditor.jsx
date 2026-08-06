"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ExternalLink, RotateCcw, Search, TriangleAlert } from "lucide-react";
import { redisGet, redisSet } from "@/app/lib/redis";
import { BASE_URL } from "@/app/lib/helpers";
import {
  PAGE_SEO_GROUPS,
  PAGE_SEO_ROUTES,
  ROBOTS_OPTIONS,
  emptyPageSeo,
} from "@/app/lib/page-seo";
import Button from "@/app/components/admin/Button";
import SelectField from "@/app/components/admin/SelectField";
import { Divider, Field, Section, inputClass } from "@/app/components/admin/ui";

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 155;

const isConfigured = (entry) =>
  !!entry &&
  Object.entries(entry).some(([, v]) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v),
  );

/** Character counter that goes amber past the length Google shows in full. */
function Counter({ value = "", limit }) {
  const length = value.length;
  return (
    <span
      className={
        length > limit
          ? "text-amber-600 dark:text-amber-400"
          : "text-zinc-500 dark:text-zinc-400"
      }
    >
      {length}/{limit}
    </span>
  );
}

/**
 * `seoKey` is resolved on the server and passed in. It cannot be computed here:
 * STORE_ID / STORE_REDIS_PREFIX are not NEXT_PUBLIC_, so in the browser they are
 * undefined and the key would silently collapse to "_page_seo" — a different
 * key from the one the storefront reads.
 */
export default function PageSeoEditor({ seoKey }) {
  const SEO_KEY = seoKey;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathParam = searchParams.get("path");

  const [map, setMap] = useState({});
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [dirty, setDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [query, setQuery] = useState("");

  const activePath = useMemo(() => {
    const known = PAGE_SEO_ROUTES.some((r) => r.path === pathParam);
    return known ? pathParam : PAGE_SEO_ROUTES[0].path;
  }, [pathParam]);

  const entry = useMemo(
    () => ({ ...emptyPageSeo(), ...(map[activePath] || {}) }),
    [map, activePath],
  );

  const route = useMemo(
    () => PAGE_SEO_ROUTES.find((r) => r.path === activePath),
    [activePath],
  );

  useEffect(() => {
    let cancelled = false;
    redisGet(SEO_KEY)
      .then((data) => {
        if (cancelled) return;
        setMap(data && typeof data === "object" ? data : {});
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        // A missing key is the normal first-run state, not a failure.
        setMap({});
        setStatus("ready");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  }, []);

  const patch = useCallback(
    (changes) => {
      setMap((prev) => ({
        ...prev,
        [activePath]: { ...emptyPageSeo(), ...(prev[activePath] || {}), ...changes },
      }));
      setDirty(true);
    },
    [activePath],
  );

  const selectPath = (path) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("path", path);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      // Drop empty entries so the stored object stays a record of real overrides.
      const cleaned = Object.fromEntries(
        Object.entries(map).filter(([, v]) => isConfigured(v)),
      );
      const response = await redisSet(SEO_KEY, cleaned);
      if (response?.success) {
        setMap(cleaned);
        setDirty(false);
        showAlert("success", "Page SEO saved.");
        // Bust the cached read so the storefront picks it up immediately.
        fetch("/api/revalidate-page-seo", { method: "POST" }).catch(() => {});
      } else {
        showAlert("error", "Failed to save. Please try again.");
      }
    } catch (error) {
      showAlert("error", "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [map, showAlert]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAGE_SEO_ROUTES;
    return PAGE_SEO_ROUTES.filter(
      (r) =>
        r.label.toLowerCase().includes(q) || r.path.toLowerCase().includes(q),
    );
  }, [query]);

  const configuredCount = useMemo(
    () => PAGE_SEO_ROUTES.filter((r) => isConfigured(map[r.path])).length,
    [map],
  );

  const selectedRobots =
    ROBOTS_OPTIONS.find((o) => o.value === entry.robots) ?? null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Page SEO
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Title, description and tags for the app&apos;s own pages.
          Category and brand pages are edited in Menu Builder.
          <span className="ml-1 text-zinc-400 dark:text-zinc-500">
            ({configuredCount}/{PAGE_SEO_ROUTES.length} configured)
          </span>
        </p>
      </div>

      {/* Save bar */}
      <div className="sticky top-16 z-10 -mx-4 flex flex-wrap items-center gap-3 border-y border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border dark:border-white/10 dark:bg-zinc-900/85">
        <div className="w-auto">
          <Button onClick={save} loading={isSaving || status === "loading"}>
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
            Saved to <code className="font-mono">{SEO_KEY}</code>
          </span>
        )}
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

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Route list */}
        <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-200 lg:w-[280px] dark:border-white/10">
          <div className="border-b border-zinc-200 p-2 dark:border-white/10">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search pages…"
                className={`${inputClass} py-2 pl-9`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto p-2">
            {PAGE_SEO_GROUPS.map((group) => {
              const rows = filtered.filter((r) => r.group === group);
              if (!rows.length) return null;
              return (
                <div key={group} className="mb-3 last:mb-0">
                  <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">
                    {group}
                  </p>
                  <ul className="space-y-0.5">
                    {rows.map((r) => {
                      const active = r.path === activePath;
                      return (
                        <li key={r.path}>
                          <button
                            type="button"
                            onClick={() => selectPath(r.path)}
                            className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                              active
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              title={
                                isConfigured(map[r.path])
                                  ? "Configured"
                                  : "Using defaults"
                              }
                              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                                isConfigured(map[r.path])
                                  ? "bg-emerald-500"
                                  : "bg-zinc-300 dark:bg-zinc-600"
                              }`}
                            />
                            {/* Stacked, both truncating — a path like
                                /my-account/change-password can't fit beside the
                                label in a 280px rail. */}
                            <span className="min-w-0 flex-1">
                              <span
                                className={`block truncate text-sm ${active ? "font-medium" : ""}`}
                              >
                                {r.label}
                              </span>
                              <span className="block truncate font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                                {r.path}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="min-w-0 flex-1 rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-white/10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-zinc-900 dark:text-white">
                {route?.label}
              </h3>
              <p className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {activePath}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {isConfigured(map[activePath]) && (
                <button
                  type="button"
                  onClick={() => patch(emptyPageSeo())}
                  title="Clear overrides and fall back to defaults"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reset
                </button>
              )}
              <a
                href={`${BASE_URL}${activePath === "/" ? "" : activePath}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                View
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <Field
              label="Meta Title"
              htmlFor="seo-title"
              hint={
                <>
                  <Counter value={entry.title} limit={TITLE_LIMIT} /> — blank
                  uses{" "}
                  {route?.defaults?.title
                    ? `“${route.defaults.title}”`
                    : "the site default"}
                  .
                </>
              }
            >
              <input
                id="seo-title"
                type="text"
                value={entry.title}
                onChange={(e) => patch({ title: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field
              label="Meta Description"
              htmlFor="seo-description"
              hint={<Counter value={entry.description} limit={DESCRIPTION_LIMIT} />}
            >
              <textarea
                id="seo-description"
                rows="4"
                value={entry.description}
                onChange={(e) => patch({ description: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field
              label="Keywords / tags"
              htmlFor="seo-keywords"
              hint="Comma separated. Rendered as <meta name=&quot;keywords&quot;> and reused for social tags."
            >
              <input
                id="seo-keywords"
                type="text"
                value={(entry.keywords || []).join(", ")}
                onChange={(e) =>
                  patch({
                    keywords: e.target.value
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean),
                  })
                }
                className={inputClass}
              />
            </Field>

            <Divider />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Search engine visibility"
                htmlFor="seo-robots"
                hint="Controls the robots meta tag."
              >
                <SelectField
                  id="seo-robots"
                  options={ROBOTS_OPTIONS}
                  value={selectedRobots}
                  placeholder={
                    route?.defaults?.robots
                      ? `Default: ${route.defaults.robots}`
                      : "Default: index, follow"
                  }
                  onChange={(option) => patch({ robots: option?.value ?? "" })}
                />
              </Field>

              <Field
                label="Canonical URL"
                htmlFor="seo-canonical"
                hint={`Blank uses ${BASE_URL || ""}${activePath === "/" ? "" : activePath}`}
              >
                <input
                  id="seo-canonical"
                  type="text"
                  value={entry.canonical}
                  onChange={(e) => patch({ canonical: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Social share image"
              htmlFor="seo-og-image"
              hint="Absolute URL or a path under /public. Used for Open Graph and Twitter cards."
            >
              <input
                id="seo-og-image"
                type="text"
                placeholder="/images/og/home.webp"
                value={entry.og_image}
                onChange={(e) => patch({ og_image: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Divider />

            <Section title="Search preview">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                <p className="truncate text-xs text-emerald-700 dark:text-emerald-500">
                  {(entry.canonical ||
                    `${BASE_URL || ""}${activePath === "/" ? "" : activePath}`)}
                </p>
                <p className="mt-0.5 truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">
                  {entry.title || route?.defaults?.title || "(site default title)"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {entry.description || "(site default description)"}
                </p>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
