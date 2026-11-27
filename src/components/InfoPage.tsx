import type { ReactNode } from "react";
export default function InfoPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <main id="main-content" className="wrap">
      <header className="page-head">
        <div>
          <span className="kicker kicker--ink">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
      </header>
      <div className="info-copy">{children}</div>
    </main>
  );
}
