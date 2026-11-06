# Phase 1 — Foundation review

Date: 6 November 2026. Scope: foundation only. Phase 2 has not started.

## Implemented

- Verified recoverable remote backup branch `backup/elan-before-lumiere-index-2026-11-06` at `0f6b6f719b11553abc23be9c7a36ccbc953c171f`; all original Git ancestry preserved.
- A clean new implementation in a separate worktree and branch `codex/lumiere-index-foundation`. Old application code, datasets, templates, fonts, API routes, tests and migrations are removed from this implementation, not from Git history.
- Next.js/React/strict TypeScript application, server-rendered Home and About routes, useful 404, robots exclusion, and explicit foundation noindex metadata. Canonical domain is the founder-confirmed `lumiereindex.com`.
- System sans-serif masthead and layout, spacing/color/reading tokens, visible keyboard focus, skip navigation, mobile CSS breakpoint, no external fonts and no fabricated editorial inventory. Every visible navigation link resolves.
- New Payload collection definitions for users, contributors, sections, media and articles, including stable relations, unique slugs, media alt/credit requirements, article versions/drafts, and publication-time predicates.
- A reviewed new-schema migration creates `lumiere_index`, adds relational constraints/indexes, revokes public schema/table/sequence access and enables RLS. CMS configuration fails closed and refuses remote databases during this foundation phase.
- Current architecture, database, visual-system, and run/verification documentation.

## Verified

- Fresh dependency installation using the new lockfile.
- `npm run verify`: four focused automated tests, lint with no errors, TypeScript, and production build all pass.
- A freshly initialized password-authenticated isolated local PostgreSQL cluster applied the migration successfully. Its first run exposed a missing schema-creation statement; the correction was tested successfully before sign-off.
- `npm run payload -- run scripts/verify-database.ts`: owner login; contributor/section/article relationships; draft -> published -> future-dated visibility; anonymous write and user-record denial; unique section slug enforcement; RLS on all new tables; absence of any legacy `elan` tables in the test database.
- HTTP checks: Home, About and robots return 200; unknown/admin/legacy cover/unimplemented newsletter URLs return 404. All visible internal links resolve. Canonical-domain and noindex metadata and skip target are present in initial HTML; no font preloads or legacy ranking providers are loaded.
- Application source and production database remain on their existing live release; no production migration, DNS change, repository rename, integration activation or release occurred.

## Not complete or not verified

This is not the complete newsroom or its final homepage. Admin screens, newsroom role workflows, reader article integration, public media delivery, search, newsletter, analytics, advertising, editorial sections and production storage/deployment are not implemented. No controls for them are shown as if working.

CSS responsive rules are implemented, but pixel-level desktop/mobile visual QA, browser interaction testing, assistive-technology review, and the founder's visual review remain pending. Route/HTML checks do not substitute for that review. A local preview is available on port 3200. Opening the preview was queued in Codex; that is not evidence of a browser review.

The local migration's UP path is verified. No production database backup/restore or migration rollback is claimed. A production cutover requires its own reviewed recovery plan.

## Decisions for the founder before Phase 2

1. Confirm the proposed Payload/Postgres newsroom foundation and review the visual direction.
2. Confirm newsroom sections, launch story formats, and the editor/reporter/publisher permissions matrix.
3. Decide which production database and media-storage resources to reuse after verification, and provide approved contact/policy information when those pages are scoped.
4. Agree a production cutover and legacy URL policy. Domain is already confirmed as lumiereindex.com; no further domain-name decision is required.

## Specification provenance

The available new chat supplies the reset/engineering instructions and Phase 1 scope. An attachment search located only an older Lumière Index ranking-product brief, which was explicitly excluded. The unseen sections 1–15 of a newsroom master brief are not represented as read; no later-phase features were invented from that missing text.


## Reference-led visual revision

The founder supplied a cinematic entertainment-layout reference after rejecting the initial sparse foundation. Home and About now use a compact masthead, photographic lead, overlapping inset, denser white editorial canvas, small blue section labels, sidebar context, image mosaic and distinct visual compositions. The UI remains a labelled design study, not a published edition; sample photos are from Unsplash and are not represented as reporting or events.

The previous visual-testing limitation above is superseded by this revision: automated headless Edge checks passed at 320, 390, 768 and 1440 pixels for Home and About. Every displayed image decoded, both pages fit the viewport, the skip link was the first keyboard target and reached main content, and the Screen anchor cleared the sticky header. Desktop and mobile screenshots were visually inspected; image alt descriptions were corrected against the actual photos. Mobile links have enlarged touch areas. Section-anchor spacing was corrected after testing exposed excessive offset.

The current automated suite, lint, strict types and production build pass. No database model, migration, production data, DNS or application dependency changed in this visual revision. Founder approval of the new visual direction remains pending. Individual story pages, standalone section pages and admin screens remain incomplete; Phase 2 has not started.
