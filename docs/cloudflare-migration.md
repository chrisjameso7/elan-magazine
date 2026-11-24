# Cloudflare migration verification

17 November 2026. Requested after Netlify rejected `built_with_badge_enabled=false` with HTTP 422: "Removing the Netlify badge is not available on this plan". The live publication remains on Netlify during compatibility testing.

## Preserved release

Git tag lumiere-netlify-release-2026-11-16 points to 5e60ea1. Cloudflare work is isolated on codex/lumiere-cloudflare. The original repository history, founder account, Supabase schema, private S3 bucket and Resend integration are preserved. Do not move DNS until hosted login, publication, scheduling, recovery and image rights/derivatives pass.

## Test architecture

Use the OpenNext adapter for the existing Next.js application with Workers Node.js compatibility. Keep the existing Postgres collections and access control. No D1 schema conversion or second newsroom is authorized by this host migration.

The staging Worker has no custom-domain routes. No paid resources or automatic migrations are configured. Credentials must be configured through Cloudflare's normal secret interface; never commit .dev.vars or export masked credentials through an application endpoint.

## Known compatibility gates

- Native Sharp currently generates image derivatives. Workers cannot execute native Node binaries; this cannot be silently removed from the newsroom workflow.
- Payload uses server-side Postgres and cryptographic authentication. Verify Node compatibility, TLS, connection lifecycle and actual Workers Free CPU/startup limits with the full application.
- Check storage, recovery-email and undici compatibility in the Workers runtime, rather than claiming success from next build alone.
- Cloudflare's current Worker size allowance is 64 MiB uncompressed across plans (September 2026 update). Older Payload template documentation still references 3MB/paid; use current provider limits and measured artifacts. Size allowance does not establish runtime compatibility or CPU sufficiency.

## Sources

https://developers.cloudflare.com/changelog/post/2026-09-04-increased-worker-size-limit/
https://developers.cloudflare.com/workers/platform/limits/
https://opennext.js.org/cloudflare/get-started
https://github.com/payloadcms/payload/tree/main/templates/with-cloudflare-d1

Status (24 November): Next/OpenNext build, 12 regression tests, lint and TypeScript checks pass. Staging deployed at https://lumiere-index-staging.phonefuturist.workers.dev (version 03de8745-1065-4482-ad33-f78a2c7967ca). Startup time reported by Wrangler: 45ms. The logo responds 200; health responds 503 and CMS pages 500 while required provider secrets are absent. This is not a verified newsroom release. Full hosted workflow verification and DNS cutover remain incomplete. The staging-origin configuration below still needs deployment after secret setup.

Wrangler 4.163.0 authenticated successfully against the founder account (no credential refresh required). OpenNext 1.20.17 requires Next >=16.4.5; staging updates Next/eslint-config-next to the registry-verified 16.4.6 patch. No --force or --legacy-peer-deps overrides are used. Dependency installation is being retried after registry connection resets.

The clean Next 16.4.6 build and TypeScript phase passed. Windows packaging required a narrowly scoped directory-junction adjustment in OpenNext file copying. Turbopack then produced unresolved hashed drizzle-kit externals; the migration branch is testing Next's supported Webpack build mode. pg-cloudflare runtime files are explicitly included in tracing. No unresolved module is being hidden with an external/stub declaration.

24 November: Workers runtime testing confirmed that native Sharp fails to load. The Cloudflare Images replacement produced valid 480×240 WebP output from PNG and correctly oriented 480×960 output from EXIF-rotated phone JPEG. The Next/OpenNext Worker build and Wrangler dry run passed. Runtime connection testing then identified a Postgres transport issue. A dedicated Hyperdrive configuration (dd0c37ae794d4e058113f837b2658559) connected successfully to the original database using the restricted lumiere_runtime role, a Supabase CA and verify-full TLS. Query caching is disabled; origin connections are capped at five. An actual remote Workers SELECT 1 test returned 200/ready=true. No schema or existing staff data was changed. Full newsroom runtime verification remains pending provider-secret setup and hosted integration testing.
