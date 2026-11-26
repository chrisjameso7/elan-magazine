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
// DATABASE_URI is optional: the Worker reaches Postgres through Hyperdrive.
const OPTIONAL_SECRETS = ["DATABASE_URI"];
const RUNTIME_SECRETS = [
  "PAYLOAD_SECRET",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
  "RESEND_API_KEY",
];
const missing = RUNTIME_SECRETS.filter((name) => !env[name]?.trim());
if (missing.length)
  console.warn(
    `Not in build variables: ${missing.join(", ")}. The deploy keeps any value already saved as a Worker secret (Settings → Variables and Secrets).`,
  );
// The build only needs well-formed values to load the CMS config. Real values
// are read from the Worker's secrets at runtime and are never bundled.
if (mode === "build")
  for (const name of missing) env[name] = `build-only-placeholder-${"x".repeat(32)}`;
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
  // OpenNext's deploy step starts a local Wrangler proxy that insists on a
  // local stand-in for the Hyperdrive binding. It is never deployed or used.
  env.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE ||=
    "postgres://placeholder:placeholder@127.0.0.1:5432/placeholder";
  const secrets = Object.fromEntries(
    [...RUNTIME_SECRETS, ...OPTIONAL_SECRETS]
      .filter((k) => process.env[k]?.trim())
      .map((k) => [k, process.env[k]]),
  );
  if (!Object.keys(secrets).length) {
    run("npx", ["wrangler", "deploy"]);
  } else {
    mkdirSync(".open-next", { recursive: true });
    const file = ".open-next/runtime-secrets.json";
    writeFileSync(file, JSON.stringify(secrets), { mode: 0o600 });
    try {
      run("npx", ["wrangler", "deploy", "--secrets-file", file]);
    } finally {
      rmSync(file, { force: true });
    }
  }
}
