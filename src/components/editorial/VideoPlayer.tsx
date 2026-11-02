import { videoSource } from '@/lib/video';
import type { Production, MediaItem } from '@/types/editorial';

export default function VideoPlayer({
  production,
  title,
  poster,
}: {
  production?: Production;
  title: string;
  poster?: MediaItem;
}) {
  const source = videoSource(production?.videoUrl);
  if (!source) return null;
  return (
    <figure className="production-player">
      <div className="video-frame">
        {source.type === 'file' ? (
          <video
            controls
            playsInline
            preload="none"
            poster={poster?.url}
            aria-label={title}
          >
            <source src={source.url} />
            <a href={source.url}>Watch {title}</a>
          </video>
        ) : (
          <iframe
            src={source.url}
            title={title}
            loading="lazy"
            allow="fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
      {(production?.description || production?.credits) && (
        <figcaption className="production-caption">
          {production.description && <p>{production.description}</p>}
          {production.credits && (
            <p className="production-credits">{production.credits}</p>
          )}
        </figcaption>
      )}
    </figure>
  );
}
