"use client";
import { useState } from "react";
export default function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), website: form.get("website") }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Try again in a minute.");
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Try again in a minute.");
      setState("idle");
    }
  }
  return (
    <section className={`newsletter ${compact ? "newsletter--compact" : ""}`} aria-labelledby="newsletter-title">
      <div>
        <h2 id="newsletter-title">
          One email, every Thursday. <i>The list before it’s a list.</i>
        </h2>
        {!compact && (
          <p>The new Index 50, the reviews worth reading, and who we think is next. Unsubscribe any time.</p>
        )}
      </div>
      {state === "done" ? (
        <p className="newsletter-done" role="status">
          You’re in. See you Thursday.
        </p>
      ) : (
        <form onSubmit={submit} noValidate>
          <label htmlFor={compact ? "nl-email-c" : "nl-email"} className="visually-hidden">
            Email address
          </label>
          <input
            id={compact ? "nl-email-c" : "nl-email"}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
          />
          <label className="hp" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <button type="submit" className="pill pill--signal" disabled={state === "sending"}>
            {state === "sending" ? "Signing up…" : "Subscribe"}
          </button>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
