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
        <p className="font-display text-3xl leading-snug text-[#751F3D] sm:text-4xl"><strong>ÉLAN</strong> is an independent digital publication dedicated to modern high fashion, cultural critique, and sartorial architecture.</p>
        <p>Engineered with a text-first, print-inspired discipline, ÉLAN provides sharp editorial commentary and elevated visual storytelling free from digital clutter.</p>
      </section>
      <section>
        <h2>Editorial Pillars &amp; Franchises</h2>
        <div className="space-y-8">
          <div><h3>The New Guard</h3><p>Deep-dive profiles and critical analyses of emergent designers, visionaries, and creative directors reshaping luxury.</p></div>
          <div><h3>The Edit</h3><p>Curated wardrobe studies, essential acquisitions, and high-contrast sartorial selections.</p></div>
          <div><h3>ÉLAN Conversations</h3><p>Text-led, uninterrupted dialogues with the figures defining contemporary style, art, and culture.</p></div>
        </div>
      </section>
      <section className="border-y border-[#751F3D]/25 py-10">
        <h2>Submissions &amp; Pitching</h2>
        <div className="space-y-8">
          <div><h3>Editorial &amp; Feature Pitches</h3><p>We accept long-form essays, cultural critiques, and profile proposals. Send briefs and writer samples to <a href="mailto:pitches@elanmagazine.com">pitches@elanmagazine.com</a>.</p></div>
          <div><h3>Photography &amp; Fashion Stories</h3><p>High-resolution editorial spreads and portrait series should be submitted with full styling and creative direction credits to <a href="mailto:media@elanmagazine.com">media@elanmagazine.com</a>.</p></div>
        </div>
      </section>
      <section>
        <h2>Masthead</h2>
        <p><strong>Founder &amp; Executive Editor:</strong> Chris James</p>
        <p><strong>Press &amp; General Inquiries:</strong> <a href="mailto:contact@elanmagazine.com">contact@elanmagazine.com</a></p>
        <p><strong>Syndication &amp; Rights:</strong> <a href="mailto:legal@elanmagazine.com">legal@elanmagazine.com</a></p>
      </section>
    </PublicationPage>
  );
}
