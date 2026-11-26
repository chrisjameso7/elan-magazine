import { notFound } from "next/navigation";
import { getPublishedArticle, populated, storyList, type Section } from "@/lib/publication";
import ArticleView from "@/components/ArticleView";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const a = await getPublishedArticle(slug);
  return a
    ? {
        title: a.title,
        description: a.standfirst,
        alternates: { canonical: `/news/${slug}` },
        openGraph: {
          type: "article",
          title: a.title,
          description: a.standfirst,
          publishedTime: a.publishedAt,
        },
      }
    : { title: "Story not found" };
}
export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();
  const section = populated<Section>(article.section);
  const related = section
    ? (await storyList({ section: section.id, limit: 4 })).docs
        .filter((s) => s.id !== article.id)
        .slice(0, 3)
    : [];
  return <ArticleView article={article} related={related} />;
}
