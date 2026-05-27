const GrillMockSVG = ({ slot = 0, className = "" }) => (
  <svg
    viewBox="0 0 480 360"
    className={`w-full h-full ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="480" height="360" className="fill-gray-100 dark:fill-gray-800" />
    <rect x="60" y="40" width="360" height="240" rx="10" className="fill-gray-200 dark:fill-gray-700" />
    <rect x="85" y="65" width="310" height="185" rx="6" className="fill-gray-300 dark:fill-gray-600" />
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={105 + i * 70}
        y={100}
        width="52"
        height="110"
        rx="26"
        className="fill-gray-400 dark:fill-gray-500"
      />
    ))}
    <rect x="60" y="280" width="360" height="20" rx="5" className="fill-gray-200 dark:fill-gray-700" />
    <rect x="170" y="305" width="140" height="34" rx="6" className="fill-gray-200 dark:fill-gray-700" />
    <text x="240" y="328" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-gray-500">
      Image {slot + 1}
    </text>
  </svg>
);

export default GrillMockSVG;
