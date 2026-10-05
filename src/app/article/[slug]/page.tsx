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
  return MOCK_ARTICLES.map((art) => ({
    slug: art.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);
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
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Related articles from the same category or general picks
  const relatedArticles = MOCK_ARTICLES.filter(
    (a) => a.id !== article.id && (a.category === article.category || a.isEditorPick)
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#11100F]">
      <Header />

      <main className="flex-1 w-full">
        {/* Article Breadcrumb & Back Link */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
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
              className="text-xs uppercase tracking-[0.22em] font-semibold text-[#751F3D] hover:underline"
            >
              {article.categoryLabel}
            </Link>
            <span className="text-[#11100F]/30">•</span>
            <span className="text-xs uppercase tracking-widest text-[#11100F]/60 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-[#11100F]">
            {article.title}
          </h1>

          <p className="font-reading text-lg sm:text-2xl text-[#11100F]/75 max-w-2xl mx-auto leading-relaxed">
            {article.dek}
          </p>

          {/* Author Byline & Publishing Meta */}
          <div className="pt-4 flex items-center justify-center gap-4 border-t border-b border-[#11100F]/10 py-4 max-w-xl mx-auto">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover border border-[#11100F]/15"
            />
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#11100F]">
                {article.author.name}
              </div>
              <div className="text-[11px] text-[#11100F]/60">
                {article.author.role} • {article.dateFormatted}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                className="p-2 text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
                aria-label="Bookmark story"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
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
            <div className="relative aspect-[16/10] sm:aspect-[21/10] overflow-hidden bg-[#11100F]/5">
              <img
                src={article.coverImage.url}
                alt={article.coverImage.alt}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {(article.coverImage.caption || article.coverImage.credit) && (
              <figcaption className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#11100F]/60 font-reading italic pt-1">
                <span>{article.coverImage.caption}</span>
                <span className="text-[11px] text-[#11100F]/45 not-italic uppercase tracking-wider font-sans mt-1 sm:mt-0">
                  {article.coverImage.credit}
                </span>
              </figcaption>
            )}
          </figure>
        </div>

        {/* Long-form Reading Body */}
        <article className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-reading text-lg sm:text-xl text-[#11100F]/85 leading-relaxed">
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
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#11100F]">
                      {block.text}
                    </h2>
                  </div>
                );
              }

              if (block.type === 'quote') {
                return (
                  <figure
                    key={idx}
                    className="my-10 pl-6 sm:pl-8 border-l-2 border-[#751F3D] py-2 space-y-2 bg-[#EAD6D8]/20"
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
                  <figure key={idx} className="my-10 -mx-4 sm:-mx-12 space-y-2">
                    <img
                      src={block.image.url}
                      alt={block.image.alt}
                      className="w-full aspect-[16/10] object-cover"
                    />
                    {block.image.caption && (
                      <figcaption className="text-xs text-[#11100F]/60 italic px-4 sm:px-12">
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
                          <figcaption className="text-[11px] text-[#11100F]/60 italic px-2">
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
              <figure className="my-10 pl-6 border-l-2 border-[#751F3D] py-2 bg-[#EAD6D8]/20">
                <blockquote className="font-display italic text-2xl sm:text-3xl text-[#11100F] leading-snug">
                  &ldquo;A work of art only begins to speak when the author stops explaining it.&rdquo;
                </blockquote>
              </figure>
              <p>
                In the ongoing dialogue between craft and digital acceleration, ÉLAN examines the minds refusing to compromise. Every garment, every space, and every sentence is weighed against the enduring demands of memory.
              </p>
            </div>
          )}

          {/* Article Tag Footer */}
          <div className="pt-8 border-t border-[#11100F]/12">
            <span className="text-[11px] uppercase tracking-widest text-[#751F3D] font-sans font-semibold block mb-3">
              Filed Under
            </span>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs uppercase tracking-wider px-3 py-1 bg-white/70 border border-[#11100F]/10 text-[#11100F]/70 font-sans"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Biography Card */}
          <div className="p-6 bg-white/60 border border-[#11100F]/12 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />
            <div className="space-y-1">
              <h4 className="font-display text-lg font-bold text-[#11100F]">
                {article.author.name}
              </h4>
              <p className="text-xs text-[#751F3D] uppercase tracking-wider font-sans font-semibold">
                {article.author.role}
              </p>
              {article.author.bio && (
                <p className="text-xs font-reading text-[#11100F]/70 leading-relaxed pt-1">
                  {article.author.bio}
                </p>
              )}
            </div>
          </div>
        </article>

        {/* Next in ÉLAN / Related Stories */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[#11100F]/12 space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-[#11100F]/10">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#11100F]">
              Next in ÉLAN
            </h3>
            <Link
              href={`/category/${article.category}`}
              className="text-xs uppercase tracking-wider text-[#751F3D] hover:underline flex items-center gap-1"
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
