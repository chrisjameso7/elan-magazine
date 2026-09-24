import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import { MOCK_AUTHORS, MOCK_ARTICLES } from '@/data/mockArticles';

export function generateStaticParams() {
  return Object.values(MOCK_AUTHORS).map((author) => ({
    slug: author.id,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = Object.values(MOCK_AUTHORS).find((a) => a.id === slug);

  if (!author) {
    notFound();
  }

  const authorArticles = MOCK_ARTICLES.filter((a) => a.author.id === author.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#11100F]">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Author Bio Header */}
        <header className="p-8 sm:p-12 bg-white/60 border border-[#11100F]/12 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shrink-0 border-2 border-[#751F3D]/20"
          />
          <div className="space-y-3 text-center sm:text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#751F3D] font-semibold block">
              Contributing Voice
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#11100F]">
              {author.name}
            </h1>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#11100F]/70">
              {author.role}
            </p>
            {author.bio && (
              <p className="font-reading text-base sm:text-lg text-[#11100F]/80 max-w-2xl leading-relaxed pt-1">
                {author.bio}
              </p>
            )}
          </div>
        </header>

        {/* Stories by this author */}
        <section className="space-y-6">
          <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#11100F] pb-3 border-b border-[#11100F]/12">
            Dispatches by {author.name} ({authorArticles.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorArticles.map((art) => (
              <StoryCard key={art.id} article={art} variant="portrait_feature" />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
