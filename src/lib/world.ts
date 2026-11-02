import 'server-only';
import { cache } from 'react';
import type { Cover, Personality } from '@/types/editorial';
import { getCMS, getArticles } from './cmsAdapter';
import { toPersonality } from './personality-adapter';
import { resolveMedia, type StoredMedia } from './media';
import { publicReleaseWhere } from '../collections/access';
import { released } from './visibility';

export const getWorld = cache(
  async (): Promise<{ covers: Cover[]; personalities: Personality[] }> => {
    if (!process.env.DATABASE_URI) return { covers: [], personalities: [] };
    const cms = await getCMS();
    const where = publicReleaseWhere();
    const [coverRows, peopleRows, stories] = await Promise.all([
      cms.find({
        collection: 'covers',
        depth: 3,
        pagination: false,
        overrideAccess: false,
        where,
        sort: '-publishedAt',
      }),
      cms.find({
        collection: 'personalities',
        depth: 1,
        pagination: false,
        overrideAccess: false,
        where,
      }),
      getArticles(),
    ]);
    const personMap = new Map(
      peopleRows.docs
        .filter((p) => released(p))
        .map((p) => {
          const person = toPersonality(p)!;
          return [person.id, person];
        }),
    );
    const storyMap = new Map(stories.map((a) => [a.id, a]));
    const people = (values: unknown) =>
      (Array.isArray(values) ? values : [])
        .map((value) =>
          personMap.get(
            String(typeof value === 'object' && value ? value.id : value),
          ),
        )
        .filter((p): p is Personality => !!p);
    const covers: Cover[] = coverRows.docs
      .filter((row) => released(row))
      .flatMap((row) => {
        const subjects = people(row.personalities);
        const storyId =
          typeof row.story === 'object' && row.story ? row.story.id : row.story;
        const story = storyMap.get(String(storyId));
        if (!subjects.length || !story) return [];
        return [
          {
            id: String(row.id),
            slug: row.slug,
            title: row.title,
            issueIdentifier: row.issueIdentifier,
            intro: row.intro,
            publishedAt: row.publishedAt,
            artwork: resolveMedia(row.artwork as StoredMedia),
            personalities: subjects,
            story,
            variants: row.variants?.map((v) => ({
              label: v.label,
              artwork: resolveMedia(v.artwork as StoredMedia),
              personalities: people(v.personalities),
            })),
            gallery: row.gallery?.map((v) => resolveMedia(v as StoredMedia)),
            production: row.production || undefined,
            behindTheScenes: row.behindTheScenes || undefined,
            relatedStories: row.relatedStories
              ?.map((value) =>
                storyMap.get(
                  String(typeof value === 'object' && value ? value.id : value),
                ),
              )
              .filter((a): a is NonNullable<typeof a> => !!a),
            isHomepage: row.isHomepage || false,
            sponsorship: row.sponsorship || undefined,
          } as Cover,
        ];
      });
    // A standalone personality is visible only when it has released editorial coverage.
    const referenced = new Set([
      ...covers.flatMap((c) =>
        [
          ...c.personalities,
          ...(c.variants?.flatMap((v) => v.personalities || []) || []),
        ].map((p) => p.id),
      ),
      ...stories.flatMap((a) => a.personalities?.map((p) => p.id) || []),
    ]);
    return {
      covers,
      personalities: [...personMap.values()].filter((p) =>
        referenced.has(p.id),
      ),
    };
  },
);
