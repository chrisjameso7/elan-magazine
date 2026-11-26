import Link from "next/link";
import { getSection, storyList, type PublicStory } from "@/lib/publication";
import {
  formatDate,
  getDiscoveries,
  getLatestIndex,
  indexCategories,
  isoWeek,
  movementLabel,
} from "@/lib/the-index";
import StoryCard, { StoryDate, TakeRow, storyMeta } from "@/components/StoryCard";
import StoryImage from "@/components/StoryImage";
import Verdict from "@/components/Verdict";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };

async function bySection(slug: string, limit: number) {
  const section = await getSection(slug);
  if (!section) return [] as PublicStory[];
  return (await storyList({ section: section.id, limit })).docs;
}

export default async function Home() {
  const [latest, featured, discover, personal, takes, index, called] =
    await Promise.all([
      storyList({ limit: 12 }),
      storyList({ featured: true, limit: 1 }),
      bySection("discover", 2),
      bySection("personal", 2),
      storyList({ reviewsOnly: true, limit: 5 }),
      getLatestIndex(5),
      getDiscoveries(2),
    ]);
  const lead = featured.docs[0] || latest.docs[0];
  const used = new Set([lead?.id]);
  const pick = (list: PublicStory[], n: number) => {
    const out = list.filter((s) => !used.has(s.id)).slice(0, n);
    out.forEach((s) => used.add(s.id));
    return out;
  };
  const discoverPicks = pick(discover, 1);
  const personalPicks = pick(personal, 1);
  const takePicks = takes.docs.filter((s) => s.id !== lead?.id).slice(0, 4);
  takePicks.forEach((s) => used.add(s.id));
  const more = pick(latest.docs, 6);
  const today = formatDate(new Date().toISOString(), "short");
  const leadMeta = lead ? storyMeta(lead) : undefined;

  return (
    <main id="main-content">
      <div className="strip">
        <div className="wrap strip-inner">
          <span>{today.toUpperCase()}</span>
          <span>{brand.tagline.toUpperCase()}</span>
          <span>LUMIEREINDEX.COM</span>
        </div>
      </div>
      <div className="wrap">
        {lead ? (
          <section className="lead" aria-labelledby="lead-title">
            <div className="lead-copy">
              <p className="tags">
                <span className="tag">{leadMeta?.section?.name || "The Index"}</span>
                {lead.format !== "news" && <span>{lead.format}</span>}
              </p>
              <h1 id="lead-title">
                <Link href={`/news/${lead.slug}`}>{lead.title}</Link>
              </h1>
              <p className="lead-standfirst">{lead.standfirst}</p>
              <div className="lead-meta">
                {leadMeta?.authors && (
                  <span>
                    By <b>{leadMeta.authors}</b>
                  </span>
                )}
                <StoryDate value={lead.publishedAt} />
                {lead.verdict && <Verdict value={lead.verdict} size="large" prefix />}
              </div>
              <Link className="arrow-link" href={`/news/${lead.slug}`}>
                Read the story
              </Link>
            </div>
            <div className="lead-visual">
              {leadMeta?.media?.url ? (
                <StoryImage media={leadMeta.media} priority sizes="(min-width:1000px) 600px, 100vw" />
              ) : (
                <div className="lead-placeholder" aria-hidden="true">
                  the{" "}<i>index</i>
                </div>
              )}
              {leadMeta?.media?.credit && (
                <span className="photo-credit">Photo: {leadMeta.media.credit}</span>
              )}
            </div>
          </section>
        ) : (
          <section className="lead lead--empty" aria-labelledby="lead-title">
            <div className="lead-copy">
              <p className="tags">
                <span className="tag">Issue 001</span>
              </p>
              <h1 id="lead-title">
                Who’s next, <i>first.</i>
              </h1>
              <p className="lead-standfirst">
                Reviews with a straight verdict, personal essays, and early
                looks at people who are about to blow up.
              </p>
              <Link className="arrow-link" href="/put-us-on">
                Tell us who we should be writing about
              </Link>
            </div>
            <div className="lead-visual">
              <div className="lead-placeholder" aria-hidden="true">
                the{" "}<i>index</i>
              </div>
            </div>
          </section>
        )}

        <section className="called-strip" aria-labelledby="called-title">
          <div className="called-intro">
            <h2 id="called-title">
              <i>Called it.</i>
            </h2>
            <p>Who we wrote about before everyone else did. Dated and kept.</p>
          </div>
          <div className="called-cells">
            {called.map((d) => (
              <div className="called-cell" key={d.id}>
                <span className="receipt">First covered {formatDate(d.firstCoveredAt, "short")}</span>
                <b>{d.name}</b>
                {(d.metricThen || d.metricNow) && (
                  <span>
                    {d.metricThen && <>Then: {d.metricThen}{d.metricLabel ? ` ${d.metricLabel}` : ""}. </>}
                    {d.metricNow && <>Now: {d.metricNow}{d.metricLabel ? ` ${d.metricLabel}` : ""}.</>}
                  </span>
                )}
              </div>
            ))}
            <div className="called-cell">
              <span className="receipt receipt--dashed">
                {called.length ? "Could be next" : "Starts with this issue"}
              </span>
              <b>Your tip could be next</b>
              <Link className="underline" href="/put-us-on">
                Send us a name
              </Link>
            </div>
          </div>
        </section>

        {(discoverPicks.length > 0 || personalPicks.length > 0 || takePicks.length > 0) && (
          <section className="trio" aria-label="This week">
            {discoverPicks.map((s) => (
              <StoryCard key={s.id} story={s} kicker="Discover · First look" />
            ))}
            {personalPicks.map((s) => (
              <StoryCard key={s.id} story={s} kicker="Personal · Essay" />
            ))}
            {takePicks.length > 0 && (
              <div className="takes">
                <span className="kicker">Critique · Quick takes</span>
                <ul>
                  {takePicks.map((s) => (
                    <TakeRow key={s.id} story={s} />
                  ))}
                </ul>
                <Link className="arrow-link" href="/sections/critique">
                  All verdicts
                </Link>
              </div>
            )}
          </section>
        )}

        <section className="index-teaser" aria-labelledby="index-title">
          <div className="index-teaser-copy">
            <span className="kicker kicker--ink">
              The Index{index.week ? ` · Week ${isoWeek(index.week)}` : ""}
            </span>
            <h2 id="index-title">
              Who’s rising <i>this week.</i>
            </h2>
            <p>
              Fifty names, ranked every Thursday. The numbers make the
              shortlist and our editors set the order.
            </p>
            <Link className="pill pill--ink" href="/the-index">
              See all 50
            </Link>
          </div>
          {index.entries.length ? (
            <ol className="rank-list">
              {index.entries.slice(0, 5).map((e) => {
                const move = movementLabel(e);
                return (
                  <li key={e.id}>
                    <span className="rank">{String(e.rank).padStart(2, "0")}</span>
                    <span className="rank-name">
                      <b>{e.name}</b>
                      <small>{indexCategories[e.category]}</small>
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
        </section>

        {more.length > 0 && (
          <section className="more" aria-labelledby="more-title">
            <div className="section-head">
              <h2 id="more-title">Latest</h2>
              <Link href="/search">Everything</Link>
            </div>
            <div className="card-grid">
              {more.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </section>
        )}

        <section className="tip-banner" aria-labelledby="tip-title">
          <h2 id="tip-title">
            Know someone before everyone else does? <i>Put us on.</i>
          </h2>
          <Link className="pill pill--signal" href="/put-us-on">
            Send a tip
          </Link>
        </section>
      </div>
    </main>
  );
}
