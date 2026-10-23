import 'server-only';
import { cache } from 'react';
import { connection } from 'next/server';
import { readArticles } from './cmsReader';
import { toArticle, type StoredArticle } from './payload-adapter';

export { toArticle, toStoredArticle } from './payload-adapter';
export const getArticles = cache(async () => readArticles(process.env.DATABASE_URI, async () => {
  await connection(); // Live publishing must not be frozen into the production build.
  const [{ getPayload }, { default: config }] = await Promise.all([import('payload'), import('../payload.config')]);
  const cms = await getPayload({ config });
  const result = await cms.find({ collection: 'articles', depth: 1, pagination: false, sort: '-publishedAt',
    overrideAccess: false, where: { _status: { equals: 'published' } } });
  return result.docs.map((doc) => toArticle(doc as unknown as StoredArticle));
}));
