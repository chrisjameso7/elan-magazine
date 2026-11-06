import Link from 'next/link';
import { brand } from '@/lib/brand';
export default function SiteFooter() {
  return (
    <footer className="shell site-footer">
      <div>
        <strong>{brand.name}</strong>
        <p>{brand.tagline}</p>
      </div>
      <Link href="/about">About the publication</Link>
      <span className="foundation-label">Foundation preview</span>
    </footer>
  );
}
