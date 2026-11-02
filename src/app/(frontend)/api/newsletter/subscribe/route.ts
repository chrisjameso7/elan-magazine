import {
  isNewsletterOriginAllowed,
  normalizeSubscriberEmail,
} from '@/lib/newsletter';
import {
  allowNewsletterRequest,
  subscribeNewsletter,
} from '@/lib/newsletterServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const respond = (body: object, status = 200) =>
    Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  if (!isNewsletterOriginAllowed(request))
    return respond({ error: 'Please subscribe from the ÉLAN website.' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json'))
    return respond({ error: 'Please send a valid subscription.' }, 415);
  const raw = await request.text();
  if (raw.length > 2048)
    return respond({ error: 'Please send a valid subscription.' }, 413);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return respond({ error: 'Please send a valid subscription.' }, 400);
  }
  const email = normalizeSubscriberEmail(body?.email);
  if (!email)
    return respond({ error: 'Please enter a valid email address.' }, 400);
  if (body?.consent !== true)
    return respond(
      {
        error: 'Please confirm that you want to receive ÉLAN editorial emails.',
      },
      400,
    );
  if (body?.website)
    return respond({ status: 'subscribed', welcome: 'pending' }); // Honeypot.
  try {
    if (!(await allowNewsletterRequest(request)))
      return respond(
        { error: 'Please wait a few minutes before trying again.' },
        429,
      );
    const delivery = await subscribeNewsletter(email);
    const welcome = delivery === 'already-subscribed' ? 'sent' : delivery;
    return respond({
      status: 'subscribed',
      welcome,
      message:
        welcome === 'pending'
          ? 'Your request is saved. Email editions are being prepared; we’ll be in touch when they launch.'
          : 'You’re on the list. Welcome to ÉLAN.',
    });
  } catch {
    console.error('[newsletter] Subscription could not be saved.');
    return respond(
      {
        error: 'We couldn’t save your subscription. Please try again shortly.',
      },
      503,
    );
  }
}
