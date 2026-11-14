# Lumière Index

News that matters. Entertainment and pop-culture newsroom, operated by Lumiere Media and Entertainment Technologies.

The application is Next.js 16 / React 19 / Payload 3 with PostgreSQL. Original Git history and the recoverable `backup/elan-before-lumiere-index-2026-11-06` branch are preserved. Work is on `codex/lumiere-index-foundation`; production cutover is a separate verified step.

## Development

Use Node 24 and `npm ci`. Copy `.env.example` to ignored `.env.local`, supply an isolated PostgreSQL connection, a random Payload secret and the owner email. Run reviewed migrations with `npm run payload -- migrate`, then `npm run dev -- --port 3200`.

- Public edition: `/`; individual articles: `/news/[slug]`.
- Newsroom: `/admin`. Accounts are provisioned by an administrator; there is no public registration.
- Private saved-draft preview: `/preview/[id]`, restricted to permitted staff.
- Navigation: Latest, Celebrity, Film & TV, Music, Culture, Exclusives and Features. Features uses the existing article format. Other sections use their canonical CMS slugs.
- Canonical publication domain: `https://lumiereindex.com`. Staging remains noindex.

## Verification

`npm run verify` runs unit tests, lint, TypeScript and the production build. The production build does not establish provider readiness.

`npm run payload -- run scripts/verify-database.ts` creates clearly labelled test records **only on the isolated database at 127.0.0.1:55441**. Set `LUMIERE_OWNER_EMAIL=owner@lumiere.test` for that command so it cannot reset a real founder account. Never run fixture creation against production.

The native workflow is Save Draft → Pending review → saved editor approval → Publish. Future first-publication dates hold stories until release; updates to already-live stories retain the original publication date and go through draft/review again. Concurrent editing uses Payload's record lock and explicit Take over control.

## Hosted configuration

See [launch runbook](docs/launch-runbook.md). Hosted connections require an explicit Supabase host allowlist and certificate validation. Schema push is disabled. The runtime database role is restricted to `lumiere_index`; old `elan` data is separate.

Hosted uploads use private S3-compatible storage and isolated environment prefixes, access-checked download URLs and signed client uploads. Recovery mail uses the Payload Resend adapter with an explicitly configured Lumière sender; installed adapters are not evidence of successful delivery.

Node dependencies include a reviewed, idempotent postinstall mitigation for the deepmerge prototype-poisoning advisory. Keep its regression test and remove the mitigation only after an upstream fix is verified. See the launch runbook for remaining audit findings.
