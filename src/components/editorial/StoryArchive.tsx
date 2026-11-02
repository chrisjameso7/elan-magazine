import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from './StoryCard';
import type { Article } from '@/types/editorial';

export default function StoryArchive({
  title,
  intro,
  eyebrow,
  stories,
}: {
  title: string;
  intro: string;
  eyebrow: string;
  stories: Article[];
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="publication-shell reading-page">
        <header className="world-heading">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
        </header>
        {stories.length ? (
          <>
            <StoryCard article={stories[0]} variant="lead" priority />
            {stories.length > 1 && (
              <div className="archive-grid">
                {stories.slice(1).map((a) => (
                  <StoryCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </>
        ) : (
          <section className="archive-empty">
            <span aria-hidden="true">↗</span>
            <h2>There is more to come.</h2>
            <p>New editorial work will appear here when it is published.</p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
