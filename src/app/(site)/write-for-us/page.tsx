import Link from "next/link";
import ApplicationForm from "@/components/ApplicationForm";
export const metadata = {
  title: "Write for us",
  description: "Write for The Index: first looks, criticism with a verdict and personal essays.",
  alternates: { canonical: "/write-for-us" },
};
export default function WriteForUs() {
  return (
    <main id="main-content" className="wrap">
      <header className="page-head">
        <div>
          <span className="kicker kicker--ink">Write for us</span>
          <h1>
            Your byline, <i>early.</i>
          </h1>
          <p>
            We’re looking for writers who notice things first: the actor before
            the breakout, the creator before the brand deal, the album before
            the discourse. No CV needed. Experience matters less than taste and
            a voice people want to read.
          </p>
        </div>
      </header>
      <div className="apply-layout">
        <aside className="apply-notes">
          <div>
            <span className="kicker kicker--ink">What we publish</span>
            <ul>
              <li>
                <b>Discover</b>: first looks at people we think are next, in
                any part of culture.
              </li>
              <li>
                <b>Critique</b>: reviews that end in a clear verdict: Obsessed,
                On repeat, It’s fine or Skip.
              </li>
              <li>
                <b>Personal</b>: first-person essays about the culture that
                shaped you.
              </li>
            </ul>
          </div>
          <div>
            <span className="kicker kicker--ink">How it works</span>
            <ol>
              <li>Send one pitch with this form.</li>
              <li>An editor replies within two weeks if it fits.</li>
              <li>We edit with you, then publish under your name.</li>
            </ol>
          </div>
          <p className="small">
            Only want to tip us off about someone? <Link className="underline" href="/put-us-on">Put us on →</Link>
            <br />
            Read our <Link className="underline" href="/standards">editorial standards</Link> first.
          </p>
        </aside>
        <ApplicationForm />
      </div>
    </main>
  );
}
