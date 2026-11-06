# Lumière Index

News that matters. Entertainment and pop-culture newsroom foundation.

This is a clean new application on `codex/lumiere-index-foundation`. The former ÉLAN application is preserved at `backup/elan-before-lumiere-index-2026-11-06`; Git history is intact. No movie-ranking product or ÉLAN application code is used by the new reader application.

## Phase 1 scope

Next.js, React, strict TypeScript, two server-rendered reader routes, an accessible CSS foundation using a system sans-serif, explicit brand/domain configuration, and new Payload/Postgres newsroom schema definitions. Public reader pages build without a database. Canonical domain: https://lumiereindex.com. Foundation routes are noindex.

The CMS is CLI-only in this phase. No admin screen, reader content integration, search, newsletter, ad system, or newsroom role workflow is presented as complete.

## Run

`npm ci`
`npm run dev -- -p 3200`

Visit http://localhost:3200. `/` and `/about` work; nonexistent routes return 404. No external font or content requests are required.

## Verify

`npm run verify`

For CMS work, copy `.env.example` into ignored `.env.local`, set a random secret of at least 32 characters, `LUMIERE_OWNER_EMAIL`, and an isolated local PostgreSQL URI. Remote database connections are deliberately refused during Phase 1.

`npm run payload -- generate:types`
`npm run payload -- migrate`

The new schema is `lumiere_index`; schema push is disabled. `npm run payload -- run scripts/verify-database.ts` verifies the isolated test database on 127.0.0.1:55441. It creates clearly named local test data only. Never use a production database for that command.

## Decisions and review

See [architecture](docs/architecture.md), [database](docs/database.md), and [visual foundations](docs/design-system.md). The final newsroom taxonomy, roles, contact information, asset storage, production data reuse and cutover require review before later phases. The confirmed domain is lumiereindex.com; no DNS change is included in Phase 1.
