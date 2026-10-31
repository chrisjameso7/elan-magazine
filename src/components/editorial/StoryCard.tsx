import Link from 'next/link';
import type { Article } from '@/types/editorial';
import { storyHref } from '@/lib/presentation';
import EditorialImage from './EditorialImage';

interface StoryCardProps {
  article: Article;
  variant?: 'lead' | 'portrait_feature' | 'horizontal_split' | 'quote_overlay' | 'compact_list' | 'numbered_rank';
  rank?: number;
  priority?: boolean;
}

export default function StoryCard({ article, variant = 'portrait_feature', rank, priority = false }: StoryCardProps) {
  const compact = variant === 'compact_list' || variant === 'numbered_rank';
  const lead = variant === 'lead';
  return <article className={`story-card story-card--${variant}`}>
    {rank && <span className="story-number" aria-hidden="true">{String(rank).padStart(2, '0')}</span>}
    {!compact && <Link href={storyHref(article)} className="story-photo" tabIndex={-1} aria-hidden="true">
      <EditorialImage image={article.coverImage} direction={article.artDirection} priority={priority || lead}
        sizes={lead ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw'} />
    </Link>}
    <div className="story-copy">
      <Link className="eyebrow" href={`/category/${article.category}`}>{article.categoryLabel}</Link>
      {lead ? <h2><Link href={storyHref(article)}>{article.title}</Link></h2> : <h3><Link href={storyHref(article)}>{article.title}</Link></h3>}
      {!compact && <p className="story-dek">{article.dek}</p>}
      <p className="story-meta"><span>{article.author.name}</span>{article.dateFormatted && <time dateTime={article.publishedAt}>{article.dateFormatted}</time>}</p>
      {lead && <Link className="text-link" href={storyHref(article)}>Read the story <span aria-hidden="true">↗</span></Link>}
    </div>
  </article>;
}
