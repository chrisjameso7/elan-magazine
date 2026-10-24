import type { Metadata } from 'next';
import PublicationPage from '@/components/layout/PublicationPage';

export const metadata: Metadata = {
  title: 'About — ÉLAN',
  description: 'The ÉLAN manifesto, editorial franchises, submission guidelines, and masthead.',
};

export default function AboutPage() {
  return (
    <PublicationPage title="Independent by design." eyebrow="About ÉLAN">
      <section aria-label="Manifesto">
        <p>ÉLAN is an independent digital publication produced by ÉLAN Entertainment, a division of Lumière Media &amp; Entertainment.</p>
        <p className="font-display text-3xl leading-snug text-[#751F3D] sm:text-4xl">The people, ideas, and creative work shaping how we live.</p>
        <p>From fashion and film to art and everyday life, we follow what moves culture forward. Thoughtful writing, distinctive photography, and the care of a print magazine guide everything we publish.</p>
      </section>
      <section>
        <h2>Our Editorial Series</h2>
        <div className="space-y-8">
          <div><h3>The New Guard</h3><p>Meet the emerging designers, artists, and creative voices whose work deserves a closer look.</p></div>
          <div><h3>The Edit</h3><p>The clothes, objects, books, films, and places we return to—and the stories behind our choices.</p></div>
          <div><h3>ÉLAN Conversations</h3><p>Conversations with people shaping style, art, and culture, with room for candour and the unexpected.</p></div>
        </div>
      </section>
      <section className="border-y border-[#751F3D]/25 py-10">
        <h2>Submissions &amp; Pitching</h2>
        <div className="space-y-8">
          <div><h3>Editorial &amp; Feature Pitches</h3><p>We welcome essays, cultural criticism, and profiles with a clear point of view. Send a short outline and samples of your writing to <a href="mailto:pitches@theelanmagazine.com">pitches@theelanmagazine.com</a>.</p></div>
          <div><h3>Photography &amp; Fashion Stories</h3><p>For photo essays, fashion stories, and portrait series, send your work with full creative and styling credits to <a href="mailto:media@theelanmagazine.com">media@theelanmagazine.com</a>.</p></div>
        </div>
      </section>
      <section>
        <h2>Masthead</h2>
        <p><strong>Founder &amp; Executive Editor:</strong> Chris James</p>
        <p><strong>Operating Division:</strong> ÉLAN Entertainment</p>
        <p><strong>Parent Entity:</strong> Lumière Media &amp; Entertainment</p>
        <p><strong>Press &amp; General Inquiries:</strong> <a href="mailto:contact@theelanmagazine.com">contact@theelanmagazine.com</a></p>
        <p><strong>Syndication &amp; Rights:</strong> <a href="mailto:legal@theelanmagazine.com">legal@theelanmagazine.com</a></p>
      </section>
    </PublicationPage>
  );
}
