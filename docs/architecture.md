# Lumière Index — Phase 1 architecture

Status: foundation implementation; not a launched newsroom.

## Scope and source of truth

The confirmed direction is a complete reset into an entertainment and pop-culture newsroom under Lumière Index, with the line “News that matters.” ÉLAN is consolidated, not rebuilt as another publication. No catalog, ratings, recommendations, ranking engine, sentiment scores, TMDB integration, AI generation, advertising, or newsletter provider is carried over.

The available new chat instructions cover sections 16–17 and the explicit Phase 1 clarification. Attachment search found an older movie-ranking change request, which is expressly excluded. Earlier newsroom master-brief sections are not visible in the available attachments; unresolved later-phase requirements must not be invented.

## Recoverability

Remote backup: `backup/elan-before-lumiere-index-2026-11-06`, verified at `0f6b6f719b11553abc23be9c7a36ccbc953c171f`.

New worktree and branch: `codex/lumiere-index-foundation`. Git ancestry is preserved. No production application or database is replaced during Phase 1. Recovery is a normal checkout of the backup branch; do not rewrite Git history.

## Technical decisions

- Next.js App Router, React, strict TypeScript; server-rendered public foundation. Reuse the pinned, previously built runtime versions; verify them again against the new application. No backend microservices or new application framework.
- Payload 3 for the planned newsroom CMS, with Postgres and Lexical. In this phase, collection definitions and schema migrations establish the data foundation. Admin UI, publishing screens, and public content integration are later milestones, not claimed working.
- A separate private `lumiere_index` database schema, with no queries into or migrations against `elan`. An isolated local database verifies migration safety. Production database reuse, credentials, and object storage are decisions deferred until reviewed. Secrets are server-only and missing CMS configuration must fail explicitly.
- Public pages do not import the CMS or require database access merely to build the foundation. No fabricated story fallback.
- The application starts with one configured owner identity. Additional editor/reporter privileges require an agreed permissions matrix; do not silently grant broader access.
- Plain CSS with a small token system; a system sans-serif stack, clear reading scale, visible keyboard focus, restrained red accent, flat rules, and no glass panels, ornamental fonts, fake bylines, fabricated article cards, or autoplay.
- Keep dependencies only where exercised by the foundation or its CMS schema. No analytics, email, advertising, payment, social SDK, or external API is represented as connected.

## Application boundaries

`src/app`: reader-facing foundation routes and metadata.
`src/components`: site identity and navigation; no speculative widget library.
`src/lib`: brand constants and URL/configuration validation.
`src/cms`: explicit access predicates and newsroom collection definitions.
`src/payload.config.ts`: migration/CLI-only CMS configuration during Phase 1.
`tests`: meaningful access/configuration/schema contracts.
`docs`: architecture, database, design foundations, validation, and founder decisions.

## Milestones

1. Backup and clean implementation boundaries; brand foundation and two usable reader routes.
2. Database architecture, owner/public access rules, new-schema migration; verify in an isolated local database.
3. Tests, lint, types, build, HTTP route checks, and a Phase 1 review report. Stop before Phase 2.

## Founder decisions before later phases

Confirm the newsroom section taxonomy and launch formats; editor/reporter/publisher permission matrix; contact addresses (canonical domain confirmed as lumiereindex.com); production database/storage reuse; and whether any legacy URLs need redirects. Hosting migrations, repository rename, paid services, production cutover, and new integrations are not implied by this foundation.
