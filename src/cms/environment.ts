export function cmsEnvironment(
  env: Record<string, string | undefined> = process.env,
) {
  const uri = env.DATABASE_URI?.trim();
  if (!uri) throw new Error("DATABASE_URI is required for CMS commands.");
  const parsed = new URL(uri);
  if (!["postgres:", "postgresql:"].includes(parsed.protocol))
    throw new Error("DATABASE_URI must be a PostgreSQL connection string.");
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (!local) {
    const allowedHost = env.LUMIERE_DATABASE_HOST?.trim();
    if (
      env.LUMIERE_DATABASE_MODE !== "hosted" ||
      !allowedHost ||
      parsed.hostname !== allowedHost ||
      !/\.pooler\.supabase\.com$|\.supabase\.co$/.test(parsed.hostname)
    )
      throw new Error(
        "Hosted databases require explicit mode and an approved Supabase host.",
      );
    if (!parsed.password)
      throw new Error("Hosted database credentials are required.");
  }
  if (env.VERCEL && local)
    throw new Error("A deployment cannot use a local database.");
  const secret = env.PAYLOAD_SECRET?.trim();
  if (!secret || secret.length < 32)
    throw new Error("PAYLOAD_SECRET must contain at least 32 characters.");
  const owner = env.LUMIERE_OWNER_EMAIL?.trim().toLowerCase();
  if (!owner || !/^\S+@\S+\.\S+$/.test(owner))
    throw new Error("LUMIERE_OWNER_EMAIL is required.");
  return { uri, secret, owner };
}
