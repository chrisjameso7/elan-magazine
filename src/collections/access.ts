import type { Access } from 'payload';

// Kept in server configuration so an account cannot promote itself by editing a field.
export const isHeadAdmin = (user: { email?: string | null } | null | undefined): boolean => {
  const owner = process.env.ELAN_HEAD_ADMIN_EMAIL?.trim().toLowerCase();
  return !!owner && user?.email?.trim().toLowerCase() === owner;
};
export const headAdminOnly: Access = ({ req }) => isHeadAdmin(req.user);
