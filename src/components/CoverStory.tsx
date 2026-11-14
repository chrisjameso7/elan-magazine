"use client";
import Link from "next/link";
import { useState } from "react";
import type { Media } from "@/cms/payload-types";
import StoryImage from "./StoryImage";
export type CoverSlide = {
  id: number;
  slug: string;
  title: string;
  standfirst: string;
  label: string;
  authors: string;
  publishedAt?: string | null;
  media?: Media;
};
export default function CoverStory({ slides }: { slides: CoverSlide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  if (!slide) return null;
  return (
    <section
      className={`cover-story ${slide.media?.url ? "" : "cover-story--text"}`}
      aria-label="Top stories"
      aria-roledescription={slides.length > 1 ? "carousel" : undefined}
    >
      {slide.media?.url && (
        <StoryImage
          key={slide.id}
          media={slide.media}
          priority
          className="cover-photo"
        />
      )}
      <div className="cover-shade" />
      <div className="cover-copy" aria-live="polite" aria-atomic="true">
        <p className="eyebrow">{slide.label}</p>
        <h1 id="lead-title">
          <Link href={`/news/${slide.slug}`}>{slide.title}</Link>
        </h1>
        <p className="cover-standfirst">{slide.standfirst}</p>
        <p className="cover-byline">
          {slide.authors && <>By {slide.authors} · </>}
          {slide.publishedAt && (
            <time dateTime={slide.publishedAt}>
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(slide.publishedAt))}
            </time>
          )}
        </p>
        <Link className="cover-read" href={`/news/${slide.slug}`}>
          Read more <span aria-hidden="true">→</span>
        </Link>
      </div>
      {slide.media?.credit && (
        <span className="cover-credit">Photo: {slide.media.credit}</span>
      )}
      {slides.length > 1 && (
        <div className="cover-pagination">
          <span aria-label={`Story ${index + 1} of ${slides.length}`}>
            {index + 1} / {slides.length}
          </span>
          <button
            type="button"
            aria-label="Previous top story"
            onClick={() =>
              setIndex((index + slides.length - 1) % slides.length)
            }
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next top story"
            onClick={() => setIndex((index + 1) % slides.length)}
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
