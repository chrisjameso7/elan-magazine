import type { MetadataRoute } from "next";
import { getCMS } from "@/lib/cms";
import { getSections } from "@/lib/publication";
import { siteURL } from "@/lib/brand";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cms = await getCMS();
  const [articles, sections, authors] = await Promise.all([
    cms.find({
      collection: "articles",
      user: null,
      overrideAccess: false,
      draft: false,
      depth: 0,
      pagination: false,
      select: { slug: true, updatedAt: true },
    }),
    getSections(),
    cms.find({
      collection: "contributors",
      user: null,
      overrideAccess: false,
      depth: 0,
      pagination: false,
      select: { slug: true },
    }),
  ]);
  const origin = siteURL();
  return [
    ...[
      "/",
      "/about",
      "/contact",
      "/standards",
      "/privacy",
      "/terms",
      "/sections",
      "/the-index",
      "/called-it",
      "/put-us-on",
    ].map((path) => ({ url: new URL(path, origin).href })),
    ...articles.docs.map((a) => ({
      url: new URL(`/news/${a.slug}`, origin).href,
      lastModified: new Date(a.updatedAt),
    })),
    ...sections.map((s) => ({
      url: new URL(`/sections/${s.slug}`, origin).href,
    })),
    ...authors.docs.map((a) => ({
      url: new URL(`/authors/${a.slug}`, origin).href,
    })),
  ];
}
