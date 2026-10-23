import type { Article, Author, ContentBlock, InterviewData } from '../types/editorial';
import { resolveMedia, type StoredMedia, type UploadedPhoto } from './media';
import { DESKS } from '../types/editorial';

type StoredBlock<T = ContentBlock> = T extends ContentBlock ? Omit<T, 'type' | 'image' | 'images'> & {
  blockType: T['type']; id?: string; blockName?: string | null;
} & (T extends { type: 'image' } ? { image: StoredMedia } : T extends { type: 'image_duo' } ? { images: StoredMedia[] } : object) : never;
type StoredInterview = Omit<InterviewData, 'portrait' | 'secondaryPortrait'> & { portrait: StoredMedia; secondaryPortrait?: StoredMedia | null };
type StoredAuthor = Author & { avatarUpload?: UploadedPhoto | string | number | null };
export type StoredArticle = Omit<Article, 'author' | 'content' | 'tags' | 'dateFormatted' | 'categoryLabel' | 'coverImage' | 'interview'> & {
  author: StoredAuthor | string | number;
  coverImage: StoredMedia;
  interview?: StoredInterview | null;
  content?: StoredBlock[] | null;
  tags?: { tag: string; id?: string }[] | null;
  dateFormatted?: string | null;
};
// Pick domain fields explicitly: Payload row IDs, auth/relationship metadata, and
// nullable optional fields must not leak into the public model or a copied story.
const compact = <T extends object>(value: T): T => Object.fromEntries(Object.entries(value).filter(([, item]) => item != null)) as T;
const media = resolveMedia;
function author(value: StoredAuthor): Author {
  return compact({ id: String(value.id), name: value.name, role: value.role, avatar: (typeof value.avatarUpload === 'object' && value.avatarUpload?.url) || value.avatar, bio: value.bio,
    social: value.social ? compact({ instagram: value.social.instagram, twitter: value.social.twitter }) : undefined });
}
function interview(value?: StoredInterview | null): InterviewData | undefined {
  if (!value?.subjectName) return undefined;
  return compact({ subjectName: value.subjectName, subjectTitle: value.subjectTitle, intro: value.intro,
    portrait: media(value.portrait), secondaryPortrait: (value.secondaryPortrait?.asset || value.secondaryPortrait?.url) ? media(value.secondaryPortrait) : undefined,
    keyQuote: value.keyQuote, qas: (value.qas || []).map((qa) => compact({ question: qa.question, answer: qa.answer, speaker: qa.speaker })),
    socialLinks: value.socialLinks ? compact({ instagram: value.socialLinks.instagram, portfolio: value.socialLinks.portfolio }) : undefined });
}
function block(value: StoredBlock): ContentBlock {
  switch (value.blockType) {
    case 'paragraph': return compact({ type: 'paragraph', text: value.text, dropCap: value.dropCap });
    case 'heading': return compact({ type: 'heading', text: value.text, kicker: value.kicker });
    case 'quote': return compact({ type: 'quote', quote: value.quote, attribution: value.attribution, context: value.context });
    case 'image': return { type: 'image', image: media(value.image) };
    case 'image_duo':
      if (value.images.length !== 2) throw new Error('Image duos require exactly two images.');
      return { type: 'image_duo', images: [media(value.images[0]), media(value.images[1])] };
    case 'callout': return compact({ type: 'callout', title: value.title, text: value.text });
    case 'divider': return { type: 'divider' };
    default: throw new Error('Unknown editorial block.');
  }
}
export function toArticle(document: StoredArticle): Article {
  if (typeof document.author !== 'object' || !document.author) throw new Error('Populate article.author (depth: 1) before adapting.');
  const category = DESKS.find((desk) => desk.slug === document.category);
  if (!category) throw new Error('Unknown editorial desk.');
  return compact({
    id: String(document.id), slug: document.slug, title: document.title, dek: document.dek,
    category: document.category, categoryLabel: category.label, author: author(document.author),
    publishedAt: document.publishedAt,
    dateFormatted: document.dateFormatted || new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(document.publishedAt)),
    tags: (document.tags || []).map(({ tag }) => tag), readTime: document.readTime, coverImage: media(document.coverImage),
    type: document.type, franchise: document.franchise,
    artDirection: document.artDirection ? compact({ accentHex: document.artDirection.accentHex,
      bgOverrideHex: document.artDirection.bgOverrideHex,
      heroFocalPoint: { x: document.artDirection.heroFocalPoint?.x ?? 50, y: document.artDirection.heroFocalPoint?.y ?? 50 } }) : undefined,
    isLead: document.isLead, isEditorPick: document.isEditorPick, isTrending: document.isTrending, trendingRank: document.trendingRank,
    content: (document.content || []).map(block), interview: interview(document.interview), isDevMock: document.isDevMock,
  });
}
type DomainStoredBlock<T = ContentBlock> = T extends ContentBlock ? Omit<T, 'type'> & { blockType: T['type'] } : never;
export function toStoredArticle(article: Article): Omit<Article, 'author' | 'content' | 'tags'> & {
  author: string; tags: { tag: string }[]; content: DomainStoredBlock[];
} {
  const document: StoredArticle = { ...article, author: article.author.id, tags: article.tags.map((tag) => ({ tag })),
    content: article.content.map(({ type, ...block }) => ({ ...block, blockType: type } as DomainStoredBlock)) };
  const clean = toArticle({ ...document, author: article.author });
  return { ...clean, author: clean.author.id, tags: clean.tags.map((tag) => ({ tag })),
    content: clean.content.map(({ type, ...block }) => ({ ...block, blockType: type } as DomainStoredBlock)) };
}
