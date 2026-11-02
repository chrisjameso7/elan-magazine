import { unsubscribeNewsletter } from '@/lib/newsletterServer';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const form = request.headers
    .get('content-type')
    ?.includes('application/x-www-form-urlencoded')
    ? await request.formData()
    : null;
  const id = String(form?.get('id') || url.searchParams.get('id') || '');
  const token = String(
    form?.get('token') || url.searchParams.get('token') || '',
  );
  try {
    const success = await unsubscribeNewsletter(id, token);
    if (form?.has('id'))
      return Response.redirect(
        new URL(
          `/unsubscribe?${success ? 'done=1' : 'invalid=1'}`,
          request.url,
        ),
        303,
      );
    return Response.json(
      { unsubscribed: success },
      { status: success ? 200 : 400, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { error: 'Please try again shortly.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
