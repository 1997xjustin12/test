"use client";
import useCompareToggle from "@/app/components/compare/useCompareToggle";

// Solana's Compare checkbox, drawn to new-design-patterns.md: the theme-colour
// checkbox from the checkout, soft text, rounded. Behaviour is in
// useCompareToggle — nothing here decides anything.
export default function CompareToggle({ product, className = "" }) {
  const { available, checked, disabled, toggle, label, fullMessage, announcement } = useCompareToggle(product);
  if (!available) return null;

  return (
    <label
      // The card around it is a link target in places; ticking must not open
      // the product.
      onClick={(e) => e.stopPropagation()}
      title={disabled ? fullMessage : undefined}
      className={`inline-flex items-center gap-2 text-xs font-medium select-none transition-colors ${
        disabled
          ? "cursor-not-allowed text-neutral-400 dark:text-neutral-600"
          : checked
            ? "cursor-pointer text-theme-600 dark:text-theme-500"
            : "cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-theme-600 dark:hover:text-theme-500"
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={toggle}
        className="h-4 w-4 rounded accent-[var(--theme-primary-600)] flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
      />
      {label}
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </label>
  );
}
