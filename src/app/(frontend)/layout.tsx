import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { demoPreviewEnabled } from '@/lib/visibility';

const playfair = localFont({ src: [
  { path: '../fonts/playfair.woff2', weight: '400 900', style: 'normal' },
  { path: '../fonts/playfair-italic.woff2', weight: '400 900', style: 'italic' },
], variable: '--font-playfair', display: 'swap' });
const jakarta = localFont({ src: '../fonts/jakarta.woff2', weight: '300 700', variable: '--font-jakarta', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://elan-magazine.vercel.app'),
  title: 'ÉLAN — CULTURE, IN ITS ELEMENT.',
  description: 'A global entertainment and culture publication. Personalities, music, film, style, and original creative work.',
  openGraph: { siteName: 'ÉLAN', type: 'website', title: 'ÉLAN — CULTURE, IN ITS ELEMENT.', description: 'Entertainment and culture, in their element.' },
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
      className={`${playfair.variable} ${jakarta.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {demoPreviewEnabled() && <div className="demo-notice" role="note">DEMONSTRATION PREVIEW — sample editorial content, never production reporting.</div>}
        {children}
      </body>
    </html>
  );
}
