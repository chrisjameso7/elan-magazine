import Link from "next/link";
import { populated, type Article } from "@/lib/publication";
import {
  formatDate,
  getLatestIndex,
  indexCategories,
  isoWeek,
  movementLabel,
} from "@/lib/the-index";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "The Index 50",
  description:
    "The people and work moving culture this week, ranked every Thursday.",
  alternates: { canonical: "/the-index" },
};
export default async function TheIndexPage() {
  const { week, entries } = await getLatestIndex(50);
  return (
    <main id="main-content" className="wrap">
      <header className="page-head">
        <div>
          <span className="kicker kicker--ink">
            {week ? `Week ${isoWeek(week)} · Published ${formatDate(week)}` : "Every Thursday"}
          </span>
          <h1>
            The Index <i className="signal-text">50</i>
          </h1>
          <p>
            The people and work moving culture this week, across music, film,
            TV, the internet, style, sport and books. Public signals build the
            shortlist. Editors set the order, and can move anyone up or down
            five places, never more.
          </p>
        </div>
      </header>
      {entries.length ? (
        <ol className="index-list">
          {entries.map((e) => {
            const move = movementLabel(e);
            const story = populated<Article>(e.story);
            return (
              <li key={e.id}>
                <span className="rank">{String(e.rank).padStart(2, "0")}</span>
                <span className="index-entry">
                  <small>{indexCategories[e.category]}</small>
                  <b>{story?.slug ? <Link href={`/news/${story.slug}`}>{e.name}</Link> : e.name}</b>
                  <span>{e.why}</span>
                </span>
                <span className={`move ${e.movement === "new" ? "move--new" : ""}`} aria-label={move.label}>
                  {move.text}
                </span>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="empty-note">The first Index publishes this Thursday.</p>
      )}
      <section className="tip-banner" aria-labelledby="tip-title">
        <h2 id="tip-title">
          Someone missing? <i>Put us on.</i>
        </h2>
        <Link className="pill pill--signal" href="/put-us-on">
          Send a tip →
        </Link>
      </section>
    </main>
  );
}
