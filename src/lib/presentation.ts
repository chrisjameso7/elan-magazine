import type { Article } from '@/types/editorial';

export function storyHref(article: Pick<Article, 'type' | 'slug'>) {
  return `/${article.type === 'standard' ? 'article' : article.type}/${article.slug}`;
}

export function profileHref(value: string | undefined, platform?: 'instagram') {
  if (!value) return undefined;
  const trimmed = value.trim();
  const candidate = platform === 'instagram' && /^@?[\w.]+$/.test(trimmed)
    ? `https://www.instagram.com/${trimmed.replace(/^@/, '')}/`
    : /^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed) ? `https://${trimmed}` : trimmed;
  try {
    const url = new URL(candidate);
    if (!['https:', 'http:'].includes(url.protocol) || /\.(mock|invalid|example)$/.test(url.hostname)) return undefined;
    return url.href;
  } catch { return undefined; }
}

// Preserve editor-selected leads and stored franchise keys; category alone never implies emerging status.
export function homepageStories(articles: Article[]) {
  const used = new Set<string>();
  const take = (items: Article[], count: number) => items.filter(a => !used.has(a.id)).slice(0, count).map(a => {
    used.add(a.id);
    return a;
  });
  const recent = [...articles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const lead = take(articles.filter(a => a.isLead), 1)[0] ?? take(recent, 1)[0];
  const wave = take(recent.filter(a => a.franchise === 'new_guard'), 3);
  const feature = take(recent.filter(a => a.type === 'interview'), 1)[0]
    ?? take(recent.filter(a => a.type === 'feature'), 1)[0];
  const edit = take(recent.filter(a => a.franchise === 'the_edit'), 3);
  const latest = take(recent, 6);
  return { lead, wave, feature, edit, latest };
}
