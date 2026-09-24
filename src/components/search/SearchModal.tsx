'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowUpRight, BookOpen } from 'lucide-react';
import { MOCK_ARTICLES, CATEGORIES } from '@/data/mockArticles';
import { Article } from '@/types/editorial';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredArticles = query.trim()
    ? MOCK_ARTICLES.filter((art) => {
        const q = query.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.dek.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          art.tags.some((t) => t.toLowerCase().includes(q)) ||
          art.author.name.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#11100F]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-[#F5F0E8] border border-[#11100F]/15 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#11100F]/15 px-6 py-5 bg-[#F5F0E8]">
          <Search className="w-5 h-5 text-[#751F3D] mr-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ÉLAN stories, topics, or authors..."
            className="w-full bg-transparent text-xl sm:text-2xl font-display text-[#11100F] placeholder-[#11100F]/40 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 ml-3 text-[#11100F]/60 hover:text-[#751F3D] transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {query.trim() === '' ? (
            <div>
              <div className="text-xs uppercase tracking-widest text-[#751F3D] font-medium mb-3">
                Explore Categories
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="p-3 bg-white/60 hover:bg-white border border-[#11100F]/8 text-left transition-all hover:border-[#751F3D]/30 group"
                  >
                    <span className="block text-xs uppercase tracking-wider font-semibold text-[#11100F] group-hover:text-[#751F3D] transition-colors">
                      {cat.label}
                    </span>
                    <span className="block text-[11px] text-[#11100F]/50 mt-1 line-clamp-1">
                      {cat.featuredTopic}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                <div className="text-xs uppercase tracking-widest text-[#751F3D] font-medium mb-3">
                  Trending Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Haute Couture', 'Elena Vance', 'Architecture', 'Fragrance', 'Kyoto', 'Minimalism'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-xs uppercase tracking-wider px-3 py-1.5 bg-[#EAD6D8]/50 hover:bg-[#EAD6D8] text-[#751F3D] border border-[#751F3D]/20 transition-colors"
                    >
                      #{term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-widest text-[#751F3D] font-medium">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'Result' : 'Results'} found
              </div>
              <div className="divide-y divide-[#11100F]/10">
                {filteredArticles.map((article: Article) => (
                  <Link
                    key={article.id}
                    href={
                      article.type === 'interview'
                        ? `/interview/${article.slug}`
                        : article.type === 'feature'
                        ? `/feature/${article.slug}`
                        : `/article/${article.slug}`
                    }
                    onClick={onClose}
                    className="py-4 flex items-start justify-between group block transition-all"
                  >
                    <div className="pr-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-[#751F3D] font-semibold">
                          {article.categoryLabel}
                        </span>
                        <span className="text-[11px] text-[#11100F]/40">•</span>
                        <span className="text-[11px] text-[#11100F]/60">{article.readTime}</span>
                      </div>
                      <h4 className="text-lg font-display text-[#11100F] group-hover:text-[#751F3D] transition-colors line-clamp-1">
                        {article.title}
                      </h4>
                      <p className="text-sm font-reading text-[#11100F]/70 line-clamp-2 mt-1">
                        {article.dek}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#11100F]/30 group-hover:text-[#751F3D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 mt-2" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-8 h-8 text-[#751F3D]/40 mx-auto mb-3" />
              <p className="font-display text-lg text-[#11100F]">No stories found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm font-reading text-[#11100F]/60 mt-1">
                Try searching for couture, architecture, beauty, or Elena Vance.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#EAD6D8]/20 border-t border-[#11100F]/10 flex items-center justify-between text-[11px] text-[#11100F]/50">
          <span>Press ESC to close</span>
          <span>ÉLAN Editorial Search</span>
        </div>
      </div>
    </div>
  );
}
