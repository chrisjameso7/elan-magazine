import { getCMS } from "@/lib/cms";
import { parseTip } from "@/lib/tips";
import { siteURL } from "@/lib/brand";
export const dynamic = "force-dynamic";
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = new Set([siteURL().origin, new URL(request.url).origin]);
  return allowed.has(origin);
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Send the form from The Index." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 4096)
    return json({ error: "That tip is too long." }, 413);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Send the form again." }, 400);
  }
  const parsed = parseTip(body);
  if ("error" in parsed) return json({ error: parsed.error }, 400);
  try {
    const cms = await getCMS();
    const recent = await cms.count({
      collection: "tips",
      overrideAccess: true,
      where: {
        and: [
          { link: { equals: parsed.tip.link } },
          { createdAt: { greater_than: new Date(Date.now() - 86_400_000).toISOString() } },
        ],
      },
    });
    if (recent.totalDocs === 0)
      await cms.create({
        collection: "tips",
        overrideAccess: true,
        data: { ...parsed.tip, status: "new" },
      });
    return json({ ok: true });
  } catch {
    return json({ error: "We couldn’t save that right now. Try again in a minute." }, 503);
  }
}
