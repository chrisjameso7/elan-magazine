import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateOpeningBlocks, storyStyle } from '../src/lib/editorial';
import { toArticle, toStoredArticle } from '../src/lib/payload-adapter';
import { DESKS, FRANCHISES, type ContentBlock } from '../src/types/editorial';
import { MOCK_ARTICLES } from '../src/data/mockArticles';
import { contentBlocks, media as mediaField } from '../src/collections/fields';
import { Articles } from '../src/collections/Articles';

const media = { url: '/photo.jpg', alt: 'Portrait', credit: 'Photographer' };
const content: ContentBlock[] = [
  { type: 'heading', text: 'Before the opening', kicker: 'Context' },
  { type: 'paragraph', text: 'Opening', dropCap: false },
  { type: 'image', image: media },
  { type: 'quote', quote: 'First quote', attribution: 'Subject', context: 'Interview' },
  { type: 'paragraph', text: 'Second paragraph' },
  { type: 'image_duo', images: [media, media] },
  { type: 'quote', quote: 'Second quote' },
  { type: 'callout', title: 'Note', text: 'Keep this' },
  { type: 'divider' },
];
test('saving the opening preserves mixed block order, later text, and metadata', () => {
  const before = structuredClone(content);
  const saved = updateOpeningBlocks(content, 'Edited opening', 'Edited quote', 'New attribution');
  assert.equal(saved.length, content.length);
  assert.deepEqual(saved.map((b) => b.type), content.map((b) => b.type));
  assert.deepEqual(saved[1], { ...content[1], text: 'Edited opening' });
  assert.deepEqual(saved[3], { ...content[3], quote: 'Edited quote', attribution: 'New attribution' });
  for (const i of [0, 2, 4, 5, 6, 7, 8]) assert.deepEqual(saved[i], content[i]);
  assert.deepEqual(content, before);
});
test('missing opening blocks are added only when populated', () => {
  assert.deepEqual(updateOpeningBlocks([], '', '', ''), []);
  assert.deepEqual(updateOpeningBlocks([], 'Opening', 'Quote', 'A'), [{ type: 'paragraph', text: 'Opening', dropCap: true }, { type: 'quote', quote: 'Quote', attribution: 'A' }]);
});
test('six desks and six franchises remain canonical', () => {
  assert.deepEqual(DESKS.map((d) => d.slug), ['culture', 'people', 'entertainment', 'style', 'life', 'places']);
  assert.equal(FRANCHISES.length, 6);
  for (const article of MOCK_ARTICLES) assert.ok(DESKS.some((desk) => desk.slug === article.category));
});
test('Payload conversion roundtrips every block and populated author', () => {
  const article = { ...MOCK_ARTICLES[0], content };
  const stored = toStoredArticle(article);
  assert.equal(stored.author, article.author.id);
  assert.throws(() => toArticle(stored), /Populate/);
  assert.deepEqual(toArticle({ ...stored, author: article.author }), article);
});
test('story colors, contrast, background, and focal point are safe', () => {
  const style = storyStyle({ accentHex: '#FFF0A0', bgOverrideHex: '#11100F', heroFocalPoint: { x: -5, y: 120 } });
  assert.equal(style.backgroundColor, undefined);
  assert.equal((style as Record<string, unknown>)['--story-focal'], '0% 100%');
  assert.equal((style as Record<string, unknown>)['--story-accent-ink'], '#11100F');
  assert.equal((style as Record<string, unknown>)['--story-bg'], '#11100F');
  assert.equal((storyStyle({ accentHex: 'invalid', heroFocalPoint: { x: 50, y: 50 } }) as Record<string, unknown>)['--story-accent'], '#6B2236');
});

test('CMS supports all block types and permits absent optional portraits', async () => {
  assert.deepEqual(contentBlocks.map((block) => block.slug), ['paragraph', 'heading', 'quote', 'image', 'image_duo', 'callout', 'divider']);
  const field = mediaField('secondaryPortrait');
  assert.equal(field.type, 'group');
  if (field.type !== 'group' || typeof field.validate !== 'function') throw new Error('Missing media validator');
  assert.equal(await field.validate({}, {} as never), true);
  assert.equal(await field.validate(media, {} as never), true);
  assert.equal(typeof await field.validate({ url: '/photo.jpg' }, {} as never), 'string');
});

test('interview validation applies only to interview stories', async () => {
  const field = Articles.fields.find((field) => 'name' in field && field.name === 'interview');
  if (field?.type !== 'group' || typeof field.validate !== 'function') throw new Error('Missing interview validator');
  assert.equal(await field.validate({}, { siblingData: { type: 'standard' } } as never), true);
  assert.equal(typeof await field.validate({}, { siblingData: { type: 'interview' } } as never), 'string');
  assert.equal(await field.validate(MOCK_ARTICLES.find((article) => article.interview)?.interview, { siblingData: { type: 'interview' } } as never), true);
});


test('unset DATABASE_URI serves mocks without initializing Payload', async () => {
  const { readArticles } = await import('../src/lib/cmsReader');
  const fail = async () => { throw new Error('Database should not be touched'); };
  assert.equal(await readArticles(undefined, fail), MOCK_ARTICLES);
  assert.equal(await readArticles('  ', fail), MOCK_ARTICLES);
  assert.deepEqual(await readArticles('postgres://configured', async () => []), []);
  await assert.rejects(readArticles('postgres://configured', fail), /Database should not be touched/);
});

test('adapter strips native nested row IDs before copying an interview', () => {
  const source = MOCK_ARTICLES.find((article) => article.interview)!;
  const stored = toStoredArticle(source);
  const native = { ...stored, author: source.author, createdAt: 'native-metadata',
    interview: { ...source.interview!, qas: source.interview!.qas.map((qa) => ({ ...qa, id: 'native-qa-id' })) },
    coverImage: { ...source.coverImage, id: 'native-media-id' } };
  const article = toArticle(native);
  assert.ok(!('createdAt' in article));
  assert.ok(!('id' in article.coverImage));
  assert.ok(article.interview!.qas.every((qa) => !('id' in qa)));
  assert.deepEqual(toStoredArticle(article).interview, source.interview);
});
