import { cmsServerURL, isHostedRuntime } from "../src/cms/hosting";
import { test } from "node:test";
import assert from "node:assert/strict";
import { brand, siteURL } from "../src/lib/brand";
import { cmsEnvironment } from "../src/cms/environment";
import {
  isAdmin,
  isEditor,
  isStaff,
  releasedArticlesWhere,
} from "../src/cms/access";
import { safeURL } from "../src/lib/safe-url";
import { editorialFingerprint } from "../src/cms/workflow";
test("confirmed canonical domain and safe origin configuration", () => {
  assert.equal(brand.name, "The Index");
  assert.equal(brand.fullName, "The Index Magazine by Lumière");
  assert.equal(siteURL("").origin, "https://lumiereindex.com");
  for (const v of [
    "javascript:alert(1)",
    "https://u:p@example.com",
    "https://example.com/path",
    "https://example.com?q=x",
  ])
    assert.throws(() => siteURL(v));
});
test("CMS configuration fails closed and unapproved remote databases are rejected", () => {
  assert.throws(() => cmsEnvironment({}), /DATABASE_URI/);
  const env = {
    DATABASE_URI: "postgresql://local@127.0.0.1:55441/postgres",
    PAYLOAD_SECRET: "x".repeat(40),
    LUMIERE_OWNER_EMAIL: "Owner@Lumiere.test",
  };
  assert.equal(cmsEnvironment(env).owner, "owner@lumiere.test");
  assert.throws(
    () => cmsEnvironment({ ...env, PAYLOAD_SECRET: "short" }),
    /32/,
  );
  assert.throws(() =>
    cmsEnvironment({
      ...env,
      DATABASE_URI: "postgresql://u@db.example.com/app",
    }),
  );
});
test("staff hierarchy does not promote writers or anonymous readers", () => {
  assert.equal(isStaff(null), false);
  assert.equal(isAdmin({ role: "writer" }), false);
  assert.equal(isEditor({ role: "writer" }), false);
  assert.equal(isStaff({ role: "writer" }), true);
  assert.equal(isEditor({ role: "editor" }), true);
  assert.equal(isAdmin({ role: "editor" }), false);
  assert.equal(isAdmin({ role: "administrator" }), true);
});
test("public predicate excludes unapproved, future and test material", () => {
  assert.deepEqual(releasedArticlesWhere(new Date("2026-11-06T00:00:00Z")), {
    and: [
      { _status: { equals: "published" } },
      { reviewStatus: { equals: "approved" } },
      { publishedAt: { less_than_equal: "2026-11-06T00:00:00.000Z" } },
      { isTestData: { not_equals: true } },
    ],
  });
});
test("editorial approval fingerprints normalize populated relationships but detect changed reporting", () => {
  const base = {
    title: "Title",
    section: 1,
    contributors: [2],
    body: { root: { children: [{ type: "text", text: "Original" }] } },
  };
  assert.equal(
    editorialFingerprint(base),
    editorialFingerprint({
      ...base,
      section: { id: 1, name: "Section" },
      contributors: [{ id: 2, name: "Writer" }],
    }),
  );
  assert.notEqual(
    editorialFingerprint(base),
    editorialFingerprint({
      ...base,
      body: { root: { children: [{ type: "text", text: "Altered" }] } },
    }),
  );
});
test("reader links reject executable, data and protocol-relative URLs", () => {
  for (const v of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.example/x",
    "/\\evil.example/x",
  ])
    assert.equal(safeURL(v), undefined);
  assert.equal(safeURL("/news/story"), "/news/story");
  assert.equal(safeURL("https://example.com"), "https://example.com/");
  assert.equal(
    safeURL("mailto:contact@lumiereindex.com"),
    "mailto:contact@lumiereindex.com",
  );
});

test("hosted database access requires an explicit approved provider host", () => {
  const base = {
    DATABASE_URI:
      "postgresql://app:secret@aws-0-eu-west-1.pooler.supabase.com:5432/postgres",
    PAYLOAD_SECRET: "x".repeat(40),
    LUMIERE_OWNER_EMAIL: "owner@example.com",
    LUMIERE_DATABASE_MODE: "hosted",
    LUMIERE_DATABASE_HOST: "aws-0-eu-west-1.pooler.supabase.com",
  };
  assert.equal(cmsEnvironment(base).owner, "owner@example.com");
  assert.throws(() =>
    cmsEnvironment({
      ...base,
      LUMIERE_DATABASE_HOST: "wrong.pooler.supabase.com",
    }),
  );
  assert.throws(() =>
    cmsEnvironment({
      ...base,
      DATABASE_URI: "postgresql://app:secret@evil.example/postgres",
      LUMIERE_DATABASE_HOST: "evil.example",
    }),
  );
  assert.throws(() =>
    cmsEnvironment({
      ...base,
      DATABASE_URI: "postgresql://local@127.0.0.1:55441/postgres",
      VERCEL: "1",
    }),
  );
});

