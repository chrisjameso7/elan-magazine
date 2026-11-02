import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import EditorialImage from '@/components/editorial/EditorialImage';
import { getArticles } from '@/lib/cmsAdapter';
import { getWorld } from '@/lib/world';
import { curateWorld } from '@/lib/curation';
import { storyHref } from '@/lib/presentation';
export const dynamic = 'force-dynamic';
export const metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const [articles, world] = await Promise.all([getArticles(), getWorld()]);
  const { cover, lead, next, latest, entertainment, originals, culture, edit } =
    curateWorld(articles, world.covers);
  return (
    <>
      <Header />
      <main id="main-content" className="brand-home">
        {cover ? (
          <section className="campaign-lead" aria-label="The current cover">
            <EditorialImage image={cover.artwork} priority />
            <div className="campaign-lead-shade" />
            <div className="publication-shell campaign-lead-copy">
              <span className="eyebrow">
                THE ÉLAN COVER / {cover.issueIdentifier}
              </span>
              <p className="campaign-names">
                {cover.personalities.map((p) => p.name).join(' / ')}
              </p>
              <h1>
                <Link href={`/covers/${cover.slug}`}>{cover.title}</Link>
              </h1>
              <p>{cover.intro}</p>
              <Link className="text-link" href={`/covers/${cover.slug}`}>
                Enter the issue <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        ) : lead ? (
          <section className="publication-shell feature-lead">
            <div className="feature-lead-image">
              <EditorialImage
                image={lead.coverImage}
                direction={lead.artDirection}
                priority
                sizes="(min-width:900px) 60vw,100vw"
              />
            </div>
            <div className="feature-lead-copy">
              <span className="eyebrow">IN FOCUS / {lead.categoryLabel}</span>
              <h1>
                <Link href={storyHref(lead)}>{lead.title}</Link>
              </h1>
              <p>{lead.dek}</p>
              <Link className="text-link" href={storyHref(lead)}>
                Enter the story <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        ) : (
          <section className="brand-manifesto publication-shell">
            <div className="manifesto-topline">
              <span>ENTERTAINMENT / CULTURE / ORIGINAL EXPRESSION</span>
              <span>A GLOBAL POINT OF VIEW</span>
            </div>
            <h1>
              Culture,
              <br />
              in its <em>element.</em>
              <span aria-hidden="true">↗</span>
            </h1>
            <div className="manifesto-bottom">
              <p>
                The personalities. The creative work.
                <br />
                The conversations that move culture.
              </p>
              <Link className="text-link" href="/covers">
                Discover ÉLAN Covers <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="manifesto-index">
              <span>ÉLAN / A NEW PERSPECTIVE</span>
              <Link href="/about">Enter our world ↗</Link>
            </div>
          </section>
        )}
        <div className="publication-shell">
          {latest.length > 0 && (
            <section
              className="editorial-section"
              aria-labelledby="latest-title"
            >
              <div className="section-heading">
                <h2 id="latest-title">
                  The <em>latest.</em>
                </h2>
                <span className="eyebrow">THE CULTURAL CONVERSATION</span>
              </div>
              <div className="latest-layout">
                <StoryCard article={latest[0]} />
                <div className="latest-list">
                  {latest.slice(1).map((a) => (
                    <StoryCard
                      key={a.id}
                      article={a}
                      variant="horizontal_split"
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
          {next.length > 0 && (
            <section className="the-next-section" aria-labelledby="next-title">
              <div className="the-next-intro">
                <span className="eyebrow">THE DISCOVERY FRANCHISE</span>
                <h2 id="next-title">
                  THE
                  <br />
                  <em>NEXT</em>
                  <span aria-hidden="true">↗</span>
                </h2>
                <p>
                  New voices. Breakout talent.
                  <br />
                  Their moment, in focus.
                </p>
                <Link className="text-link" href="/series/new_guard">
                  Meet THE NEXT ↗
                </Link>
              </div>
              <div className="next-portraits">
                {next.map((a) => (
                  <StoryCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
          {entertainment.length > 0 && (
            <section
              className="editorial-section"
              aria-labelledby="sound-title"
            >
              <div className="section-heading">
                <h2 id="sound-title">
                  On screen.
                  <br />
                  <em>In rotation.</em>
                </h2>
                <div className="section-destinations">
                  <Link href="/category/entertainment">ENTERTAINMENT ↗</Link>
                  <Link href="/category/music">MUSIC ↗</Link>
                </div>
              </div>
              <div className="sound-layout">
                {entertainment.map((a, i) => (
                  <StoryCard
                    key={a.id}
                    article={a}
                    variant={i === 0 ? 'portrait_feature' : 'horizontal_split'}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
        {originals.length > 0 && (
          <section className="originals-home" aria-labelledby="originals-title">
            <div className="publication-shell">
              <div className="section-heading">
                <h2 id="originals-title">
                  ÉLAN
                  <br />
                  <em>ORIGINALS</em>
                </h2>
                <Link className="text-link" href="/originals">
                  All productions ↗
                </Link>
              </div>
              <div className="originals-home-grid">
                {originals.map((a) => (
                  <article key={a.id}>
                    <Link className="original-thumbnail" href={storyHref(a)}>
                      <EditorialImage
                        image={a.coverImage}
                        direction={a.artDirection}
                        sizes="(min-width:900px) 60vw,100vw"
                      />
                      <span className="play-label">
                        PLAY FILM <span aria-hidden="true">↗</span>
                      </span>
                    </Link>
                    <span className="eyebrow">
                      ÉLAN ORIGINALS{' '}
                      {a.production?.duration && ` / ${a.production.duration}`}
                    </span>
                    <h3>
                      <Link href={storyHref(a)}>{a.title}</Link>
                    </h3>
                    <p>{a.dek}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
        <div className="publication-shell">
          {culture.length > 0 && (
            <section
              className="editorial-section"
              aria-labelledby="culture-title"
            >
              <div className="section-heading">
                <h2 id="culture-title">
                  Style is a<br />
                  <em>cultural language.</em>
                </h2>
                <div className="section-destinations">
                  <Link href="/category/style">STYLE ↗</Link>
                  <Link href="/category/culture">CULTURE ↗</Link>
                </div>
              </div>
              <div className="culture-composition">
                {culture.map((a, i) => (
                  <StoryCard
                    key={a.id}
                    article={a}
                    variant={i === 0 ? 'portrait_feature' : 'horizontal_split'}
                  />
                ))}
              </div>
            </section>
          )}
          {edit.length > 0 && (
            <section className="edit-section" aria-labelledby="edit-title">
              <div className="section-heading">
                <h2 id="edit-title">
                  The ÉLAN <em>Edit.</em>
                </h2>
                <Link className="eyebrow" href="/series/the_edit">
                  A CONSIDERED SELECTION ↗
                </Link>
              </div>
              <div className="edit-grid">
                {edit.map((a) => (
                  <StoryCard
                    key={a.id}
                    article={a}
                    variant="horizontal_split"
                  />
                ))}
              </div>
            </section>
          )}
          {!articles.length && (
            <section className="world-paths" aria-label="Explore ÉLAN">
              <Link href="/covers">
                <span className="eyebrow">01 / THE SIGNATURE</span>
                <h2>
                  The <em>Covers.</em>
                </h2>
                <p>
                  Personalities, original photography, and complete cover
                  experiences.
                </p>
                <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/originals">
                <span className="eyebrow">02 / THE CREATIVE WORLD</span>
                <h2>
                  ÉLAN <em>Originals.</em>
                </h2>
                <p>Video, conversations, and creative work beyond the page.</p>
                <span aria-hidden="true">↗</span>
              </Link>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
