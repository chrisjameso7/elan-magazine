export const brand = {
  name: 'The Index',
  fullName: 'The Index Magazine by Lumière',
  tagline: 'Who’s next, first.',
  operator:'Lumiere Media and Entertainment Technologies',
  founder:'Chris James',
  contactEmail:'contact@lumiereindex.com',
  privacyEmail:'privacy@lumiereindex.com',
  domain: 'lumiereindex.com',
  description: 'A culture magazine of criticism, personal essays and discovery — finding who’s next before everyone else.',
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
