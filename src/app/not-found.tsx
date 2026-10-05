import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#11100F]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase font-mono tracking-[0.28em] text-[#751F3D] font-bold block">
            404 // DISPATCH NOT FOUND
          </span>

          <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-[#11100F]">
            Silence in the Archive
          </h1>

          <p className="font-reading text-lg sm:text-xl text-[#11100F]/75 leading-relaxed">
            The story or page you are seeking has been archived, relocated, or does not exist.
          </p>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#751F3D] hover:bg-[#8C2549] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Front Page</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
