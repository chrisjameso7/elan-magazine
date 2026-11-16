import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { brand } from "@/lib/brand";
export const metadata = {
  title: "About",
  description:
    "About Lumière Index, an entertainment and pop-culture publication.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <InfoPage title="News that matters." eyebrow="About Lumière Index">
      <p className="standfirst">
        Entertainment and pop culture, with a clear editorial point of view.
      </p>
      <p>
        Lumière Index is an entertainment and pop-culture publication operated
        by {brand.operator}.
      </p>
      <h2>The editorial direction</h2>
      <p>
        We focus on the creative work, personalities and conversations that
        shape entertainment and popular culture. News, features, interviews,
        analysis and reviews have distinct editorial roles; each story
        identifies its format and contributors.
      </p>
      <h2>Leadership</h2>
      <p>
        <strong>{brand.founder}</strong>
        <br />
        Founder and CEO
      </p>
      <h2>Get in touch</h2>
      <p>
        Editorial enquiries and pitches:{" "}
        <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>.
      </p>
      <p>
        <Link href="/standards">Read our editorial standards ↗</Link>
      </p>
    </InfoPage>
  );
}
