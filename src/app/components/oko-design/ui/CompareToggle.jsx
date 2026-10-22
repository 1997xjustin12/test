"use client";
import useCompareToggle from "@/app/components/compare/useCompareToggle";

// OKO's Compare checkbox, drawn to oko-design-patterns.md: the square barn
// checkbox from the checkout, Inter label, no pill (§5), no emoji (§6).
// Behaviour is in useCompareToggle.
export default function CompareToggle({ product, className = "" }) {
  const { available, checked, disabled, toggle, label, fullMessage, announcement } = useCompareToggle(product);
  if (!available) return null;

  return (
    <label
      onClick={(e) => e.stopPropagation()}
      title={disabled ? fullMessage : undefined}
      className={`inline-flex items-center gap-2 font-inter text-[12px] font-semibold select-none transition-colors ${
        disabled
          ? "cursor-not-allowed text-oko-stone/60"
          : checked
            ? "cursor-pointer text-oko-barn dark:text-oko-barn-light"
            : "cursor-pointer text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light"
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={toggle}
        className="w-4 h-4 rounded-[2px] accent-oko-barn flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
      />
      {label}
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </label>
  );
}
