import type { Article } from '../types/editorial';

// Missing configuration uses mocks; configured database failures remain visible.
export async function readArticles(databaseURI: string | undefined, load: () => Promise<Article[]>): Promise<Article[]> {
  if (!databaseURI?.trim()) return (await import('../data/mockArticles')).MOCK_ARTICLES;
  return load();
}
