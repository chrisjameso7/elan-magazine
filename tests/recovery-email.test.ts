import { test } from "node:test";
import assert from "node:assert/strict";
import { recoveryEmail } from "../src/cms/recovery-email";
test("recovery email escapes account data and encodes the native one-use reset URL", () => {
  const html = recoveryEmail({
    origin: "https://lumiereindex.netlify.app",
    name: '<script>alert("name")</script>',
    token: 'secret/?&"',
  });
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("/admin/reset/secret%2F%3F%26%22"));
  assert.ok(
    html.includes(
      "https://lumiereindex.netlify.app/brand/lumiere-index-logo.png",
    ),
  );
  assert.equal((html.match(/href=/g) || []).length, 2);
  assert.throws(() =>
    recoveryEmail({ origin: "javascript:alert(1)", token: "test" }),
  );
});
