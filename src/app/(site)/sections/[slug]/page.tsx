import { notFound } from "next/navigation";
import { getSection, storyList } from "@/lib/publication";
import { editorialNavigation } from "@/lib/navigation";
import StoryArchive from "@/components/StoryArchive";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = await getSection(slug);
  const configured = editorialNavigation.find((item) => item.slug === slug);
  return {
    title: s?.name || configured?.label || "Section not found",
    description: s?.description,
    alternates: { canonical: `/sections/${slug}` },
  };
}
export default async function SectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const s = await getSection(slug);
  const configured = editorialNavigation.find(
    (item) => item.slug === slug && item.href.startsWith("/sections/"),
  );
  if (!s && !configured) notFound();
  const query = await searchParams;
  const page = Math.max(1, Math.min(10000, Number(query.page) || 1));
  // Features is an existing article format, so no duplicate category model is needed.
  const stories =
    slug === "features"
      ? await storyList({ format: "feature", page })
      : s
        ? await storyList({ section: s.id, page })
        : { docs: [], totalPages: 1 };
  if (page > stories.totalPages && page > 1) notFound();
  return (
    <StoryArchive
      kicker="Section"
      title={configured?.label || s!.name}
      intro={s?.description || undefined}
      stories={stories.docs}
      page={page}
      totalPages={stories.totalPages}
      href={(p) => `/sections/${slug}?page=${p}`}
    />
  );
}
