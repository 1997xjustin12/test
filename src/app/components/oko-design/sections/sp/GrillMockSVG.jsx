// Placeholder product illustration recolored to the OKO palette (cream well,
// stone-line rules, stone label). Stroke/fill only — no shadows.
const GrillMockSVG = ({ slot = 0, className = "" }) => (
  <svg
    viewBox="0 0 480 360"
    className={`w-full h-full ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="480" height="360" className="fill-oko-cream-dim dark:fill-oko-night-3" />
    <rect x="60" y="40" width="360" height="240" rx="2" className="fill-oko-stone-line dark:fill-oko-line-dark" />
    <rect x="85" y="65" width="310" height="185" rx="2" className="fill-oko-cream dark:fill-oko-night-2" />
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={105 + i * 70}
        y={100}
        width="52"
        height="110"
        rx="2"
        className="fill-oko-stone/60 dark:fill-oko-line-dark"
      />
    ))}
    <rect x="60" y="280" width="360" height="20" rx="2" className="fill-oko-stone-line dark:fill-oko-line-dark" />
    <rect x="170" y="305" width="140" height="34" rx="2" className="fill-oko-stone-line dark:fill-oko-line-dark" />
    <text x="240" y="328" textAnchor="middle" fontSize="11" className="fill-oko-stone">
      Image {slot + 1}
    </text>
  </svg>
);

export default GrillMockSVG;
