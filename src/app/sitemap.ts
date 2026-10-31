import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/cmsAdapter';
import { DESKS } from '@/types/editorial';
import { storyHref } from '@/lib/presentation';

export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'https://elan-magazine.vercel.app';
  const articles = await getArticles();
  const paths = ['/', '/about', '/privacy', '/terms', ...DESKS.map(d => `/category/${d.slug}`), ...articles.map(storyHref)];
  return [...new Set(paths)].map(path => ({ url: new URL(path, origin).href }));
}
