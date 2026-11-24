export function isHostedRuntime(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(
    env.LUMIERE_HOSTING_PLATFORM === "cloudflare" ||
    env.VERCEL ||
    env.AWS_LAMBDA_FUNCTION_NAME ||
    (env.NETLIFY && env.CONTEXT !== "dev"),
  );
}
export function cmsServerURL(
  env: Record<string, string | undefined> = process.env,
): string {
  const candidate =
    env.CMS_SERVER_URL ||
    env.DEPLOY_PRIME_URL ||
    env.DEPLOY_URL ||
    env.URL ||
    (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : undefined);
  if (!candidate) {
    if (isHostedRuntime(env)) throw Error("A hosted CMS origin is required.");
    return "http://localhost:3200";
  }
  const url = new URL(candidate);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw Error(
      "CMS_SERVER_URL must be an HTTP(S) origin without credentials or a path.",
    );
  if (
    isHostedRuntime(env) &&
    (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
      url.protocol !== "https:")
  )
    throw Error("Hosted newsroom origins require public HTTPS.");
  return url.origin;
}
