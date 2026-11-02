import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/cmsAdapter';
import { getWorld } from '@/lib/world';
import { DESKS } from '@/types/editorial';
import { storyHref } from '@/lib/presentation';

export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'https://elan-magazine.vercel.app';
  const [articles, world] = await Promise.all([getArticles(), getWorld()]);
  const paths = ['/', '/about', '/privacy', '/terms', '/covers', '/originals', '/newsletter', ...world.covers.map(c => `/covers/${c.slug}`), ...world.personalities.map(p => `/people/${p.slug}`), ...DESKS.map(d => `/category/${d.slug}`), ...articles.map(storyHref)];
  return [...new Set(paths)].map(path => ({ url: new URL(path, origin).href }));
}
