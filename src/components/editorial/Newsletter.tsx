'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Newsletter() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');
  return (
    <section
      className="newsletter-invitation"
      aria-labelledby="newsletter-title"
    >
      <div>
        <span className="eyebrow">An invitation, from ÉLAN</span>
        <h2 id="newsletter-title">
          A little closer
          <br />
          to <em>the culture.</em>
        </h2>
        <p>
          New perspectives, personalities, and the stories we want you to spend
          time with.
        </p>
      </div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (status === 'saving') return;
          const form = new FormData(event.currentTarget);
          setStatus('saving');
          setMessage('');
          try {
            const response = await fetch('/api/newsletter/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: form.get('email'),
                website: form.get('website'),
                consent: form.get('consent') === 'on',
              }),
            });
            const result = await response.json();
            if (!response.ok)
              throw new Error(result.error || 'Please try again.');
            setStatus('saved');
            setMessage(result.message || 'Your subscription request is saved.');
          } catch (error) {
            setStatus('error');
            setMessage(
              error instanceof Error
                ? error.message
                : 'We could not save your request. Please try again.',
            );
          }
        }}
      >
        <label htmlFor="newsletter-email">Your email address</label>
        <div className="newsletter-input">
          <input
            id="newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            disabled={status === 'saved'}
          />
          <button disabled={status === 'saving' || status === 'saved'}>
            {status === 'saving'
              ? 'Saving…'
              : status === 'saved'
                ? 'Request saved'
                : 'Join the list ↗'}
          </button>
        </div>
        <div className="newsletter-honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="newsletter-consent">
          <input
            type="checkbox"
            name="consent"
            required
            disabled={status === 'saved'}
          />
          I agree to receive ÉLAN editorial emails. I can unsubscribe at any
          time.
        </label>
        <p className="newsletter-privacy">
          Read our <Link href="/privacy">privacy policy</Link>. Email editions
          are being prepared; signing up saves your request.
        </p>
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className="newsletter-status"
        >
          {message}
        </p>
      </form>
    </section>
  );
}
