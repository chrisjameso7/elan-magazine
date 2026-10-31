'use client';
import { useSyncExternalStore, useState } from 'react';
import { Bookmark, Share2 } from 'lucide-react';

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('elan-saved', callback);
  return () => { window.removeEventListener('storage', callback); window.removeEventListener('elan-saved', callback); };
};

export default function StoryTools({ slug, title }: { slug: string; title: string }) {
  const key = `elan:saved:v1:${slug}`;
  const saved = useSyncExternalStore(subscribe, () => {
    try { return localStorage.getItem(key) === 'true'; } catch { return false; }
  }, () => false);
  const [message, setMessage] = useState('');
  const save = () => {
    try {
      if (saved) localStorage.removeItem(key); else localStorage.setItem(key, 'true');
      window.dispatchEvent(new Event('elan-saved'));
      setMessage(saved ? 'Removed from this device.' : 'Saved on this device. Revisit this story to find your saved marker.');
    } catch { setMessage('Saving is unavailable in this browser.'); }
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setMessage('Story link copied.'); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setMessage('Copy the page address from your browser to share this story.');
    }
  };
  return <div className="story-tools"><button onClick={save} aria-pressed={saved}><Bookmark size={15} aria-hidden="true" />{saved ? 'Saved' : 'Save'}</button><button onClick={share}><Share2 size={15} aria-hidden="true" />Share</button><span role="status">{message}</span></div>;
}
