import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="wrap">
      <header className="page-head">
        <div>
          <span className="kicker kicker--ink">404</span>
          <h1>
            This page <i>isn’t on the list.</i>
          </h1>
          <p>It may have moved, or it was never here.</p>
          <Link className="arrow-link" href="/">
            Back to The Index
          </Link>
        </div>
      </header>
    </main>
  );
}
