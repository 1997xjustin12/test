"use client";

import { useCallback, useEffect, useState } from "react";
import { Field, Pill, cardClass, inputClass } from "@/app/components/admin/ui";
import { ColorField } from "@/app/components/admin/home-page/fields";
import { HEADER_COLORS } from "@/app/lib/site-layout/header";

/**
 * The header editor.
 *
 * Short on purpose. The links in the header are the menu, and the menu has its
 * own editor at /admin/menu-builder — so what is here is the phone, the search
 * field's placeholder and the colours, and the screen says where the links come
 * from rather than leaving someone hunting for them.
 */

const muted = "text-zinc-500 dark:text-zinc-400";

export default function HeaderEditor() {
  const [record, setRecord] = useState(null);
  const [tab, setTab] = useState("light");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/header");
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Could not load the header");
      setRecord(body.header);
      setDirty(false);
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const change = (next) => {
    setRecord(next);
    setDirty(true);
    setStatus(null);
  };
  const setContent = (key, value) => change({ ...record, content: { ...record.content, [key]: value } });
  const setColor = (key, value) =>
    change({
      ...record,
      appearance: { ...record.appearance, [tab]: { ...record.appearance[tab], [key]: value } },
    });

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Save failed");
      setRecord(body.header);
      setDirty(false);
      setStatus({ ok: true, message: "Saved. The site may take a refresh to catch up." });
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (!record) {
    return (
      <div className="container mx-auto px-2 pt-2">
        <p className={`text-sm ${muted}`}>{status?.message ?? "Loading…"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex max-w-4xl flex-col gap-5 px-2 pb-16 pt-2">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Header</h1>
        <p className={`mt-1 max-w-2xl text-sm ${muted}`}>
          Build this brand&apos;s header. While the switch is off, visitors see the header the site
          ships with. This applies to this brand only — turning it on here does not turn it on for
          the others.
        </p>
      </header>

      <div className={`${cardClass} flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Use this header</h2>
          <p className={`max-w-xl text-xs ${muted}`}>Applies to every page on this brand.</p>
        </div>
        <Pill active={record.enabled} onClick={() => change({ ...record, enabled: !record.enabled })}>
          {record.enabled ? "On — using this header" : "Off — using the current header"}
        </Pill>
      </div>

      <div className={`${cardClass} flex flex-col gap-5 p-4`}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone" hint="Shown beside the icons on wide screens, and dialled when pressed.">
            <input
              value={record.content.phone}
              onChange={(e) => setContent("phone", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Search placeholder">
            <input
              value={record.content.searchPlaceholder}
              onChange={(e) => setContent("searchPlaceholder", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="rounded-xl border border-zinc-200 p-3 dark:border-white/10">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Links</h3>
          <p className={`mt-1 text-xs ${muted}`}>
            The header shows the menu, so the links are edited in{" "}
            <a href="/admin/menu-builder" className="underline hover:text-zinc-800 dark:hover:text-zinc-200">
              Menu Builder
            </a>{" "}
            — including which items appear, through its &ldquo;Show in navigation&rdquo; toggle. There
            is no second list here, so the header and the rest of the site cannot disagree about what
            the navigation is.
          </p>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wide ${muted}`}>Colours</span>
            {["light", "dark"].map((mode) => (
              <Pill key={mode} active={tab === mode} onClick={() => setTab(mode)}>
                {`${mode} mode`}
              </Pill>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(HEADER_COLORS).map(([key, field]) => (
              <ColorField
                key={key}
                field={field}
                value={record.appearance[tab][key]}
                onChange={(v) => setColor(key, v)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-zinc-200 bg-white/95 py-3 backdrop-blur dark:border-white/10 dark:bg-zinc-950/90">
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : dirty ? "Save" : "Saved"}
        </button>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 dark:border-white/10 dark:text-zinc-300"
        >
          View site
        </a>
        {dirty && !status && <span className={`text-sm ${muted}`}>Unsaved changes</span>}
        {status && (
          <span
            className={`text-sm ${status.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {status.message}
          </span>
        )}
      </div>
    </div>
  );
}
