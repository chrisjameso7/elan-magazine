import 'server-only';
import { createHmac, randomUUID } from 'node:crypto';
import { getPayload } from 'payload';
import { sql } from '@payloadcms/db-postgres';
import config from '@/payload.config';
import {
  deliverWelcome,
  unsubscribeToken,
  validUnsubscribeToken,
  welcomeEmail,
} from './newsletter';

export async function newsletterCMS() {
  if (!process.env.DATABASE_URI)
    throw new Error('Newsletter database is not configured');
  return getPayload({ config });
}

export async function allowNewsletterRequest(request: Request) {
  const cms = await newsletterCMS();
  // Vercel supplies this header; do not trust a client-provided X-Forwarded-For.
  const ip = process.env.VERCEL
    ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'
    : 'local';
  const key = createHmac('sha256', process.env.PAYLOAD_SECRET || '')
    .update(`newsletter-rate:${ip}`)
    .digest('hex');
  const result = await cms.db.drizzle.execute(sql`
    INSERT INTO "elan"."newsletter_rate_limits" (key, window_start, attempts)
    VALUES (${key}, NOW(), 1)
    ON CONFLICT (key) DO UPDATE SET
      attempts = CASE WHEN newsletter_rate_limits.window_start < NOW() - INTERVAL '15 minutes' THEN 1 ELSE newsletter_rate_limits.attempts + 1 END,
      window_start = CASE WHEN newsletter_rate_limits.window_start < NOW() - INTERVAL '15 minutes' THEN NOW() ELSE newsletter_rate_limits.window_start END
    RETURNING attempts`);
  await cms.db.drizzle.execute(
    sql`DELETE FROM "elan"."newsletter_rate_limits" WHERE window_start < NOW() - INTERVAL '1 day'`,
  );
  return Number(result.rows[0]?.attempts) <= 5;
}

export async function subscribeNewsletter(email: string) {
  const cms = await newsletterCMS();
  const find = () =>
    cms.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    });
  let subscriber = (await find()).docs[0];
  if (!subscriber) {
    try {
      subscriber = await cms.create({
        collection: 'subscribers',
        overrideAccess: true,
        data: {
          email,
          status: 'active',
          subscribedAt: new Date().toISOString(),
          subscriptionId: randomUUID(),
          welcomeStatus: 'pending',
        },
      });
    } catch (error) {
      // The unique email index also protects simultaneous form submissions.
      subscriber = (await find()).docs[0];
      if (!subscriber) throw error;
    }
  } else if (subscriber.status === 'unsubscribed') {
    await cms.db.drizzle.execute(sql`
      UPDATE "elan"."subscribers" SET status = 'active', subscribed_at = NOW(), updated_at = NOW(),
        subscription_id = ${randomUUID()}, unsubscribed_at = NULL, welcome_status = 'pending',
        welcome_attempted_at = NULL, welcome_message_id = NULL
      WHERE id = ${subscriber.id} AND status = 'unsubscribed'`);
    subscriber = (await find()).docs[0];
  }
  if (subscriber.welcomeStatus === 'sent') return 'already-subscribed' as const;
  // Claim delivery atomically across serverless instances. Failed sends may retry after 15 minutes.
  let claimed;
  try {
    claimed = await cms.db.drizzle.execute(sql`
    UPDATE "elan"."subscribers" SET welcome_attempted_at = NOW()
    WHERE id = ${subscriber.id} AND subscription_id = ${subscriber.subscriptionId}
      AND status = 'active' AND welcome_status != 'sent'
      AND (welcome_attempted_at IS NULL OR welcome_attempted_at < NOW() - INTERVAL '15 minutes')
    RETURNING id`);
  } catch {
    console.warn(
      '[newsletter] Subscription saved; delivery could not be claimed.',
    );
    return 'pending' as const;
  }
  if (!claimed.rows.length) return 'pending' as const;
  const saved = subscriber;
  const result = await deliverWelcome(
    saved,
    async (record) => {
      if (!process.env.RESEND_API_KEY)
        throw new Error('Resend is not configured');
      // The configured site origin avoids Host-header injection into email links.
      const site =
        process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
      const token = unsubscribeToken(
        record.id,
        record.subscriptionId,
        process.env.PAYLOAD_SECRET || '',
      );
      const unsubscribe = new URL('/unsubscribe', site);
      unsubscribe.searchParams.set('id', String(record.id));
      unsubscribe.searchParams.set('token', token);
      const oneClick = new URL('/api/newsletter/unsubscribe', site);
      oneClick.search = unsubscribe.search;
      if (process.env.ELAN_NEWSLETTER_DELIVERY_ENABLED !== 'true')
        throw new Error('Email delivery is not enabled');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: AbortSignal.timeout(10000),
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `elan-welcome/${record.subscriptionId}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_SENDER_EMAIL,
          to: record.email,
          ...welcomeEmail(unsubscribe.href),
          headers: {
            'List-Unsubscribe': `<${oneClick.href}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }),
      });
      const data = (await response.json()) as { id?: string };
      if (!response.ok || !data.id)
        throw new Error('Welcome delivery was not accepted');
      return data.id;
    },
    async (status, messageId) => {
      await cms.update({
        collection: 'subscribers',
        id: saved.id,
        overrideAccess: true,
        data: {
          welcomeStatus: status,
          ...(messageId ? { welcomeMessageId: messageId } : {}),
        },
      });
    },
  );
  if (result === 'pending')
    console.warn('[newsletter] Subscription saved; welcome delivery pending.');
  return result;
}

export async function unsubscribeNewsletter(id: string, token: string) {
  if (!/^\d+$/.test(id) || token.length > 128) return false;
  const cms = await newsletterCMS();
  const result = await cms.find({
    collection: 'subscribers',
    where: { id: { equals: Number(id) } },
    limit: 1,
    overrideAccess: true,
  });
  const subscriber = result.docs[0];
  if (
    !subscriber ||
    !validUnsubscribeToken(
      subscriber.id,
      subscriber.subscriptionId,
      token,
      process.env.PAYLOAD_SECRET || '',
    )
  )
    return false;
  if (subscriber.status !== 'unsubscribed')
    await cms.update({
      collection: 'subscribers',
      id: subscriber.id,
      overrideAccess: true,
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString(),
      },
    });
  return true;
}
