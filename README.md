# ÉLAN

A premium publication about people, culture, and modern life.

The six desks are CULTURE, PEOPLE, ENTERTAINMENT, STYLE, LIFE, and PLACES.
Franchises include The New Guard, Élan Conversations, Portfolio, The Edit,
After Dark, and The Élan 50. Story accents, backgrounds, and focal points live
in the CMS alongside all seven block types and structured interview Q&A.

## Preview without PostgreSQL

```sh
npm ci
npm run dev
```

Leave `DATABASE_URI` unset to serve `src/data/mockArticles.ts` without loading
Payload or opening a database connection. `/admin` redirects to the session-only
prototype at `/editorial-preview`; this route returns 404 when a database is configured. The mock dataset is dynamically loaded only on the server fallback path and is not imported by client navigation components. Configured database failures are surfaced;
they do not silently show mock content. An empty live database displays an empty
editorial state until stories are published.

## Persistent local editing

1. Start a local PostgreSQL instance. Docker users can run `docker compose up -d`.
2. Copy `.env.example` to `.env.local`, set `DATABASE_URI`, a random
   `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`.
3. For a disposable local database only, set `PAYLOAD_DB_PUSH=true` and run
   `npm run seed`. This creates the development schema and seeds four authors
   and ten stories. Existing records are never overwritten.
4. Optionally set `ELAN_EDITOR_EMAIL` and `ELAN_EDITOR_PASSWORD` before seeding
   to bootstrap the first editor. Otherwise create the first account at `/admin`.
   Seeding never adds another account when any editor already exists.
5. Run `npm run dev`, then visit `http://localhost:3000/admin`.

A workspace-local Postgres instance was also provisioned for this checkout.
Its startup helper and database files live beside the checkout in
`../local-postgres`; `node ../local-postgres/start.mjs` starts it again.
The generated `.env.local` and local access credentials are ignored by Git.

Payload's admin and REST API have their own root layout under `(payload)`.
The magazine has its own `(frontend)` layout. Public pages and search use the
server-only `cmsAdapter.ts`, query published records with populated authors,
and adapt native Payload rows to the existing public Article model. Reads are
request-time when configured, so published edits appear without a rebuild.

The prototype composer preserves all original blocks when editing its opening
paragraph and first quote. Live Payload editing supports the complete block array.

## Staging and Supabase

Use an existing project with a dedicated server-side PostgreSQL connection.
Payload stores its tables in an isolated `elan` schema. The initial migration
creates this schema and revokes direct access for PUBLIC and, when present,
Supabase's anon/authenticated roles. Keep `elan` out of Supabase's exposed Data
API schemas; all editorial access goes through Payload's authentication and
collection access rules. A Supabase publishable key is not a database URI.

Set the following in the staging host's secret/environment settings:

```ini
DATABASE_URI=<server-side PostgreSQL URI with verified TLS>
PAYLOAD_SECRET=<unique random staging secret>
NEXT_PUBLIC_SERVER_URL=https://<staging-host>
PAYLOAD_DB_PUSH=false
```

Use a distinct staging database or a dedicated schema approved for this app.
Before applying migrations, inspect the existing project's schema. Never point
local push mode at staging or production, and never run the initial migration
against a database already managed using development schema push.

```sh
npm run payload -- migrate
npm run payload -- migrate:status
npm run build
npm run start
```

Run the migration using the schema owner's database role. The `elan` schema is
separate from an existing Supabase public/auth/storage schema. An initial
migration has been tested against a fresh local PostgreSQL database with push
disabled. Remote staging activation requires project authorization and a
server-side database connection; neither passwords nor connection URIs belong
in Git. Do not use the local editor password or secret for staging.

## Adapter contract

`src/lib/payload-adapter.ts` converts native `blockType` to public `type`,
stringifies IDs, unwraps tags, requires a populated author, preserves two-image
arrays and Q&A, and removes native nested row IDs and nullable optional values.
This also prevents duplicate child IDs when copying a story. Canonical category
labels and missing formatted dates are derived consistently.

## Validation

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

The tests cover mixed-block preservation, schema constraints, nested-ID cleanup,
Payload conversion, story colors/framing, and the missing-DATABASE_URI fallback.
Live integration checks additionally cover editor login, denied anonymous writes,
persisted edits, published public pages, draft protection, and search filtering.

## Dependency triage (2026-10-23)

Next.js and eslint-config-next were updated to 16.4.2. Targeted overrides pin
DOMPurify 3.4.17, Sass 1.106.1, and source-map-js 1.2.2 to resolve the affected
runtime/editor/build dependencies.

`npm audit --omit=dev` reports zero high/critical findings and five moderate
findings in the bundled Drizzle migration-tool chain (drizzle-kit, its esbuild
loader, and esbuild). This app does not start their vulnerable development
server, and they are not request handlers. The full audit additionally reports
five high findings in the ESLint glob/braces dependency chain, which runs during
local linting. These are tracked tooling findings, not public-route or upload
buffer vulnerabilities. There is no sharp advisory in the audit, and this
configuration has no upload collection or uploaded-media processing endpoint.
Review future dependency updates before production rollout.

Next/Payload integration follows the [official installation guide](https://payloadcms.com/docs/getting-started/installation),
with [explicit PostgreSQL migrations](https://payloadcms.com/docs/database/migrations).

### Head administrator

Set server-only `ELAN_HEAD_ADMIN_EMAIL` to the owner account email in every deployment. Only that account can enter Payload admin, manage users, or create, update, publish, and delete content. Other accounts cannot make changes; public visitors can still read published stories and contributors. Missing owner configuration denies administrative access. The email is kept in deployment configuration rather than an editable role field. Trusted maintenance scripts using Payload Local API with `overrideAccess: true` retain their normal privileged behavior.

### Vercel environments

Configure both Production and Preview with `DATABASE_URI` (Supabase session pooler port 5432), `PAYLOAD_SECRET`, the environment’s `NEXT_PUBLIC_SERVER_URL`, `ELAN_HEAD_ADMIN_EMAIL`, and `PAYLOAD_DB_PUSH=false`. Use the same Payload secret as the seeded environment. The official Supabase database CA is bundled server-side; remove workstation-specific `sslrootcert` paths when copying a URI. The pool verifies TLS and limits each server instance to one database connection. Do not upload seed passwords as deployment variables.
