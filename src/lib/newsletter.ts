import { createHmac, timingSafeEqual } from 'node:crypto';

export function normalizeSubscriberEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))
    return null;
  return email;
}

export function unsubscribeToken(
  id: string | number,
  subscriptionId: string,
  secret: string,
): string {
  if (!secret) throw new Error('Newsletter signing secret is missing');
  return createHmac('sha256', secret)
    .update(`elan-newsletter:${id}:${subscriptionId}`)
    .digest('base64url');
}

export function validUnsubscribeToken(
  id: string | number,
  subscriptionId: string,
  token: string,
  secret: string,
): boolean {
  const expected = Buffer.from(unsubscribeToken(id, subscriptionId, secret));
  const received = Buffer.from(token);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export function welcomeEmail(unsubscribeURL: string) {
  const safeURL = unsubscribeURL
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;');
  return {
    subject: 'Welcome to The ÉLAN Briefing',
    text: `Welcome to The ÉLAN Briefing.\n\nYou’re on the list. Look out for personalities, conversations, music, film, and creative work selected by the ÉLAN editors.\n\nThank you for reading ÉLAN.\n\nThe ÉLAN Editors\n\nUnsubscribe at any time: ${unsubscribeURL}`,
    html: `<div style="background:#F3F0E9;padding:40px 24px;color:#11100F;font-family:Georgia,serif;line-height:1.7"><div style="max-width:560px;margin:auto"><p style="color:#171717;letter-spacing:5px;font-size:32px">ÉLAN</p><h1 style="font-size:30px;font-weight:400;color:#171717">Welcome to The ÉLAN Briefing.</h1><p>You’re on the list. Look out for personalities, conversations, music, film, and creative work selected by the ÉLAN editors.</p><p>Thank you for reading ÉLAN.</p><p>The ÉLAN Editors</p><hr style="border:0;border-top:1px solid #17171733;margin:32px 0"><p style="font-size:13px"><a href="${safeURL}" style="color:#171717">Unsubscribe at any time</a></p></div></div>`,
  };
}

// Storage happens before delivery. Delivery failures never undo a subscription.
export async function deliverWelcome<T>(
  saved: T,
  send: (subscriber: T) => Promise<string>,
  record: (status: 'sent' | 'failed', messageId?: string) => Promise<void>,
): Promise<'sent' | 'pending'> {
  try {
    const messageId = await send(saved);
    await record('sent', messageId);
    return 'sent';
  } catch {
    try {
      await record('failed');
    } catch {
      /* The subscription is already committed. */
    }
    return 'pending';
  }
}

export function isNewsletterOriginAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const source = new URL(origin);
    const target = new URL(request.url);
    return (
      source.host === (request.headers.get('host') || target.host) &&
      source.protocol === target.protocol
    );
  } catch {
    return false;
  }
}
