import { brand } from '@/lib/brand';
export const metadata = { title: 'About', alternates: { canonical: '/about' } };
export default function About() {
  return (
    <main id="main-content" className="shell about-page">
      <p className="eyebrow">About the publication</p>
      <h1>{brand.name}</h1>
      <p className="standfirst">{brand.tagline}</p>
      <div className="reading-copy">
        <p>
          Lumière Index is being developed as an entertainment and pop-culture
          newsroom. ÉLAN is being consolidated into Lumière.
        </p>
        <h2>Where we are now</h2>
        <p>
          This foundation establishes the application, editorial data
          architecture, and visual system. The newsroom, publishing workflow,
          and launch edition are still in development.
        </p>
        <p>
          There are no movie rankings, fabricated stories, or simulated
          integrations in this preview.
        </p>
      </div>
    </main>
  );
}
