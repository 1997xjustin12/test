"use client";
import useCompareToggle from "@/app/components/compare/useCompareToggle";

// BBQ's Compare checkbox, drawn to bbq-design-patterns.md: the near-square
// theme checkbox from the checkout, Oswald uppercase label. Behaviour is in
// useCompareToggle.
export default function CompareToggle({ product, className = "" }) {
  const { available, checked, disabled, toggle, label, fullMessage, announcement } = useCompareToggle(product);
  if (!available) return null;

  return (
    <label
      onClick={(e) => e.stopPropagation()}
      title={disabled ? fullMessage : undefined}
      className={`inline-flex items-center gap-2 font-oswald text-[11px] font-semibold uppercase tracking-wide select-none transition-colors ${
        disabled
          ? "cursor-not-allowed text-char/30 dark:text-ash/25"
          : checked
            ? "cursor-pointer text-theme-600 dark:text-theme-500"
            : "cursor-pointer text-char/50 dark:text-ash/40 hover:text-theme-600 dark:hover:text-theme-500"
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={toggle}
        className="h-4 w-4 rounded-sm accent-[var(--theme-primary-600)] flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
      />
      {label}
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </label>
  );
}
