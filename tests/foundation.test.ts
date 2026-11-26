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
