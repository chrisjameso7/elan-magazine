import type { Article, Author, ContentBlock } from '../types/editorial';
import { DESKS } from '../types/editorial';

type StoredBlock<T = ContentBlock> = T extends ContentBlock ? Omit<T, 'type'> & { blockType: T['type']; id?: string; blockName?: string | null } : never;
export type StoredArticle = Omit<Article, 'author' | 'content' | 'tags' | 'dateFormatted' | 'categoryLabel'> & {
  author: Author | string | number;
  content?: StoredBlock[] | null;
  tags?: { tag: string; id?: string }[] | null;
  dateFormatted?: string | null;
};
export function toArticle(document: StoredArticle): Article {
  if (typeof document.author !== 'object' || !document.author) throw new Error('Populate article.author (depth: 1) before adapting.');
  return {
    ...document, author: document.author,
    categoryLabel: DESKS.find((desk) => desk.slug === document.category)?.label || document.category,
    dateFormatted: document.dateFormatted || new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(document.publishedAt)),
    tags: (document.tags || []).map(({ tag }) => tag),
    content: (document.content || []).map(({ blockType, id, blockName, ...block }) => {
      void id; void blockName;
      if (blockType === 'image_duo' && (!('images' in block) || block.images.length !== 2)) throw new Error('Image duos require exactly two images.');
      return { ...block, type: blockType } as ContentBlock;
    }),
  };
}
export function toStoredArticle(article: Article): StoredArticle {
  return { ...article, author: article.author.id, tags: article.tags.map((tag) => ({ tag })),
    content: article.content.map(({ type, ...block }) => ({ ...block, blockType: type } as StoredBlock)),
  };
}
