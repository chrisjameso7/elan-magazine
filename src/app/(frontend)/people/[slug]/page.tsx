import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditorialImage from '@/components/editorial/EditorialImage';
import StoryCard from '@/components/editorial/StoryCard';
import { getWorld } from '@/lib/world';
import { getArticles } from '@/lib/cmsAdapter';
import { profileHref } from '@/lib/presentation';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = (await getWorld()).personalities.find((p) => p.slug === slug);
  return p
    ? {
        title: `${p.name} — ÉLAN`,
        description: p.bio,
        alternates: { canonical: `/people/${slug}` },
        openGraph: {
          title: p.name,
          description: p.bio,
          images: [{ url: p.portrait.url, alt: p.portrait.alt }],
        },
      }
    : { title: 'Personality not found — ÉLAN' };
}
export default async function PersonalityPage({ params }: Props) {
  const { slug } = await params;
  const [world, articles] = await Promise.all([getWorld(), getArticles()]);
  const person = world.personalities.find((p) => p.slug === slug);
  if (!person) notFound();
  const stories = articles.filter((a) =>
    a.personalities?.some((p) => p.id === person.id),
  );
  const covers = world.covers.filter(
    (c) =>
      c.personalities.some((p) => p.id === person.id) ||
      c.variants?.some((v) => v.personalities?.some((p) => p.id === person.id)),
  );
  const instagram = profileHref(person.social?.instagram, 'instagram');
  const website = profileHref(person.social?.website);
  return (
    <>
      <Header />
      <main id="main-content" className="publication-shell personality-page">
        <header className="personality-opening">
          <div>
            <Link className="eyebrow" href="/category/people">
              ÉLAN / PEOPLE
            </Link>
            <p className="personality-profession">{person.profession}</p>
            <h1>{person.name}</h1>
            <p className="personality-bio">{person.bio}</p>
            <nav className="personality-links" aria-label="Personality links">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                  Instagram ↗
                </a>
              )}
              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer">
                  Website ↗
                </a>
              )}
            </nav>
          </div>
          <figure>
            <EditorialImage
              image={person.portrait}
              priority
              sizes="(min-width:900px) 45vw,100vw"
            />
          </figure>
        </header>
        {!!covers.length && (
          <section className="editorial-section">
            <div className="section-heading">
              <h2>
                On the <em>cover.</em>
              </h2>
            </div>
            <div className="person-cover-links">
              {covers.map((c) => (
                <Link key={c.id} href={`/covers/${c.slug}`}>
                  <span className="eyebrow">{c.issueIdentifier}</span>
                  <h3>{c.title} ↗</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
        {!!stories.length && (
          <section className="editorial-section">
            <div className="section-heading">
              <h2>
                The work. <em>The conversations.</em>
              </h2>
            </div>
            <div className="archive-grid">
              {stories.map((a) => (
                <StoryCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
