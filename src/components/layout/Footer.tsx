'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { CATEGORIES } from '@/data/mockArticles';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="w-full bg-[#11100F] text-[#F5F0E8] border-t border-[#11100F]">
      {/* Top Dispatch / Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C98B9D] font-medium block">
              The ÉLAN Briefing
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-[#F5F0E8]">
              Critical perspectives on fashion, culture, and the modern intellect.
            </h2>
            <p className="font-reading text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
              Delivered weekly. An uncompromising edit of emerging designers, cultural essays, architectural studies, and intimate interviews.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="p-6 bg-white/5 border border-[#751F3D]/50 flex items-center gap-3">
                <Check className="w-5 h-5 text-[#C98B9D]" />
                <span className="text-sm font-reading text-white/90">
                  You are now subscribed to The ÉLAN Briefing.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#C98B9D] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-[#751F3D] hover:bg-[#8C2549] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-white/40 tracking-wide">
                  By subscribing, you agree to our privacy standards. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Colophon & Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="font-display text-4xl sm:text-5xl font-bold tracking-[0.14em] text-[#F5F0E8] hover:text-[#C98B9D] transition-colors inline-block"
            >
              ÉLAN
            </Link>
            <p className="font-reading text-sm text-white/60 max-w-sm leading-relaxed">
              A digital-first editorial publication exploring fashion, beauty, culture, entertainment, people, relationships, travel, design, luxury, and contemporary life.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] uppercase tracking-widest text-[#C98B9D] border border-[#C98B9D]/30 px-3 py-1">
                Digital Edition • Continuous Dispatch
              </span>
            </div>
          </div>

          {/* Editorial Taxonomy */}
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C98B9D] font-semibold block mb-4">
              Sections
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm text-white/70">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="hover:text-[#F5F0E8] hover:translate-x-0.5 transition-all text-xs uppercase tracking-wider"
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                href="/interview/elena-vance-thunderous-elegance"
                className="hover:text-[#F5F0E8] hover:translate-x-0.5 transition-all text-xs uppercase tracking-wider text-[#C98B9D]"
              >
                ÉLAN Interviews
              </Link>
            </div>
          </div>

          {/* Publication Info */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C98B9D] font-semibold block mb-4">
              Publication
            </span>
            <ul className="space-y-2 text-xs text-white/60 uppercase tracking-wider">
              <li>
                <span className="text-white/40">Editorial Inquiries:</span>
                <span className="block text-white/80 lowercase mt-0.5">editorial@elan-mag.mock</span>
              </li>
              <li>
                <span className="text-white/40">Press & Syndication:</span>
                <span className="block text-white/80 lowercase mt-0.5">press@elan-mag.mock</span>
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-white/40 normal-case block">
                  ÉLAN is published digitally. Independent editorial perspectives.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© {new Date().getFullYear()} ÉLAN Magazine. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-white transition-colors">Accessibility</Link>
            <Link href="/admin" className="hover:text-[#C98B9D] transition-colors font-mono font-medium text-[#C98B9D]">Editorial Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
