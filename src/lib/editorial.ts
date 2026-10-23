import type { ArtDirection, ContentBlock } from '@/types/editorial';
import type { CSSProperties } from 'react';

export const HEX_COLOR = /^#[0-9a-f]{6}$/i;
export function validHex(value: string | undefined, fallback: string): string {
  return value && HEX_COLOR.test(value) ? value : fallback;
}
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
export function foreground(hex: string): string {
  return luminance(hex) > 0.179 ? '#11100F' : '#FFFFFF';
}
function accentText(accent: string, bg: string): string {
  const a = luminance(accent);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5 ? accent : foreground(bg);
}
export function storyStyle(direction?: ArtDirection, background = '#F5F0E8'): CSSProperties {
  const accent = validHex(direction?.accentHex, '#6B2236');
  const bg = validHex(direction?.bgOverrideHex, background);
  return { '--story-accent': accent, '--story-accent-text': accentText(accent, bg), '--story-accent-ink': foreground(accent), '--story-bg': bg, '--story-ink': foreground(bg), '--story-focal': heroPosition(direction) } as CSSProperties;
}
export function heroPosition(direction?: ArtDirection): string {
  return `${clamp(direction?.heroFocalPoint.x)}% ${clamp(direction?.heroFocalPoint.y)}%`;
}
function clamp(value: number | undefined): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value!)) : 50;
}

// Change only the first paragraph and quote exposed by the compact composer.
// Preserve ordering, metadata, and every other block (including later paragraphs/quotes).
export function updateOpeningBlocks(content: ContentBlock[], text: string, quote: string, attribution: string): ContentBlock[] {
  const paragraphIndex = content.findIndex((b) => b.type === 'paragraph');
  const quoteIndex = content.findIndex((b) => b.type === 'quote');
  const result = content.map((block, index): ContentBlock => {
    if (index === paragraphIndex && block.type === 'paragraph') return { ...block, text };
    if (index === quoteIndex && block.type === 'quote') return { ...block, quote, attribution };
    return block;
  });
  if (paragraphIndex === -1 && text) result.unshift({ type: 'paragraph', text, dropCap: true });
  if (quoteIndex === -1 && quote) result.push({ type: 'quote', quote, attribution });
  return result;
}
