import type { Article } from '../types/editorial';
import { demoPreviewEnabled, publicStories } from './visibility';

// Missing configuration uses mocks; configured database failures remain visible.
export async function readArticles(databaseURI: string | undefined, load: () => Promise<Article[]>): Promise<Article[]> {
  if (!databaseURI?.trim()) return demoPreviewEnabled() ? (await import('../data/mockArticles')).MOCK_ARTICLES : [];
  return publicStories(await load());
}
