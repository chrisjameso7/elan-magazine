import type { Personality } from '../types/editorial';
import { resolveMedia, type StoredMedia } from './media';

export function toPersonality(value: unknown): Personality | undefined {
  if (!value || typeof value !== 'object') return;
  const person = value as Personality & { portrait: StoredMedia };
  if (!person.name || !person.slug || !person.bio) return;
  return {
    id: String(person.id),
    slug: person.slug,
    name: person.name,
    profession: person.profession,
    bio: person.bio,
    portrait: resolveMedia(person.portrait),
    ...(person.social
      ? {
          social: {
            instagram: person.social.instagram,
            website: person.social.website,
          },
        }
      : {}),
  };
}
