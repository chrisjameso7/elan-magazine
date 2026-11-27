import "server-only";
import { cache } from "react";
import { getCMS } from "./cms";
import type { Discovery, IndexEntry } from "@/cms/payload-types";

/** The most recent week whose entries are all published, ranked. */
export const getLatestIndex = cache(async (limit = 50) => {
  const cms = await getCMS();
  const recent = await cms.find({
    collection: "index-entries",
    user: null,
    overrideAccess: false,
    depth: 0,
    limit: 200,
    sort: "-week",
    select: { week: true },
  });
  const weeks = [...new Set(recent.docs.map((d) => d.week))];
  for (const week of weeks) {
    const unpublished = await cms.count({
      collection: "index-entries",
      overrideAccess: true,
      where: { and: [{ week: { equals: week } }, { isPublished: { not_equals: true } }] },
    });
    if (unpublished.totalDocs) continue;
    const result = await cms.find({
      collection: "index-entries",
      user: null,
      overrideAccess: false,
      depth: 1,
      limit,
      sort: "rank",
      where: { week: { equals: week } },
    });
    return { week, entries: result.docs };
  }
  return { week: null, entries: [] as IndexEntry[] };
});

export const getDiscoveries = cache(async (limit = 24) => {
  const cms = await getCMS();
  return (
    await cms.find({
      collection: "discoveries",
      user: null,
      overrideAccess: false,
      depth: 1,
      limit,
      sort: "-firstCoveredAt",
    })
  ).docs as Discovery[];
});

export function movementLabel(entry: Pick<IndexEntry, "movement" | "places">) {
  const n = entry.places ?? 0;
  const places = `${n} ${n === 1 ? "place" : "places"}`;
  switch (entry.movement) {
    case "up":
      return { text: n ? `▲ ${n}` : "▲", label: n ? `Up ${places}` : "Up" };
    case "down":
      return { text: n ? `▼ ${n}` : "▼", label: n ? `Down ${places}` : "Down" };
    case "same":
      return { text: "—", label: "No change" };
    default:
      return { text: "NEW", label: "New entry" };
  }
}

export const indexCategories: Record<IndexEntry["category"], string> = {
  music: "Music",
  "film-tv": "Film & TV",
  internet: "Internet",
  style: "Style",
  books: "Books",
  art: "Art & design",
  sport: "Sport",
  gaming: "Gaming",
  culture: "Culture",
};

export function formatDate(value: string, month: "long" | "short" = "long") {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

/** ISO week number, used as the issue label for The Index. */
export function isoWeek(value: string) {
  const date = new Date(value);
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export async function getIndexPage() {
  const { indexPageDefaults } = await import("@/cms/globals/index-page");
  try {
    const { getCMS } = await import("@/lib/cms");
    const cms = await getCMS();
    const page = await cms.findGlobal({ slug: "index-page", depth: 0, overrideAccess: false, user: null });
    return {
      intro: page.intro || indexPageDefaults.intro,
      rules: (page.rules || indexPageDefaults.rules).split("\n").map((r) => r.trim()).filter(Boolean),
      weekNote: page.weekNote?.trim() || "",
    };
  } catch {
    return { intro: indexPageDefaults.intro, rules: indexPageDefaults.rules.split("\n"), weekNote: "" };
  }
}
