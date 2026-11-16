# Database foundation

Separate schema: `lumiere_index`. No queries, destructive migrations, data copies, or cross-schema foreign keys into `elan`. The existing production database is not a target for Phase 1 commands.

## Logical model

- Users: native Payload authentication plus display name; email unique through Payload. No public signup route is exposed by this foundation. Authorization fails closed without a configured owner. Additional newsroom roles are not implemented.
- Contributors: unique slug, display name and optional biography; no copied or invented contributor data.
- Sections: unique slug, display name and description; no seed taxonomy presumed approved.
- Media: upload metadata, required alt text and credit, optional caption. Local storage only for isolated development; object storage is not configured or claimed working.
- Articles: unique slug, title, standfirst, one section, one or more contributors, optional hero, Lexical body, publication time, source references. Payload drafts/version tables preserve revisions. Published reads require status=published and publishedAt <= now, evaluated per request.
- Payload-managed relationship, revision, auth-session, preference and lock tables are infrastructure rather than duplicate business entities.

Use framework-native numeric primary keys and generated foreign keys to keep Payload's adapter, snapshots, and migration tooling aligned. Do not hand-edit a generated key type independently of its adapter. Slugs provide human-readable routes; they do not replace stable IDs. UTC timezone-aware timestamps and indexed publication timestamps support releases; relation lookup indexes come from the generated migration.

## Security

There is no browser database client. All CMS reads and writes must explicitly respect access control (`overrideAccess:false`) at user-facing boundaries. Private collections are owner-only in this foundation. Public article predicates are established and tested, but public content integration is a later milestone. Contributors and media must have an explicit public projection before exposing reader data in Phase 2.

Migration tooling needs DDL privileges; production runtime should use a separate scoped role limited to the new schema. Revoke schema access and table/sequence privileges from PUBLIC, anon and authenticated; enable RLS as defense in depth. No blanket grants to public roles. RLS is not a substitute for Payload access checks; the server role may bypass RLS.

## Migration workflow

`npm run payload -- generate:types`
`npm run payload -- migrate:create foundation`
Review generated SQL; add private-schema hardening; apply and test against an empty isolated local database. Schema push is disabled in every environment. Do not attach the new schema to production until the database/storage reuse decision and cutover are reviewed.

Backup branch protects application source, not database contents. No production database restore or backup is claimed by Phase 1. Production data is untouched.
