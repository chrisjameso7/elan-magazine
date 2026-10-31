import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homepageStories, storyHref, profileHref } from '../src/lib/presentation';
import { MOCK_ARTICLES } from '../src/data/mockArticles';

test('homepage preserves editorial lead and curates only explicitly marked emerging voices', () => {
  const snapshot = JSON.stringify(MOCK_ARTICLES);
  const result = homepageStories(MOCK_ARTICLES);
  assert.equal(result.lead?.id, MOCK_ARTICLES.find(a => a.isLead)?.id);
  assert.ok(result.wave.every(a => a.franchise === 'new_guard'));
  assert.equal(result.feature?.type, 'interview');
  const selected = [result.lead, ...result.wave, ...result.latest, result.feature, ...result.edit].filter(Boolean);
  assert.equal(new Set(selected.map(a => a!.id)).size, selected.length);
  assert.equal(JSON.stringify(MOCK_ARTICLES), snapshot);
});

test('empty and sparse publications do not invent or repeat stories', () => {
  const empty = homepageStories([]);
  assert.equal(empty.lead, undefined);
  assert.deepEqual(empty.wave, []);
  const single = homepageStories([MOCK_ARTICLES[0]]);
  assert.equal(single.lead, MOCK_ARTICLES[0]);
  assert.equal(single.feature, undefined);
  assert.deepEqual(single.latest, []);
  assert.deepEqual(single.edit, []);
  assert.deepEqual(single.wave, []);
});

test('editorial links retain the existing format-specific URLs', () => {
  for (const article of MOCK_ARTICLES) {
    assert.equal(storyHref(article), `/${article.type === 'standard' ? 'article' : article.type}/${article.slug}`);
  }
});

test('subject links support supplied handles and URLs without linking placeholder sites or executable schemes', () => {
  assert.equal(profileHref('@test_person', 'instagram'), 'https://www.instagram.com/test_person/');
  assert.equal(profileHref('https://example.com/work'), 'https://example.com/work');
  assert.equal(profileHref('portfolio.mock'), undefined);
  assert.equal(profileHref('javascript:alert(1)'), undefined);
});
