"use client";

import { useCallback, useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { Field, Pill, cardClass, inputClass } from "@/app/components/admin/ui";
import { ColorField, ImagePicker } from "@/app/components/admin/home-page/fields";
import { FOOTER_COLORS, SOCIAL_PLATFORMS } from "@/app/lib/site-layout/footer";
import { SOCIAL_LABELS } from "@/app/components/site-layout/social-icons";

/**
 * The footer editor.
 *
 * Built like a homepage section's page — switch at the top, fields, Light and
 * Dark colour tabs, a sticky save bar — because it is the same job and an
 * operator should not have to learn a second set of habits.
 *
 * Columns are the one genuinely new shape: a list of lists, where both the
 * columns and the links inside them can be reordered. The homepage's list field
 * only nests scalars, so this is its own control rather than a generalisation
 * of that one.
 */

const muted = "text-zinc-500 dark:text-zinc-400";
const newId = () => `f${Math.random().toString(36).slice(2, 9)}`;

const smallBtn =
  "rounded-lg px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-white/5";
const dangerBtn =
  "rounded-lg px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10";

function Move({ onUp, onDown, upDisabled, downDisabled, label }) {
  return (
    <>
      <button type="button" onClick={onUp} disabled={upDisabled} aria-label={`Move ${label} earlier`} className={smallBtn}>
        ↑
      </button>
      <button type="button" onClick={onDown} disabled={downDisabled} aria-label={`Move ${label} later`} className={smallBtn}>
        ↓
      </button>
    </>
  );
}

function LinkRow({ link, index, count, onChange, onMove, onRemove }) {
  return (
    <li className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 p-2 dark:border-white/10">
      <input
        value={link.label}
        placeholder="Label"
        onChange={(e) => onChange({ ...link, label: e.target.value })}
        className={`${inputClass} min-w-0 flex-1 py-1.5 text-sm`}
      />
      <input
        value={link.url}
        placeholder="/path or https://…"
        spellCheck={false}
        onChange={(e) => onChange({ ...link, url: e.target.value })}
        className={`${inputClass} min-w-0 flex-1 py-1.5 text-sm`}
      />
      <span className="flex shrink-0 items-center gap-1">
        <Move
          label={link.label || "link"}
          onUp={() => onMove(Math.max(0, index - 1))}
          onDown={() => onMove(Math.min(count - 1, index + 1))}
          upDisabled={index === 0}
          downDisabled={index === count - 1}
        />
        <button type="button" onClick={onRemove} className={dangerBtn}>
          Remove
        </button>
      </span>
    </li>
  );
}

function Columns({ columns, onChange }) {
  const setColumn = (i, next) => onChange(columns.map((c, j) => (j === i ? next : c)));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Columns</h3>
        <p className={`mt-1 text-xs ${muted}`}>
          Drag is by the arrows. A link with no address — or one that is not a path, a full
          https:// address, or tel:/mailto: — is left off the footer, and a column with nothing
          left to point at is left off entirely.
        </p>
      </div>

      {columns.map((column, i) => (
        <div key={column.id} className={`${cardClass} p-3`}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <input
              value={column.heading}
              placeholder="Column heading"
              onChange={(e) => setColumn(i, { ...column, heading: e.target.value })}
              className={`${inputClass} min-w-0 flex-1 py-1.5 text-sm font-semibold`}
            />
            <span className="flex shrink-0 items-center gap-1">
              <Move
                label={column.heading || "column"}
                onUp={() => onChange(arrayMove(columns, i, Math.max(0, i - 1)))}
                onDown={() => onChange(arrayMove(columns, i, Math.min(columns.length - 1, i + 1)))}
                upDisabled={i === 0}
                downDisabled={i === columns.length - 1}
              />
              <button
                type="button"
                onClick={() => onChange(columns.filter((_, j) => j !== i))}
                className={dangerBtn}
              >
                Remove column
              </button>
            </span>
          </div>

          <ul className="flex flex-col gap-2">
            {column.links.map((link, k) => (
              <LinkRow
                key={link.id}
                link={link}
                index={k}
                count={column.links.length}
                onChange={(next) =>
                  setColumn(i, { ...column, links: column.links.map((l, m) => (m === k ? next : l)) })
                }
                onMove={(to) => setColumn(i, { ...column, links: arrayMove(column.links, k, to) })}
                onRemove={() =>
                  setColumn(i, { ...column, links: column.links.filter((_, m) => m !== k) })
                }
              />
            ))}
          </ul>

          <button
            type="button"
            onClick={() =>
              setColumn(i, {
                ...column,
                links: [...column.links, { id: newId(), label: "", url: "" }],
              })
            }
            disabled={column.links.length >= 12}
            className="mt-2 w-fit rounded-xl border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-indigo-400 disabled:opacity-40 dark:border-white/10 dark:text-zinc-300"
          >
            Add link
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...columns, { id: newId(), heading: "", links: [] }])}
        disabled={columns.length >= 5}
        className="w-fit rounded-xl border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 disabled:opacity-40 dark:border-white/10 dark:text-zinc-300"
      >
        Add column
      </button>
    </div>
  );
}

