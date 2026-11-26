import { getCMS } from "@/lib/cms";
import { parseApplication } from "@/lib/applications";
import { siteURL } from "@/lib/brand";
export const dynamic = "force-dynamic";
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || ![siteURL().origin, new URL(request.url).origin].includes(origin))
    return json({ error: "Send the form from The Index." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 12_000)
    return json({ error: "That application is too long." }, 413);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Send the form again." }, 400);
  }
  const parsed = parseApplication(body);
  if ("error" in parsed) return json({ error: parsed.error }, 400);
  try {
    const cms = await getCMS();
    const recent = await cms.count({
      collection: "applications",
      overrideAccess: true,
      where: {
        and: [
          { email: { equals: parsed.application.email } },
          { createdAt: { greater_than: new Date(Date.now() - 86_400_000).toISOString() } },
        ],
      },
    });
    if (recent.totalDocs === 0)
      await cms.create({
        collection: "applications",
        overrideAccess: true,
        data: { ...parsed.application, status: "new" },
      });
    return json({ ok: true });
  } catch {
    return json({ error: "We couldn’t save that right now. Try again in a minute." }, 503);
  }
}
