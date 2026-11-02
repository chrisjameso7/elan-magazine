import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VideoPlayer from '@/components/editorial/VideoPlayer';
import StoryTools from '@/components/editorial/StoryTools';
import ArticleBody from '@/components/editorial/ArticleBody';
import Gallery from '@/components/editorial/Gallery';
import Sponsorship from '@/components/editorial/Sponsorship';
import StoryCard from '@/components/editorial/StoryCard';
import { getArticles } from '@/lib/cmsAdapter';
import { storyMetadata } from '@/lib/story-metadata';
import { videoSource } from '@/lib/video';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return storyMetadata(
    (await getArticles()).find((a) => a.slug === slug && a.type === 'original'),
    `/originals/${slug}`,
  );
}
export default async function OriginalPage({ params }: Props) {
  const { slug } = await params;
  const articles = await getArticles();
  const story = articles.find((a) => a.slug === slug && a.type === 'original');
  if (!story || !videoSource(story.production?.videoUrl)) notFound();
  const related = articles
    .filter((a) => a.type === 'original' && a.id !== story.id)
    .slice(0, 3);
  return (
    <>
      <Header />
      <main id="main-content" className="original-experience">
        <div className="publication-shell">
          <header className="original-heading">
            <Link className="eyebrow" href="/originals">
              ÉLAN ORIGINALS
            </Link>
            <h1>{story.title}</h1>
            <p>{story.dek}</p>
            <nav
              className="personality-links"
              aria-label="Featured personalities"
            >
              {story.personalities?.map((p) => (
                <Link key={p.id} href={`/people/${p.slug}`}>
                  {p.name} ↗
                </Link>
              ))}
            </nav>
          </header>
          <VideoPlayer
            production={story.production}
            title={story.title}
            poster={story.coverImage}
          />
          <div className="original-byline">
            <span>
              By {story.author.name} / {story.dateFormatted}
            </span>
            <StoryTools slug={story.slug} title={story.title} />
          </div>
        </div>
      </main>
      <div className="publication-shell">
        <article className="reading-body original-body">
          <Sponsorship value={story.sponsorship} />
          <ArticleBody blocks={story.content} />
        </article>
        <Gallery images={story.gallery} />
        {related.length > 0 && (
          <section className="editorial-section">
            <div className="section-heading">
              <h2>
                More <em>Originals.</em>
              </h2>
            </div>
            <div className="related-grid">
              {related.map((a) => (
                <StoryCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
