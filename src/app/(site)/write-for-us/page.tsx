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
            Write for <i>The Index.</i>
          </h1>
          <p>
            We want writers who spot people early and can explain why they
            matter. You don’t need a CV or a list of bylines. Send one good
            pitch.
          </p>
        </div>
      </header>
      <div className="apply-layout">
        <aside className="apply-notes">
          <div>
            <span className="kicker kicker--ink">What we publish</span>
            <ul>
              <li>
                <b>Discover</b>: first looks at people we think are next.
              </li>
              <li>
                <b>Critique</b>: reviews that end in a verdict.
              </li>
              <li>
                <b>Personal</b>: first-person essays.
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
            Only want to tip us off about someone? <Link className="underline" href="/put-us-on">Put us on</Link>.
            <br />
            Read our <Link className="underline" href="/standards">editorial standards</Link> first.
          </p>
        </aside>
        <ApplicationForm />
      </div>
    </main>
  );
}
