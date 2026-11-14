# Staging and production launch runbook

Updated 13 November 2026. Production is not yet approved by verification.

## Preserved infrastructure

Git history and the remote backup branch remain intact. Vercel project `elan-magazine` and Supabase project `wpqsmcczmdbzvsioydmy` are reused deliberately. New tables live in `lumiere_index`; the runtime role has no access to `elan`. All 17 newsroom tables have RLS; anonymous Supabase roles have no schema access. Payload performs staff and publication authorization server-side.

The existing `elan-media` bucket was verified private. Lumière uses isolated prefixes `lumiere-index/preview` and `lumiere-index/production`. Do not move old objects or make the bucket public. Preview must not use the production prefix.

## Required hosted keys

- `DATABASE_URI`: restricted runtime account, not the migration administrator.
- `LUMIERE_DATABASE_MODE=hosted` and `LUMIERE_DATABASE_HOST`: exact approved Supabase pooler host.
- `PAYLOAD_SECRET`: independent high-entropy value.
- `LUMIERE_OWNER_EMAIL=jamesadebajo7@gmail.com`.
- `MEDIA_STORAGE=s3`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PREFIX`.
- `RESEND_API_KEY`, `LUMIERE_SENDER_EMAIL=contact@lumiereindex.com`; the domain must be verified by the provider before recovery delivery is claimed.
- `NEXT_PUBLIC_SITE_URL=https://lumiereindex.com`; `CMS_SERVER_URL` is the actual environment origin, or defaults to Vercel's deployment origin.
- `LUMIERE_LAUNCH_READY=false` on preview. Set true only at verified production cutover.

Sensitive S3 and Resend keys stay in Vercel and are not copied into documentation or logs. Branch-specific preview overrides leave production configuration unchanged. `.env*` and `work/` are ignored; account setup tokens must never be committed.

## Verified so far

Four reviewed application migrations are installed in the new hosted schema and tracked in Payload's migration table. The scoped role is not a superuser, cannot access the legacy schema, and connected over verified TLS. The hosted owner, Chris James contributor and canonical sections are provisioned. No reporting has been fabricated.

Local native browser verification covers writer draft creation and submission, editor approval and publishing, and anonymous mobile reading of saved title and body. The document lock takeover is part of that handoff. Local API integration tests cover roles, escalation denial, private live revisions, image rights, future release exclusion and RLS.

## Remaining release gates

1. Pass the current unit/lint/type/build verification and push a reviewable checkpoint.
2. Build the branch-specific staging deployment.
3. Test actual hosted media upload, derivatives, private draft denial, access-checked published delivery and unpublish behavior.
4. Repeat article creation → review → approval → publication, search, preview and updates against the hosted API/browser. Delete only recorded QA fixtures afterwards.
5. Verify recovery delivery from the new sender and refresh the founder's one-use password setup link. Do not claim delivery from provider configuration alone.
6. Check canonical/robots/sitemap/metadata, mobile navigation, account access, errors and empty edition behavior.
7. Only then deploy/promote production and connect the verified custom domain; preserve existing verification TXT records and a rollback target.

## Dependency review

The production audit after the security updates reports zero high/critical findings. Happy DOM and Undici were updated; the Payload HTTP client's Agent/fetch path is exercised by the application tests. The deepmerge prototype-poisoning issue is mitigated in both distributed builds by a deterministic postinstall patch with a malicious-input regression test; npm audit continues to flag the upstream version.

Remaining moderate findings trace to esbuild's development-server exposure through migration tooling. This application does not expose an esbuild development server in deployment. Keep migration commands private, never run the tooling server publicly, and remove the exception when upstream updates its dependency. This is a documented exposure assessment, not a zero-vulnerability claim.

## Recovery

The old application remains the production rollback target until cutover. Reverting the application release does not require deleting either schema. Do not run migration DOWN against live editorial data as an application rollback. Take a database backup before subsequent destructive schema changes. Keep media prefixes and database environments aligned.
