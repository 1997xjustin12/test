"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Globe, Info, Save } from "lucide-react";
import { Toggle } from "@/app/components/admin/ui";

/**
 * Where the AI assistant is served.
 *
 * One switch, deliberately: the assistant costs money per message, and the only
 * question anyone has actually needed to answer is whether the team in the
 * Philippines can reach it. Anything more configurable would be a country
 * picker nobody uses, with more ways to leave it wrong.
 */
export default function AiAssistantSettings() {
  const [usCaOnly, setUsCaOnly] = useState(true);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/region-settings", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load (${res.status}).`);
      const data = await res.json();
      setUsCaOnly(data.usCaOnly);
      setMeta(data);
      setDirty(false);
    } catch (e) {
      setError(e?.message || "Couldn't load the setting.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      const res = await fetch("/api/chat/region-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usCaOnly }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.status === "error") {
        setError(data?.error || `Save failed (${res.status}).`);
        return;
      }
      setSaved(data);
      setMeta((m) => ({ ...m, countries: data.countries, usCaOnly: data.usCaOnly }));
      setDirty(false);
    } catch (e) {
      setError(e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const countries = usCaOnly ? ["US", "CA"] : ["US", "CA", "PH"];
  const names = { US: "United States", CA: "Canada", PH: "Philippines" };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          AI assistant
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Which countries the shopping assistant answers in. Every message costs a
          model call, so this exists to keep spend pointed at the markets we sell
          to.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <strong>Affects all three brands.</strong> One setting covers Solana, BBQ
          Grill Outlet and Outdoor Kitchen Outlet, so a demo only needs one flip —
          and, more usefully, only one thing to remember to turn back on.
        </span>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 break-words">{error}</span>
        </div>
      )}

      {saved && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Saved. {saved.note}</span>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      ) : (
        <>
          <section className="rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-white/10">
            <Toggle
              label="Restrict to the US and Canada"
              name="us-ca-only"
              id="us-ca-only"
              checked={usCaOnly}
              onChange={(e) => {
                setUsCaOnly(e.target.checked);
                setDirty(true);
                setSaved(null);
              }}
              hint="Turn off to add the Philippines, for demos and testing from the team there. Leaving it off means every message from PH costs a model call, so turn it back on when the demo is done."
            />

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4 dark:border-white/5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Currently serving:
              </span>
              {countries.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-sm text-zinc-800 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  <Globe className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                  {names[c]}
                </span>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-between gap-3">
            <p className="flex items-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              <span>
                {meta?.enforcedHere
                  ? "This deployment is production, so the setting applies here."
                  : "Local and preview builds are never restricted, so the assistant works here whatever this says. The setting governs production."}
              </span>
            </p>
            <button
              type="button"
              onClick={save}
              disabled={saving || !dirty}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
