import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Newsreader, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ÉLAN — Modern Culture, Fashion & Lifestyle',
  description: 'A digital-first culture and lifestyle publication covering fashion, beauty, culture, entertainment, people, relationships, travel, design, luxury, and contemporary life.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} ${newsreader.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F0E8] text-[#11100F] font-sans antialiased selection:bg-[#751F3D] selection:text-white">
        {children}
      </body>
    </html>
  );
}
