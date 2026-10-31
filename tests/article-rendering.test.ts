import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ArticleBody from '../src/components/editorial/ArticleBody';
import type { ContentBlock } from '../src/types/editorial';

test('public reading template preserves all seven editorial block types and photo credits', () => {
  const image = { url: '/approved.jpg', alt: 'Approved portrait', caption: 'Original caption', credit: 'Original photographer' };
  const blocks: ContentBlock[] = [
    { type: 'paragraph', text: 'Original paragraph.' }, { type: 'heading', text: 'Original heading' },
    { type: 'quote', quote: 'Original quotation.', attribution: 'Original speaker' },
    { type: 'image', image }, { type: 'image_duo', images: [image, image] },
    { type: 'callout', title: 'Original note', text: 'Original callout.' }, { type: 'divider' },
  ];
  const html = renderToStaticMarkup(createElement(ArticleBody, { blocks }));
  for (const text of ['Original paragraph.', 'Original heading', 'Original quotation.', 'Original speaker', 'Original caption', 'Original photographer', 'Original note', 'Original callout.']) assert.ok(html.includes(text), text);
  assert.equal((html.match(/<img /g) || []).length, 3);
  assert.match(html, /<hr/);
  assert.equal(renderToStaticMarkup(createElement(ArticleBody, { blocks: [] })), '');
});
