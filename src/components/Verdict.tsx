import { verdicts, type VerdictKey } from "@/lib/navigation";
export default function Verdict({
  value,
  size = "small",
  prefix = false,
}: {
  value?: string | null;
  size?: "small" | "large";
  prefix?: boolean;
}) {
  if (!value || !(value in verdicts)) return null;
  const verdict = verdicts[value as VerdictKey];
  return (
    <span className={`verdict verdict--${verdict.tone} verdict--${size}`}>
      {prefix && <span className="verdict-prefix">Verdict: </span>}
      {verdict.label}
    </span>
  );
}
