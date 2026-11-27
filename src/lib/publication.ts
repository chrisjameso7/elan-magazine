import "server-only";
import { cache } from "react";
import type { Where } from "payload";
import { getCMS } from "./cms";
import type { Article, Contributor, Media, Section } from "@/cms/payload-types";
export type PublicStory = Pick<
  Article,
  | "id"
  | "title"
  | "slug"
  | "standfirst"
  | "hero"
  | "section"
  | "contributors"
  | "publishedAt"
  | "updatedAt"
  | "format"
  | "isFeatured"
  | "verdict"
>;
export function populated<T>(value: unknown): T | undefined {
  return typeof value === "object" && value ? (value as T) : undefined;
}
export const getSections = cache(async () => {
  const cms = await getCMS();
  return (
    await cms.find({
      collection: "sections",
      user: null,
      overrideAccess: false,
      depth: 0,
      pagination: false,
      sort: ["navOrder", "name"],
    })
  ).docs;
});
export async function storyList({
  q = "",
  section,
  contributor,
  format,
  page = 1,
  limit = 12,
  featured = false,
  reviewsOnly = false,
}: {
  q?: string;
  section?: number;
  contributor?: number;
  format?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  reviewsOnly?: boolean;
} = {}) {
  const cms = await getCMS();
  const where: Where = {
    and: [
      ...(q
        ? [{ or: [{ title: { like: q } }, { standfirst: { like: q } }] }]
        : []),
      ...(section ? [{ section: { equals: section } }] : []),
      ...(contributor ? [{ contributors: { contains: contributor } }] : []),
      ...(format ? [{ format: { equals: format } }] : []),
      ...(featured ? [{ isFeatured: { equals: true } }] : []),
      ...(reviewsOnly ? [{ verdict: { exists: true } }] : []),
    ],
  };
  const result = await cms.find({
    collection: "articles",
    user: null,
    overrideAccess: false,
    draft: false,
    where,
    depth: 2,
    sort: "-publishedAt",
    page,
    limit,
    select: {
      id: true,
      title: true,
      slug: true,
      standfirst: true,
      hero: true,
      section: true,
      contributors: true,
      publishedAt: true,
      updatedAt: true,
      format: true,
      isFeatured: true,
      verdict: true,
    },
  });
  return { ...result, docs: result.docs as PublicStory[] };
}
export const getPublishedArticle = cache(async (slug: string) => {
  const cms = await getCMS();
  return (
    await cms.find({
      collection: "articles",
      user: null,
      overrideAccess: false,
      draft: false,
      depth: 2,
      limit: 1,
      where: { slug: { equals: slug } },
    })
  ).docs[0];
});
export const getPublishedArticles = cache(async () => {
  const cms = await getCMS();
  return (
    await cms.find({
      collection: "articles",
      user: null,
      overrideAccess: false,
      draft: false,
      depth: 2,
      pagination: false,
      sort: "-publishedAt",
    })
  ).docs;
});
export const getContributor = cache(async (slug: string) => {
  const cms = await getCMS();
  return (
    await cms.find({
      collection: "contributors",
      user: null,
      overrideAccess: false,
      depth: 1,
      limit: 1,
      where: { slug: { equals: slug } },
    })
  ).docs[0];
});
export const getSection = cache(async (slug: string) =>
  (await getSections()).find((s) => s.slug === slug),
);
export type { Article, Contributor, Media, Section };
