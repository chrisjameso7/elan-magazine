'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import SearchModal from '../search/SearchModal';
import { DESKS } from '@/types/editorial';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    // Observe the full masthead without changing its height or shifting the story below it.
    const observer = new IntersectionObserver(([entry]) => setCompact(entry.boundingClientRect.bottom <= 0));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); menu.current?.close(); setSearchOpen(open => !open);
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  const closeMenu = () => { menu.current?.close(); menuTrigger.current?.focus(); };
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header ref={header} className="site-header">
      <div className="publication-shell masthead-row">
        <div className="masthead-note"><span className="eyebrow">Independent perspectives</span><span>People • Culture • Modern Life</span></div>
        <Link href="/" className="masthead" aria-label="The Élan home">ÉLAN</Link>
        <div className="header-actions"><Link href="/about" className="header-about">About The Élan</Link><button onClick={() => setSearchOpen(true)} aria-label="Search stories"><Search size={19} /><span>Search</span></button><button ref={menuTrigger} className="menu-trigger" aria-label="Open navigation" aria-haspopup="dialog" onClick={() => menu.current?.showModal()}><Menu size={22} /></button></div>
      </div>
      <nav className="publication-shell desk-nav" aria-label="Main sections">{DESKS.map(desk => <Link key={desk.slug} href={`/category/${desk.slug}`} aria-current={pathname === `/category/${desk.slug}` ? 'page' : undefined}>{desk.label}</Link>)}</nav>
    </header>
    {compact && <div className="scroll-header">
      <div className="publication-shell scroll-header-inner">
        <Link href="/" className="scroll-wordmark" aria-label="The Élan home">ÉLAN</Link>
        <nav className="scroll-nav" aria-label="Quick navigation">{DESKS.map(desk => <Link key={desk.slug} href={`/category/${desk.slug}`} aria-current={pathname === `/category/${desk.slug}` ? 'page' : undefined}>{desk.label}</Link>)}<Link href="/about" aria-current={pathname === '/about' ? 'page' : undefined}>About</Link></nav>
        <div className="scroll-actions"><button onClick={() => setSearchOpen(true)} aria-label="Search stories"><Search size={19} /></button><button className="scroll-menu" aria-label="Open navigation" aria-haspopup="dialog" onClick={event => { menuTrigger.current = event.currentTarget; menu.current?.showModal(); }}><Menu size={22} /></button></div>
      </div>
    </div>}
    <dialog ref={menu} className="menu-dialog" aria-labelledby="menu-title" onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}>
      <div className="menu-heading"><span id="menu-title" className="font-display">Explore ÉLAN</span><button onClick={closeMenu} aria-label="Close navigation"><X /></button></div>
      <nav aria-label="Mobile sections"><Link href="/" onClick={closeMenu}>Home</Link>{DESKS.map(desk => <Link key={desk.slug} href={`/category/${desk.slug}`} onClick={closeMenu} aria-current={pathname === `/category/${desk.slug}` ? 'page' : undefined}>{desk.label}<span aria-hidden="true">↗</span></Link>)}<Link href="/about" onClick={closeMenu}>About The Élan</Link></nav>
      <p>People • Culture • Modern Life</p>
    </dialog>
    <SearchModal isOpen={searchOpen} onClose={closeSearch} />
  </>;
}
