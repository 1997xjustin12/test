"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Info, Pin, Plus, Save, Search, X } from "lucide-react";
import { useSolanaCategories } from "@/app/context/category";
import { STORE_NAME } from "@/app/lib/store_constants";
import { cardClass, inputClass } from "@/app/components/admin/ui";

/**
 * Pinned products: choose which products lead a listing page when it is
 * sorted by Most popular. Per page, per brand. See docs/pinned-products.md.
 *
 * Pins only reorder a page's results — a product that does not belong on the
 * page, or is hidden, simply doesn't show — so the editor marks products it
 * can no longer find rather than refusing them.
 */

/** Menu entries that are product listings (not Home, Search or plain links). */
const LISTING_TYPES = ["category", "brand", "custom_page", "category1"];

function Thumb({ src, alt }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-800">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ""} className="h-full w-full object-contain p-0.5" loading="lazy" />
      ) : (
        <Pin className="h-4 w-4 text-zinc-300" aria-hidden="true" />
      )}
    </span>
  );
}

export default function PinnedProductsEditor() {
  const { flatCategories = [] } = useSolanaCategories() || {};

  const [summary, setSummary] = useState({});
  const [max, setMax] = useState(24);
  const [pageFilter, setPageFilter] = useState("");
  const [page, setPage] = useState("");
  const [pins, setPins] = useState([]);
  const [loadingPins, setLoadingPins] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // The listing pages, from the shared menu.
  const pages = useMemo(() => {
    const seen = new Set();
    return flatCategories
      .filter((item) => item?.url && LISTING_TYPES.includes(item?.nav_type) && !["Home", "Search"].includes(item?.name))
      .filter((item) => (seen.has(item.url) ? false : seen.add(item.url)))
      .map((item) => ({ url: item.url, name: item.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [flatCategories]);

  const visiblePages = useMemo(() => {
    const q = pageFilter.trim().toLowerCase();
    const list = q ? pages.filter((p) => p.name.toLowerCase().includes(q) || p.url.includes(q)) : pages;
    // Pages with pins first, so what's pinned is visible at a glance.
    return [...list].sort((a, b) => (summary[b.url] ? 1 : 0) - (summary[a.url] ? 1 : 0));
  }, [pages, pageFilter, summary]);

  const loadSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/pinned-products", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to load (${res.status}).`);
      setSummary(data.pages || {});
      if (data.max) setMax(data.max);
    } catch (e) {
      setError(e?.message || "Couldn't load the pinned products.");
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const openPage = async (url) => {
    if (dirty && !window.confirm("Discard the unsaved changes to this page's pins?")) return;
    setPage(url);
    setPins([]);
    setDirty(false);
    setSaved(false);
    setError(null);
    setLoadingPins(true);
    try {
      const res = await fetch(`/api/pinned-products?page=${encodeURIComponent(url)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to load (${res.status}).`);
      setPins(data.products || []);
    } catch (e) {
      setError(e?.message || "Couldn't load this page's pins.");
    } finally {
      setLoadingPins(false);
    }
  };

  // Product search, debounced.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/catalog/search?q=${encodeURIComponent(q)}&limit=12`, { cache: "no-store" });
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const change = (next) => {
    setPins(next);
    setDirty(true);
    setSaved(false);
  };

  const add = (product) => {
    if (pins.some((p) => p.handle === product.handle) || pins.length >= max) return;
    change([...pins, { handle: product.handle, title: product.title, brand: product.brand, sku: product.sku, image: product.image, published: product.availability !== "OutOfStock" }]);
  };

  const move = (index, delta) => {
    const next = [...pins];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    change(next);
  };

  const remove = (handle) => change(pins.filter((p) => p.handle !== handle));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/pinned-products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, handles: pins.map((p) => p.handle) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.status === "error") throw new Error(data?.error || `Save failed (${res.status}).`);
      setDirty(false);
      setSaved(true);
      setSummary((prev) => {
        const next = { ...prev };
        if (data.handles?.length) next[page] = data.handles.length;
        else delete next[page];
        return next;
      });
    } catch (e) {
      setError(e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const pageName = pages.find((p) => p.url === page)?.name || page;
  const pinnedCount = Object.keys(summary).length;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">Pinned products</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Choose the products that come first on a listing page when it&apos;s sorted by Most popular, the default
          sort. Other sorts and typed searches keep their usual order.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <strong>Pins are per brand:</strong> changes here apply to {STORE_NAME || "this store"} only. A pinned
          product shows only where it already belongs — pinning reorders a page, it never adds products to it.
        </span>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 break-words">{error}</span>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Pages */}
        <section className={`${cardClass} flex flex-col p-3`}>
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Listing pages</h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{pinnedCount} pinned</span>
          </div>
          <input
            type="search"
            value={pageFilter}
            onChange={(e) => setPageFilter(e.target.value)}
            placeholder="Find a page…"
            aria-label="Find a listing page"
            className={`${inputClass} mb-2`}
          />
          <ul className="max-h-[60vh] overflow-y-auto">
            {visiblePages.map((p) => (
              <li key={p.url}>
                <button
                  type="button"
                  onClick={() => openPage(p.url)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    p.url === page
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{p.name}</span>
                    <span className="block truncate text-xs text-zinc-400">/{p.url}</span>
                  </span>
                  {summary[p.url] ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      <Pin className="h-3 w-3" aria-hidden="true" />
                      {summary[p.url]}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
            {!visiblePages.length && <li className="px-2.5 py-3 text-sm text-zinc-500">No listing pages match.</li>}
          </ul>
        </section>

        {/* Selected page */}
        <section className={`${cardClass} flex flex-col gap-4 p-4 sm:p-5`}>
          {!page ? (
            <p className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Pick a listing page on the left to see and change its pinned products.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-zinc-900 dark:text-white">{pageName}</h3>
                  <a href={`/${page}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">
                    /{page} ↗
                  </a>
                </div>
                <button
                  type="button"
                  onClick={save}
                  disabled={!dirty || saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  {saving ? "Saving…" : "Save pins"}
                </button>
              </div>

              {saved && (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Saved. The page shows the new order now.</span>
                </div>
              )}

              {/* Pinned list */}
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Pinned, in order <span className="font-normal text-zinc-400">({pins.length} of {max})</span>
                </p>
                {loadingPins ? (
                  <p className="text-sm text-zinc-500">Loading…</p>
                ) : pins.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-white/15 dark:text-zinc-400">
                    Nothing pinned. This page shows its normal order. Search below to pin products.
                  </p>
                ) : (
                  <ol className="flex flex-col gap-2">
                    {pins.map((p, index) => (
                      <li key={p.handle} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2 dark:border-white/10">
                        <span className="w-5 text-center text-sm font-semibold text-zinc-400">{index + 1}</span>
                        <Thumb src={p.image} alt={p.title} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{p.missing ? p.handle : p.title}</p>
                          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {p.missing ? (
                              <span className="text-amber-600 dark:text-amber-400">Not found in the catalogue — it won&apos;t show</span>
                            ) : (
                              <>
                                {[p.brand, p.sku].filter(Boolean).join(" · ")}
                                {p.published === false && <span className="ml-1 text-amber-600 dark:text-amber-400">· unpublished</span>}
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${p.title || p.handle} up`} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-white/10">
                            <ArrowUp className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button type="button" onClick={() => move(index, 1)} disabled={index === pins.length - 1} aria-label={`Move ${p.title || p.handle} down`} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-white/10">
                            <ArrowDown className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button type="button" onClick={() => remove(p.handle)} aria-label={`Unpin ${p.title || p.handle}`} className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Search to add */}
              <div>
                <label htmlFor="pin-search" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Add products
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                  <input
                    id="pin-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, brand or SKU…"
                    className={`${inputClass} pl-9`}
                  />
                </div>
                {searching && <p className="mt-2 text-xs text-zinc-500">Searching…</p>}
                {results.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {results.map((r) => {
                      const already = pins.some((p) => p.handle === r.handle);
                      return (
                        <li key={r.handle} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2 dark:border-white/10">
                          <Thumb src={r.image} alt={r.title} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-zinc-900 dark:text-white">{r.title}</p>
                            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{[r.brand, r.sku].filter(Boolean).join(" · ")}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => add(r)}
                            disabled={already || pins.length >= max}
                            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-300"
                          >
                            {already ? "Pinned" : (<><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Pin</>)}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
