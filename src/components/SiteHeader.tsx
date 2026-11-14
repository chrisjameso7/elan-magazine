"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import { editorialNavigation } from "@/lib/navigation";
export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header
      className={`site-header ${pathname === "/" ? "site-header--cover" : ""} ${scrolled ? "site-header--scrolled" : ""} ${menuOpen ? "site-header--menu-open" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="newsroom-topline">
        <span>{brand.tagline}</span>
        <p>Entertainment. Culture. Everything in between.</p>
        <Link
          className="header-search"
          href="/search"
          aria-label="Search Lumière Index"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
        </Link>
      </div>
      <div className="header-inner">
        <Link
          className="wordmark"
          href="/"
          aria-label={`${brand.name} home`}
          onClick={() => setMenuOpen(false)}
        >
          <span>LUMIÈRE</span>
          <small>INDEX</small>
        </Link>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="editorial-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {menuOpen ? (
              <path d="m5 5 14 14M19 5 5 19" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
          <small>Menu</small>
        </button>
        <nav
          id="editorial-navigation"
          className="site-nav"
          aria-label="Main navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMenuOpen(false);
              document
                .querySelector<HTMLButtonElement>(".mobile-menu-toggle")
                ?.focus();
            }
          }}
        >
          {editorialNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
