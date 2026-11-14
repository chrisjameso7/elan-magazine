import Link from "next/link";
import {
  storyList,
  populated,
  type Media,
  type Section,
  type Contributor,
} from "@/lib/publication";
import CoverStory from "@/components/CoverStory";
import StoryCard from "@/components/StoryCard";
export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const [latest, featured] = await Promise.all([
    storyList({ limit: 17 }),
    storyList({ featured: true, limit: 1 }),
  ]);
  const lead = featured.docs[0] || latest.docs[0];
  const rest = latest.docs.filter((a) => a.id !== lead?.id);
  const slides = (lead ? [lead, ...rest.slice(0, 3)] : []).map((story) => ({
    id: story.id,
    slug: story.slug,
    title: story.title,
    standfirst: story.standfirst,
    label: populated<Section>(story.section)?.name || story.format,
    authors:
      story.contributors
        ?.map((a) => populated<Contributor>(a)?.name)
        .filter(Boolean)
        .join(", ") || "",
    publishedAt: story.publishedAt,
    media: populated<Media>(story.hero),
  }));
  return (
    <main
      id="main-content"
      className={`cover-edition ${lead ? "cover-edition--populated" : ""}`}
    >
      {lead ? (
        <CoverStory slides={slides} />
      ) : (
        <section className="first-edition editorial-body">
          <p className="eyebrow">The first edition</p>
          <h1>News that matters.</h1>
          <p>Entertainment. Culture. Everything in between.</p>
          <p className="empty-edition">
            Our first stories will appear here as they are published.
          </p>
          <Link className="text-link" href="/about">
            Meet Lumière Index →
          </Link>
        </section>
      )}
      <div className="editorial-body cover-content">
        {rest.length > 0 && (
          <section aria-label="Latest stories" className="cover-latest">
            <div className="cover-grid">
              {rest.slice(0, 4).map((a) => (
                <StoryCard key={a.id} story={a} cover />
              ))}
            </div>
          </section>
        )}
        <div
          className={`edition-bottom ${rest[4] ? "" : "edition-bottom--single"}`}
        >
          {rest[4] && (
            <section
              className="edition-feature"
              aria-label="More from the newsroom"
            >
              <StoryCard story={rest[4]} />
            </section>
          )}
          <aside className="publication-note">
            <p className="eyebrow">Lumière Index</p>
            <h2>A closer look at the stories shaping culture.</h2>
            <p>
              News, features, interviews and analysis. Read our editorial
              standards and find out how to reach the newsroom.
            </p>
            <Link className="text-link" href="/standards">
              Our editorial standards →
            </Link>
            <Link className="text-link" href="/contact">
              Contact the newsroom →
            </Link>
          </aside>
        </div>
        {rest.length > 5 && (
          <section className="home-section">
            <div className="section-topline">
              <h2>More from Lumière</h2>
              <Link href="/search">All stories →</Link>
            </div>
            <div className="news-grid">
              {rest.slice(5).map((a) => (
                <StoryCard key={a.id} story={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
