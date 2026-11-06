import Link from 'next/link';
import { brand } from '@/lib/brand';
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link className="footer-wordmark" href="/">
          LUMIÈRE <span>INDEX</span>
        </Link>
        <p>{brand.tagline}</p>
      </div>
      <div className="footer-bottom">
        <span>Entertainment &amp; pop culture</span>
        <Link href="/about">About the publication ↗</Link>
        <span>Design review / Not a published edition</span>
      </div>
    </footer>
  );
}
