// Cloudflare Workers Builds entry point: `node scripts/cloudflare-ci.mjs build|deploy`.
// Non-secret settings come from wrangler.jsonc vars; secrets come from the
// encrypted build variables set in the Cloudflare dashboard.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const mode = process.argv[2];
if (!["build", "deploy"].includes(mode)) {
  console.error("Usage: node scripts/cloudflare-ci.mjs build|deploy");
  process.exit(2);
}
const vars = JSON.parse(readFileSync("wrangler.jsonc", "utf8")).vars ?? {};
const env = { ...vars, ...process.env };
const RUNTIME_SECRETS = [
  "DATABASE_URI",
  "PAYLOAD_SECRET",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
  "RESEND_API_KEY",
];
const missing = RUNTIME_SECRETS.filter((name) => !env[name]?.trim());
if (missing.length) {
  console.error(
    `Add these as build variables (Settings → Build → Variables and secrets): ${missing.join(", ")}`,
  );
  process.exit(1);
}
function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...env, ...extraEnv },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (mode === "build") {
  run("npm", ["run", "build:cloudflare"]);
} else {
  if (env.MIGRATION_DATABASE_URI?.trim()) {
    console.log("Applying newsroom database migrations…");
    run("npx", ["payload", "migrate"], {
      DATABASE_URI: env.MIGRATION_DATABASE_URI,
      LUMIERE_HOSTING_PLATFORM: "",
    });
  } else {
    console.log("MIGRATION_DATABASE_URI is not set; skipping migrations.");
  }
  mkdirSync(".open-next", { recursive: true });
  const file = ".open-next/runtime-secrets.json";
  writeFileSync(
    file,
    JSON.stringify(Object.fromEntries(RUNTIME_SECRETS.map((k) => [k, env[k]]))),
    { mode: 0o600 },
  );
  try {
    run("npx", ["wrangler", "deploy", "--secrets-file", file]);
  } finally {
    rmSync(file, { force: true });
  }
}
