/** The Index mark: an index finger, pointing at who's next. */
export function BrandMark({
  size = 40,
  hand = "currentColor",
  finger = "var(--signal)",
}: {
  size?: number;
  hand?: string;
  finger?: string;
}) {
  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="12" width="22" height="26" rx="7" fill={hand} />
      <rect x="18" y="15" width="28" height="9" rx="4.5" fill={finger} />
    </svg>
  );
}
export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-logo ${compact ? "brand-logo--compact" : ""}`}>
      <BrandMark size={compact ? 32 : 42} />
      <span className="brand-words">
        <span className="brand-name">
          the <i>index</i>
        </span>
        {!compact && <span className="brand-by">Magazine by Lumière</span>}
      </span>
    </span>
  );
}
