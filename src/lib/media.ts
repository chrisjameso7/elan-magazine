import type { MediaItem } from '../types/editorial';

export interface UploadedPhoto {
  id: string | number;
  url?: string | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
}
export type StoredMedia = Partial<MediaItem> & { asset?: UploadedPhoto | string | number | null };
export function hasMedia(value: unknown): boolean {
  const item = value as StoredMedia | null;
  return !!item && (!!item.asset || (!!item.url?.trim() && !!item.alt?.trim()));
}
export function resolveMedia(value: StoredMedia): MediaItem {
  const asset = typeof value?.asset === 'object' && value.asset ? value.asset : undefined;
  const url = asset?.url || value?.url;
  const alt = value?.alt || asset?.alt;
  if (!url || !alt) throw new Error('Populate the uploaded photo or provide an image URL and alt text.');
  return Object.fromEntries(Object.entries({ url, alt, caption: value.caption || asset?.caption,
    credit: value.credit || asset?.credit, aspectRatio: value.aspectRatio }).filter(([, item]) => item != null)) as unknown as MediaItem;
}
