import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  released,
  demonstrationContent,
  publicStories,
} from '../src/lib/visibility';
import { videoSource } from '../src/lib/video';
import { curateWorld } from '../src/lib/curation';
import { MOCK_ARTICLES } from '../src/data/mockArticles';
import type { Cover } from '../src/types/editorial';
test('release guards reject drafts, future dates, demo flags, and legacy mock credits', () => {
  const past = { _status: 'published', publishedAt: '2020-01-01' };
  assert.equal(released(past), true);
  assert.equal(released({ ...past, _status: 'draft' }), false);
  assert.equal(released({ ...past, publishedAt: '2099-01-01' }), false);
  assert.equal(released({ ...past, isDevMock: true }), false);
  assert.equal(demonstrationContent({ credit: '[Development Mock]' }), true);
  assert.deepEqual(publicStories(MOCK_ARTICLES), []);
});
test('video embeds allow supported HTTPS media without executable URLs', () => {
  assert.equal(videoSource('javascript:alert(1)'), undefined);
  assert.equal(videoSource('https://example.com/not-video'), undefined);
  assert.equal(videoSource('http://example.com/film.mp4'), undefined);
  assert.equal(videoSource('https://example.com/film.mp4')?.type, 'file');
  assert.equal(
    videoSource('https://youtu.be/abcdefghijk')?.url,
    'https://www.youtube-nocookie.com/embed/abcdefghijk',
  );
  assert.equal(videoSource('https://vimeo.com/12345')?.type, 'embed');
});
test('cover priority and section curation reserve every story once', () => {
  const stories = MOCK_ARTICLES.map((a, i) => ({ ...a, id: String(i) }));
  const result = curateWorld(stories, [
    { isHomepage: true, story: stories[0] } as Cover,
  ]);
  assert.ok(result.cover);
  assert.equal(result.lead, undefined);
  const ids = [
    ...result.next,
    ...result.latest,
    ...result.originals,
    ...result.entertainment,
    ...result.culture,
    ...result.edit,
  ].map((a) => a.id);
  assert.ok(!ids.includes('0'));
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(curateWorld([], []).latest, []);
});
