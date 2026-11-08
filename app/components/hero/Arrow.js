import s from "./hero.module.css";

const PATHS = {
  right: "M2 8h11M9 4l4 4-4 4",
  down: "M8 2v11M4 9l4 4 4-4",
  upright: "M4 12L12 4M5 4h7v7",
};

// Inline stroke icon. Never a font glyph: Bai Jamjuree has no arrow glyphs.
export default function Arrow({ dir = "right", size = 14, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`${s.arrow} ${className}`}
    >
      <path d={PATHS[dir] ?? PATHS.right} />
    </svg>
  );
}
