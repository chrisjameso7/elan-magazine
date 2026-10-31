import type { Metadata } from 'next';
import type { Article } from '@/types/editorial';
import { storyHref } from './presentation';

export function storyMetadata(article: Article | undefined, path: string): Metadata {
  if (!article) return { title: 'Story not found — The Élan' };
  return {
    title: `${article.title} — The Élan`, description: article.dek,
    alternates: { canonical: storyHref(article) },
    openGraph: { type: 'article', title: article.title, description: article.dek, url: path,
      publishedTime: article.publishedAt, authors: [article.author.name],
      images: [{ url: article.coverImage.url, alt: article.coverImage.alt }] },
    twitter: { card: 'summary_large_image', title: article.title, description: article.dek, images: [article.coverImage.url] },
  };
}
