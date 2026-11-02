export const DESKS = [
  { slug: 'people', label: 'PEOPLE', description: 'Profiles, creators, conversations, and emerging talent.', featuredTopic: 'Emerging Voices' },
  { slug: 'entertainment', label: 'ENTERTAINMENT', description: 'Film, television, music, and performance culture.', featuredTopic: 'On Screen & On Stage' },
  { slug: 'music', label: 'MUSIC', description: 'The artists, sounds, and scenes moving music forward.', featuredTopic: 'In Rotation' },
  { slug: 'style', label: 'STYLE', description: 'Fashion, beauty, design, and personal style.', featuredTopic: 'Personal Expression' },
  { slug: 'culture', label: 'CULTURE', description: 'Art, design, internet culture, ideas, places, and the way we live.', featuredTopic: 'The Cultural Conversation' },
] as const;
export type CategorySlug = (typeof DESKS)[number]['slug'] | 'life' | 'places';
export const NAVIGATION = [{ href: '/covers', label: 'COVERS' }, ...DESKS.map(d => ({ href: `/category/${d.slug}`, label: d.label }))];

export const FRANCHISES = [
  { value: 'new_guard', label: 'THE NEXT' },
  { value: 'elan_conversations', label: 'IN CONVERSATION' },
  { value: 'off_camera', label: 'OFF CAMERA' },
  { value: 'originals', label: 'ÉLAN ORIGINALS' },
  { value: 'culture_edit', label: 'THE CULTURE EDIT' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'the_edit', label: 'The Edit' },
  { value: 'after_dark', label: 'After Dark' },
  { value: 'elan_50', label: 'ÉLAN LISTS' },
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
  type: 'standard' | 'feature' | 'interview' | 'original';
  personalities?: Personality[];
  gallery?: MediaItem[];
  production?: Production;
  sponsorship?: { sponsored?: boolean; partner?: string; disclosure?: string };
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

export interface Production { videoUrl?: string; description?: string; credits?: string; duration?: string }
export interface Personality { id: string; slug: string; name: string; profession: string; bio: string; portrait: MediaItem; social?: { instagram?: string; website?: string } }
export interface Cover {
  id: string; slug: string; title: string; issueIdentifier: string; intro: string; publishedAt: string;
  artwork: MediaItem; personalities: Personality[]; variants?: { label: string; artwork: MediaItem; personalities?: Personality[] }[];
  story?: Article; gallery?: MediaItem[]; production?: Production; behindTheScenes?: string;
  relatedStories?: Article[]; isHomepage?: boolean; sponsorship?: { sponsored?: boolean; partner?: string; disclosure?: string };
}

export interface CategoryInfo {
  slug: CategorySlug;
  label: string;
  description: string;
  featuredTopic: string;
}
