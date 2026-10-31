/* eslint-disable @next/next/no-img-element -- Preserve CMS/S3 sources without changing deployment host configuration. Unsplash supplies responsive variants. */
import type { MediaItem, ArtDirection } from '@/types/editorial';
import { heroPosition } from '@/lib/editorial';

export default function EditorialImage({ image, direction, priority = false, sizes = '100vw', className = '' }: {
  image: MediaItem; direction?: ArtDirection; priority?: boolean; sizes?: string; className?: string;
}) {
  let srcSet: string | undefined;
  let src = image.url;
  try {
    const url = new URL(image.url);
    if (url.hostname === 'images.unsplash.com') {
      srcSet = [400, 640, 960, 1280, 1600].map(width => {
        const variant = new URL(url);
        variant.searchParams.set('w', String(width));
        variant.searchParams.set('q', '80');
        return `${variant.href} ${width}w`;
      }).join(', ');
      url.searchParams.set('w', '1280');
      src = url.href;
    }
  } catch { /* Relative CMS image sources remain valid. */ }
  return <img src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={image.alt}
    loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined}
    decoding="async" width={1200} height={900} style={{ objectPosition: heroPosition(direction) }}
    className={`editorial-image ${className}`} />;
}
