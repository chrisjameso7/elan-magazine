import Link from "next/link";
import type { Article, Contributor, Media, Section } from "@/cms/payload-types";
import ArticleBody from "./ArticleBody";
import StoryTools from "./StoryTools";
import StoryImage from "./StoryImage";
import { safeURL } from "@/lib/safe-url";
const object = <T,>(value: unknown): T | undefined =>
  typeof value === "object" && value ? (value as T) : undefined;
export default function ArticleView({
  article,
  preview = false,
}: {
  article: Article;
  preview?: boolean;
}) {
  const section = object<Section>(article.section);
  const hero = object<Media>(article.hero);
  const bylines = (article.contributors || [])
    .map((c) => object<Contributor>(c))
    .filter((c): c is Contributor => !!c);
  return (
    <main id="main-content" className="reader-article">
      {preview && (
        <aside className="draft-banner">
          PRIVATE PREVIEW — {article.reviewStatus}. This view can include
          unpublished changes.
        </aside>
      )}
      <header className="article-opening">
        <p className="eyebrow">
          {section?.name || "Lumière Index"} / {article.format}
        </p>
        <h1>{article.title}</h1>
        <p className="article-standfirst">{article.standfirst}</p>
        <div className="article-byline">
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
        </div>
      </header>
      {hero?.url && (
        <figure className="article-hero">
          <StoryImage
            media={hero}
            priority
            sizes="(min-width:1200px) 1100px, 100vw"
          />
          <figcaption>
            {hero.caption}
            {hero.credit && <span>Photo: {hero.credit}</span>}
          </figcaption>
        </figure>
      )}
      {!preview && <StoryTools title={article.title} />}
      <ArticleBody body={article.body} />
      {!!article.sources?.length && (
        <aside className="article-sources">
          <h2>Sources &amp; further reading</h2>
          {article.sources.map((s, i) => (
            <a
              key={i}
              href={safeURL(s.url)}
              rel="noopener noreferrer"
              target="_blank"
            >
              {s.label} ↗
            </a>
          ))}
        </aside>
      )}
    </main>
  );
}
