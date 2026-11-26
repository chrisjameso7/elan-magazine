import Link from "next/link";
import type { Article, Contributor, Media, Section } from "@/cms/payload-types";
import type { PublicStory } from "@/lib/publication";
import ArticleBody from "./ArticleBody";
import StoryTools from "./StoryTools";
import StoryImage from "./StoryImage";
import StoryCard from "./StoryCard";
import Verdict from "./Verdict";
import NewsletterSignup from "./NewsletterSignup";
import { safeURL } from "@/lib/safe-url";
const object = <T,>(value: unknown): T | undefined =>
  typeof value === "object" && value ? (value as T) : undefined;
export default function ArticleView({
  article,
  preview = false,
  related = [],
}: {
  article: Article;
  preview?: boolean;
  related?: PublicStory[];
}) {
  const section = object<Section>(article.section);
  const hero = object<Media>(article.hero);
  const bylines = (article.contributors || [])
    .map((c) => object<Contributor>(c))
    .filter((c): c is Contributor => !!c);
  return (
    <main id="main-content" className="article">
      {preview && (
        <aside className="draft-banner">
          Private preview ({article.reviewStatus}). This view can include
          unpublished changes.
        </aside>
      )}
      <header className="article-head wrap">
        <p className="tags">
          <span className="tag">{section?.name || "The Index"}</span>
          {article.format !== "news" && <span>{article.format}</span>}
        </p>
        <h1>{article.title}</h1>
        <p className="article-standfirst">{article.standfirst}</p>
        <p className="meta">
          <span>
            By{" "}
            {bylines.map((c, i) => (
              <span key={c.id}>
                {i > 0 ? ", " : ""}
                <Link href={`/authors/${c.slug}`}>{c.name}</Link>
              </span>
            ))}
          </span>
          {article.publishedAt && (
            <time dateTime={article.publishedAt}>
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(article.publishedAt))}
            </time>
          )}
        </p>
      </header>
      {hero?.url && (
        <figure className="article-hero wrap">
          <StoryImage media={hero} priority sizes="(min-width:1320px) 1272px, 100vw" />
          <figcaption>
            {hero.caption}
            {hero.credit && <span>Photo: {hero.credit}</span>}
          </figcaption>
        </figure>
      )}
      <div className="article-layout wrap">
        <ArticleBody body={article.body} />
        <aside className="article-aside">
          {article.verdict && (
            <div className="verdict-box">
              <span className="kicker kicker--ink">The verdict</span>
              <Verdict value={article.verdict} size="large" />
            </div>
          )}
          {!preview && <StoryTools title={article.title} />}
          {!!article.sources?.length && (
            <div className="article-sources">
              <span className="kicker kicker--ink">Sources &amp; further reading</span>
              {article.sources.map((s, i) => (
                <a key={i} href={safeURL(s.url)} rel="noopener noreferrer" target="_blank">
                  {s.label} ↗
                </a>
              ))}
            </div>
          )}
          <div className="aside-tip">
            <b>Know who’s next?</b>
            <Link className="underline" href="/put-us-on">
              Put us on
            </Link>
          </div>
        </aside>
      </div>
      {!preview && (
        <div className="wrap">
          <NewsletterSignup compact />
        </div>
      )}
      {related.length > 0 && (
        <section className="related wrap" aria-labelledby="related-title">
          <h2 id="related-title" className="kicker kicker--ink">
            More from {section?.name || "The Index"}
          </h2>
          <div className="card-grid">
            {related.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
