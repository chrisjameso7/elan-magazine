import { APIError, type CollectionBeforeChangeHook } from "payload";

/**
 * Store every entry's week as noon UTC on its calendar day in Lagos, so entries
 * picked at different times on the same Thursday still belong to one list.
 */
export function normalizeWeek(value: unknown): string | undefined {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return `${day}T12:00:00.000Z`;
}

const nameKey = (name: unknown) =>
  String(name ?? "").normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");

/** Compare with last week's rank. Unlisted last week means a new entry. */
export function movementFrom(rank: number, previousRank?: number) {
  if (!previousRank) return { movement: "new" as const, places: null };
  const change = previousRank - rank;
  if (change > 0) return { movement: "up" as const, places: change };
  if (change < 0) return { movement: "down" as const, places: -change };
  return { movement: "same" as const, places: null };
}

export const indexEntryRules: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const merged = { ...(originalDoc || {}), ...data } as Record<string, unknown>;
  const week = normalizeWeek(merged.week);
  if (!week) throw new APIError("Choose the Thursday this list is published.", 400);
  data.week = week;
  const rank = Number(merged.rank);
  const id = originalDoc?.id;

  const clash = await req.payload.find({
    collection: "index-entries",
    req,
    overrideAccess: true,
    depth: 0,
    limit: 1,
    select: { name: true },
    where: {
      and: [
        { week: { equals: week } },
        { rank: { equals: rank } },
        ...(id ? [{ id: { not_equals: id } }] : []),
      ],
    },
  });
  if (clash.docs[0])
    throw new APIError(
      `#${rank} is already taken this week by ${clash.docs[0].name}. Change one of them first.`,
      400,
    );

  const previous = await req.payload.find({
    collection: "index-entries",
    req,
    overrideAccess: true,
    depth: 0,
    limit: 1,
    sort: "-week",
    select: { week: true },
    where: { week: { less_than: week } },
  });
  const previousWeek = previous.docs[0]?.week;
  let previousRank: number | undefined;
  if (previousWeek) {
    const lastList = await req.payload.find({
      collection: "index-entries",
      req,
      overrideAccess: true,
      depth: 0,
      limit: 100,
      pagination: false,
      select: { name: true, rank: true },
      where: { week: { equals: previousWeek } },
    });
    previousRank = lastList.docs.find((e) => nameKey(e.name) === nameKey(merged.name))?.rank;
  }
  Object.assign(data, movementFrom(rank, previousRank));
  return data;
};
