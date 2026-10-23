import type { Field, Block, TextField } from 'payload';
import { HEX_COLOR } from '../lib/editorial';
export const text = (name: string, required = false): TextField => ({ name, type: 'text', required });
export const mediaFields = (required = true): Field[] => [
  text('url', required), text('alt', required), text('caption'), text('credit'),
  { name: 'aspectRatio', type: 'select', enumName: 'media_aspect_ratio', options: ['landscape', 'portrait', 'square', 'wide'] },
];
export const media = (name: string, required = false): Field => ({
  name, type: 'group', required, fields: mediaFields(false),
  validate: (value: unknown) => {
    const item = value as Record<string, unknown> | null | undefined;
    if (!required && (!item || !Object.values(item).some(Boolean))) return true;
    return (typeof item?.url === 'string' && !!item.url.trim() && typeof item.alt === 'string' && !!item.alt.trim()) || 'Provide an image URL and alt text.';
  },
});
export const hex = (name: string, required = false): TextField => ({
  name, type: 'text', required,
  validate: (value: unknown) => value == null || value === '' || (typeof value === 'string' && HEX_COLOR.test(value)) || 'Use a six-digit hex color (#RRGGBB).',
});
export const contentBlocks: Block[] = [
  { slug: 'paragraph', fields: [{ name: 'text', type: 'textarea', required: true }, { name: 'dropCap', type: 'checkbox' }] },
  { slug: 'heading', fields: [text('text', true), text('kicker')] },
  { slug: 'quote', fields: [{ name: 'quote', type: 'textarea', required: true }, text('attribution'), text('context')] },
  { slug: 'image', fields: [media('image', true)] },
  { slug: 'image_duo', fields: [{ name: 'images', type: 'array', required: true, minRows: 2, maxRows: 2, fields: mediaFields() }] },
  { slug: 'callout', fields: [text('title'), { name: 'text', type: 'textarea', required: true }] },
  { slug: 'divider', fields: [] },
];
