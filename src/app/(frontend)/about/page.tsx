import type { Metadata } from 'next';
import PublicationPage from '@/components/layout/PublicationPage';

export const metadata: Metadata = {
  title: 'About — ÉLAN',
  description: 'The ÉLAN manifesto, editorial franchises, submission guidelines, and masthead.',
};

export default function AboutPage() {
  return (
    <PublicationPage title="Culture, in its element." eyebrow="About ÉLAN">
      <section aria-label="Manifesto">
        <p>ÉLAN is an independent digital publication produced by ÉLAN Entertainment, a division of Lumière Media &amp; Entertainment.</p>
        <p className="font-display text-3xl leading-snug text-[#171717] sm:text-4xl">A global entertainment and culture publication for a new generation.</p>
        <p>ÉLAN explores the personalities, creative work, and cultural movements shaping contemporary life. From music and screen culture to personal style, art, and the internet, we follow work with a point of view. Cover campaigns, considered conversations, and original productions bring that world into focus.</p>
      </section>
      <section>
        <h2>Our Editorial Series</h2>
        <div className="space-y-8">
          <div><h3>THE NEXT</h3><p>Emerging personalities and creative figures worth knowing.</p></div>
          <div><h3>IN CONVERSATION</h3><p>Interviews with room for candour, exchange, and the unexpected.</p></div>
          <div><h3>OFF CAMERA</h3><p>Creative processes, personal environments, and the work behind the work.</p></div>
          <div><h3>ÉLAN ORIGINALS</h3><p>Video interviews, editorial films, and original productions.</p></div>
          <div><h3>THE CULTURE EDIT</h3><p>A considered perspective on cultural developments.</p></div>
          <div><h3>ÉLAN LISTS</h3><p>Editorial selections with clear criteria and a point of view.</p></div>
        </div>
      </section>
      <section id="submissions" className="border-y border-[#171717]/25 py-10">
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
