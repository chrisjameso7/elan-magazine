import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { brand } from "@/lib/brand";
export const metadata = {
  title: "About",
  description: `About ${brand.fullName}.`,
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <InfoPage title="Who’s next, first." eyebrow={`About ${brand.name}`}>
      <p className="standfirst">
        {brand.fullName} is a culture magazine for people who find things
        before the algorithm does.
      </p>
      <p>
        We write about the people and work shaping culture: actors, creators,
        directors, designers, writers, athletes, musicians, shows, films and the
        internet moments everyone ends up quoting. Some are already famous. Most
        of the fun is in the ones who aren’t yet.
      </p>
      <h2>What we publish</h2>
      <p>
        <strong>Discover</strong> — first looks at people we think are next.
        <br />
        <strong>Critique</strong> — reviews with a clear verdict: Obsessed, On
        repeat, It’s fine or Skip.
        <br />
        <strong>Personal</strong> — first-person essays about the culture that
        shaped us.
        <br />
        <strong>The Index 50</strong> — a weekly ranked list of who and what is
        rising. Public signals build the shortlist; editors set the order and
        can move an entry at most five places.
        <br />
        <strong>Called It</strong> — a dated record of who we covered early, so
        you can check our work.
      </p>
      <h2>Publisher</h2>
      <p>
        {brand.name} is published by {brand.operator}.
        <br />
        <strong>{brand.founder}</strong>, Founder and CEO
      </p>
      <h2>Get in touch</h2>
      <p>
        Pitches and enquiries:{" "}
        <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>. Know
        someone we should cover? <Link href="/put-us-on">Put us on →</Link>
      </p>
      <p>
        <Link href="/standards">Read our editorial standards →</Link>
      </p>
    </InfoPage>
  );
}
