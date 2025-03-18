// material-symbols:format-h1
export default function MSH1Icon({ color, width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? "24"}
      height={height ?? "24"}
      viewBox="0 0 24 24"
    >
      <path
        fill={color ?? "currentColor"}
        d="M5 17V7h2v4h4V7h2v10h-2v-4H7v4zm12 0V9h-2V7h4v10z"
      />
    </svg>
  );
}
