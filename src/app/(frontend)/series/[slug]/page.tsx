import { notFound } from 'next/navigation';
import { FRANCHISES } from '@/types/editorial';
import { getArticles } from '@/lib/cmsAdapter';
import StoryArchive from '@/components/editorial/StoryArchive';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const series = FRANCHISES.find((f) => f.value === slug);
  return {
    title: series ? `${series.label} — ÉLAN` : 'Series not found — ÉLAN',
    alternates: { canonical: `/series/${slug}` },
  };
}
export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const series = FRANCHISES.find((f) => f.value === slug);
  if (!series) notFound();
  return (
    <StoryArchive
      title={series.label}
      eyebrow="An ÉLAN editorial series"
      intro="A recurring point of view on the personalities and work shaping culture."
      stories={(await getArticles()).filter(
        (a) =>
          a.franchise === series.value ||
          (series.value === 'the_edit' && a.franchise === 'culture_edit'),
      )}
    />
  );
}
