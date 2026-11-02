import type { MediaItem } from '@/types/editorial';
import EditorialImage from './EditorialImage';
import { PhotoCaption } from './ArticleBody';

export default function Gallery({
  images,
  label = 'Photography',
}: {
  images?: MediaItem[];
  label?: string;
}) {
  if (!images?.length) return null;
  return (
    <section className="campaign-gallery" aria-label={label}>
      <div className="section-heading">
        <h2>{label}</h2>
        <span className="eyebrow">The visual story</span>
      </div>
      <div className="gallery-layout">
        {images.map((image, index) => (
          <figure key={`${image.url}-${index}`}>
            <EditorialImage
              image={image}
              sizes="(min-width: 900px) 50vw, 100vw"
            />
            <PhotoCaption image={image} />
          </figure>
        ))}
      </div>
    </section>
  );
}
