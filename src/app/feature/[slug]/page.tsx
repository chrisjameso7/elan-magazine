import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Clock, Share2, Bookmark, ArrowLeft, ArrowUpRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import { MOCK_ARTICLES } from '@/data/mockArticles';

export function generateStaticParams() {
  return MOCK_ARTICLES.filter((a) => a.type === 'feature' || a.isLead).map((art) => ({
    slug: art.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: 'Feature Not Found — ÉLAN' };
  return {
    title: `${article.title} — ÉLAN Feature`,
    description: article.dek,
    openGraph: {
      title: `${article.title} — ÉLAN Feature`,
      description: article.dek,
      images: [{ url: article.coverImage.url, alt: article.title }],
    },
  };
}

export default async function FeatureArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = MOCK_ARTICLES.filter(
    (a) => a.id !== article.id && a.isEditorPick
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#11100F]">
      <Header />

      <main className="flex-1 w-full">
        {/* Full-bleed Art-Directed Feature Hero (NOVA & Pink Couture Homage) */}
        <section className="relative w-full min-h-[75vh] lg:min-h-[85vh] flex flex-col justify-end overflow-hidden bg-[#11100F] text-[#F5F0E8]">
          <img
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-75"
          />
          {/* Subtle gradient veil */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100F] via-[#11100F]/40 to-transparent" />

          {/* Overlaid Feature Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20 space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/70 hover:text-[#C98B9D] transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Editorial</span>
            </Link>

            <div className="space-y-4 max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-[#751F3D] text-white text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold">
                  ÉLAN Feature
                </span>
                <span className="text-white/60 text-xs tracking-wider uppercase font-mono">
                  {article.categoryLabel}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/60 text-xs tracking-wider uppercase flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.98] tracking-tight text-[#F5F0E8]">
                {article.title}
              </h1>

              <p className="font-reading text-lg sm:text-2xl text-white/85 max-w-2xl leading-relaxed">
                {article.dek}
              </p>
            </div>

            {/* Translucent Glass Byline Panel */}
            <div className="max-w-2xl p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/30"
                />
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-white">
                    {article.author.name}
                  </div>
                  <div className="text-[11px] text-white/60">
                    {article.dateFormatted}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="p-2 text-white/80 hover:text-[#C98B9D] transition-colors"
                  aria-label="Bookmark feature"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-white/80 hover:text-[#C98B9D] transition-colors"
                  aria-label="Share feature"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Body with Asymmetric Column Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Rail: Subtle Editorial Notes & Context */}
            <aside className="lg:col-span-3 space-y-6 text-xs text-[#11100F]/60 border-b lg:border-b-0 lg:border-r border-[#11100F]/12 pb-8 lg:pb-0 lg:pr-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#751F3D] font-bold block mb-1">
                  EDITORIAL DOSSIER
                </span>
                <p className="font-reading text-sm text-[#11100F]/80 leading-relaxed">
                  Published as part of ÉLAN&apos;s continuous study into contemporary form, texture, and creative philosophy.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#751F3D] font-bold block mb-1">
                  SUBJECT TAGS
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-white/60 border border-[#11100F]/10 text-[10px] uppercase font-sans tracking-wider"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#751F3D] font-bold block mb-1">
                  PHOTO CREDITS
                </span>
                <p className="font-reading text-[11px] text-[#11100F]/60 italic">
                  {article.coverImage.credit || 'ÉLAN Visual Study Archive'}
                </p>
              </div>
            </aside>

            {/* Center/Right: Long-form Reading Body */}
            <article className="lg:col-span-9 space-y-8 font-reading text-lg sm:text-xl text-[#11100F]/85 leading-relaxed max-w-2xl">
              {article.content && article.content.length > 0 ? (
                article.content.map((block, idx) => {
                  if (block.type === 'paragraph') {
                    return (
                      <p
                        key={idx}
                        className={block.dropCap ? 'drop-cap leading-relaxed' : 'leading-relaxed'}
                      >
                        {block.text}
                      </p>
                    );
                  }

                  if (block.type === 'heading') {
                    return (
                      <div key={idx} className="pt-8 pb-2 space-y-1">
                        {block.kicker && (
                          <span className="text-xs uppercase tracking-[0.25em] text-[#751F3D] font-sans font-bold block">
                            {block.kicker}
                          </span>
                        )}
                        <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#11100F]">
                          {block.text}
                        </h2>
                      </div>
                    );
                  }

                  if (block.type === 'quote') {
                    return (
                      <figure
                        key={idx}
                        className="my-10 p-6 sm:p-8 bg-[#EAD6D8]/25 border-l-2 border-[#751F3D] space-y-3"
                      >
                        <blockquote className="font-display italic text-2xl sm:text-3xl text-[#11100F] leading-snug">
                          &ldquo;{block.quote}&rdquo;
                        </blockquote>
                        {(block.attribution || block.context) && (
                          <figcaption className="text-xs font-sans uppercase tracking-widest text-[#751F3D] font-semibold">
                            {block.attribution}
                            {block.context && <span className="text-[#11100F]/50 font-normal"> — {block.context}</span>}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  if (block.type === 'image') {
                    return (
                      <figure key={idx} className="my-10 space-y-2">
                        <img
                          src={block.image.url}
                          alt={block.image.alt}
                          className="w-full aspect-[16/10] object-cover"
                        />
                        {block.image.caption && (
                          <figcaption className="text-xs text-[#11100F]/60 italic">
                            {block.image.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  if (block.type === 'image_duo') {
                    return (
                      <div key={idx} className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {block.images.map((img, i) => (
                          <figure key={i} className="space-y-1.5">
                            <img
                              src={img.url}
                              alt={img.alt}
                              className="w-full aspect-[4/5] object-cover"
                            />
                            {img.caption && (
                              <figcaption className="text-[11px] text-[#11100F]/60 italic">
                                {img.caption}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    );
                  }

                  return null;
                })
              ) : (
                <p className="drop-cap">
                  An uncompromising devotion to craft requires the courage to resist immediate applause. In these pages, ÉLAN continues its exploration of high-fashion and modern living.
                </p>
              )}

              {/* Author Bio Box */}
              <div className="mt-12 p-6 bg-white/70 border border-[#11100F]/12 flex items-center gap-4">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                />
                <div>
                  <h4 className="font-display text-lg font-bold text-[#11100F]">
                    {article.author.name}
                  </h4>
                  <p className="text-xs text-[#751F3D] uppercase tracking-wider font-semibold font-sans">
                    {article.author.role}
                  </p>
                  <p className="text-xs font-reading text-[#11100F]/70 pt-1">
                    {article.author.bio}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Next in ÉLAN */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#11100F]/12 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#11100F]/10">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#11100F]">
              Further Reading
            </h3>
            <Link
              href="/"
              className="text-xs uppercase tracking-wider text-[#751F3D] hover:underline flex items-center gap-1"
            >
              Back to Home <ArrowUpRight className="w-3.5 h-3.5" />
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
