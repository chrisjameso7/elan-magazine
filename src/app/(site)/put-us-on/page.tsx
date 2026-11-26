import TipForm from "@/components/TipForm";
export const metadata = {
  title: "Put us on",
  description: "Tell The Index who we should be writing about next.",
  alternates: { canonical: "/put-us-on" },
};
export default function PutUsOn() {
  return (
    <main id="main-content" className="wrap">
      <section className="tip-panel" aria-labelledby="tip-title">
        <div>
          <span className="kicker kicker--ink">Put us on</span>
          <h1 id="tip-title">
            Who should we be writing about <i>right now?</i>
          </h1>
          <p>
            Send us the actor, creator, designer, writer, athlete, show, film or
            artist you’d bet on. Yourself counts. If we write about them, you
            get credit on the Called It wall.
          </p>
          <p className="small">
            We only use your email to credit you or ask a follow-up question.
          </p>
        </div>
        <TipForm />
      </section>
    </main>
  );
}
