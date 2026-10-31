'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { DESKS, type Article } from '@/types/editorial';
import { storyHref } from '@/lib/presentation';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const element = dialog.current;
    if (!isOpen || !element) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    element.showModal();
    input.current?.focus();
    const controller = new AbortController();
    fetch('/api/editorial/search', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Search unavailable');
      return response.json() as Promise<Article[]>;
    }).then(data => { setArticles(data); setState('ready'); }).catch(() => {
      if (!controller.signal.aborted) setState('error');
    });
    return () => { controller.abort(); element.close(); previousFocus?.focus(); };
  }, [isOpen]);
  const close = () => { setQuery(''); setState('loading'); onClose(); };
  const normalized = query.trim().toLowerCase();
  const results = normalized ? articles.filter(a => [a.title, a.dek, a.category, a.author.name, ...a.tags].some(value => value.toLowerCase().includes(normalized))) : [];
  return <dialog ref={dialog} className="search-dialog" aria-label="Search The Élan" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="search-top"><Search size={20} aria-hidden="true" /><label className="sr-only" htmlFor="editorial-query">Search stories, topics, or contributors</label><input id="editorial-query" ref={input} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search stories, topics, people…" /><button onClick={close} aria-label="Close search"><X size={20} /></button></div>
    <div className="search-content">
      {state === 'error' ? <p role="alert">Search is temporarily unavailable. Please close and try again.</p> : normalized ? <><p role="status">{state === 'loading' ? 'Searching…' : `${results.length} ${results.length === 1 ? 'story' : 'stories'} found`}</p><div className="search-results">{results.map(a => <Link key={a.id} href={storyHref(a)} onClick={close}><span className="eyebrow">{a.categoryLabel}</span><h3>{a.title}</h3><p>{a.dek}</p></Link>)}</div>{state === 'ready' && results.length === 0 && <p>Try another name, topic, or section.</p>}</> : <><span className="eyebrow">Explore the publication</span><nav aria-label="Search categories" className="search-categories">{DESKS.map(desk => <Link key={desk.slug} href={`/category/${desk.slug}`} onClick={close}>{desk.label}</Link>)}</nav></>}
    </div>
  </dialog>;
}
