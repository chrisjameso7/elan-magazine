import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
export const metadata = {
  title: 'The ÉLAN List',
  description:
    'An invitation to the world of ÉLAN. Sign up for editorial emails.',
  alternates: { canonical: '/newsletter' },
};
export default function NewsletterPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="publication-shell">
        <header className="world-heading">
          <span className="eyebrow">ÉLAN / THE LIST</span>
          <h1>
            Stay in
            <br />
            <em>your element.</em>
          </h1>
          <p>
            A direct connection to ÉLAN. Join the list below for future
            editorial dispatches.
          </p>
        </header>
      </main>
      <Footer />
    </>
  );
}