test("deepmerge cannot poison returned objects through either operand", async () => {
  const { default: merge } = await import("deepmerge");
  const malicious = JSON.parse(
    '{"__proto__":{"poisoned":true},"constructor":{"prototype":{"poisoned":true}}}',
  );
  for (const result of [
    merge(malicious, { safe: true }),
    merge({ safe: true }, malicious),
  ]) {
    assert.equal(Object.getPrototypeOf(result), Object.prototype);
    assert.equal((result as Record<string, unknown>).poisoned, undefined);
    assert.equal(
      Object.prototype.hasOwnProperty.call(result, "__proto__"),
      false,
    );
    assert.equal(result.safe, true);
  }
  assert.deepEqual(merge({ items: [1] }, { items: [2] }), { items: [1, 2] });
});

test("Netlify detects hosted functions and selects the actual preview origin", () => {
  assert.equal(
    isHostedRuntime({ NETLIFY: "true", CONTEXT: "deploy-preview" }),
    true,
  );
  assert.equal(
    isHostedRuntime({ AWS_LAMBDA_FUNCTION_NAME: "next-server" }),
    true,
  );
  assert.equal(isHostedRuntime({ NETLIFY: "true", CONTEXT: "dev" }), false);
  assert.equal(
    cmsServerURL({
      NETLIFY: "true",
      DEPLOY_PRIME_URL: "https://deploy-preview-5--lumiere.netlify.app",
      URL: "https://lumiere.netlify.app",
    }),
    "https://deploy-preview-5--lumiere.netlify.app",
  );
  assert.throws(() =>
    cmsServerURL({ NETLIFY: "true", CMS_SERVER_URL: "http://localhost:3200" }),
  );
  assert.throws(() =>
    cmsServerURL({
      NETLIFY: "true",
      CMS_SERVER_URL: "https://user:pass@example.com",
    }),
  );
  assert.throws(() => cmsServerURL({ NETLIFY: "true" }));
  const local = {
    DATABASE_URI: "postgresql://local@127.0.0.1:55441/postgres",
    PAYLOAD_SECRET: "x".repeat(40),
    LUMIERE_OWNER_EMAIL: "owner@example.com",
    NETLIFY: "true",
  };
  assert.throws(() => cmsEnvironment(local));
});

