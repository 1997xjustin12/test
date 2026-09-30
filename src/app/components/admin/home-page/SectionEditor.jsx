"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Divider, Pill, cardClass } from "@/app/components/admin/ui";
import { SECTION_TYPES, appearanceDefault } from "@/app/lib/home-page/sections";
import { ColorField, ContentField } from "./fields";

/**
 * One section's own screen.
 *
 * It edits a single section but saves the whole record, because that is what
 * the storefront reads — the other sections are carried through untouched from
 * what the server handed this page.
 *
 * Content is edited once; only the colours have Light and Dark tabs, since that
 * is all the two designs differ in.
 */

const muted = "text-zinc-500 dark:text-zinc-400";

export default function SectionEditor({ section: initialSection, siblings, enabled, images, posts }) {
  const router = useRouter();
  const [section, setSection] = useState(initialSection);
  const [tab, setTab] = useState("light");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const def = SECTION_TYPES[section.type];

  const change = (next) => {
    setSection(next);
    setDirty(true);
    setStatus(null);
  };

  const setContent = (key, value) => change({ ...section, content: { ...section.content, [key]: value } });
  const setAppearance = (key, value) =>
    change({
      ...section,
      appearance: { ...section.appearance, [tab]: { ...section.appearance[tab], [key]: value } },
    });

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      // siblings preserves the running order; this section replaces itself.
      const sections = siblings.map((s) => (s.id === section.id ? section : s));
      const res = await fetch("/api/home-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, sections }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      const saved = data.homePage.sections.find((s) => s.id === section.id);
      if (saved) setSection(saved);
      setDirty(false);
      setStatus({ ok: true, message: "Saved. The homepage may take a refresh to catch up." });
      router.refresh();
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className={`${cardClass} flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">{def.label}</h2>
          <p className={`max-w-xl text-xs ${muted}`}>{def.description}</p>
        </div>
        <Pill active={section.visible} onClick={() => change({ ...section, visible: !section.visible })}>
          {section.visible ? "Visible on the page" : "Hidden from the page"}
        </Pill>
      </div>

      <div className={`${cardClass} p-4`}>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(def.content).map(([key, field]) => (
            <div key={key} className={["textarea", "image", "list", "blogs"].includes(field.type) ? "md:col-span-2" : ""}>
              <ContentField
                name={`${section.id}-${key}`}
                field={field}
                value={section.content[key]}
                images={images}
                posts={posts}
                onChange={(v) => setContent(key, v)}
              />
            </div>
          ))}
        </div>

        <div className="my-5">
          <Divider />
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wide ${muted}`}>Colours</span>
          {["light", "dark"].map((mode) => (
            <Pill key={mode} active={tab === mode} onClick={() => setTab(mode)}>
              {`${mode} mode`}
            </Pill>
          ))}
          <button
            type="button"
            onClick={() =>
              change({
                ...section,
                appearance: {
                  ...section.appearance,
                  [tab]: Object.fromEntries(
                    Object.entries(def.appearance).map(([k, f]) => [k, appearanceDefault(f, tab)]),
                  ),
                },
              })
            }
            className={`ml-auto text-xs underline ${muted} hover:text-zinc-800 dark:hover:text-zinc-200`}
          >
            Reset {tab}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(def.appearance).map(([key, field]) => (
            <ColorField
              key={key}
              field={field}
              value={section.appearance[tab][key]}
              onChange={(v) => setAppearance(key, v)}
            />
          ))}
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
        <Link
          href="/admin/home-page"
          className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 dark:border-white/10 dark:text-zinc-300"
        >
          Back to sections
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 dark:border-white/10 dark:text-zinc-300"
        >
          View homepage
        </a>
        {dirty && !status && <span className={`text-sm ${muted}`}>Unsaved changes</span>}
        {status && (
          <span className={`text-sm ${status.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {status.message}
          </span>
        )}
      </div>
    </div>
  );
}
