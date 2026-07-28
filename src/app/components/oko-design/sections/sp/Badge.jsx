// Small bordered label, 2px radius (no pills — spec §5). Barn = action/urgency,
// sage = savings/logistics, stone = neutral meta.
const Badge = ({ children, variant = "barn" }) => {
  const variants = {
    barn: "bg-oko-barn/10 text-oko-barn dark:text-oko-barn-light border-oko-barn/25",
    orange: "bg-oko-barn/10 text-oko-barn dark:text-oko-barn-light border-oko-barn/25",
    sage: "bg-oko-sage/10 text-oko-sage dark:text-oko-sage-light border-oko-sage/25",
    green: "bg-oko-sage/10 text-oko-sage dark:text-oko-sage-light border-oko-sage/25",
    stone: "bg-oko-cream-dim dark:bg-oko-night-3 text-oko-stone border-oko-stone-line dark:border-oko-line-dark",
    gray: "bg-oko-cream-dim dark:bg-oko-night-3 text-oko-stone border-oko-stone-line dark:border-oko-line-dark",
    blue: "bg-oko-sage/10 text-oko-sage dark:text-oko-sage-light border-oko-sage/25",
  };
  return (
    <span
      className={`inline-block font-inter text-[10px] font-semibold px-2 py-0.5 rounded-[2px] border tracking-[0.06em] uppercase ${variants[variant] || variants.stone}`}
    >
      {children}
    </span>
  );
};

export default Badge;
