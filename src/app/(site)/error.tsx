"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="wrap">
      <header className="page-head">
        <div>
          <span className="kicker kicker--ink">Something broke</span>
          <h1>We couldn’t load this page.</h1>
          <p>Please try again in a moment.</p>
          <button className="pill pill--ink" type="button" onClick={reset}>
            Try again
          </button>
        </div>
      </header>
    </main>
  );
}
