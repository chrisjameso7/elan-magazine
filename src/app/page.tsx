import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import { MOCK_ARTICLES } from '@/data/mockArticles';

export default function HomePage() {
  const leadStory = MOCK_ARTICLES.find((a) => a.isLead) || MOCK_ARTICLES[0];
  const pinkCoutureStory = MOCK_ARTICLES.find((a) => a.slug === 'a-radical-softness-couture') || MOCK_ARTICLES[1];
  const interviewStory = MOCK_ARTICLES.find((a) => a.slug === 'elena-vance-thunderous-elegance') || MOCK_ARTICLES[2];
  const beautyStory = MOCK_ARTICLES.find((a) => a.category === 'beauty') || MOCK_ARTICLES[4];
  const cultureStory = MOCK_ARTICLES.find((a) => a.category === 'culture') || MOCK_ARTICLES[5];
  const designStory = MOCK_ARTICLES.find((a) => a.category === 'design') || MOCK_ARTICLES[3];
  const lifeStory = MOCK_ARTICLES.find((a) => a.category === 'life') || MOCK_ARTICLES[7];
  const travelStory = MOCK_ARTICLES.find((a) => a.category === 'travel') || MOCK_ARTICLES[8];

  const latestArticles = MOCK_ARTICLES.slice(0, 4);
  const trendingArticles = MOCK_ARTICLES.filter((a) => a.isTrending).slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#11100F]">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-24">
        {/* =========================================================================
            SECTION 1: THE LEAD COVER STORY (Monumental Editorial Feature)
            ========================================================================= */}
        <section aria-label="The Lead Story">
          <StoryCard article={leadStory} variant="lead" />
        </section>

        {/* =========================================================================
            SECTION 2: THE LATEST DISPATCH (Columns & Rows Structural Discipline)
            4-Column Live Cultural Feed with Timestamps and Clean Swiss Alignment
            ========================================================================= */}
        <section aria-label="The Latest Continuous Dispatch" className="pt-2">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#11100F]/12">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#751F3D] animate-pulse" />
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#11100F]">
                The Continuous Dispatch
              </h2>
            </div>
            <span className="text-[11px] text-[#11100F]/50 uppercase tracking-widest">
              Live Cultural Stream
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#11100F]/10">
            {latestArticles.map((article, idx) => (
              <div
                key={article.id}
                className={`${idx > 0 ? 'sm:pl-6 lg:pl-8 pt-6 sm:pt-0' : 'sm:pr-2'} flex flex-col justify-between`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                    <span className="font-semibold text-[#751F3D]">
                      {article.categoryLabel}
                    </span>
                    <span className="text-[#11100F]/50 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {idx === 0 ? '24m ago' : idx === 1 ? '1h ago' : idx === 2 ? '3h ago' : '5h ago'}
                    </span>
                  </div>

                  <Link
                    href={
                      article.type === 'interview'
                        ? `/interview/${article.slug}`
                        : article.type === 'feature'
                        ? `/feature/${article.slug}`
                        : `/article/${article.slug}`
                    }
                    className="block group"
                  >
                    <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-[#11100F] group-hover:text-[#751F3D] transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="font-reading text-sm text-[#11100F]/70 line-clamp-2 leading-relaxed">
                    {article.dek}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#11100F]/8 flex items-center justify-between text-xs text-[#11100F]/60">
                  <span>{article.author.name}</span>
                  <span className="text-[11px] font-mono text-[#11100F]/40">{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: THE PINK COUTURE LAYERED SPREAD (Visual Identity Homage)
            Feminine energy, layered composition, subtle rose backdrop, statement type
            ========================================================================= */}
        <section
          aria-label="Couture Layered Spread"
          className="relative bg-gradient-to-br from-[#EAD6D8]/30 via-[#F5F0E8] to-[#EAD6D8]/20 p-6 sm:p-10 lg:p-14 border border-[#751F3D]/15 overflow-hidden"
        >
          {/* Subtle watermarked couture typography behind content */}
          <div
            aria-hidden="true"
            className="absolute -bottom-8 -right-6 font-display font-black text-7xl sm:text-9xl lg:text-[14rem] text-[#751F3D]/5 select-none pointer-events-none tracking-tighter"
          >
            COUTURE
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Portrait & Translucent Layering */}
            <div className="lg:col-span-6 relative">
              <Link href={`/feature/${pinkCoutureStory.slug}`} className="block group">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                  <img
                    src={pinkCoutureStory.coverImage.url}
                    alt={pinkCoutureStory.coverImage.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  {/* Subtle tinted glass card floating on corner */}
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#F5F0E8]/85 backdrop-blur-md border border-white/50 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#751F3D] font-bold block">
                      Haute Couture Study
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#11100F] leading-tight">
                      {pinkCoutureStory.title}
                    </h3>
                    <div className="text-xs text-[#11100F]/60 flex items-center justify-between pt-1">
                      <span>By {pinkCoutureStory.author.name}</span>
                      <span className="text-[#751F3D] font-medium flex items-center gap-1">
                        Explore Feature <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Editorial Statement & Philosophy */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#751F3D] font-bold block">
                  The Sartorial Doctrine
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#11100F] leading-[1.1]">
                  EVERY <span className="text-[#751F3D] italic font-serif">WOMAN</span> DESERVES TO FEEL THE VISCERAL WEIGHT OF HER OWN ELEGANCE.
                </h2>
              </div>

              <p className="font-reading text-base sm:text-lg text-[#11100F]/80 leading-relaxed">
                {pinkCoutureStory.dek}
              </p>

              {/* Editorial Keynotes Duo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white/50 border border-[#11100F]/8">
                  <span className="text-[10px] font-mono text-[#751F3D] block font-semibold">
                    (01) TACTILE RESILIENCE
                  </span>
                  <p className="text-xs text-[#11100F]/70 font-reading mt-1 leading-relaxed">
                    Pleated gossamer and raw silks engineered to move with sovereign natural grace.
                  </p>
                </div>
                <div className="p-4 bg-white/50 border border-[#11100F]/8">
                  <span className="text-[10px] font-mono text-[#751F3D] block font-semibold">
                    (02) CHROMATIC POWER
                  </span>
                  <p className="text-xs text-[#11100F]/70 font-reading mt-1 leading-relaxed">
                    Reclaiming blush, wine, and rose as instruments of undeniable cultural presence.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/feature/${pinkCoutureStory.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#751F3D] hover:bg-[#8C2549] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>Read The Full Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: ÉLAN SPOTLIGHT INTERVIEW (NOVA Editorial Drama)
            Prestige Q&A feature showcase with monumental contrast and subject bio
            ========================================================================= */}
        <section
          aria-label="ÉLAN Spotlight Interview"
          className="bg-[#11100F] text-[#F5F0E8] p-8 sm:p-12 lg:p-16 border border-[#11100F] overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Subject Quote & Bio */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#751F3D] text-white text-[10px] uppercase tracking-[0.25em] font-semibold">
                  ÉLAN Interview
                </span>
                <span className="text-xs uppercase tracking-widest text-[#C98B9D]">
                  The Vanguard Series
                </span>
              </div>

              <Link href={`/interview/${interviewStory.slug}`} className="block group">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight text-[#F5F0E8] group-hover:text-[#C98B9D] transition-colors">
                  &ldquo;I Don’t Believe in Modesty When the Work Speaks With Thunder.&rdquo;
                </h2>
              </Link>

              <div className="space-y-3 font-reading text-base sm:text-lg text-white/75 leading-relaxed">
                <p>
                  Elena Vance has spent a decade dismantling the polite consensus of European couture. In this exclusive conversation, she talks creative solitude, why glamour requires presence, and the courage to make dangerous art.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-t border-white/15 pt-6">
                <div>
                  <h4 className="font-display text-lg font-bold text-white">Elena Vance</h4>
                  <p className="text-xs text-[#C98B9D] uppercase tracking-wider">
                    Founder & Artistic Director, Vance Atelier
                  </p>
                </div>
                <Link
                  href={`/interview/${interviewStory.slug}`}
                  className="sm:ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-[#751F3D] text-white text-xs uppercase tracking-widest font-semibold border border-white/20 transition-colors"
                >
                  <span>Read Interview</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Subject Portrait */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <Link href={`/interview/${interviewStory.slug}`} className="block group overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                  <img
                    src={interviewStory.coverImage.url}
                    alt={interviewStory.coverImage.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11100F]/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-xs text-white/70 italic font-reading">
                    {interviewStory.coverImage.caption}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: BEAUTY & CULTURE DUALITY (Asymmetric Editorial Rhythm)
            ========================================================================= */}
        <section aria-label="Beauty and Culture Duality" className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#11100F]/12">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#11100F]">
              Beauty & Critical Culture
            </h2>
            <span className="text-[11px] text-[#751F3D] uppercase tracking-widest font-semibold">
              Curated Features
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Beauty Focus */}
            <div className="lg:col-span-5">
              <StoryCard article={beautyStory} variant="portrait_feature" />
            </div>

            {/* Right: Culture & Essay Stack */}
            <div className="lg:col-span-7 space-y-8 divide-y divide-[#11100F]/10">
              <div className="pt-0">
                <StoryCard article={cultureStory} variant="horizontal_split" />
              </div>
              <div className="pt-6">
                <StoryCard article={lifeStory} variant="horizontal_split" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: MOST READ & DESIGN DISPATCH (Structured Ranking)
            ========================================================================= */}
        <section aria-label="Most Read and Design Dispatch" className="space-y-8 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Most Read List 01 to 05 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#11100F]/12">
                <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#11100F]">
                  Most Read This Week
                </h2>
                <span className="text-[11px] font-mono text-[#751F3D] font-bold">
                  TRENDING / 01—05
                </span>
              </div>

              <div className="divide-y divide-[#11100F]/10">
                {trendingArticles.map((art, idx) => (
                  <StoryCard
                    key={art.id}
                    article={art}
                    variant="numbered_rank"
                    rank={idx + 1}
                  />
                ))}
              </div>
            </div>

            {/* Right: Design & Travel Atmosphere */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#11100F]/12">
                <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#11100F]">
                  Design & Living Spaces
                </h2>
                <Link
                  href="/category/design"
                  className="text-[11px] uppercase tracking-wider text-[#751F3D] hover:underline"
                >
                  View All Design →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StoryCard article={designStory} variant="portrait_feature" />
                <StoryCard article={travelStory} variant="portrait_feature" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
