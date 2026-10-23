export const DESKS = [
  { slug: 'culture', label: 'CULTURE', description: 'Internet culture, ideas, art, trends, and social criticism.', featuredTopic: 'The Cultural Conversation' },
  { slug: 'people', label: 'PEOPLE', description: 'Profiles, creators, conversations, and emerging talent.', featuredTopic: 'Emerging Voices' },
  { slug: 'entertainment', label: 'ENTERTAINMENT', description: 'Film, television, music, and performance culture.', featuredTopic: 'On Screen & On Stage' },
  { slug: 'style', label: 'STYLE', description: 'Fashion, beauty, design, and personal style.', featuredTopic: 'Personal Expression' },
  { slug: 'life', label: 'LIFE', description: 'Relationships, food, modern living, and night culture.', featuredTopic: 'Modern Life' },
  { slug: 'places', label: 'PLACES', description: 'Cities, travel, and culturally significant spaces.', featuredTopic: 'City Stories' },
] as const;
export type CategorySlug = (typeof DESKS)[number]['slug'];

export const FRANCHISES = [
  { value: 'new_guard', label: 'The New Guard' },
  { value: 'elan_conversations', label: 'Élan Conversations' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'the_edit', label: 'The Edit' },
  { value: 'after_dark', label: 'After Dark' },
  { value: 'elan_50', label: 'The Élan 50' },
] as const;
export type Franchise = (typeof FRANCHISES)[number]['value'];

export interface ArtDirection {
  accentHex: string;
  bgOverrideHex?: string;
  heroFocalPoint: { x: number; y: number };
}

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
  franchise?: Franchise;
  artDirection?: ArtDirection;
  isLead?: boolean;
  isEditorPick?: boolean;
  isTrending?: boolean;
  trendingRank?: number;
  content: ContentBlock[];
  interview?: InterviewData;
  isDevMock?: boolean; // Absent or false for persistent content
}

export interface CategoryInfo {
  slug: CategorySlug;
  label: string;
  description: string;
  featuredTopic: string;
}
