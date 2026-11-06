export const brand = {
  name: 'Lumière Index',
  tagline: 'News that matters.',
  domain: 'lumiereindex.com',
  description: 'An entertainment and pop-culture newsroom.',
} as const;

export function siteURL(value = process.env.NEXT_PUBLIC_SITE_URL): URL {
  const url = new URL(value || `https://${brand.domain}`);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials.',
    );
  }
  if (url.pathname !== '/' || url.search || url.hash)
    throw new Error('NEXT_PUBLIC_SITE_URL must be an origin.');
  return url;
}
