/* eslint-disable @next/next/no-img-element -- The review uses Unsplash responsive CDN variants; final editorial media delivery is a later milestone. */
import type { PreviewPhoto } from '@/lib/preview-media';
export default function PreviewImage({
  photo,
  priority = false,
  sizes = '100vw',
  className = '',
}: {
  photo: PreviewPhoto;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const source = (width: number) =>
    `${photo.url}?auto=format&fit=crop&w=${width}&q=85`;
  return (
    <img
      className={`preview-image ${className}`}
      src={source(1200)}
      srcSet={[400, 640, 960, 1280, 1800]
        .map((w) => `${source(w)} ${w}w`)
        .join(', ')}
      sizes={sizes}
      alt={photo.alt}
      width={1600}
      height={1000}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      style={{ objectPosition: photo.position }}
    />
  );
}
