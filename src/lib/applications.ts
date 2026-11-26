export const applicationBeats = {
  music: "Music",
  "film-tv": "Film & TV",
  internet: "Internet",
  style: "Style",
  books: "Books",
  art: "Art & design",
  sport: "Sport",
  gaming: "Gaming",
  culture: "Culture",
} as const;
export const applicationFormats = {
  discover: "Discover — first looks at who’s next",
  critique: "Critique — reviews with a verdict",
  personal: "Personal — first-person essays",
} as const;
export type ApplicationInput = {
  name: string;
  email: string;
  location?: string;
  beats: (keyof typeof applicationBeats)[];
  formats: (keyof typeof applicationFormats)[];
  pitch: string;
  whyThem?: string;
  samples?: string;
  social?: string;
};
const text = (value: unknown, max: number, multiline = false) =>
  typeof value === "string"
    ? (multiline
        ? value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n")
        : value.replace(/\s+/g, " ")
      )
        .trim()
        .slice(0, max)
    : "";
const pick = <T extends string>(value: unknown, allowed: Record<T, string>) =>
  Array.isArray(value)
    ? [...new Set(value.filter((v): v is T => typeof v === "string" && v in allowed))]
    : [];

/** Validates a Write for us application. Returns cleaned data or a reader-facing error. */
export function parseApplication(
  body: unknown,
): { application: ApplicationInput } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Send the form again." };
  const data = body as Record<string, unknown>;
  if (text(data.website, 200)) return { error: "Send the form again." };
  const name = text(data.name, 120);
  if (name.length < 2) return { error: "Tell us your name." };
  const email = text(data.email, 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Add an email we can reply to." };
  const beats = pick(data.beats, applicationBeats);
  if (!beats.length) return { error: "Pick at least one thing you want to cover." };
  const formats = pick(data.formats, applicationFormats);
  const pitch = text(data.pitch, 1500, true);
  if (pitch.length < 40)
    return { error: "Give us a first pitch: a few sentences on the story you’d write." };
  return {
    application: {
      name,
      email,
      location: text(data.location, 120) || undefined,
      beats,
      formats,
      pitch,
      whyThem: text(data.whyThem, 800, true) || undefined,
      samples: text(data.samples, 1000, true) || undefined,
      social: text(data.social, 120) || undefined,
    },
  };
}
