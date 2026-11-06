import Link from 'next/link';
import { brand } from '@/lib/brand';
export const metadata = { alternates: { canonical: '/' } };
export default function Home() {
  return (
    <main id="main-content" className="shell">
      <section className="front-page" aria-labelledby="front-title">
        <p className="eyebrow">
          <span className="edition-mark" aria-hidden="true" />
          Lumière Index / Foundation edition
        </p>
        <h1 id="front-title">{brand.tagline}</h1>
        <p className="front-deck">
          Entertainment. Pop culture.
          <br />A clear editorial point of view.
        </p>
        <Link className="text-link" href="/about">
          The publication <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="edition-note" aria-labelledby="edition-title">
        <p className="eyebrow">The newsroom</p>
        <div>
          <h2 id="edition-title">A new chapter for Lumière.</h2>
          <p>
            This is the foundation preview of Lumière Index. Editorial coverage
            will appear here when the newsroom and publishing experience are
            ready.
          </p>
          <p className="muted">
            No stories have been published in this preview.
          </p>
        </div>
      </section>
    </main>
  );
}
