import Link from "next/link";
import {
  populated,
  type PublicStory,
  type Media,
  type Contributor,
  type Section,
} from "@/lib/publication";
import StoryImage from "./StoryImage";
import Verdict from "./Verdict";
export function storyMeta(story: PublicStory) {
  const section = populated<Section>(story.section);
  const authors = story.contributors
    ?.map((a) => populated<Contributor>(a)?.name)
    .filter(Boolean)
    .join(", ");
  return { section, authors, media: populated<Media>(story.hero) };
}
export function StoryDate({ value }: { value?: string | null }) {
  if (!value) return null;
  return (
    <time dateTime={value}>
      {new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(value))}
    </time>
  );
}
export default function StoryCard({
  story,
  kicker,
}: {
  story: PublicStory;
  kicker?: string;
}) {
  const { section, authors, media } = storyMeta(story);
  const href = `/news/${story.slug}`;
  return (
    <article className="story-card">
      <span className="kicker">
        {kicker || section?.name || "The Index"}
        {!kicker && story.format && story.format !== "news" ? ` · ${story.format}` : ""}
      </span>
      {media?.url ? (
        <Link className="story-card-photo" href={href} tabIndex={-1} aria-hidden="true">
          <StoryImage media={media} sizes="(min-width:900px) 420px, 100vw" />
          {story.verdict && <Verdict value={story.verdict} />}
        </Link>
      ) : null}
      <h3>
        <Link href={href}>{story.title}</Link>
      </h3>
      <p>{story.standfirst}</p>
      <p className="meta">
        {authors && <span>{authors}</span>}
        <StoryDate value={story.publishedAt} />
      </p>
    </article>
  );
}
export function TakeRow({ story }: { story: PublicStory }) {
  const { section } = storyMeta(story);
  return (
    <li className="take-row">
      <span>
        <Link href={`/news/${story.slug}`}>
          <b>{story.title}</b>
        </Link>
        <small>{section?.name || "Critique"}</small>
      </span>
      <Verdict value={story.verdict} />
    </li>
  );
}
