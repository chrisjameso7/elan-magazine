import { getArticles } from '@/lib/cmsAdapter';
export const dynamic = 'force-dynamic';
export async function GET() { return Response.json(await getArticles(), { headers: { 'Cache-Control': 'no-store' } }); }
