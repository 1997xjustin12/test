// material-symbols-light:check
export default function MSLCheckIcon({ color, width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? "24"}
      height={height ?? "24"}
      viewBox={width && height ? `0 0 24 24` : "0 0 24 24"}
    >
      <path
        fill={color ?? "currentColor"}
        d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
      />
    </svg>
  );
}
