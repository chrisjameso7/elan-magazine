import { getPayload } from 'payload';
import config from '../src/payload.config';
import { MOCK_ARTICLES, MOCK_AUTHORS } from '../src/data/mockArticles';
import { toStoredArticle } from '../src/lib/payload-adapter';
if (!process.env.DATABASE_URI) throw new Error('DATABASE_URI is required for seeding.');
const cms = await getPayload({ config });
try {
  if (process.env.ELAN_EDITOR_EMAIL && process.env.ELAN_EDITOR_PASSWORD) {
    const existing = await cms.find({ collection: 'users', limit: 1, overrideAccess: true });
    if (!existing.totalDocs) await cms.create({ collection: 'users', data: { email: process.env.ELAN_EDITOR_EMAIL, password: process.env.ELAN_EDITOR_PASSWORD }, overrideAccess: true });
  }
  for (const author of Object.values(MOCK_AUTHORS)) {
    const existing = await cms.find({ collection: 'authors', where: { id: { equals: author.id } }, limit: 1, overrideAccess: true });
    if (!existing.totalDocs) await cms.create({ collection: 'authors', data: author, overrideAccess: true });
  }
  for (const article of MOCK_ARTICLES) {
    const existing = await cms.find({ collection: 'articles', where: { slug: { equals: article.slug } }, limit: 1, overrideAccess: true });
    if (!existing.totalDocs) await cms.create({ collection: 'articles', data: { ...toStoredArticle(article), artDirection: article.artDirection ?? { accentHex: '#6B2236', heroFocalPoint: { x: 50, y: 50 } }, _status: 'published', isDevMock: false }, overrideAccess: true });
  }
  console.log('Seed complete: 4 contributors and 10 stories; existing records were preserved. The six desks and six franchises are built into the schema.');
} finally { await cms.destroy(); }
