import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditorialImage from '@/components/editorial/EditorialImage';
import ArticleBody, { PhotoCaption } from '@/components/editorial/ArticleBody';
import Gallery from '@/components/editorial/Gallery';
import VideoPlayer from '@/components/editorial/VideoPlayer';
import StoryTools from '@/components/editorial/StoryTools';
import StoryCard from '@/components/editorial/StoryCard';
import Sponsorship from '@/components/editorial/Sponsorship';
import { getWorld } from '@/lib/world';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cover = (await getWorld()).covers.find((c) => c.slug === slug);
  return cover
    ? {
        title: `${cover.title} — ÉLAN Covers`,
        description: cover.intro,
        alternates: { canonical: `/covers/${slug}` },
        openGraph: {
          title: cover.title,
          description: cover.intro,
          images: [{ url: cover.artwork.url, alt: cover.artwork.alt }],
        },
      }
    : { title: 'Cover not found — ÉLAN' };
}
export default async function CoverPage({ params }: Props) {
  const { slug } = await params;
  const cover = (await getWorld()).covers.find((c) => c.slug === slug);
  if (!cover) notFound();
  return (
    <>
      <Header />
      <main id="main-content" className="cover-experience">
        <section className="cover-opening">
          <figure>
            <EditorialImage image={cover.artwork} priority />
            <PhotoCaption image={cover.artwork} />
          </figure>
          <div className="cover-opening-copy">
            <Link className="eyebrow" href="/covers">
              ÉLAN COVERS / {cover.issueIdentifier}
            </Link>
            <p className="cover-subjects">
              {cover.personalities.map((person) => (
                <Link key={person.id} href={`/people/${person.slug}`}>
                  {person.name}
                </Link>
              ))}
            </p>
            <h1>{cover.title}</h1>
            <p>{cover.intro}</p>
            <div className="reading-byline">
              <time dateTime={cover.publishedAt}>
                {new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(new Date(cover.publishedAt))}
              </time>
              <StoryTools slug={`cover-${slug}`} title={cover.title} />
            </div>
          </div>
        </section>
        <div className="publication-shell">
          <Sponsorship value={cover.sponsorship} />
          {!!cover.variants?.length && (
            <section className="cover-variations" aria-label="Cover variations">
              <div className="section-heading">
                <h2>
                  One issue. <em>Different perspectives.</em>
                </h2>
              </div>
              <div className="variation-grid">
                {cover.variants.map((variant, index) => (
                  <figure key={index}>
                    <EditorialImage
                      image={variant.artwork}
                      sizes="(min-width:900px) 33vw,100vw"
                    />
                    <figcaption>
                      <strong>{variant.label}</strong>
                      {variant.personalities?.map((p) => (
                        <Link key={p.id} href={`/people/${p.slug}`}>
                          {p.name}
                        </Link>
                      ))}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
          {cover.story && (
            <article className="reading-body cover-main-story">
              <span className="eyebrow">
                The cover story /{' '}
                <Link href={`/author/${cover.story.author.id}`}>
                  {cover.story.author.name}
                </Link>
              </span>
              <h2>{cover.story.title}</h2>
              <p>{cover.story.dek}</p>
              {cover.story.interview && (
                <>
                  <p>{cover.story.interview.intro}</p>
                  <figure className="reading-quote">
                    <blockquote>“{cover.story.interview.keyQuote}”</blockquote>
                    <figcaption>{cover.story.interview.subjectName}</figcaption>
                  </figure>
                  {cover.story.interview.qas.map((qa, index) => (
                    <section className="interview-qa" key={index}>
                      <span className="eyebrow">{qa.speaker || 'ÉLAN'}</span>
                      <h2>{qa.question}</h2>
                      <p>{qa.answer}</p>
                    </section>
                  ))}
                </>
              )}
              <ArticleBody blocks={cover.story.content} />
            </article>
          )}
          <Gallery images={cover.gallery} label="The photography" />
          <VideoPlayer
            production={cover.production}
            title={`${cover.title} / Film`}
            poster={cover.artwork}
          />
          {cover.behindTheScenes && (
            <section className="off-camera-note">
              <span className="eyebrow">OFF CAMERA</span>
              <h2>Beyond the frame.</h2>
              <p>{cover.behindTheScenes}</p>
            </section>
          )}
          {!!cover.relatedStories?.length && (
            <section className="editorial-section">
              <div className="section-heading">
                <h2>
                  In the same <em>world.</em>
                </h2>
              </div>
              <div className="related-grid">
                {cover.relatedStories.map((a) => (
                  <StoryCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
