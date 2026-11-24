import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { brand } from "@/lib/brand";
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link
          className="footer-wordmark"
          href="/"
          aria-label="Lumière Index home"
        >
          <BrandLogo light />
        </Link>
        <p>{brand.tagline}</p>
      </div>
      <nav className="footer-links" aria-label="Publication information">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/standards">Editorial standards</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/admin">Newsroom sign-in</Link>
      </nav>
      <div className="footer-bottom">
        <span>© 2026 Lumiere Index. All rights reserved.</span>
        <span>A Lumiere Publication.</span>
      </div>
    </footer>
  );
}
