import Link from 'next/link';
import { brand } from '@/lib/brand';
export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label={`${brand.name} home`}>
          <span>LUMIÈRE</span>
          <small>INDEX</small>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/#screen">Screen</Link>
          <Link href="/#music">Music</Link>
          <Link href="/#culture">Culture</Link>
          <Link href="/about">About</Link>
        </nav>
        <p className="brand-line">{brand.tagline}</p>
      </div>
    </header>
  );
}
