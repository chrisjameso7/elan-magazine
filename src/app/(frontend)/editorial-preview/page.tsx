export const dynamic = 'force-dynamic';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import PreviewComposer from '@/components/editorial/PreviewComposer';

export default async function EditorialPreviewPage() {
  await connection();
  if (process.env.DATABASE_URI?.trim()) notFound();
  const { MOCK_ARTICLES, MOCK_AUTHORS } = await import('@/data/mockArticles');
  return <PreviewComposer initialArticles={MOCK_ARTICLES} authors={MOCK_AUTHORS} />;
}
