export default function Sponsorship({
  value,
}: {
  value?: { sponsored?: boolean; partner?: string; disclosure?: string };
}) {
  if (!value?.sponsored) return null;
  return (
    <aside
      className="sponsor-disclosure"
      aria-label="Sponsored content disclosure"
    >
      <strong>
        Sponsored production{value.partner ? ` / ${value.partner}` : ''}
      </strong>
      <p>{value.disclosure}</p>
    </aside>
  );
}
