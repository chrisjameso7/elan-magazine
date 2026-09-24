import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import { MOCK_ARTICLES } from '@/data/mockArticles';

export function generateStaticParams() {
  const allTags = Array.from(
    new Set(
      MOCK_ARTICLES.flatMap((a) =>
        a.tags.map((t) => t.toLowerCase().replace(/\s+/g, '-'))
      )
    )
  );
  return allTags.map((tag) => ({ slug: tag }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  const matchingArticles = MOCK_ARTICLES.filter((a) =>
    a.tags.some(
      (t) => t.toLowerCase().replace(/\s+/g, '-') === decodedSlug || t.toLowerCase() === decodedSlug
    )
  );

  if (matchingArticles.length === 0) {
    notFound();
  }

  const tagName = matchingArticles[0].tags.find(
    (t) => t.toLowerCase().replace(/\s+/g, '-') === decodedSlug || t.toLowerCase() === decodedSlug
  ) || slug;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#11100F]">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <header className="space-y-3 pb-6 border-b border-[#11100F]/12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#751F3D] font-semibold block">
            Curated Subject Dossier
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#11100F]">
            #{tagName}
          </h1>
          <p className="font-reading text-base sm:text-lg text-[#11100F]/70">
            {matchingArticles.length} {matchingArticles.length === 1 ? 'Dispatch' : 'Dispatches'} exploring this subject.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {matchingArticles.map((art) => (
            <StoryCard key={art.id} article={art} variant="portrait_feature" />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
