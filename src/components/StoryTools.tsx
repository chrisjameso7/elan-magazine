"use client";
import { useState } from "react";
export default function StoryTools({ title }: { title: string }) {
  const [message, setMessage] = useState("");
  return (
    <div className="story-tools">
      <button
        type="button"
        className="pill pill--outline"
        onClick={async () => {
          try {
            if (navigator.share) await navigator.share({ title, url: location.href });
            else {
              await navigator.clipboard.writeText(location.href);
              setMessage("Link copied.");
            }
          } catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError"))
              setMessage("Copy the page address from your browser to share.");
          }
        }}
      >
        Share
      </button>
      <span role="status">{message}</span>
    </div>
  );
}