function Socials({ socials, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Social links</h3>
        <p className={`mt-1 text-xs ${muted}`}>
          Only the ones with an address appear. The starting two are the addresses this brand
          already publishes; add others once there are accounts to point at.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {socials.map((social, i) => (
          <li key={social.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 p-2 dark:border-white/10">
            <select
              value={social.platform}
              onChange={(e) =>
                onChange(socials.map((s, j) => (j === i ? { ...s, platform: e.target.value } : s)))
              }
              className={`${inputClass} w-40 shrink-0 py-1.5 text-sm`}
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {SOCIAL_LABELS[p] ?? p}
                </option>
              ))}
            </select>
            <input
              value={social.url}
              placeholder="https://…"
              spellCheck={false}
              onChange={(e) =>
                onChange(socials.map((s, j) => (j === i ? { ...s, url: e.target.value } : s)))
              }
              className={`${inputClass} min-w-0 flex-1 py-1.5 text-sm`}
            />
            <span className="flex shrink-0 items-center gap-1">
              <Move
                label={SOCIAL_LABELS[social.platform] ?? social.platform}
                onUp={() => onChange(arrayMove(socials, i, Math.max(0, i - 1)))}
                onDown={() => onChange(arrayMove(socials, i, Math.min(socials.length - 1, i + 1)))}
                upDisabled={i === 0}
                downDisabled={i === socials.length - 1}
              />
              <button type="button" onClick={() => onChange(socials.filter((_, j) => j !== i))} className={dangerBtn}>
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onChange([...socials, { id: newId(), platform: SOCIAL_PLATFORMS[0], url: "" }])}
        disabled={socials.length >= 8}
        className="w-fit rounded-xl border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 disabled:opacity-40 dark:border-white/10 dark:text-zinc-300"
      >
        Add social link
      </button>
    </div>
  );
}

export default function FooterEditor({ images }) {
  const [record, setRecord] = useState(null);
  const [tab, setTab] = useState("light");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/footer");
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Could not load the footer");
      setRecord(body.footer);
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
      const res = await fetch("/api/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Save failed");
      setRecord(body.footer);
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

  const { content } = record;

  return (
    <div className="container mx-auto flex max-w-4xl flex-col gap-5 px-2 pb-16 pt-2">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Footer</h1>
        <p className={`mt-1 max-w-2xl text-sm ${muted}`}>
          Build this brand&apos;s footer. While the switch is off, visitors see the footer the site
          ships with — nothing here is visible to anyone until you turn it on.
        </p>
      </header>

      <div className={`${cardClass} flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Use this footer</h2>
          <p className={`max-w-xl text-xs ${muted}`}>
            Applies to every page on this brand, not just the homepage.
          </p>
        </div>
        <Pill active={record.enabled} onClick={() => change({ ...record, enabled: !record.enabled })}>
          {record.enabled ? "On — using this footer" : "Off — using the current footer"}
        </Pill>
      </div>

      <div className={`${cardClass} flex flex-col gap-5 p-4`}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone" hint="Shown under the logo, and dialled when pressed.">
            <input
              value={content.phone}
              onChange={(e) => setContent("phone", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Copyright line" hint="{year} becomes the current year, {store} the store name.">
            <input
              value={content.copyright}
              onChange={(e) => setContent("copyright", e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Address" hint="One line per line.">
              <textarea
                rows={2}
                value={content.address}
                onChange={(e) => setContent("address", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Logo" hint="Leave this empty to use the store logo from Favicon & Logo.">
              <ImagePicker
                value={content.logo}
                images={images}
                onChange={(v) => setContent("logo", v)}
              />
            </Field>
          </div>
        </div>

        <Columns columns={content.columns} onChange={(v) => setContent("columns", v)} />
        <Socials socials={content.socials} onChange={(v) => setContent("socials", v)} />

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
            {Object.entries(FOOTER_COLORS).map(([key, field]) => (
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