test("Cloudflare hosting fails closed for local database configuration", () => {
  assert.equal(
    isHostedRuntime({ LUMIERE_HOSTING_PLATFORM: "cloudflare" }),
    true,
  );
  assert.throws(
    () =>
      cmsEnvironment({
        LUMIERE_HOSTING_PLATFORM: "cloudflare",
        DATABASE_URI: "postgresql://test@127.0.0.1:55441/postgres",
        PAYLOAD_SECRET: "x".repeat(40),
        LUMIERE_OWNER_EMAIL: "owner@example.com",
      }),
    /local database/,
  );
});
test("Put Us On tips are validated, trimmed and protected from bots", async () => {
  const { parseTip } = await import("../src/lib/tips");
  const ok = parseTip({ name: "  Ada  ", link: "https://www.tiktok.com/@ada", why: "x".repeat(400), isSelf: true });
  assert.ok("tip" in ok);
  if ("tip" in ok) {
    assert.equal(ok.tip.name, "Ada");
    assert.equal(ok.tip.why?.length, 280);
    assert.equal(ok.tip.isSelf, true);
  }
  assert.ok("error" in parseTip({ name: "Ada", link: "javascript:alert(1)" }));
  assert.ok("error" in parseTip({ name: "Ada", link: "https://u:p@example.com" }));
  assert.ok("error" in parseTip({ name: "A", link: "https://example.com" }));
  assert.ok("error" in parseTip({ name: "Ada", link: "https://example.com", website: "spam" }));
  assert.ok("error" in parseTip({ name: "Ada", link: "https://example.com", email: "nope" }));
  assert.ok("error" in parseTip(null));
});
test("Cloudflare Workers can run on Hyperdrive alone, other hosts still need DATABASE_URI", () => {
  const base = { PAYLOAD_SECRET: "x".repeat(40), LUMIERE_OWNER_EMAIL: "owner@lumiere.test" };
  const cf = cmsEnvironment({ ...base, LUMIERE_HOSTING_PLATFORM: "cloudflare" });
  assert.equal(cf.uri, "");
  assert.equal(cf.hyperdriveOnly, true);
  assert.throws(() => cmsEnvironment({ ...base, LUMIERE_HOSTING_PLATFORM: "cloudflare", PAYLOAD_SECRET: "short" }), /PAYLOAD_SECRET/);
  assert.throws(() => cmsEnvironment(base), /DATABASE_URI/);
});
test("Writer applications are validated and cleaned", async () => {
  const { parseApplication } = await import("../src/lib/applications");
  const ok = parseApplication({ name: " Ada ", email: "ADA@Example.com", beats: ["music", "nope", "music"], formats: ["critique"], pitch: "A first look at a director shooting sci-fi on a borrowed phone in Lagos." });
  assert.ok("application" in ok);
  if ("application" in ok) {
    assert.equal(ok.application.email, "ada@example.com");
    assert.deepEqual(ok.application.beats, ["music"]);
  }
  assert.ok("error" in parseApplication({ name: "Ada", email: "ada@example.com", beats: [], pitch: "x".repeat(50) }));
  assert.ok("error" in parseApplication({ name: "Ada", email: "bad", beats: ["music"], pitch: "x".repeat(50) }));
  assert.ok("error" in parseApplication({ name: "Ada", email: "ada@example.com", beats: ["music"], pitch: "too short" }));
  assert.ok("error" in parseApplication({ name: "Ada", email: "ada@example.com", beats: ["music"], pitch: "x".repeat(50), website: "spam" }));
});
test("Newsletter sign-up opts readers in to The Index topic only", async () => {
  const { parseSubscriber, subscribe } = await import("../src/lib/newsletter");
  assert.deepEqual(parseSubscriber({ email: " Ada@Example.com " }), { email: "ada@example.com" });
  assert.ok("error" in parseSubscriber({ email: "nope" }));
  assert.ok("error" in parseSubscriber({ email: "a@b.co", website: "spam" }));
  const config = { apiKey: "k", segmentId: "seg", topicId: "top" };
  const calls: { url: string; method?: string; body?: string }[] = [];
  const ok = async (url: string, init?: RequestInit) => {
    calls.push({ url, method: init?.method, body: init?.body as string });
    return new Response("{}", { status: 200 });
  };
  await subscribe("ada@example.com", config, ok as typeof fetch);
  assert.equal(calls.length, 1);
  const created = JSON.parse(calls[0].body!);
  assert.deepEqual(created.segments, [{ id: "seg" }]);
  assert.deepEqual(created.topics, [{ id: "top", subscription: "opt_in" }]);
  calls.length = 0;
  const existing = async (url: string, init?: RequestInit) => {
    calls.push({ url, method: init?.method, body: init?.body as string });
    return new Response("{}", { status: init?.method === "POST" && url.endsWith("/contacts") ? 409 : 200 });
  };
  await subscribe("ada@example.com", config, existing as typeof fetch);
  assert.deepEqual(calls.map((c) => c.method), ["POST", "POST", "PATCH"]);
  assert.match(calls[1].url, /\/contacts\/ada%40example\.com\/segments\/seg$/);
  assert.equal(created.unsubscribed, false);
  await assert.rejects(subscribe("ada@example.com", config, (async () => new Response("{}", { status: 500 })) as typeof fetch));
});
test("Newsletter welcome email is plain, branded and never throws", async () => {
  const { sendWelcome, welcomeEmailHTML } = await import("../src/lib/newsletter");
  const html = welcomeEmailHTML();
  assert.match(html, /You’re on the <i>list\.<\/i>/);
  assert.equal(html.includes("—"), false);
  let sent: Record<string, unknown> = {};
  await sendWelcome("ada@example.com", "k", (async (_u: string, init?: RequestInit) => {
    sent = JSON.parse(init!.body as string);
    return new Response("{}", { status: 200 });
  }) as typeof fetch);
  assert.equal(sent.from, "The Index <newsletter@lumiereindex.com>");
  assert.equal(sent.reply_to, "contact@lumiereindex.com");
  await sendWelcome("ada@example.com", "k", (async () => { throw new Error("down"); }) as typeof fetch);
});
