import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import { CATEGORIES, MOCK_ARTICLES } from '@/data/mockArticles';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryArticles = MOCK_ARTICLES.filter((a) => a.category === slug);
  const otherArticles = MOCK_ARTICLES.filter((a) => a.category !== slug).slice(0, 3);

  const leadArticle = categoryArticles[0];
  const secondaryArticles = categoryArticles.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#11100F]">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Category Breadcrumb */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Category Header */}
        <header className="space-y-4 pb-8 border-b border-[#11100F]/12">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#751F3D] font-semibold">
              ÉLAN Section
            </span>
            <span className="text-[#11100F]/30">•</span>
            <span className="text-xs uppercase tracking-wider text-[#11100F]/50 font-mono">
              Topic: {category.featuredTopic}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#11100F]">
            {category.label}
          </h1>

          <p className="font-reading text-lg sm:text-2xl text-[#11100F]/75 max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </header>

        {/* Lead story in Category */}
        {leadArticle ? (
          <section className="space-y-12">
            <StoryCard article={leadArticle} variant="lead" />

            {/* Remaining articles in this category */}
            {secondaryArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                {secondaryArticles.map((art) => (
                  <StoryCard key={art.id} article={art} variant="portrait_feature" />
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="py-16 text-center space-y-3">
            <p className="font-display text-2xl text-[#11100F]">
              Dispatches currently in preparation for {category.label}.
            </p>
            <p className="font-reading text-base text-[#11100F]/60">
              Explore our current stories below.
            </p>
          </div>
        )}

        {/* Discover other sections */}
        <section className="pt-12 border-t border-[#11100F]/12 space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-[#11100F]/10">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#11100F]">
              Also in ÉLAN
            </h3>
            <Link
              href="/"
              className="text-xs uppercase tracking-wider text-[#751F3D] hover:underline flex items-center gap-1"
            >
              All Sections <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherArticles.map((art) => (
              <StoryCard key={art.id} article={art} variant="portrait_feature" />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
