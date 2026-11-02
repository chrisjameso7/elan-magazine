import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditorialImage from '@/components/editorial/EditorialImage';
import { getWorld } from '@/lib/world';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Covers — ÉLAN',
  description:
    'The ÉLAN cover archive. Personalities, original photography, and complete cover experiences.',
  alternates: { canonical: '/covers' },
};

export default async function CoversPage() {
  const { covers } = await getWorld();
  return (
    <>
      <Header />
      <main id="main-content" className="publication-shell covers-archive">
        <header className="world-heading">
          <span className="eyebrow">The signature / ÉLAN</span>
          <h1>
            The <em>covers.</em>
          </h1>
          <p>A personality. A point of view. An issue to spend time with.</p>
        </header>
        {covers.length ? (
          <div className="cover-archive-grid">
            {covers.map((cover) => (
              <article key={cover.id}>
                <Link
                  className="archive-cover-art"
                  href={`/covers/${cover.slug}`}
                >
                  <EditorialImage
                    image={cover.artwork}
                    sizes="(min-width:900px) 45vw,100vw"
                    priority={cover.id === covers[0].id}
                  />
                </Link>
                <div className="cover-archive-meta">
                  <span className="eyebrow">{cover.issueIdentifier}</span>
                  <time dateTime={cover.publishedAt}>
                    {new Intl.DateTimeFormat('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'UTC',
                    }).format(new Date(cover.publishedAt))}
                  </time>
                </div>
                <h2>
                  <Link href={`/covers/${cover.slug}`}>
                    {cover.personalities.map((p) => p.name).join(' / ')}
                  </Link>
                </h2>
                <p>{cover.title}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="cover-awaiting">
            <span className="empty-cover-wordmark" aria-hidden="true">
              ÉLAN
            </span>
            <h2>
              The next cover
              <br />
              starts with a <em>point of view.</em>
            </h2>
            <p>
              Our cover archive will open with the first published campaign.
            </p>
            <Link className="text-link" href="/about#submissions">
              Enter the conversation ↗
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
