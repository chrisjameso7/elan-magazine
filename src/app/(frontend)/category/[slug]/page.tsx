export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import { DESKS } from '@/types/editorial';
import { getArticles } from '@/lib/cmsAdapter';

interface Props { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const desk = DESKS.find(d => d.slug === slug);
  return desk ? { title: `${desk.label} — The Élan`, description: desk.description, alternates: { canonical: `/category/${slug}` } } : { title: 'Section not found — The Élan' };
}
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const desk = DESKS.find(d => d.slug === slug);
  if (!desk) notFound();
  const articles = await getArticles();
  const stories = articles.filter(a => a.category === slug);
  const others = articles.filter(a => a.category !== slug).slice(0, 3);
  return <><Header /><main id="main-content" className="publication-shell reading-page">
    <Link className="reading-breadcrumb" href="/">← The Élan</Link>
    <header className="archive-header"><span className="eyebrow">The {desk.label.toLowerCase()} desk</span><h1>{desk.label.toLowerCase()}</h1><p>{desk.description}</p></header>
    {stories.length > 0 ? <><StoryCard article={stories[0]} variant="lead" priority />{stories.length > 1 && <div className="archive-grid">{stories.slice(1).map(a => <StoryCard key={a.id} article={a} />)}</div>}</> : <p className="py-12">Our editors are preparing new stories for this section. Explore more from The Élan below.</p>}
    {others.length > 0 && <section className="editorial-section" aria-labelledby="also-title"><div className="section-heading"><h2 id="also-title">Also in Élan</h2><Link className="eyebrow" href="/">All sections ↗</Link></div><div className="related-grid">{others.map(a => <StoryCard key={a.id} article={a} />)}</div></section>}
  </main><Footer /></>;
}
