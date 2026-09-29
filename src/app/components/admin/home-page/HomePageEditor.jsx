"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Divider,
  DragHandle,
  Field,
  Pill,
  Section,
  cardClass,
  inputClass,
} from "@/app/components/admin/ui";
import {
  SECTION_TYPES,
  THEME_COLOR,
  appearanceDefault,
  itemId,
  newSection,
  sectionTypeList,
} from "@/app/lib/home-page/sections";
import { ICON_NAMES, iconComponent } from "@/app/components/home-page/icons";

/**
 * The homepage editor.
 *
 * Every form here is generated from the section registry, so a new section type
 * appears on this screen without changes to this file. Styling comes from the
 * shared admin kit — the same inputs, cards and drag handle as the menu editor,
 * and the same light and dark treatment as the rest of /admin.
 *
 * Content is edited once; only colours have Light and Dark tabs, because that
 * is all the two designs differ in.
 */

const muted = "text-zinc-500 dark:text-zinc-400";
const heading = "text-zinc-900 dark:text-white";

/* ─────────────────────────── field editors ─────────────────────────── */

function ColorField({ field, value, onChange }) {
  const usingTheme = value === THEME_COLOR;
  return (
    <Field label={field.label} hint={field.hint}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={usingTheme ? "#e85d26" : value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-zinc-300 bg-white dark:border-white/10 dark:bg-zinc-900"
          aria-label={`${field.label} colour`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} font-mono text-xs`}
          spellCheck={false}
        />
        <Pill active={usingTheme} onClick={() => onChange(THEME_COLOR)} title="Follow the brand colour from Theme colour">
          Theme
        </Pill>
      </div>
    </Field>
  );
}

function IconField({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const Current = iconComponent(value);

  return (
    <Field label="Icon">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
          <Current className="h-5 w-5 text-zinc-700 dark:text-zinc-200" aria-hidden="true" />
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`${inputClass} text-left`}
        >
          {value || "Choose an icon"}
        </button>
      </div>

      {open && (
        <div className="mt-2 grid max-h-52 grid-cols-6 gap-1 overflow-y-auto rounded-xl border border-zinc-200 p-2 dark:border-white/10 sm:grid-cols-9">
          {ICON_NAMES.map((name) => {
            const Icon = iconComponent(name);
            const active = name === value;
            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                className={`flex h-9 items-center justify-center rounded-lg border transition-colors ${
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      )}
    </Field>
  );
}

