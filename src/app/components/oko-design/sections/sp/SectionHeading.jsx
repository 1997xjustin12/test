// Section header (spec §8.7) — mono uppercase barn eyebrow over a display H2,
// with an optional action aligned to the baseline on the right.
const SectionHeading = ({ children, eyebrow, action }) => (
  <div className="flex items-end justify-between gap-4 mb-6">
    <div>
      {eyebrow && (
        <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-1.5">
          {eyebrow}
        </span>
      )}
      <h2 className="font-oko-display font-semibold text-[21px] sm:text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">
        {children}
      </h2>
    </div>
    {action}
  </div>
);

export default SectionHeading;
