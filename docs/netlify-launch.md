# Netlify launch preparation

Updated 14 November 2026. Status: repository configuration prepared; Netlify account access and hosted verification pending.

## Host decision

Netlify explicitly permits commercial projects on its Free plan and supports Next.js App Router, route handlers and Server Actions. The plan is usage-limited and may pause projects at the monthly limit; do not describe it as unlimited hosting.

Official references:
- https://www.netlify.com/blog/introducing-netlify-free-plan/
- https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- https://www.netlify.com/pricing/

## Connect the correct code

Import `chrisjameso7/elan-magazine`. Select **codex/lumiere-index-foundation**, not `main`, for the initial test deployment: main still contains the legacy ÉLAN application. Build command: `npm run build`; publish directory: `.next`; Node: 24. Let Netlify install its current Next.js adapter automatically. Do not configure a static export or a catch-all SPA redirect.

Use a temporary Netlify hostname first. Keep `LUMIERE_LAUNCH_READY=false` and `S3_PREFIX=lumiere-index/preview`. Do not connect lumiereindex.com until the application and newsroom pass hosted verification. Do not activate automatic production releases of unverified changes.

## Environment settings

Configure the keys in `launch-runbook.md` using the Netlify UI/API with **Builds and Functions** scopes. Values in netlify.toml alone are not serverless-function environment variables. Set `AWS_LAMBDA_JS_RUNTIME=nodejs24.x` through the UI/API; Netlify does not accept this runtime setting from netlify.toml.

Set `CMS_SERVER_URL` to the actual temporary HTTPS site origin. If it is unset, the application can derive the origin from Netlify's deploy URLs where available; hosted execution fails closed if there is no valid public HTTPS origin. Credentials and secrets must never be placed in next.config.ts, netlify.toml, a client variable, chat or Git.

The restricted database URI and independent Payload secret are already prepared in an ignored local handoff file. Do not reuse a database administrator account. The S3 and Resend secrets held as sensitive Vercel variables are not available for plaintext export through the connected API. Provision/rotate scoped provider credentials through their normal account interfaces if they are not held in the founder's secret store. Do not expose them through a diagnostic endpoint or publish them.

## Verify before cutover

- Initial edition, canonical section pages, About, Contact, Privacy, Terms, robots and sitemap.
- Owner password setup and login; writer/editor/server-side permission enforcement.
- Native draft → review → saved approval → publish; saved draft preview; article updates.
- Direct media upload, generated image sizes, credits/licence fields; private draft media denial and published delivery.
- First-publication scheduling, unpublishing, search and filtering.
- Phone/tablet/desktop layouts and menu behavior; real image decode and no client errors.
- Recovery email actually delivered from a verified lumiereindex.com sender.
- Remove recorded test fixtures, then create a fresh one-use founder setup link.

After verification, configure production media prefix and canonical CMS origin, use the Netlify-specified domain records, preserve unrelated mail and verification TXT records, and test TLS and redirects. Keep a verified rollback release. No Netlify deployment or DNS change is claimed by this preparation document.
