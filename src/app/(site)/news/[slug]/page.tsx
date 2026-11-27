import { notFound } from "next/navigation";
import { getPublishedArticle, populated, storyList, type Section } from "@/lib/publication";
import type { Media } from "@/cms/payload-types";
import ArticleView from "@/components/ArticleView";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const a = await getPublishedArticle(slug);
  const hero = a ? populated<Media>(a.hero) : undefined;
  const images = hero?.url
    ? [
        {
          url: `/share/${slug}.jpg`,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: hero.alt,
        },
      ]
    : [{ url: "/brand/og.png", width: 1200, height: 630, type: "image/png", alt: "The Index" }];
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
          images,
        },
        twitter: {
          card: "summary_large_image",
          title: a.title,
          description: a.standfirst,
          images,
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
