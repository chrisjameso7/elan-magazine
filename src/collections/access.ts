import type { Access, Where } from 'payload';

// Kept in server configuration so an account cannot promote itself by editing a field.
export const isHeadAdmin = (
  user: { email?: string | null } | null | undefined,
): boolean => {
  const owner = process.env.ELAN_HEAD_ADMIN_EMAIL?.trim().toLowerCase();
  return !!owner && user?.email?.trim().toLowerCase() === owner;
};
export const headAdminOnly: Access = ({ req }) => isHeadAdmin(req.user);
export const publicReleaseWhere = (): Where => ({
  and: [
    { _status: { equals: 'published' } },
    { publishedAt: { less_than_equal: new Date().toISOString() } },
    { isDevMock: { not_equals: true } },
  ],
});
export const publicEditorialRead: Access = ({ req }) =>
  isHeadAdmin(req.user) ? true : publicReleaseWhere();
