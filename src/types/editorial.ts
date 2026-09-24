export type CategorySlug =
  | 'fashion'
  | 'beauty'
  | 'culture'
  | 'entertainment'
  | 'people'
  | 'life'
  | 'travel'
  | 'design';

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  social?: {
    instagram?: string;
    twitter?: string;
  };
}

export interface MediaItem {
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square' | 'wide';
}

export type ContentBlock =
  | { type: 'paragraph'; text: string; dropCap?: boolean }
  | { type: 'heading'; text: string; kicker?: string }
  | { type: 'quote'; quote: string; attribution?: string; context?: string }
  | { type: 'image'; image: MediaItem }
  | { type: 'image_duo'; images: [MediaItem, MediaItem] }
  | { type: 'callout'; title?: string; text: string }
  | { type: 'divider' };

export interface InterviewExchange {
  question: string;
  answer: string;
  speaker?: string;
}

export interface InterviewData {
  subjectName: string;
  subjectTitle: string;
  intro: string;
  portrait: MediaItem;
  secondaryPortrait?: MediaItem;
  keyQuote: string;
  qas: InterviewExchange[];
  socialLinks?: {
    instagram?: string;
    portfolio?: string;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  dek: string;
  category: CategorySlug;
  categoryLabel: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  dateFormatted: string;
  readTime: string;
  coverImage: MediaItem;
  type: 'standard' | 'feature' | 'interview';
  isLead?: boolean;
  isEditorPick?: boolean;
  isTrending?: boolean;
  trendingRank?: number;
  content: ContentBlock[];
  interview?: InterviewData;
  isDevMock: true; // Explicit flag indicating development mock data
}

export interface CategoryInfo {
  slug: CategorySlug;
  label: string;
  description: string;
  featuredTopic: string;
}
