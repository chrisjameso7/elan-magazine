import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PublicationPage({ title, eyebrow, children, dated = false, updated = false }: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  dated?: boolean;
  updated?: boolean;
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full flex-1 bg-[#F5F0E8] px-5 sm:px-8">
        <article className="mx-auto max-w-5xl py-16 sm:py-24 lg:py-28">
          <header className="border-b border-[#751F3D]/30 pb-10 sm:pb-14">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#751F3D]">{eyebrow}</p>
            <h1 className="max-w-4xl font-display text-5xl leading-[1.05] tracking-tight text-[#751F3D] sm:text-7xl lg:text-8xl">{title}</h1>
            {dated && (
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-xs text-[#11100F]/65">
                <p>Effective Date: <time dateTime="2026-10-24">October 24, 2026</time></p>
                {updated && <p>Last Updated: <time dateTime="2026-10-24">October 24, 2026</time></p>}
              </div>
            )}
          </header>
          <div className="mt-12 max-w-3xl space-y-12 font-reading text-xl leading-relaxed text-[#11100F]/85 sm:ml-auto sm:mt-16 sm:text-[22px] [&_a]:break-words [&_a]:text-[#751F3D] [&_a]:underline [&_a]:decoration-[#751F3D]/35 [&_a]:underline-offset-4 [&_a:hover]:decoration-[#751F3D] [&_h2]:mb-5 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:text-[#11100F] [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-[#751F3D] [&_p+p]:mt-5 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-4 [&_ul]:pl-6 [&_strong]:font-semibold">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
