import Link from "next/link";
import { populated, type Article } from "@/lib/publication";
import {
  formatDate,
  getIndexPage,
  getLatestIndex,
  indexCategories,
  isoWeek,
  movementLabel,
} from "@/lib/the-index";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "The Index 50",
  description:
    "Fifty people on the way up, picked before everyone else catches on. A new list every Thursday.",
  alternates: { canonical: "/the-index" },
};
export default async function TheIndexPage() {
  const [{ week, entries }, page] = await Promise.all([getLatestIndex(50), getIndexPage()]);
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
          <p>{page.intro}</p>
        </div>
      </header>
      <details className="index-rules">
        <summary>How we make the list</summary>
        <ul>
          {page.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </details>
      {page.weekNote && entries.length > 0 && <p className="index-note">{page.weekNote}</p>}
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
        <p className="empty-note">The first list isn’t out yet. It comes out on a Thursday.</p>
      )}
      <section className="tip-banner" aria-labelledby="tip-title">
        <h2 id="tip-title">
          Someone missing? <i>Put us on.</i>
        </h2>
        <Link className="pill pill--signal" href="/put-us-on">
          Send a tip
        </Link>
      </section>
    </main>
  );
}
