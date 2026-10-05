import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Share2, Bookmark, ArrowLeft, ArrowUpRight, Globe, ExternalLink } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import { MOCK_ARTICLES } from '@/data/mockArticles';

export function generateStaticParams() {
  return MOCK_ARTICLES.filter((a) => a.type === 'interview').map((art) => ({
    slug: art.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);
  if (!article || !article.interview) return { title: 'Interview Not Found — ÉLAN' };
  return {
    title: `${article.interview.subjectName}: "${article.interview.keyQuote}" — ÉLAN Interviews`,
    description: article.dek,
    openGraph: {
      title: `${article.interview.subjectName} — ÉLAN Interviews`,
      description: article.dek,
      images: [{ url: article.interview.portrait.url, alt: article.interview.subjectName }],
    },
  };
}

export default async function InterviewPage({ params }: PageProps) {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);

  if (!article || !article.interview) {
    notFound();
  }

  const interview = article.interview;
  const relatedArticles = MOCK_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#11100F]">
      <Header />

      <main className="flex-1 w-full">
        {/* Back navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Stories</span>
          </Link>
        </div>

        {/* =========================================================================
            INTERVIEW HERO (High-Prestige Portrait & Monumental Subject Typography)
            ========================================================================= */}
        <header className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 border-b border-[#11100F]/12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Subject Typography & Bio Details */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#751F3D] text-white text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold">
                  ÉLAN Conversations
                </span>
                <span className="text-xs uppercase tracking-widest text-[#11100F]/50">
                  Vol. 01 / Feature
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] font-semibold text-[#751F3D] block">
                  {interview.subjectTitle}
                </span>
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] tracking-tight text-[#11100F]">
                  {interview.subjectName}
                </h1>
              </div>

              <p className="font-reading text-lg sm:text-2xl text-[#11100F]/80 leading-relaxed max-w-xl">
                {article.dek}
              </p>

              {/* Byline & Social Profile Pill */}
              <div className="pt-4 border-t border-[#11100F]/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#11100F]">
                      Conducted by {article.author.name}
                    </div>
                    <div className="text-[11px] text-[#11100F]/55">
                      {article.dateFormatted} • {article.readTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {interview.socialLinks?.instagram && (
                    <a
                      href={`https://instagram.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-[#11100F]/15 text-[#11100F]/70 hover:text-[#751F3D] hover:border-[#751F3D] transition-colors"
                      aria-label="Instagram profile"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {interview.socialLinks?.portfolio && (
                    <a
                      href={`https://${interview.socialLinks.portfolio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-[#11100F]/15 text-[#11100F]/70 hover:text-[#751F3D] hover:border-[#751F3D] transition-colors"
                      aria-label="Portfolio link"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    className="p-2 border border-[#11100F]/15 text-[#11100F]/70 hover:text-[#751F3D] hover:border-[#751F3D] transition-colors"
                    aria-label="Share interview"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 border border-[#11100F]/15 text-[#11100F]/70 hover:text-[#751F3D] hover:border-[#751F3D] transition-colors"
                    aria-label="Bookmark"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Hero Portrait */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <figure className="space-y-2">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#11100F]/5 shadow-xl">
                  <img
                    src={interview.portrait.url}
                    alt={interview.portrait.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <figcaption className="text-xs text-[#11100F]/55 italic font-reading">
                  {interview.portrait.caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </header>

        {/* =========================================================================
            INTERVIEW INTRO & MONUMENTAL PULL QUOTE
            ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
          {/* Curatorial Introduction */}
          <div className="p-6 sm:p-10 bg-[#EAD6D8]/30 border-l-2 border-[#751F3D] space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#751F3D] font-bold block">
              Curator&apos;s Introduction
            </span>
            <p className="font-reading text-lg sm:text-xl text-[#11100F]/85 leading-relaxed italic">
              {interview.intro}
            </p>
          </div>

          {/* Monumental Key Quote Breakout */}
          <div className="py-6 text-center space-y-4">
            <blockquote className="font-display italic text-3xl sm:text-5xl lg:text-6xl text-[#11100F] font-bold leading-[1.08] tracking-tight">
              &ldquo;{interview.keyQuote}&rdquo;
            </blockquote>
            <span className="text-xs uppercase tracking-[0.22em] text-[#751F3D] font-bold block">
              — {interview.subjectName}
            </span>
          </div>

          {/* =========================================================================
              Q&A DIALOGUE FORMATTING (Prestigious Editorial Cadence)
              ========================================================================= */}
          <div className="space-y-12 pt-6">
            {interview.qas.map((qa, idx) => (
              <div key={idx} className="space-y-4 pt-6 border-t border-[#11100F]/10">
                {/* Question */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#751F3D] flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#751F3D]/10 rounded-none">
                      {qa.speaker || 'ÉLAN'}
                    </span>
                    <span>// QUESTION</span>
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#11100F] leading-snug">
                    {qa.question}
                  </h3>
                </div>

                {/* Answer */}
                <div className="space-y-2 pl-4 sm:pl-6 border-l border-[#11100F]/20">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#11100F]/60 block">
                    {interview.subjectName}
                  </span>
                  <p className="font-reading text-lg sm:text-xl text-[#11100F]/85 leading-relaxed">
                    {qa.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Atelier Portrait Interlude */}
          {interview.secondaryPortrait && (
            <figure className="my-12 space-y-2">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#11100F]/5">
                <img
                  src={interview.secondaryPortrait.url}
                  alt={interview.secondaryPortrait.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="text-xs text-[#11100F]/60 italic font-reading">
                {interview.secondaryPortrait.caption}
              </figcaption>
            </figure>
          )}

          {/* Share Profile Banner */}
          <div className="p-8 bg-[#11100F] text-[#F5F0E8] flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C98B9D] font-bold block">
                Share This Feature
              </span>
              <h4 className="font-display text-xl sm:text-2xl font-bold">
                ÉLAN Conversations with {interview.subjectName}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="px-5 py-2.5 bg-[#751F3D] hover:bg-[#8C2549] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Profile</span>
              </button>
            </div>
          </div>
        </section>

        {/* Next in ÉLAN */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[#11100F]/12 space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-[#11100F]/10">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#11100F]">
              More From ÉLAN Conversations
            </h3>
            <Link
              href="/"
              className="text-xs uppercase tracking-wider text-[#751F3D] hover:underline flex items-center gap-1"
            >
              Browse All Stories <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((rel) => (
              <StoryCard key={rel.id} article={rel} variant="portrait_feature" />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
