export type TipInput = {
  name: string;
  link: string;
  why?: string;
  isSelf: boolean;
  email?: string;
};
const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

/** Validates a public Put Us On tip. Returns the cleaned tip or an error for the reader. */
export function parseTip(body: unknown): { tip: TipInput } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Send the form again." };
  const data = body as Record<string, unknown>;
  // Honeypot: people never see this field.
  if (clean(data.website, 200)) return { error: "Send the form again." };
  const name = clean(data.name, 120);
  if (name.length < 2) return { error: "Tell us who it is." };
  const rawLink = clean(data.link, 500);
  let link: string;
  try {
    const url = new URL(rawLink);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password)
      throw new Error();
    link = url.toString();
  } catch {
    return { error: "Add a full link starting with https://" };
  }
  const why = clean(data.why, 280) || undefined;
  const email = clean(data.email, 200) || undefined;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "That email doesn’t look right. Leave it blank if you prefer." };
  return { tip: { name, link, why, email, isSelf: data.isSelf === true } };
}
