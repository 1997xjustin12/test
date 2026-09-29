"use client";

import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { Field, Section, Pill, cardClass, inputClass } from "@/app/components/admin/ui";
import { THEME_COLOR, itemId } from "@/app/lib/home-page/sections";
import { ICON_NAMES, iconComponent } from "@/app/components/home-page/icons";

/**
 * The form controls a section's schema is rendered with.
 *
 * One editor per field type, so a section type gets its form from its registry
 * entry alone. Styling is the shared admin kit, which carries the light and
 * dark treatment used across /admin.
 */

const muted = "text-zinc-500 dark:text-zinc-400";

export function ColorField({ field, value, onChange }) {
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

export function IconField({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const Current = iconComponent(value);

  return (
    <Field label="Icon">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
          <Current className="h-5 w-5 text-zinc-700 dark:text-zinc-200" aria-hidden="true" />
        </span>
        <button type="button" onClick={() => setOpen((v) => !v)} className={`${inputClass} text-left`}>
          {value || "Choose an icon"}
        </button>
      </div>

      {open && (
        <div className="mt-2 grid max-h-52 grid-cols-6 gap-1 overflow-y-auto rounded-xl border border-zinc-200 p-2 dark:border-white/10 sm:grid-cols-9">
          {ICON_NAMES.map((name) => {
            const Icon = iconComponent(name);
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
                  name === value
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      )}
    </Field>
  );
}

export function ImagePicker({ value, images, onChange }) {
  // Grouped by folder; the flat list is only for "is this one of ours?".
  const groups = Array.isArray(images) ? images : [];
  const known = groups.flatMap((group) => group.images);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={value ?? ""}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      {groups.length > 0 && (
        <select
          className={`${inputClass} text-xs`}
          value={known.includes(value) ? value : ""}
          onChange={(e) => e.target.value && onChange(e.target.value)}
        >
          <option value="">Choose from the image library…</option>
          {groups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.images.map((src) => (
                <option key={src} value={src}>
                  {src.split("/").pop()}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      )}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-28 w-full rounded-xl border border-zinc-200 object-cover dark:border-white/10" />
      )}
    </div>
  );
}

export function ListField({ field, value, onChange, images }) {
  const items = Array.isArray(value) ? value : [];
  const setItem = (id, patch) => onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <Section title={field.label} description={field.hint}>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={item.id} className={`${cardClass} p-3`}>
            <div className="mb-2 flex items-center justify-between">
              <span className={`text-xs font-medium uppercase tracking-wide ${muted}`}>Item {index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onChange(arrayMove(items, index, Math.max(0, index - 1)))}
                  disabled={index === 0}
                  className="rounded-lg px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-white/5"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onChange(arrayMove(items, index, Math.min(items.length - 1, index + 1)))}
                  disabled={index === items.length - 1}
                  className="rounded-lg px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-white/5"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((i) => i.id !== item.id))}
                  disabled={items.length <= (field.min ?? 1)}
                  className="rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-30 dark:hover:bg-red-500/10"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(field.item).map(([key, sub]) =>
                sub.type === "icon" ? (
                  <IconField key={key} value={item[key]} onChange={(v) => setItem(item.id, { [key]: v })} />
                ) : sub.type === "image" ? (
                  <div key={key} className="sm:col-span-2">
                    <Field label={sub.label} hint={sub.hint}>
                      <ImagePicker value={item[key]} images={images} onChange={(v) => setItem(item.id, { [key]: v })} />
                    </Field>
                  </div>
                ) : sub.type === "textarea" ? (
                  <div key={key} className="sm:col-span-2">
                    <Field label={sub.label} hint={sub.hint}>
                      <textarea
                        rows={2}
                        value={item[key] ?? ""}
                        maxLength={sub.maxLength}
                        onChange={(e) => setItem(item.id, { [key]: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                  </div>
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

export function ContentField({ name, field, value, images, onChange }) {
  if (field.type === "list") return <ListField field={field} value={value} onChange={onChange} images={images} />;

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
        <ImagePicker value={value} images={images} onChange={onChange} />
      ) : (
        <input type="text" maxLength={field.maxLength} spellCheck={field.type !== "url"} {...common} />
      )}
    </Field>
  );
}
