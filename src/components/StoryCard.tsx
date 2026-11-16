import Link from "next/link";
import {
  populated,
  type PublicStory,
  type Media,
  type Contributor,
  type Section,
} from "@/lib/publication";
import StoryImage from "./StoryImage";
export default function StoryCard({
  story,
  compact = false,
  cover = false,
}: {
  story: PublicStory;
  compact?: boolean;
  cover?: boolean;
}) {
  const media = populated<Media>(story.hero);
  const section = populated<Section>(story.section);
  const authors = story.contributors
    ?.map((a) => populated<Contributor>(a)?.name)
    .filter(Boolean)
    .join(", ");
  const date = story.publishedAt ? (
    <time dateTime={story.publishedAt}>
      {new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(story.publishedAt))}
    </time>
  ) : null;
  if (cover && media?.url)
    return (
      <article className="cover-card">
        <div className="cover-card-visual">
          <Link
            className="cover-card-photo"
            href={`/news/${story.slug}`}
            tabIndex={-1}
            aria-hidden="true"
          >
            <StoryImage media={media} sizes="(min-width:1000px) 25vw,50vw" />
          </Link>
          <div className="cover-card-overlay">
            <span className="eyebrow">{section?.name || story.format}</span>
            <h3>
              <Link href={`/news/${story.slug}`}>{story.title}</Link>
            </h3>
          </div>
        </div>
        <p className="cover-card-summary">{story.standfirst}</p>
        <div className="cover-card-meta">
          {authors && <span>By {authors}</span>}
          {date}
        </div>
      </article>
    );
  return (
    <article className={`news-card ${compact ? "news-card--compact" : ""}`}>
      {media?.url && (
        <Link
          className="news-card-photo"
          href={`/news/${story.slug}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <StoryImage
            media={media}
            sizes={compact ? "180px" : "(min-width:900px) 380px,100vw"}
          />
        </Link>
      )}
      <div>
        <span className="eyebrow">
          {section?.name || "News"} / {story.format}
        </span>
        <h3>
          <Link href={`/news/${story.slug}`}>{story.title}</Link>
        </h3>
        {!compact && <p>{story.standfirst}</p>}
        {authors && <p className="card-byline">By {authors}</p>}
        {date}
      </div>
    </article>
  );
}
