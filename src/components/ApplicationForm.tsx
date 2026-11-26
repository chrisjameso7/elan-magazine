"use client";
import { useState } from "react";
import { applicationBeats, applicationFormats } from "@/lib/applications";
export default function ApplicationForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/write-for-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          location: form.get("location"),
          social: form.get("social"),
          beats: form.getAll("beats"),
          formats: form.getAll("formats"),
          pitch: form.get("pitch"),
          whyThem: form.get("whyThem"),
          samples: form.get("samples"),
          website: form.get("website"),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Try again in a minute.");
      setState("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Try again in a minute.");
      setState("idle");
    }
  }
  if (state === "sent")
    return (
      <div className="tip-sent" role="status">
        <b>Application in. Thank you.</b>
        <p>
          An editor reads every one. If your pitch fits, we’ll email you within
          two weeks to talk about your first piece.
        </p>
      </div>
    );
  return (
    <form className="tip-form apply-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label>
          Your name
          <input name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Where you’re based <small>(optional)</small>
          <input name="location" maxLength={120} placeholder="City, country" />
        </label>
        <label>
          Social handle <small>(optional)</small>
          <input name="social" maxLength={120} placeholder="@yourname" />
        </label>
      </div>
      <fieldset className="chips">
        <legend>What do you want to cover?</legend>
        {Object.entries(applicationBeats).map(([value, label]) => (
          <label key={value} className="chip">
            <input type="checkbox" name="beats" value={value} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <fieldset className="chips">
        <legend>
          Which kind of writing? <small>(pick any)</small>
        </legend>
        {Object.entries(applicationFormats).map(([value, label]) => (
          <label key={value} className="chip">
            <input type="checkbox" name="formats" value={value} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <label>
        Your first pitch
        <small>
          The story you’d write first: who or what, the angle, and why now. A
          few sentences is enough.
        </small>
        <textarea name="pitch" required maxLength={1500} rows={6} />
      </label>
      <label>
        Why you? <small>(optional)</small>
        <textarea name="whyThem" maxLength={800} rows={3} placeholder="What you know, what you’ve spotted early, what you can’t stop talking about" />
      </label>
      <label>
        Writing samples <small>(optional, links)</small>
        <textarea name="samples" maxLength={1000} rows={3} placeholder="Blog, Substack, threads, school paper, anything you’ve written" />
      </label>
      <label className="hp" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send my application"}
      </button>
      <p className="small">
        We use your details only to review your application and reply to you.
      </p>
    </form>
  );
}
