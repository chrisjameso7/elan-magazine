import Link from 'next/link';
import PreviewImage from '@/components/PreviewImage';
import { previewMedia } from '@/lib/preview-media';
export const metadata = { alternates: { canonical: '/' } };
export default function Home() {
  return (
    <main id="main-content">
      <div className="review-notice">
        <span>VISUAL DIRECTION / 02</span>
        <p>Design preview. Sample photography; no published stories.</p>
      </div>
      <section className="cinematic-lead" aria-labelledby="lead-title">
        <PreviewImage
          photo={previewMedia.live}
          priority
          className="lead-photo"
        />
        <div className="lead-band">
          <div className="lead-inner">
            <figure className="overlap-image">
              <PreviewImage
                photo={previewMedia.screen}
                priority
                sizes="200px"
              />
              <figcaption>SCREEN / SOUND / CULTURE</figcaption>
            </figure>
            <div className="lead-copy">
              <p className="eyebrow">The Lumière point of view</p>
              <h1 id="lead-title">
                The stories behind
                <br />
                the spotlight.
              </h1>
              <p>Entertainment. Pop culture. News that matters.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="editorial-body">
        <section className="opening-grid" aria-label="The publication in focus">
          <aside className="publication-details">
            <h2 className="section-label">The publication</h2>
            <dl>
              <div>
                <dt>Focus</dt>
                <dd>Entertainment &amp; pop culture</dd>
              </div>
              <div>
                <dt>Identity</dt>
                <dd>Lumière Index</dd>
              </div>
              <div>
                <dt>Our line</dt>
                <dd>News that matters.</dd>
              </div>
            </dl>
            <Link className="solid-link" href="/about">
              Discover Lumière <span aria-hidden="true">↗</span>
            </Link>
          </aside>
          <div className="opening-copy">
            <h2 className="section-label">A closer look</h2>
            <h3>
              Entertainment is only
              <br />
              the beginning.
            </h3>
            <p>
              The films we talk about. The music we return to. The personalities
              and moments that become part of the conversation.
            </p>
            <p>
              Lumière Index is taking shape as a home for entertainment and
              pop-culture journalism, with a clear point of view and room to go
              deeper.
            </p>
            <Link className="text-link" href="/about">
              Read our direction <span aria-hidden="true">↗</span>
            </Link>
            <div className="coverage-index">
              <span>01 / SCREEN</span>
              <span>02 / MUSIC</span>
              <span>03 / CULTURE</span>
            </div>
          </div>
          <aside className="frame-gallery">
            <h2 className="section-label">
              In the frame <span>Visual study</span>
            </h2>
            <div className="gallery-mosaic">
              <PreviewImage
                photo={previewMedia.cinema}
                sizes="(min-width:900px) 350px, 100vw"
              />
              <PreviewImage photo={previewMedia.music} sizes="200px" />
              <PreviewImage photo={previewMedia.screen} sizes="200px" />
            </div>
            <p className="photo-note">Sample photography / Unsplash</p>
          </aside>
        </section>
        <section
          id="screen"
          className="screen-section"
          aria-labelledby="screen-title"
        >
          <div className="section-topline">
            <h2 id="screen-title">On screen</h2>
            <span>PROPOSED COVERAGE / 01</span>
          </div>
          <div className="screen-composition">
            <div className="screen-photo">
              <PreviewImage
                photo={previewMedia.screen}
                sizes="(min-width:900px) 750px,100vw"
              />
              <span className="image-caption">THE SCREEN STUDY</span>
            </div>
            <div className="screen-notes">
              <span className="eyebrow">Film &amp; television</span>
              <h3>
                Beyond the
                <br />
                opening scene.
              </h3>
              <p>
                The creative work, the people behind it, and its place in the
                wider cultural conversation.
              </p>
              <div className="note-row">
                <span>01</span>
                <div>
                  <h4>The work</h4>
                  <p>Film, television and creative expression.</p>
                </div>
              </div>
              <div className="note-row">
                <span>02</span>
                <div>
                  <h4>The conversation</h4>
                  <p>Context and perspective beyond the release.</p>
                </div>
              </div>
              <Link className="text-link" href="/about#editorial-direction">
                Our editorial direction ↗
              </Link>
            </div>
          </div>
        </section>
        <section
          id="music"
          className="music-section"
          aria-labelledby="music-title"
        >
          <div className="section-topline">
            <h2 id="music-title">In music</h2>
            <span>PROPOSED COVERAGE / 02</span>
          </div>
          <div className="music-composition">
            <div className="music-statement">
              <span className="eyebrow">The sound. The scene.</span>
              <h3>
                More than
                <br />a moment
                <br />
                on stage.
              </h3>
              <p>Artists, live performance and the culture around the music.</p>
            </div>
            <figure>
              <PreviewImage
                photo={previewMedia.music}
                sizes="(min-width:900px) 380px,100vw"
              />
              <figcaption>Sound / A visual study</figcaption>
            </figure>
            <figure>
              <PreviewImage
                photo={previewMedia.guitar}
                sizes="(min-width:900px) 400px,100vw"
              />
              <figcaption>Musicianship / A visual study</figcaption>
            </figure>
          </div>
        </section>
        <section
          id="culture"
          className="culture-section"
          aria-labelledby="culture-title"
        >
          <div className="section-topline">
            <h2 id="culture-title">In culture</h2>
            <span>PROPOSED COVERAGE / 03</span>
          </div>
          <div className="culture-composition">
            <div className="culture-feature">
              <PreviewImage
                photo={previewMedia.decks}
                sizes="(min-width:900px) 550px,100vw"
              />
              <div>
                <span className="eyebrow">People &amp; popular culture</span>
                <h3>
                  What brings
                  <br />
                  us together.
                </h3>
                <p>
                  Personalities, audiences, creative communities and the stories
                  that connect them.
                </p>
                <Link className="text-link" href="/about">
                  Meet the publication ↗
                </Link>
              </div>
            </div>
            <aside className="edition-status">
              <span className="eyebrow">The first edition</span>
              <h3>
                The newsroom
                <br />
                comes next.
              </h3>
              <p>
                This is a visual foundation for review. Reported stories,
                interviews and editorial photography will appear when the
                publishing experience is ready.
              </p>
              <p>No sample headline here represents a published news report.</p>
              <Link className="text-link" href="/about">
                About Lumière Index ↗
              </Link>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
