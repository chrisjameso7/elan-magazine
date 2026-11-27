import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { brand } from "@/lib/brand";
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Link href="/" aria-label={`${brand.fullName} home`}>
            <BrandLogo />
          </Link>
          <p>{brand.tagline}</p>
        </div>
        <nav className="footer-links" aria-label="Publication information">
          <Link href="/put-us-on">Put us on</Link>
          <Link href="/write-for-us">Write for us</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/standards">Editorial standards</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/admin">Newsroom sign-in</Link>
        </nav>
        <p className="footer-legal">
          © 2026 Lumiere Index. All rights reserved.
          <br />A Lumiere publication.
        </p>
      </div>
    </footer>
  );
}