function ListField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const setItem = (id, patch) => onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <Section title={field.label} description={field.hint}>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={item.id} className={`${cardClass} p-3`}>
            <div className="mb-2 flex items-center justify-between">
              <span className={`text-xs font-medium uppercase tracking-wide ${muted}`}>
                Item {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => onChange(arrayMove(items, index, Math.max(0, index - 1)))}
                  disabled={index === 0}
                  className="rounded-lg px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-white/5">↑</button>
                <button type="button" onClick={() => onChange(arrayMove(items, index, Math.min(items.length - 1, index + 1)))}
                  disabled={index === items.length - 1}
                  className="rounded-lg px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-white/5">↓</button>
                <button type="button" onClick={() => onChange(items.filter((i) => i.id !== item.id))}
                  disabled={items.length <= (field.min ?? 1)}
                  className="rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-30 dark:hover:bg-red-500/10">
                  Remove
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(field.item).map(([key, sub]) =>
                sub.type === "icon" ? (
                  <IconField key={key} value={item[key]} onChange={(v) => setItem(item.id, { [key]: v })} />
                ) : (
                  <Field key={key} label={sub.label} hint={sub.hint}>
                    <input
                      type="text"
                      value={item[key] ?? ""}
                      maxLength={sub.maxLength}
                      onChange={(e) => setItem(item.id, { [key]: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          onChange([
            ...items,
            {
              id: itemId(),
              ...Object.fromEntries(Object.entries(field.item).map(([k, sub]) => [k, sub.default ?? ""])),
            },
          ])
        }
        disabled={items.length >= (field.max ?? 12)}
        className="w-fit rounded-xl border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 disabled:opacity-40 dark:border-white/10 dark:text-zinc-300"
      >
        {field.addLabel ?? "Add item"}
      </button>
    </Section>
  );
}

function ContentField({ name, field, value, images, onChange }) {
  if (field.type === "list") return <ListField field={field} value={value} onChange={onChange} />;

  const common = {
    id: name,
    value: value ?? "",
    onChange: (e) => onChange(e.target.value),
    className: inputClass,
  };

  return (
    <Field label={field.label} htmlFor={name} hint={field.hint}>
      {field.type === "textarea" ? (
        <textarea rows={3} maxLength={field.maxLength} {...common} />
      ) : field.type === "image" ? (
        <div className="flex flex-col gap-2">
          <input type="text" spellCheck={false} {...common} />
          {images.length > 0 && (
            <select
              className={`${inputClass} text-xs`}
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
            <img src={value} alt="" className="h-28 w-full rounded-xl border border-zinc-200 object-cover dark:border-white/10" />
          )}
        </div>
      ) : (
        <input type="text" maxLength={field.maxLength} spellCheck={field.type !== "url"} {...common} />
      )}
    </Field>
  );
}

/* ─────────────────────────── one section ─────────────────────────── */

function SectionCard({ section, images, onChange, onRemove }) {
  const [tab, setTab] = useState("light");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const def = SECTION_TYPES[section.type];
  if (!def) return null;

  const setContent = (key, value) => onChange({ ...section, content: { ...section.content, [key]: value } });
  const setAppearance = (key, value) =>
    onChange({
      ...section,
      appearance: { ...section.appearance, [tab]: { ...section.appearance[tab], [key]: value } },
    });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`${cardClass} p-4 ${isDragging ? "opacity-60 shadow-lg" : ""}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-white/10">
        <div className="flex items-start gap-2">
          <DragHandle {...attributes} {...listeners} />
          <div>
            <h3 className={`text-sm font-semibold ${heading}`}>{def.label}</h3>
            <p className={`text-xs ${muted}`}>{def.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Pill active={section.visible} onClick={() => onChange({ ...section, visible: !section.visible })}>
            {section.visible ? "Visible" : "Hidden"}
          </Pill>
          <button
            type="button"
            onClick={() => onRemove(section.id)}
            className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(def.content).map(([key, field]) => (
          <div key={key} className={["textarea", "image", "list"].includes(field.type) ? "md:col-span-2" : ""}>
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

      <div className="mt-5">
        <Divider />
      </div>

      <div className="mt-4">
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
            className={`ml-auto text-xs underline ${muted} hover:text-zinc-800 dark:hover:text-zinc-200`}
          >
            Reset {tab}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(def.appearance).map(([key, field]) => (
            <ColorField key={key} field={field} value={section.appearance[tab][key]} onChange={(v) => setAppearance(key, v)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── the screen ─────────────────────────── */

export default function HomePageEditor({ initial, images }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [sections, setSections] = useState(initial.sections);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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
      setStatus({ ok: true, message: "Saved. The homepage may take a refresh to catch up." });
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className={`${cardClass} flex flex-wrap items-center justify-between gap-4 p-4`}>
        <div>
          <h2 className={`text-sm font-semibold ${heading}`}>Use this homepage</h2>
          <p className={`max-w-xl text-xs ${muted}`}>
            While this is off, visitors see the existing homepage. Build the page first, then switch it
            on — nothing here is visible to anyone until you do.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            enabled
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-zinc-300 text-zinc-700 hover:border-indigo-400 dark:border-white/10 dark:text-zinc-300"
          }`}
        >
          {enabled ? "On — this page is live" : "Off — using the current homepage"}
        </button>
      </div>

      {sections.length === 0 && (
        <div className={`${cardClass} p-6 text-center text-sm ${muted}`}>
          No sections yet. Add one below to start building the page.
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;
          const from = sections.findIndex((s) => s.id === active.id);
          const to = sections.findIndex((s) => s.id === over.id);
          update(arrayMove(sections, from, to));
        }}
      >
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                images={images}
                onChange={(next) => update(sections.map((s) => (s.id === next.id ? next : s)))}
                onRemove={(id) => update(sections.filter((s) => s.id !== id))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className={`${cardClass} flex flex-wrap items-center gap-2 p-4`}>
        <span className={`text-xs font-semibold uppercase tracking-wide ${muted}`}>Add a section</span>
        {sectionTypeList().map((type) => (
          <Pill key={type.type} onClick={() => update([...sections, newSection(type.type)])} title={type.description}>
            + {type.label}
          </Pill>
        ))}
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-zinc-200 bg-white/95 py-3 backdrop-blur dark:border-white/10 dark:bg-zinc-950/90">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 dark:border-white/10 dark:text-zinc-300"
        >
          View homepage
        </a>
        {status && (
          <span className={`text-sm ${status.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {status.message}
          </span>
        )}
      </div>
    </div>
  );
}
