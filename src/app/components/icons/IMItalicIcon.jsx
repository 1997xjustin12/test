// icomoon-free:italic
export default function IMItalicIcon({ color, width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? "24"}
      height={height ?? "24"}
      viewBox="0 0 16 16"
    >
      <path
        fill={color ?? "currentColor"}
        d="M14 1v1h-2L7 14h2v1H2v-1h2L9 2H7V1z"
      />
    </svg>
  );
}
