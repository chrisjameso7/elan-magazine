import type { ContentBlock, MediaItem } from '@/types/editorial';
import EditorialImage from './EditorialImage';

export function PhotoCaption({ image }: { image: MediaItem }) {
  if (!image.caption && !image.credit) return null;
  return <figcaption className="photo-caption">{image.caption && <span>{image.caption}</span>}{image.credit && <span>{image.credit}</span>}</figcaption>;
}

export default function ArticleBody({ blocks }: { blocks: ContentBlock[] }) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case 'paragraph': return <p key={index} className={block.dropCap ? 'drop-cap' : undefined}>{block.text}</p>;
      case 'heading': return <div key={index}>{block.kicker && <span className="eyebrow">{block.kicker}</span>}<h2>{block.text}</h2></div>;
      case 'quote': return <figure className="reading-quote" key={index}><blockquote>“{block.quote}”</blockquote>{(block.attribution || block.context) && <figcaption>{[block.attribution, block.context].filter(Boolean).join(' — ')}</figcaption>}</figure>;
      case 'image': return <figure key={index}><EditorialImage image={block.image} sizes="(min-width: 720px) 680px, 100vw" /><PhotoCaption image={block.image} /></figure>;
      case 'image_duo': return <div key={index} className="reading-duo">{block.images.map((image, i) => <figure key={i}><EditorialImage image={image} sizes="(min-width: 720px) 330px, 45vw" /><PhotoCaption image={image} /></figure>)}</div>;
      case 'callout': return <aside key={index} className="reading-callout">{block.title && <h2>{block.title}</h2>}<p>{block.text}</p></aside>;
      case 'divider': return <hr key={index} className="reading-divider" />;
    }
  });
}
