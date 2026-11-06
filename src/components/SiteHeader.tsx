import Link from 'next/link';
import { brand } from '@/lib/brand';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="shell masthead">
        <Link className="wordmark" href="/" aria-label={`${brand.name} home`}>
          LUMIÈRE<span>INDEX</span>
          <span className="wordmark-period" aria-hidden="true">
            .
          </span>
        </Link>
        <p className="brand-line">{brand.tagline}</p>
      </div>
      <nav className="shell site-nav" aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/about">About Lumière Index</Link>
        <span>Entertainment &amp; pop culture</span>
      </nav>
    </header>
  );
}
