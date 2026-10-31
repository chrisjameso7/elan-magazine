import Link from 'next/link';
import { DESKS } from '@/types/editorial';

export default function Footer() {
  return <footer className="site-footer">
    <div className="publication-shell">
      <section className="reader-connection" aria-labelledby="reader-title"><div><span className="eyebrow">Be part of the conversation</span><h2 id="reader-title">Who should we know <em>next?</em></h2><p>A new voice. A different perspective. A story that deserves to be told.</p></div><Link className="text-link" href="/about#submissions">Pitch a story <span aria-hidden="true">↗</span></Link></section>
      <div className="footer-grid"><div><Link className="footer-wordmark" href="/" aria-label="The Élan home">ÉLAN</Link><p className="footer-descriptor">People • Culture • Modern Life</p><p>An independent publication discovering people worth knowing and exploring the world around them.</p></div>
        <nav aria-label="Footer sections"><span className="eyebrow">Explore</span>{DESKS.map(desk => <Link key={desk.slug} href={`/category/${desk.slug}`}>{desk.label.charAt(0) + desk.label.slice(1).toLowerCase()}</Link>)}</nav>
        <nav aria-label="Publication"><span className="eyebrow">The publication</span><Link href="/about">About The Élan</Link><Link href="/about#submissions">Submissions</Link><a href="mailto:contact@theelanmagazine.com">Editorial contact ↗</a><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms of use</Link><Link href="/admin">Editorial desk</Link></nav>
      </div>
      <div className="footer-baseline"><p>© {new Date().getFullYear()} The Élan. All rights reserved.</p><p>A Lumière Media &amp; Entertainment publication.</p></div>
    </div>
  </footer>;
}
