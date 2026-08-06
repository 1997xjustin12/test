"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Server,
  ShoppingBag,
} from "lucide-react";

const TARGETS = [
  {
    id: "feed",
    label: "Merchant feed",
    path: "/products_sitemap.xml",
    blurb:
      "Google Merchant Center product feed — price, availability, images. Register it under Products → Feeds as a scheduled fetch.",
  },
  {
    id: "sitemap",
    label: "Sitemap",
    path: "/sitemap.xml",
    blurb: "Crawl discovery for search engines. Sourced from Elasticsearch.",
  },
];

const fmtDuration = (ms) =>
  ms == null ? "—" : ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;

const fmtWhen = (iso) => {
  if (!iso) return "never";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "unknown" : d.toLocaleString();
};

function StatusRow({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="min-w-0 truncate text-right text-xs font-medium text-zinc-800 dark:text-zinc-200">
        {children}
      </span>
    </div>
  );
}

export default function FeedManager({ baseUrl }) {
  const [info, setInfo] = useState(null);
  const [running, setRunning] = useState(null); // target id
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/regenerate-feed", { cache: "no-store" });
      setInfo(await res.json());
    } catch (e) {
      setError("Couldn't load feed status.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // A Shopify-sourced run takes tens of seconds; show it ticking so the screen
  // doesn't look hung.
  useEffect(() => {
    if (!running) return undefined;
    setElapsed(0);
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const regenerate = async (target) => {
    setRunning(target);
    setError(null);
    try {
      const res = await fetch(`/api/regenerate-feed?target=${target}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.status !== "ok") {
        setError(data.error || "Generation failed.");
      }
      await load();
    } catch (e) {
      setError(e?.message || "Request failed.");
    } finally {
      setRunning(null);
    }
  };

  const isShopify = info?.mode === "shopify";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          XML Feeds
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Rebuild the merchant feed after a product update instead of waiting
          for the hourly refresh.
        </p>
      </div>

      {/* Mode banner — which catalog the feed actually describes */}
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          isShopify
            ? "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10"
            : "border-zinc-200 dark:border-white/10"
        }`}
      >
        {isShopify ? (
          <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        ) : (
          <Server className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            {isShopify
              ? "External Shopify storefront"
              : "This site (Elasticsearch)"}
          </p>
          <p className="mt-0.5 break-all text-xs text-zinc-600 dark:text-zinc-400">
            {info?.source || "—"}
          </p>
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            {isShopify
              ? "Price and availability are read from that store's products.json so they match its landing pages. It is rate limited, so a full rebuild takes tens of seconds."
              : "Products come from this app's Elasticsearch index and link to this site."}{" "}
            Change this in{" "}
            <a
              href="/admin/settings"
              className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Store Settings → Catalog
            </a>
            .
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 break-words">{error}</span>
        </div>
      )}

      {TARGETS.map((target) => {
        const last = info?.last?.[target.id];
        const busy = running === target.id;
        const ok = last?.status === "ok";

        return (
          <section
            key={target.id}
            className="rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-white/10"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-white">
                  {target.label}
                  {last && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        ok
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                      }`}
                    >
                      {ok ? (
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      )}
                      {ok ? "OK" : "Failed"}
                    </span>
                  )}
                </h3>
                <p className="mt-1 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
                  {target.blurb}
                </p>
                <a
                  href={`${baseUrl || ""}${target.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 font-mono text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {target.path}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>

              <button
                type="button"
                onClick={() => regenerate(target.id)}
                disabled={!!running}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${busy ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {busy ? `Generating… ${elapsed}s` : "Regenerate"}
              </button>
            </div>

            <div className="mt-4 divide-y divide-zinc-100 border-t border-zinc-100 pt-2 dark:divide-white/5 dark:border-white/5">
              <StatusRow label="Items">
                {last?.items != null ? last.items.toLocaleString() : "—"}
              </StatusRow>
              <StatusRow label="Size">
                {last?.bytes != null
                  ? `${(last.bytes / 1024).toFixed(0)} KB`
                  : "—"}
              </StatusRow>
              <StatusRow label="Took">{fmtDuration(last?.durationMs)}</StatusRow>
              <StatusRow label="Last generated">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 text-zinc-400" aria-hidden="true" />
                  {fmtWhen(last?.generatedAt)}
                </span>
              </StatusRow>
              {last?.error && (
                <StatusRow label="Error">
                  <span className="text-red-600 dark:text-red-400">
                    {last.error}
                  </span>
                </StatusRow>
              )}
            </div>
          </section>
        );
      })}

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Both documents also refresh on their own every hour. Regenerating here
        busts the cache and rebuilds immediately so you can confirm the result.
      </p>
    </div>
  );
}
