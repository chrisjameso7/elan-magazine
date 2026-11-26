import { parseSubscriber, subscribe } from "@/lib/newsletter";
import { siteURL } from "@/lib/brand";
export const dynamic = "force-dynamic";
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || ![siteURL().origin, new URL(request.url).origin].includes(origin))
    return json({ error: "Sign up from The Index." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 1024)
    return json({ error: "Send the form again." }, 413);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Send the form again." }, 400);
  }
  const parsed = parseSubscriber(body);
  if ("error" in parsed) return json({ error: parsed.error }, 400);
  const apiKey = process.env.RESEND_CONTACTS_KEY;
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID;
  if (!apiKey || !segmentId || !topicId)
    return json({ error: "Sign-ups open soon. Try again later." }, 503);
  try {
    await subscribe(parsed.email, { apiKey, segmentId, topicId });
    return json({ ok: true });
  } catch (error) {
    console.error("Newsletter sign-up failed", error instanceof Error ? error.message : error);
    return json({ error: "We couldn’t sign you up right now. Try again in a minute." }, 502);
  }
}
