export const dynamic = 'force-dynamic';
import { storyStyle } from '@/lib/editorial';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Clock, Share2, Bookmark, ArrowLeft, ArrowUpRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import { getArticles } from '@/lib/cmsAdapter';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: 'Story Not Found — ÉLAN' };
  return {
    title: `${article.title} — ÉLAN`,
    description: article.dek,
    openGraph: {
      title: `${article.title} — ÉLAN`,
      description: article.dek,
      images: [{ url: article.coverImage.url, alt: article.title }],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Related articles from the same category or general picks
  const relatedArticles = articles.filter(
    (a) => a.id !== article.id && (a.category === article.category || a.isEditorPick)
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#11100F]">
      <Header />

      <main style={storyStyle(article.artDirection)} className="bg-[var(--story-bg)] text-[var(--story-ink)] flex-1 w-full">
        {/* Article Breadcrumb & Back Link */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--story-ink)]/60 hover:text-[var(--story-accent-text)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Stories</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/category/${article.category}`}
              className="text-xs uppercase tracking-[0.22em] font-semibold text-[var(--story-accent-text)] hover:underline"
            >
              {article.categoryLabel}
            </Link>
            <span className="text-[var(--story-ink)]/30">•</span>
            <span className="text-xs uppercase tracking-widest text-[var(--story-ink)]/60 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-[var(--story-ink)]">
            {article.title}
          </h1>

          <p className="font-reading text-lg sm:text-2xl text-[var(--story-ink)]/75 max-w-2xl mx-auto leading-relaxed">
            {article.dek}
          </p>

          {/* Author Byline & Publishing Meta */}
          <div className="pt-4 flex items-center justify-center gap-4 border-t border-b border-[var(--story-ink)]/10 py-4 max-w-xl mx-auto">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover border border-[var(--story-ink)]/15"
            />
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider font-semibold text-[var(--story-ink)]">
                {article.author.name}
              </div>
              <div className="text-[11px] text-[var(--story-ink)]/60">
                {article.author.role} • {article.dateFormatted}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                className="p-2 text-[var(--story-ink)]/60 hover:text-[var(--story-accent-text)] transition-colors"
                aria-label="Bookmark story"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-[var(--story-ink)]/60 hover:text-[var(--story-accent-text)] transition-colors"
                aria-label="Share story"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Photography with Caption & Credits */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 my-8">
          <figure className="space-y-3">
            <div className="relative aspect-[16/10] sm:aspect-[21/10] overflow-hidden bg-[var(--story-ink)]/5">
              <img
                src={article.coverImage.url}
                alt={article.coverImage.alt}
                className="w-full h-full object-cover object-[var(--story-focal)]"
              />
            </div>
            {(article.coverImage.caption || article.coverImage.credit) && (
              <figcaption className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[var(--story-ink)]/60 font-reading italic pt-1">
                <span>{article.coverImage.caption}</span>
                <span className="text-[11px] text-[var(--story-ink)]/45 not-italic uppercase tracking-wider font-sans mt-1 sm:mt-0">
                  {article.coverImage.credit}
                </span>
              </figcaption>
            )}
          </figure>
        </div>

        {/* Long-form Reading Body */}
        <article className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-reading text-lg sm:text-xl text-[var(--story-ink)]/85 leading-relaxed">
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
                      <span className="text-xs uppercase tracking-[0.25em] text-[var(--story-accent-text)] font-sans font-bold block">
                        {block.kicker}
                      </span>
                    )}
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--story-ink)]">
                      {block.text}
                    </h2>
                  </div>
                );
              }

              if (block.type === 'quote') {
                return (
                  <figure
                    key={idx}
                    className="my-10 pl-6 sm:pl-8 border-l-2 border-[var(--story-accent)] py-2 space-y-2 bg-[var(--story-accent)]/20"
                  >
                    <blockquote className="font-display italic text-2xl sm:text-3xl text-[var(--story-ink)] leading-snug">
                      &ldquo;{block.quote}&rdquo;
                    </blockquote>
                    {(block.attribution || block.context) && (
                      <figcaption className="text-xs font-sans uppercase tracking-widest text-[var(--story-accent-text)] font-semibold">
                        {block.attribution}
                        {block.context && <span className="text-[var(--story-ink)]/50 font-normal"> — {block.context}</span>}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              if (block.type === 'image') {
                return (
                  <figure key={idx} className="my-10 -mx-4 sm:-mx-12 space-y-2">
                    <img
                      src={block.image.url}
                      alt={block.image.alt}
                      className="w-full aspect-[16/10] object-cover"
                    />
                    {block.image.caption && (
                      <figcaption className="text-xs text-[var(--story-ink)]/60 italic px-4 sm:px-12">
                        {block.image.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              if (block.type === 'image_duo') {
                return (
                  <div key={idx} className="my-10 -mx-4 sm:-mx-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {block.images.map((img, i) => (
                      <figure key={i} className="space-y-1.5">
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full aspect-[4/5] object-cover"
                        />
                        {img.caption && (
                          <figcaption className="text-[11px] text-[var(--story-ink)]/60 italic px-2">
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
            <div className="space-y-6 leading-relaxed">
              <p className="drop-cap">
                The essence of contemporary aesthetics lies not in the proliferation of decorative noise, but in the radical courage to strip away until only truth remains. When we look across the vanguard of contemporary European culture, we find a shared longing for silence and tactile permanence.
              </p>
              <figure className="my-10 pl-6 border-l-2 border-[var(--story-accent)] py-2 bg-[var(--story-accent)]/20">
                <blockquote className="font-display italic text-2xl sm:text-3xl text-[var(--story-ink)] leading-snug">
                  &ldquo;A work of art only begins to speak when the author stops explaining it.&rdquo;
                </blockquote>
              </figure>
              <p>
                In the ongoing dialogue between craft and digital acceleration, ÉLAN examines the minds refusing to compromise. Every garment, every space, and every sentence is weighed against the enduring demands of memory.
              </p>
            </div>
          )}

          {/* Article Tag Footer */}
          <div className="pt-8 border-t border-[var(--story-ink)]/12">
            <span className="text-[11px] uppercase tracking-widest text-[var(--story-accent-text)] font-sans font-semibold block mb-3">
              Filed Under
            </span>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs uppercase tracking-wider px-3 py-1 bg-white/70 border border-[var(--story-ink)]/10 text-[var(--story-ink)]/70 font-sans"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Biography Card */}
          <div className="p-6 bg-white/60 border border-[var(--story-ink)]/12 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />
            <div className="space-y-1">
              <h4 className="font-display text-lg font-bold text-[var(--story-ink)]">
                {article.author.name}
              </h4>
              <p className="text-xs text-[var(--story-accent-text)] uppercase tracking-wider font-sans font-semibold">
                {article.author.role}
              </p>
              {article.author.bio && (
                <p className="text-xs font-reading text-[var(--story-ink)]/70 leading-relaxed pt-1">
                  {article.author.bio}
                </p>
              )}
            </div>
          </div>
        </article>

        {/* Next in ÉLAN / Related Stories */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--story-ink)]/12 space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--story-ink)]/10">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--story-ink)]">
              Next in ÉLAN
            </h3>
            <Link
              href={`/category/${article.category}`}
              className="text-xs uppercase tracking-wider text-[var(--story-accent-text)] hover:underline flex items-center gap-1"
            >
              More in {article.categoryLabel}
              <ArrowUpRight className="w-3.5 h-3.5" />
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
