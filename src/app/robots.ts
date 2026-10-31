import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'https://elan-magazine.vercel.app';
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/editorial-preview'] }, sitemap: new URL('/sitemap.xml', origin).href };
}
