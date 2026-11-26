import Link from "next/link";
import StoryCard from "./StoryCard";
import type { PublicStory } from "@/lib/publication";
export default function StoryArchive({
  title,
  kicker = "The Index",
  intro,
  stories,
  page = 1,
  totalPages = 1,
  href,
}: {
  title: string;
  kicker?: string;
  intro?: string;
  stories: PublicStory[];
  page?: number;
  totalPages?: number;
  href?: (page: number) => string;
}) {
  return (
    <main id="main-content" className="wrap">
      <header className="page-head">
        <div>
          <span className="kicker kicker--ink">{kicker}</span>
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
        </div>
      </header>
      {stories.length ? (
        <div className="card-grid">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <p className="empty-note">Nothing published here yet. The first stories are on the way.</p>
      )}
      {href && totalPages > 1 && (
        <nav className="pagination" aria-label="Story pages">
          {page > 1 && <Link href={href(page - 1)}>← Previous</Link>}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && <Link href={href(page + 1)}>Next →</Link>}
        </nav>
      )}
    </main>
  );
}
