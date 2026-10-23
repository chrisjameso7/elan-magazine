import type { Article } from '../types/editorial';
import { MOCK_ARTICLES } from '../data/mockArticles';

// Missing configuration uses mocks; configured database failures remain visible.
export async function readArticles(databaseURI: string | undefined, load: () => Promise<Article[]>): Promise<Article[]> {
  if (!databaseURI?.trim()) return MOCK_ARTICLES;
  return load();
}
