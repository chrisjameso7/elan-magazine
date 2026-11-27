"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLogo from "./BrandLogo";
import { brand } from "@/lib/brand";
import { editorialNavigation } from "@/lib/navigation";
export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  return (
    <header className={`site-header ${menuOpen ? "is-open" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="header-inner wrap">
        <Link
          className="header-logo"
          href="/"
          aria-label={`${brand.fullName} home`}
          onClick={close}
        >
          <BrandLogo />
        </Link>
        <nav
          id="site-navigation"
          className="site-nav"
          aria-label="Sections"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              close();
              document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
            }
          }}
        >
          {editorialNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link className="nav-tip" href="/put-us-on" onClick={close}>
            Put us on
          </Link>
        </nav>
        <div className="header-actions">
          <Link className="pill pill--signal" href="/put-us-on">
            Put us on
          </Link>
          <Link className="icon-button" href="/search" aria-label="Search The Index">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </Link>
          <button
            className="icon-button menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
