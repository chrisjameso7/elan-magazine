import Link from 'next/link';
import PreviewImage from '@/components/PreviewImage';
import { previewMedia } from '@/lib/preview-media';
export const metadata = { title: 'About', alternates: { canonical: '/about' } };
export default function About() {
  return (
    <main id="main-content">
      <div className="review-notice">
        <span>THE PUBLICATION</span>
        <p>Visual foundation preview / Sample photography</p>
      </div>
      <header className="about-opening">
        <PreviewImage photo={previewMedia.decks} priority />
        <div>
          <span className="eyebrow">Lumière Index</span>
          <h1>
            News that
            <br />
            matters.
          </h1>
          <p>
            Entertainment &amp; pop culture.
            <br />A clear editorial point of view.
          </p>
        </div>
      </header>
      <div className="editorial-body about-content">
        <aside>
          <h2 className="section-label">Inside Lumière</h2>
          <a href="#editorial-direction">Editorial direction ↗</a>
          <Link href="/">The visual edition ↗</Link>
          <span className="photo-note">Sample photography / Unsplash</span>
        </aside>
        <article id="editorial-direction">
          <p className="eyebrow">A new chapter</p>
          <h2>
            Entertainment has
            <br />a wider story.
          </h2>
          <p className="standfirst">
            The work. The personalities. The conversations that become culture.
          </p>
          <p>
            Lumière Index is being developed as an entertainment and pop-culture
            newsroom. ÉLAN is being consolidated into Lumière.
          </p>
          <h3>The editorial direction</h3>
          <p>
            Film and television, music, personalities and popular culture form
            the proposed editorial world. The aim is a publication with context,
            curiosity and a recognisable point of view.
          </p>
          <div className="about-pullquote">
            “News that matters.”<span>THE LUMIÈRE INDEX BRAND LINE</span>
          </div>
          <h3>Where we are now</h3>
          <p>
            This is a visual foundation for review. The newsroom, publishing
            workflow and launch edition are still in development. The images are
            sample photography, not documentation of our reporting or events.
          </p>
          <Link className="text-link" href="/">
            Explore the visual edition ↗
          </Link>
        </article>
      </div>
    </main>
  );
}
