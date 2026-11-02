import type { Article } from '../types/editorial';

export function demonstrationContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  return (
    (value as { isDevMock?: boolean }).isDevMock === true ||
    /\[development mock(?: bio)?\]/i.test(JSON.stringify(value))
  );
}
export function released(
  value: {
    _status?: string | null;
    publishedAt?: string | null;
    isDevMock?: boolean | null;
  },
  now = Date.now(),
): boolean {
  return (
    value._status === 'published' &&
    !demonstrationContent(value) &&
    !!value.publishedAt &&
    Date.parse(value.publishedAt) <= now
  );
}
export function publicStories(articles: Article[], demo = false): Article[] {
  return articles.filter(
    (article) =>
      (demo || !demonstrationContent(article)) &&
      Date.parse(article.publishedAt) <= Date.now(),
  );
}
export function demoPreviewEnabled(): boolean {
  return (
    process.env.VERCEL_ENV !== 'production' &&
    (process.env.ELAN_DEMO_PREVIEW === 'true' ||
      process.env.NODE_ENV === 'development')
  );
}
