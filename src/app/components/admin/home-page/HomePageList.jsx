"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { DragHandle, Pill, cardClass } from "@/app/components/admin/ui";
import { SECTION_TYPES, newSection, sectionTypeList } from "@/app/lib/home-page/sections";

/**
 * The homepage's running order.
 *
 * Deliberately thin: what the page is, what it is made of, and in what order.
 * Each section's fields live on its own screen, so this one stays short enough
 * to drag a section from the bottom to the top without scrolling past a dozen
 * colour pickers.
 */

const muted = "text-zinc-500 dark:text-zinc-400";

function Row({ section, onToggle, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const def = SECTION_TYPES[section.type];
  if (!def) return null;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`${cardClass} flex items-center gap-3 p-3 ${isDragging ? "opacity-60 shadow-lg" : ""}`}
    >
      <DragHandle {...attributes} {...listeners} />

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${section.visible ? "text-zinc-900 dark:text-white" : muted}`}>
          {def.label}
        </p>
        <p className={`truncate text-xs ${muted}`}>{def.description}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Pill active={section.visible} onClick={() => onToggle(section.id)}>
          {section.visible ? "Visible" : "Hidden"}
        </Pill>
        <Link
          href={`/admin/home-page/${section.id}`}
          className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:text-zinc-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onRemove(section.id)}
          className="rounded-full border border-red-200 px-3.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function HomePageList({ initial }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [sections, setSections] = useState(initial.sections);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const change = (nextSections, nextEnabled = enabled) => {
    setSections(nextSections);
    setEnabled(nextEnabled);
    setDirty(true);
    setStatus(null);
  };

  const put = async (body) => {
    const res = await fetch("/api/home-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Save failed");
    return data.homePage;
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const saved = await put({ enabled, sections });
      setSections(saved.sections);
      setDirty(false);
      setStatus({ ok: true, message: "Saved. The homepage may take a refresh to catch up." });
      router.refresh();
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  // Adding opens the new section's own screen, so anything pending here is
  // saved first rather than lost on the way.
  const add = async (type) => {
    const created = newSection(type);
    setSaving(true);
    setStatus(null);
    try {
      await put({ enabled, sections: [...sections, created] });
      setDirty(false);
      router.push(`/admin/home-page/${created.id}`);
    } catch (error) {
      setStatus({ ok: false, message: error.message });
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className={`${cardClass} flex flex-wrap items-center justify-between gap-4 p-4`}>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Use this homepage</h2>
          <p className={`max-w-xl text-xs ${muted}`}>
            While this is off, visitors see the existing homepage. Build the page first, then switch it on —
            nothing here is visible to anyone until you do.
          </p>
        </div>
        <button
          type="button"
          onClick={() => change(sections, !enabled)}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            enabled
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-zinc-300 text-zinc-700 hover:border-indigo-400 dark:border-white/10 dark:text-zinc-300"
          }`}
        >
          {enabled ? "On — this page is live" : "Off — using the current homepage"}
        </button>
      </div>

      {sections.length === 0 ? (
        <div className={`${cardClass} p-6 text-center text-sm ${muted}`}>
          No sections yet. Add one below to start building the page.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;
            const from = sections.findIndex((s) => s.id === active.id);
            const to = sections.findIndex((s) => s.id === over.id);
            change(arrayMove(sections, from, to));
          }}
        >
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {sections.map((section) => (
                <Row
                  key={section.id}
                  section={section}
                  onToggle={(id) =>
                    change(sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)))
                  }
                  onRemove={(id) => change(sections.filter((s) => s.id !== id))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className={`${cardClass} flex flex-wrap items-center gap-2 p-4`}>
        <span className={`text-xs font-semibold uppercase tracking-wide ${muted}`}>Add a section</span>
        {sectionTypeList().map((type) => (
          <Pill key={type.type} onClick={() => add(type.type)} title={type.description} disabled={saving}>
            + {type.label}
          </Pill>
        ))}
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
