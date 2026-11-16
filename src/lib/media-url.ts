import { safeURL } from "./safe-url";
/** Keep Payload media on the current deployment so preview and domain changes preserve access checks. */
export function mediaURL(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const safe = safeURL(value);
  if (!safe) return undefined;
  const parsed = new URL(safe, "https://media.invalid");
  return parsed.pathname.startsWith("/api/media/file/")
    ? `${parsed.pathname}${parsed.search}`
    : safe;
}
