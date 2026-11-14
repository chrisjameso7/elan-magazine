import nextEnv from "@next/env";
import { randomBytes } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
nextEnv.loadEnvConfig(process.cwd());
const target = new URL(process.env.DATABASE_URI || "");
if (target.hostname !== "127.0.0.1" || target.port !== "55441")
  throw Error("This bootstrap is restricted to the isolated local newsroom.");
const { getPayload } = await import("payload");
const { default: config } = await import("../src/payload.config");
const cms = await getPayload({ config });
try {
  const email = process.env.LUMIERE_OWNER_EMAIL!;
  let owner = (
    await cms.find({
      collection: "users",
      where: { email: { equals: email } },
      overrideAccess: true,
      limit: 1,
    })
  ).docs[0];
  if (!owner) {
    const password = randomBytes(32).toString("base64url");
    owner = await cms.create({
      collection: "users",
      overrideAccess: true,
      context: { bootstrapOwner: true },
      data: { name: "Chris James", email, role: "administrator", password },
    });
    const response = await fetch("http://localhost:3200/api/users/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (
      !response.ok ||
      result.user?.email !== email ||
      result.user?.role !== "administrator"
    )
      throw Error("Native owner login verification failed.");
    console.log("Owner native API login verified.");
  }
  let contributor = (
    await cms.find({
      collection: "contributors",
      user: owner,
      overrideAccess: false,
      where: { slug: { equals: "chris-james" } },
      limit: 1,
    })
  ).docs[0];
  if (!contributor)
    contributor = await cms.create({
      collection: "contributors",
      user: owner,
      overrideAccess: false,
      data: {
        name: "Chris James",
        slug: "chris-james",
        bio: "Founder and CEO of Lumiere Media and Entertainment Technologies.",
      },
    });
  await cms.update({
    collection: "users",
    id: owner.id,
    user: owner,
    overrideAccess: false,
    data: { contributor: contributor.id },
  });
  for (const [name, slug] of [
    ["Celebrity", "celebrity"],
    ["Film & TV", "film-tv"],
    ["Music", "music"],
    ["Culture", "culture"],
    ["Exclusives", "exclusives"],
  ]) {
    const exists = await cms.find({
      collection: "sections",
      where: { slug: { equals: slug } },
      user: owner,
      overrideAccess: false,
      limit: 1,
    });
    if (!exists.totalDocs)
      await cms.create({
        collection: "sections",
        user: owner,
        overrideAccess: false,
        data: { name, slug },
      });
  }
  const token = await cms.forgotPassword({
    collection: "users",
    data: { email },
    disableEmail: true,
    expiration: 3600000,
  });
  if (!token) throw Error("Account setup token was not created.");
  const setupURL = `http://localhost:3200/admin/reset/${token}`;
  mkdirSync("work", { recursive: true });
  writeFileSync(
    "work/owner-account-setup.html",
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Lumière newsroom account setup</title><style>body{max-width:600px;margin:60px auto;padding:20px;font:18px/1.6 Arial;color:#211b16}a{display:inline-block;padding:15px 20px;background:#211b16;color:white}small{display:block;margin-top:30px}</style><h1>Set your newsroom password</h1><p>Administrator: <strong>${email}</strong></p><p>This private, one-use setup link expires in one hour. Keep the local site running.</p><a href="${setupURL}">Choose my password →</a><small>Local development only. This does not create a production account or send an email.</small></html>`,
    { mode: 0o600 },
  );
  writeFileSync(
    "work/owner-account-setup.json",
    JSON.stringify({
      email,
      url: setupURL,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    }),
    { mode: 0o600 },
  );
  console.log(
    "Administrator and canonical sections prepared. Private one-use setup file written; no password or reset token logged.",
  );
} finally {
  await cms.destroy();
}
