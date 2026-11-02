import { getArticles } from '@/lib/cmsAdapter';
import StoryArchive from '@/components/editorial/StoryArchive';
import { videoSource } from '@/lib/video';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'ÉLAN Originals — Films & Conversations',
  description: 'Original films, video interviews, and productions from ÉLAN.',
  alternates: { canonical: '/originals' },
};
export default async function OriginalsPage() {
  return (
    <StoryArchive
      title="ÉLAN Originals"
      eyebrow="The production studio"
      intro="Personalities in their own words. Creative work, beyond the frame."
      stories={(await getArticles()).filter(
        (a) => a.type === 'original' && videoSource(a.production?.videoUrl),
      )}
    />
  );
}
