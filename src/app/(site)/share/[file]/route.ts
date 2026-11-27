import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getPublishedArticle, populated } from "@/lib/publication";
import { siteURL } from "@/lib/brand";
import type { Media } from "@/cms/payload-types";

type Images = {
  input(input: ReadableStream<Uint8Array>): {
    transform(options: Record<string, unknown>): {
      output(options: { format: string; quality?: number }): Promise<{ response(): Response }>;
    };
  };
};
type Env = {
  IMAGES?: Images;
  WORKER_SELF_REFERENCE?: { fetch(request: Request): Promise<Response> };
};

/** Link previews (WhatsApp especially) skip WebP, so serve each story's hero as a 1200x630 JPEG. */
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const slug = file.replace(/\.jpg$/, "");
  const article = await getPublishedArticle(slug);
  const hero = article ? populated<Media>(article.hero) : undefined;
  if (!hero?.url) return new Response("Not found", { status: 404 });
  const source = new URL(hero.url, siteURL());
  let env: Env = {};
  try {
    env = getCloudflareContext().env as Env;
  } catch {}
  if (!env.IMAGES || !env.WORKER_SELF_REFERENCE)
    return Response.redirect(source.href, 302);
  const original = await env.WORKER_SELF_REFERENCE.fetch(new Request(source.href));
  if (!original.ok || !original.body)
    return new Response("Image unavailable", { status: 502 });
  const image = await env.IMAGES.input(original.body)
    .transform({ width: 1200, height: 630, fit: "cover" })
    .output({ format: "image/jpeg", quality: 82 });
  const response = image.response();
  return new Response(response.body, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
}
