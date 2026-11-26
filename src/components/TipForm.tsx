"use client";
import { useState } from "react";
export default function TipForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/put-us-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          link: form.get("link"),
          why: form.get("why"),
          email: form.get("email"),
          website: form.get("website"),
          isSelf: form.get("isSelf") === "on",
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Try again in a minute.");
      setState("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Try again in a minute.");
      setState("idle");
    }
  }
  if (state === "sent")
    return (
      <div className="tip-sent" role="status">
        <b>Got it. Thank you.</b>
        <p>We read every tip. If we write about them, you’ll see it on the Called It wall.</p>
        <button type="button" className="pill pill--ink" onClick={() => setState("idle")}>
          Send another
        </button>
      </div>
    );
  return (
    <form className="tip-form" onSubmit={submit} noValidate>
      <label>
        Who is it?
        <input name="name" required maxLength={120} placeholder="Name or handle" autoComplete="off" />
      </label>
      <label>
        Link
        <input name="link" type="url" required maxLength={500} placeholder="TikTok, YouTube, Instagram, IMDb, a portfolio…" />
      </label>
      <label>
        Why now? <small>(one line)</small>
        <input name="why" maxLength={280} placeholder="The thing that made you send this" />
      </label>
      <label>
        Your email <small>(optional, so we can credit you)</small>
        <input name="email" type="email" maxLength={200} autoComplete="email" />
      </label>
      <label className="hp" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="check">
        <input name="isSelf" type="checkbox" /> This is me, or my own work
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send the tip"}
      </button>
    </form>
  );
}
