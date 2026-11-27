import Link from "next/link";
import { populated, type Article } from "@/lib/publication";
import { formatDate, getDiscoveries } from "@/lib/the-index";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Called It",
  description: "Who The Index wrote about before everyone else did.",
  alternates: { canonical: "/called-it" },
};
export default async function CalledIt() {
  const discoveries = await getDiscoveries(60);
  return (
    <main id="main-content" className="wrap">
      <header className="page-head">
        <div>
          <span className="kicker kicker--ink">Our receipts</span>
          <h1>
            <i>Called it.</i>
          </h1>
          <p>
            Everyone we wrote about early, with the date we first covered them.
            Check our work.
          </p>
        </div>
      </header>
      {discoveries.length ? (
        <div className="receipt-grid">
          {discoveries.map((d) => {
            const story = populated<Article>(d.story);
            return (
              <article className="receipt-card" key={d.id}>
                <span className="receipt">First covered {formatDate(d.firstCoveredAt, "short")}</span>
                <h2>{d.name}</h2>
                {d.metricThen && (
                  <p>
                    <small>Then</small> {d.metricThen} {d.metricLabel}
                  </p>
                )}
                {d.metricNow && (
                  <p>
                    <small>Now</small> {d.metricNow} {d.metricLabel}
                  </p>
                )}
                {story?.slug && (
                  <Link className="underline" href={`/news/${story.slug}`}>
                    Read what we wrote
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <p className="empty-note">
          The wall starts with Issue 001. <Link className="underline" href="/put-us-on">Tell us who should be first</Link>.
        </p>
      )}
    </main>
  );
}
