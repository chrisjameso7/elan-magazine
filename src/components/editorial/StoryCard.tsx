import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Article } from '@/types/editorial';

interface StoryCardProps {
  article: Article;
  variant?:
    | 'lead'
    | 'portrait_feature'
    | 'horizontal_split'
    | 'quote_overlay'
    | 'compact_list'
    | 'numbered_rank';
  rank?: number;
  priority?: boolean;
}

export default function StoryCard({
  article,
  variant = 'portrait_feature',
  rank,
}: StoryCardProps) {
  const getHref = () => {
    if (article.type === 'interview') return `/interview/${article.slug}`;
    if (article.type === 'feature') return `/feature/${article.slug}`;
    return `/article/${article.slug}`;
  };

  const href = getHref();

  // VARIANT 1: THE ART-DIRECTED LEAD HERO (NOVA & Pink Couture Asymmetry)
  if (variant === 'lead') {
    return (
      <article className="relative w-full group border-b border-[#11100F]/12 pb-14 sm:pb-20 lg:pb-24 pt-2">
        <Link href={href} className="block focus:outline-none">
          {/* Asymmetric 12-Column Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center relative">
            {/* Photographic Canvas (Columns 5–12 on desktop with offset layer breaking rectangular frame) */}
            <div className="lg:col-span-8 lg:col-start-5 relative">
              {/* Subtle offset physical paper plane behind photo */}
              <div
                aria-hidden="true"
                className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 w-full h-full bg-[#EAD6D8]/35 border border-[#751F3D]/10 pointer-events-none transition-transform duration-700 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
              />

              {/* High-fashion photographic frame */}
              <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/11] overflow-hidden bg-[#11100F]/5 z-0">
                <img
                  src={article.coverImage.url}
                  alt={article.coverImage.alt}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                {/* Very subtle warm edge veil where typography meets photo on desktop */}
                <div className="hidden lg:block absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#F5F0E8]/80 via-[#F5F0E8]/30 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Typographic Composition Layer (Columns 1–8 on desktop, overlapping the photograph) */}
            <div className="lg:col-span-8 lg:col-start-1 lg:row-start-1 z-10 space-y-4 sm:space-y-6 lg:pr-6 xl:pr-10">
              {/* Category Kicker */}
              <div>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-[#751F3D]">
                  The Lead // {article.categoryLabel}
                </span>
              </div>

              {/* Monumental Overlapping Headline */}
              <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[6.5rem] font-bold leading-[0.92] tracking-[-0.02em] text-[#11100F] group-hover:text-[#751F3D] transition-colors duration-300">
                {article.title}
              </h2>

              {/* Dek in comfortable Newsreader serif & Byline in clean sans */}
              <div className="space-y-4 pt-1 max-w-xl">
                <p className="font-reading text-lg sm:text-xl lg:text-2xl text-[#11100F]/80 leading-relaxed">
                  {article.dek}
                </p>

                <div className="pt-2 flex items-center gap-3 text-xs sm:text-sm text-[#11100F]/65 uppercase tracking-wider font-sans">
                  <span>By <strong className="font-medium text-[#11100F]">{article.author.name}</strong></span>
                  <span className="text-[#11100F]/30">•</span>
                  <span>{article.dateFormatted}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // VARIANT 2: PORTRAIT FEATURE (High-fashion vertical card)
  if (variant === 'portrait_feature') {
    return (
      <article className="group flex flex-col justify-between h-full">
        <Link href={href} className="block">
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#11100F]/5">
            <img
              src={article.coverImage.url}
              alt={article.coverImage.alt}
              className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              loading="lazy"
            />
            <div className="absolute top-4 left-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 bg-[#F5F0E8]/90 text-[#751F3D] backdrop-blur-sm">
                {article.categoryLabel}
              </span>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-[#11100F]/50 uppercase tracking-wider">
              <span>{article.readTime}</span>
              <span>•</span>
              <span>{article.dateFormatted}</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug text-[#11100F] group-hover:text-[#751F3D] transition-colors duration-200">
              {article.title}
            </h3>

            <p className="font-reading text-sm sm:text-base text-[#11100F]/70 line-clamp-2 leading-relaxed">
              {article.dek}
            </p>

            <div className="pt-2 text-xs text-[#11100F]/60">
              By <span className="font-medium text-[#11100F]">{article.author.name}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // VARIANT 3: HORIZONTAL SPLIT (Asymmetric editorial layout)
  if (variant === 'horizontal_split') {
    return (
      <article className="group grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center py-8 border-b border-[#11100F]/10">
        <div className="md:col-span-5 lg:col-span-6 overflow-hidden">
          <Link href={href} className="block aspect-[16/10] overflow-hidden bg-[#11100F]/5">
            <img
              src={article.coverImage.url}
              alt={article.coverImage.alt}
              className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
            />
          </Link>
        </div>

        <div className="md:col-span-7 lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#751F3D]">
              {article.categoryLabel}
            </span>
            <span className="text-[11px] text-[#11100F]/30">•</span>
            <span className="text-[11px] text-[#11100F]/50 uppercase tracking-wider">
              {article.readTime}
            </span>
          </div>

          <Link href={href} className="block">
            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#11100F] group-hover:text-[#751F3D] transition-colors">
              {article.title}
            </h3>
          </Link>

          <p className="font-reading text-base sm:text-lg text-[#11100F]/70 leading-relaxed line-clamp-3">
            {article.dek}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-[#11100F]/60">
            <span>By <strong className="font-medium text-[#11100F]">{article.author.name}</strong></span>
            <Link
              href={href}
              className="flex items-center gap-1 text-[#751F3D] font-medium uppercase tracking-wider text-[11px] hover:underline"
            >
              Read Story
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // VARIANT 4: QUOTE OVERLAY (Pink Couture spirit - layered typography over image)
  if (variant === 'quote_overlay') {
    return (
      <article className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden group">
        <Link href={href} className="block w-full h-full">
          <img
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#751F3D]/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100F]/90 via-[#11100F]/40 to-transparent" />

          {/* Translucent layered quote card */}
          <div className="absolute inset-x-6 bottom-6 p-6 sm:p-8 bg-[#F5F0E8]/90 backdrop-blur-md border border-white/40 text-[#11100F] space-y-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#751F3D] font-semibold block">
              {article.categoryLabel}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug">
              {article.title}
            </h3>
            <p className="font-reading italic text-sm text-[#11100F]/80 line-clamp-2">
              &ldquo;{article.dek}&rdquo;
            </p>
            <div className="pt-1 text-[11px] uppercase tracking-wider text-[#11100F]/60 font-medium">
              By {article.author.name}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // VARIANT 5: NUMBERED RANK (Most Read 01 to 05)
  if (variant === 'numbered_rank') {
    const formattedRank = rank ? String(rank).padStart(2, '0') : '01';
    return (
      <article className="group py-5 border-b border-[#11100F]/10 flex items-start gap-5">
        <span className="font-display text-3xl sm:text-4xl font-bold text-[#751F3D]/30 group-hover:text-[#751F3D] transition-colors leading-none shrink-0 pt-0.5">
          {formattedRank}
        </span>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#751F3D] font-semibold">
            <span>{article.categoryLabel}</span>
            <span className="text-[#11100F]/30">•</span>
            <span className="text-[#11100F]/50 font-normal">{article.readTime}</span>
          </div>
          <Link href={href} className="block">
            <h4 className="font-display text-lg sm:text-xl font-bold leading-snug text-[#11100F] group-hover:text-[#751F3D] transition-colors line-clamp-2">
              {article.title}
            </h4>
          </Link>
          <div className="text-xs text-[#11100F]/60 pt-0.5">
            By {article.author.name}
          </div>
        </div>
      </article>
    );
  }

  // VARIANT 6: COMPACT LIST (Editorial brief)
  return (
    <article className="group py-4 border-b border-[#11100F]/8 space-y-1">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#751F3D] font-semibold">
        <span>{article.categoryLabel}</span>
        <span className="text-[#11100F]/30">•</span>
        <span className="text-[#11100F]/50 font-normal">{article.readTime}</span>
      </div>
      <Link href={href} className="block">
        <h4 className="font-display text-base sm:text-lg font-bold leading-snug text-[#11100F] group-hover:text-[#751F3D] transition-colors line-clamp-2">
          {article.title}
        </h4>
      </Link>
      <div className="text-xs text-[#11100F]/60">
        By {article.author.name}
      </div>
    </article>
  );
}
