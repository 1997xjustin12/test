"use client";

import { useState } from "react";
import { SECTION_TYPES, THEME_COLOR, appearanceDefault, newSection, sectionTypeList } from "@/app/lib/home-page/sections";

/**
 * The homepage editor.
 *
 * Every form on this screen is generated from the section registry, so adding a
 * section type to lib/home-page/sections.js puts it here with no changes to
 * this file.
 *
 * Content is edited once. Appearance is edited per colour scheme, behind the
 * Light/Dark tabs, because that is the only thing the two designs differ in —
 * duplicating the copy per scheme would only let the two drift apart.
 */

const label = "block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1";
const input =
  "w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none";
const card = "rounded-lg border border-stone-200 bg-white p-4";

function ColorField({ field, value, onChange }) {
  const usingTheme = value === THEME_COLOR;
  return (
    <div>
      <label className={label}>{field.label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={usingTheme ? "#e85d26" : value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-stone-300 bg-white"
          aria-label={`${field.label} colour`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${input} font-mono text-xs`}
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => onChange(THEME_COLOR)}
          className={`whitespace-nowrap rounded-md border px-2.5 py-2 text-xs font-medium ${
            usingTheme
              ? "border-stone-800 bg-stone-800 text-white"
              : "border-stone-300 text-stone-600 hover:border-stone-500"
          }`}
          title="Follow the brand colour set in Theme colour"
        >
          Theme
        </button>
      </div>
      {field.hint && <p className="mt-1 text-xs text-stone-500">{field.hint}</p>}
    </div>
  );
}

function ContentField({ name, field, value, images, onChange }) {
  const common = { id: name, value: value ?? "", onChange: (e) => onChange(e.target.value), className: input };

  return (
    <div>
      <label className={label} htmlFor={name}>
        {field.label}
        {field.required && <span className="ml-1 text-red-600">*</span>}
      </label>

      {field.type === "textarea" ? (
        <textarea rows={3} {...common} />
      ) : field.type === "image" ? (
        <div className="space-y-2">
          <input type="text" spellCheck={false} {...common} />
          {images.length > 0 && (
            <select
              className={`${input} text-xs`}
              value={images.includes(value) ? value : ""}
              onChange={(e) => e.target.value && onChange(e.target.value)}
            >
              <option value="">Choose from public/images/banner…</option>
              {images.map((src) => (
                <option key={src} value={src}>
                  {src.split("/").pop()}
                </option>
              ))}
            </select>
          )}
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-28 w-full rounded border border-stone-200 object-cover" />
          )}
        </div>
      ) : (
        <input type="text" spellCheck={field.type !== "url"} {...common} />
      )}

      {field.hint && <p className="mt-1 text-xs text-stone-500">{field.hint}</p>}
      {field.maxLength && (
        <p className="mt-1 text-right text-[11px] text-stone-400">
          {(value ?? "").length}/{field.maxLength}
        </p>
      )}
    </div>
  );
}

function SectionCard({ section, images, index, count, onChange, onMove, onRemove }) {
  const [tab, setTab] = useState("light");
  const def = SECTION_TYPES[section.type];
  if (!def) return null;

  const setContent = (key, value) =>
    onChange({ ...section, content: { ...section.content, [key]: value } });

  const setAppearance = (key, value) =>
    onChange({
      ...section,
      appearance: { ...section.appearance, [tab]: { ...section.appearance[tab], [key]: value } },
    });

  return (
    <div className={card}>
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">{def.label}</h3>
          <p className="text-xs text-stone-500">{def.description}</p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onChange({ ...section, visible: !section.visible })}
            className={`rounded-md border px-2.5 py-1.5 text-xs font-medium ${
              section.visible ? "border-stone-300 text-stone-600" : "border-amber-400 bg-amber-50 text-amber-700"
            }`}>
            {section.visible ? "Visible" : "Hidden"}
          </button>
          <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0}
            className="rounded-md border border-stone-300 px-2 py-1.5 text-xs disabled:opacity-30" title="Move up">↑</button>
          <button type="button" onClick={() => onMove(index, 1)} disabled={index === count - 1}
            className="rounded-md border border-stone-300 px-2 py-1.5 text-xs disabled:opacity-30" title="Move down">↓</button>
          <button type="button" onClick={() => onRemove(section.id)}
            className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50">Remove</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(def.content).map(([key, field]) => (
          <div key={key} className={field.type === "textarea" || field.type === "image" ? "md:col-span-2" : ""}>
            <ContentField
              name={`${section.id}-${key}`}
              field={field}
              value={section.content[key]}
              images={images}
              onChange={(v) => setContent(key, v)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-stone-200 pt-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Colours</span>
          {["light", "dark"].map((mode) => (
            <button key={mode} type="button" onClick={() => setTab(mode)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${
                tab === mode ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}>
              {`${mode} mode`}
            </button>
          ))}
          <button type="button"
            onClick={() =>
              onChange({
                ...section,
                appearance: {
                  ...section.appearance,
                  [tab]: Object.fromEntries(
                    Object.entries(def.appearance).map(([k, f]) => [k, appearanceDefault(f, tab)]),
                  ),
                },
              })
            }
            className="ml-auto text-xs text-stone-500 underline hover:text-stone-800">
            Reset {tab}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(def.appearance).map(([key, field]) => (
            <ColorField key={key} field={field} value={section.appearance[tab][key]}
              onChange={(v) => setAppearance(key, v)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePageEditor({ initial, images }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [sections, setSections] = useState(initial.sections);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (next) => {
    setSections(next);
    setStatus(null);
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/home-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, sections }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      setSections(data.homePage.sections);
      setStatus({ ok: true, message: "Saved. The homepage is updated." });
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className={`${card} flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Use this homepage</h2>
          <p className="max-w-xl text-xs text-stone-500">
            While this is off, visitors see the existing homepage. Build the page first, then switch it on —
            nothing here is visible to anyone until you do.
          </p>
        </div>
        <button type="button" onClick={() => setEnabled(!enabled)}
          className={`rounded-md border px-4 py-2 text-sm font-medium ${
            enabled ? "border-green-600 bg-green-600 text-white" : "border-stone-300 text-stone-600 hover:border-stone-500"
          }`}>
          {enabled ? "On — this page is live" : "Off — using the current homepage"}
        </button>
      </div>

      {sections.length === 0 && (
        <div className={`${card} text-center text-sm text-stone-500`}>
          No sections yet. Add one below to start building the page.
        </div>
      )}

      {sections.map((section, index) => (
        <SectionCard
          key={section.id}
          section={section}
          images={images}
          index={index}
          count={sections.length}
          onChange={(next) => update(sections.map((s) => (s.id === next.id ? next : s)))}
          onMove={(from, delta) => {
            const to = from + delta;
            if (to < 0 || to >= sections.length) return;
            const next = [...sections];
            [next[from], next[to]] = [next[to], next[from]];
            update(next);
          }}
          onRemove={(id) => update(sections.filter((s) => s.id !== id))}
        />
      ))}

      <div className={`${card} flex flex-wrap items-center gap-3`}>
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Add a section</span>
        {sectionTypeList().map((type) => (
          <button key={type.type} type="button"
            onClick={() => update([...sections, newSection(type.type)])}
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:border-stone-500">
            + {type.label}
          </button>
        ))}
      </div>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-stone-200 bg-white/95 py-3 backdrop-blur">
        <button type="button" onClick={save} disabled={saving}
          className="rounded-md bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "Saving…" : "Save"}
        </button>
        <a href="/" target="_blank" rel="noreferrer"
          className="rounded-md border border-stone-300 px-4 py-2.5 text-sm hover:border-stone-500">
          View homepage
        </a>
        {status && (
          <span className={`text-sm ${status.ok ? "text-green-700" : "text-red-700"}`}>{status.message}</span>
        )}
      </div>
    </div>
  );
}
