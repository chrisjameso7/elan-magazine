import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
const env = JSON.parse(readFileSync("work/hosted-setup-private.json", "utf8"));
if (
  env.LUMIERE_DATABASE_MODE !== "hosted" ||
  env.S3_PREFIX !== "lumiere-index/preview"
)
  throw Error("Preview only");
for (const [k, v] of Object.entries(env))
  if (typeof v === "string") process.env[k] = v;
delete process.env.MEDIA_STORAGE;
delete process.env.RESEND_API_KEY;
const { getPayload } = await import("payload");
const { default: config } = await import("../src/payload.config");
const cms = await getPayload({ config });
try {
  const owner = (
    await cms.find({
      collection: "users",
      where: { email: { equals: env.LUMIERE_OWNER_EMAIL } },
      overrideAccess: true,
      limit: 1,
    })
  ).docs[0];
  if (!owner) throw Error("Owner missing");
  const fixtures: {
    users: Array<{ id: number; email: string; password: string; role: string }>;
    articles: number[];
    media: number[];
    contributors: number[];
    sections: number[];
  } = { users: [], articles: [], media: [], contributors: [], sections: [] };
  const suffix = randomBytes(5).toString("hex");
  for (const role of ["administrator", "editor", "writer", "writer"] as const) {
    const password = randomBytes(24).toString("hex");
    const user = await cms.create({
      collection: "users",
      user: owner,
      overrideAccess: false,
      data: {
        name: "Launch verification " + role,
        email: `qa-${role}-${fixtures.users.length}-${suffix}@lumiere.test`,
        role,
        password,
      },
    });
    fixtures.users.push({ id: user.id, email: user.email, password, role });
  }
  writeFileSync("work/hosted-workflow-private.json", JSON.stringify(fixtures));
  console.log(
    "Temporary hosted workflow accounts prepared; founder credentials unchanged.",
  );
} finally {
  await cms.destroy();
}
process.exit(0);
