import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Subscribers } from '../src/collections/Subscribers';
import {
  deliverWelcome,
  isNewsletterOriginAllowed,
  normalizeSubscriberEmail,
  unsubscribeToken,
  validUnsubscribeToken,
  welcomeEmail,
} from '../src/lib/newsletter';

test('subscriber emails normalize and reject malformed or oversized input', () => {
  assert.equal(
    normalizeSubscriberEmail(' Reader+Briefing@Example.com '),
    'reader+briefing@example.com',
  );
  for (const value of [
    null,
    {},
    'bad',
    'a@b',
    'x\r\n@y.com',
    '<a>@example.com',
    `${'x'.repeat(250)}@example.com`,
  ])
    assert.equal(normalizeSubscriberEmail(value), null);
});

test('unsubscribe signatures reject tampering and old subscription links after resubscription', () => {
  const token = unsubscribeToken(12, 'subscription-1', 'secret');
  assert.ok(validUnsubscribeToken(12, 'subscription-1', token, 'secret'));
  assert.equal(
    validUnsubscribeToken(13, 'subscription-1', token, 'secret'),
    false,
  );
  assert.equal(
    validUnsubscribeToken(12, 'subscription-2', token, 'secret'),
    false,
  );
  assert.equal(
    validUnsubscribeToken(12, 'subscription-1', token + 'x', 'secret'),
    false,
  );
});

test('a failed email preserves the saved subscriber and reports pending delivery', async () => {
  const saved = { id: 1, email: 'reader@example.com' };
  const statuses: string[] = [];
  assert.equal(
    await deliverWelcome(
      saved,
      async (record) => {
        assert.equal(record, saved);
        throw new Error('Provider unavailable');
      },
      async (status) => {
        statuses.push(status);
      },
    ),
    'pending',
  );
  assert.deepEqual(saved, { id: 1, email: 'reader@example.com' });
  assert.deepEqual(statuses, ['failed']);
});

test('delivery success records the message ID; tracking failures still return a clean pending response', async () => {
  let recorded;
  assert.equal(
    await deliverWelcome(
      {},
      async () => 'message-1',
      async (status, id) => {
        recorded = { status, id };
      },
    ),
    'sent',
  );
  assert.deepEqual(recorded, { status: 'sent', id: 'message-1' });
  assert.equal(
    await deliverWelcome(
      {},
      async () => 'message-2',
      async () => {
        throw new Error('Database unavailable');
      },
    ),
    'pending',
  );
});

test('welcome email contains the requested subject and unsubscribe in text and HTML', () => {
  const email = welcomeEmail('https://example.com/unsubscribe?id=1&token=test');
  assert.equal(email.subject, 'Welcome to The ÉLAN Briefing');
  assert.match(email.text, /selected by the ÉLAN editors/);
  assert.match(
    email.text,
    /https:\/\/example.com\/unsubscribe\?id=1&token=test/,
  );
  assert.match(email.html, /id=1&amp;token=test/);
});

test('anonymous users cannot read or mutate subscriber records through Payload REST', async () => {
  for (const action of ['read', 'create', 'update', 'delete'] as const)
    assert.equal(
      await Subscribers.access![action]!({ req: { user: null } } as never),
      false,
    );
});

test('origin checks use the public host behind Next.js internal routing', () => {
  const request = (origin: string) =>
    new Request('http://localhost:3000/api/newsletter/subscribe', {
      headers: { host: '127.0.0.1:3000', origin },
    });
  assert.equal(
    isNewsletterOriginAllowed(request('http://127.0.0.1:3000')),
    true,
  );
  assert.equal(
    isNewsletterOriginAllowed(request('https://attacker.example')),
    false,
  );
  assert.equal(isNewsletterOriginAllowed(request('null')), false);
});
