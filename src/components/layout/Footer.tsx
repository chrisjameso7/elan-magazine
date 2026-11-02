import Link from 'next/link';
import { NAVIGATION } from '@/types/editorial';
import Newsletter from '@/components/editorial/Newsletter';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="publication-shell">
        <Newsletter />
        <div className="footer-grid">
          <div>
            <Link className="footer-wordmark" href="/" aria-label="ÉLAN home">
              ÉLAN
            </Link>
            <p className="footer-descriptor">CULTURE, IN ITS ELEMENT.</p>
            <p>
              A global entertainment and culture publication. A closer look at
              the personalities, creative work, and movements shaping what comes
              next.
            </p>
          </div>
          <nav aria-label="Footer sections">
            <span className="eyebrow">The world of ÉLAN</span>
            {NAVIGATION.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/originals">Originals</Link>
          </nav>
          <nav aria-label="Publication">
            <span className="eyebrow">Connect</span>
            <Link href="/about">About ÉLAN</Link>
            <Link href="/about#submissions">Submissions</Link>
            <a href="mailto:contact@theelanmagazine.com">Contact ↗</a>
            <Link href="/newsletter">Newsletter</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/admin">Editorial desk</Link>
          </nav>
        </div>
        <div className="footer-baseline">
          <p>© {new Date().getFullYear()} ÉLAN. All rights reserved.</p>
          <p>A Lumière Media &amp; Entertainment publication.</p>
        </div>
      </div>
    </footer>
  );
}
