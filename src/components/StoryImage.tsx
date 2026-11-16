/* eslint-disable @next/next/no-img-element -- Payload derivatives preserve access-controlled media delivery. */
import { mediaURL } from "@/lib/media-url";
import type { Media } from "@/cms/payload-types";
export default function StoryImage({
  media,
  priority = false,
  sizes = "100vw",
  className = "",
}: {
  media: Media;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const variants = [
    media.sizes?.thumbnail,
    media.sizes?.story,
    media.sizes?.hero,
  ].filter((s): s is NonNullable<typeof s> => !!s?.url && !!s.width);
  const srcSet = variants
    .map((s) => `${mediaURL(s.url)} ${s.width}w`)
    .join(", ");
  if (!media.url) return null;
  return (
    <img
      src={mediaURL(media.url)}
      srcSet={srcSet || undefined}
      sizes={srcSet ? sizes : undefined}
      alt={media.alt}
      width={media.width || 1600}
      height={media.height || 900}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      decoding="async"
    />
  );
}
