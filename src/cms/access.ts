import type { Access, Where } from 'payload';
export function isOwner(
  user: { email?: string | null } | null | undefined,
): boolean {
  const owner = process.env.LUMIERE_OWNER_EMAIL?.trim().toLowerCase();
  return !!owner && user?.email?.trim().toLowerCase() === owner;
}
export const ownerOnly: Access = ({ req }) => isOwner(req.user);
export function releasedArticlesWhere(now = new Date()): Where {
  return {
    and: [
      { _status: { equals: 'published' } },
      { publishedAt: { less_than_equal: now.toISOString() } },
    ],
  };
}
export const readArticles: Access = ({ req }) =>
  isOwner(req.user) ? true : releasedArticlesWhere();
