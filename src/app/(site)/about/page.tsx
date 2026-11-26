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
        {brand.fullName} is a culture magazine. We cover people before
        they’re everywhere, and we review what’s out now with a straight
        verdict.
      </p>
      <p>
        Some of the people we write about are already famous. The ones we
        care about most aren’t yet. Music, film, TV, the internet, style,
        sport, books: if people are about to be talking about it, it’s ours.
      </p>
      <h2>What we publish</h2>
      <p>
        <strong>Discover.</strong> First looks at people we think are next.
        <br />
        <strong>Critique.</strong> Reviews that end in a verdict: Obsessed, On
        repeat, It’s fine or Skip.
        <br />
        <strong>Personal.</strong> First-person essays about a song, a show or
        a person that mattered to the writer.
        <br />
        <strong>The Index 50.</strong> A weekly ranked list. Public numbers build
        the shortlist, and editors set the order, moving an entry five places
        at most.
        <br />
        <strong>Called It.</strong> A dated record of who we covered early, so
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
        someone we should cover? <Link href="/put-us-on">Put us on</Link> Want to write for us? <Link href="/write-for-us">Apply here</Link>
      </p>
      <p>
        <Link href="/standards">Read our editorial standards</Link>
      </p>
    </InfoPage>
  );
}
