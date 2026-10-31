export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/cmsAdapter';
import { storyMetadata } from '@/lib/story-metadata';
import EditorialPage from '@/components/editorial/EditorialPage';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = (await getArticles()).find(a => a.slug === slug);
  return storyMetadata(article, `/feature/${slug}`);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find(a => a.slug === slug);
  if (!article) notFound();
  return <EditorialPage article={article} articles={articles} format="feature" />;
}
