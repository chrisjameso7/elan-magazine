export function cmsEnvironment(
  env: Record<string, string | undefined> = process.env,
) {
  const uri = env.DATABASE_URI?.trim();
  if (!uri) throw new Error('DATABASE_URI is required for CMS commands.');
  const parsed = new URL(uri);
  if (!['postgres:', 'postgresql:'].includes(parsed.protocol))
    throw new Error('DATABASE_URI must be a PostgreSQL connection string.');
  if (!['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname))
    throw new Error('Phase 1 CMS commands require an isolated local database.');
  const secret = env.PAYLOAD_SECRET?.trim();
  if (!secret || secret.length < 32)
    throw new Error('PAYLOAD_SECRET must contain at least 32 characters.');
  const owner = env.LUMIERE_OWNER_EMAIL?.trim().toLowerCase();
  if (!owner || !/^\S+@\S+\.\S+$/.test(owner))
    throw new Error('LUMIERE_OWNER_EMAIL is required.');
  return { uri, secret, owner };
}
