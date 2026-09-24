'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronRight } from 'lucide-react';
import SearchModal from '../search/SearchModal';
import { CATEGORIES } from '@/data/mockArticles';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format today's real-time publication date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <>
      <header className="relative w-full bg-[#F5F0E8] border-b border-[#11100F]/12 z-40">
        {/* Top Minimalist Dateline & Utility Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-[11px] sm:text-xs tracking-wider uppercase text-[#11100F]/70 border-b border-[#11100F]/8">
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#11100F]">{todayFormatted}</span>
            <span className="text-[#11100F]/30">•</span>
            <span className="text-[#751F3D] font-semibold tracking-widest">Digital Edition</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 hover:text-[#751F3D] transition-colors group cursor-pointer"
              aria-label="Open search"
            >
              <Search className="w-3.5 h-3.5 text-[#11100F]/60 group-hover:text-[#751F3D] transition-colors" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] bg-white/60 border border-[#11100F]/15 font-mono text-[#11100F]/60 ml-1">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* The Iconic ÉLAN Masthead */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9 lg:py-11 text-center">
          <Link
            href="/"
            className="inline-block group focus:outline-none"
            aria-label="ÉLAN Home"
          >
            <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] leading-[0.88] font-bold tracking-[0.06em] sm:tracking-[0.10em] text-[#11100F] group-hover:text-[#751F3D] transition-colors duration-300">
              ÉLAN
            </h1>
            <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#11100F]/60 font-medium">
              Culture • Fashion • Society • Living
            </p>
          </Link>
        </div>

        {/* Primary Editorial Navigation */}
        <nav
          aria-label="Primary"
          className="border-t border-[#11100F]/12 bg-[#F5F0E8]/95 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-13">
              {/* Mobile menu trigger */}
              <div className="flex lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 -ml-2 text-[#11100F] hover:text-[#751F3D] transition-colors"
                  aria-label="Open mobile menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* Desktop Categories */}
              <div className="hidden lg:flex items-center justify-center flex-1 gap-7 xl:gap-9">
                <Link
                  href="/"
                  className={`text-xs uppercase tracking-[0.18em] py-4 transition-colors font-medium relative ${
                    pathname === '/'
                      ? 'text-[#751F3D] font-semibold'
                      : 'text-[#11100F]/80 hover:text-[#751F3D]'
                  }`}
                >
                  Home
                  {pathname === '/' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#751F3D]" />
                  )}
                </Link>

                {CATEGORIES.map((cat) => {
                  const isActive = pathname === `/category/${cat.slug}`;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className={`text-xs uppercase tracking-[0.18em] py-4 transition-colors font-medium relative ${
                        isActive
                          ? 'text-[#751F3D] font-semibold'
                          : 'text-[#11100F]/80 hover:text-[#751F3D]'
                      }`}
                    >
                      {cat.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#751F3D]" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Right Search Action for tablet/mobile */}
              <div className="flex lg:hidden">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 -mr-2 text-[#11100F] hover:text-[#751F3D] transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Sticky Compact Header on Scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#11100F]/12 transition-all duration-300 transform ${
          isScrolled
            ? 'translate-y-0 opacity-100 shadow-sm'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1 text-[#11100F] hover:text-[#751F3D]"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              href="/"
              className="font-display text-2xl sm:text-3xl font-bold tracking-[0.12em] text-[#11100F] hover:text-[#751F3D] transition-colors"
            >
              ÉLAN
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-[0.16em]">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`py-1 transition-colors ${
                  pathname === `/category/${cat.slug}`
                    ? 'text-[#751F3D] font-semibold'
                    : 'text-[#11100F]/80 hover:text-[#751F3D]'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#11100F]/70 hover:text-[#751F3D] transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#11100F]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#F5F0E8] h-full shadow-2xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#11100F]/12">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-display text-3xl font-bold tracking-[0.12em] text-[#11100F]"
                >
                  ÉLAN
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-[#11100F]/70 hover:text-[#751F3D] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-white/70 border border-[#11100F]/12 text-xs uppercase tracking-wider text-[#11100F]/70 hover:text-[#751F3D] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#751F3D]" />
                    Search Stories & Topics
                  </span>
                  <span className="text-[10px] text-[#11100F]/40 font-mono">⌘K</span>
                </button>
              </div>

              {/* Mobile Category List */}
              <div className="mt-8 space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-sm font-display uppercase tracking-widest text-[#11100F] hover:text-[#751F3D] border-b border-[#11100F]/8"
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-[#11100F]/30" />
                </Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-sm font-display uppercase tracking-widest text-[#11100F] hover:text-[#751F3D] border-b border-[#11100F]/8"
                  >
                    <span>{cat.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#11100F]/30" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="pt-8 border-t border-[#11100F]/12 text-xs text-[#11100F]/60 space-y-2">
              <p className="font-display font-medium text-[#11100F]">ÉLAN Digital Magazine</p>
              <p className="text-[11px] leading-relaxed">
                Culture, Fashion, Beauty & Contemporary Living.
              </p>
              <p className="text-[10px] text-[#11100F]/40 pt-2">
                © {new Date().getFullYear()} ÉLAN. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
