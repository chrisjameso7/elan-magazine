# The Index Magazine by Lumière

26 November 2026. Lumière Index is relaunched as **The Index Magazine by Lumière** at lumiereindex.com: a culture magazine of criticism, personal essays and discovery. It covers people and work across music, film and TV, the internet, style, books, art, sport and gaming. It is not limited to musicians.

Design canvas: https://claude.ai/artifact/TxE8yGYQpMSEdWRnKkuePS

## Identity

- The mark is an index finger pointing right, at who's next. Ink hand, signal-orange finger. The favicon is `public/brand/mark.svg`.
- Colours: paper `#F4F1EA`, ink `#121212`, signal `#FF5A1F`, highlight `#D9F84A`. Use signal text `#C2410C` for orange text on paper, for contrast.
- Type: Instrument Serif for headlines, Inter Tight for UI and reading, JetBrains Mono for dates, ranks and receipts. All three are self-hosted under `src/app/fonts` (SIL OFL).
- The verdict scale replaces stars: Obsessed, On repeat, It's fine, Skip.

## Editorial model

| Surface | Where it lives in the newsroom |
| --- | --- |
| Discover, Critique, Personal | Sections (the migration adds these three) |
| Verdict | `verdict` on an article; shown when the format is Review |
| The Index 50 | The Index → The Index 50. One row per place per week. Only published rows show. |
| Called It | The Index → Called It. Use only figures or milestones you can source. |
| Put Us On tips | The Index → Put Us On tips. Readers send these through `/put-us-on`. The public cannot read them. |

Public routes: `/`, `/sections/{discover,critique,personal}`, `/the-index`, `/called-it`, `/put-us-on`, `/news/[slug]`.

The tip endpoint is `POST /api/put-us-on`. It sits outside Payload's `/api/tips` REST route on purpose, so the admin list keeps working. It needs a same-origin `Origin` header and has a honeypot field. It also drops a repeat of the same link within 24 hours. Validation lives in `src/lib/tips.ts` and is covered by tests.

## Database

Migration `20261126_111253_index_magazine` adds three things:

- the `verdict` column on articles and their versions;
- the `index_entries`, `discoveries` and `tips` tables;
- the Discover, Critique and Personal sections.

It then re-applies the schema hardening: it revokes access from PUBLIC, anon and authenticated, and enables RLS. It also grants the runtime role access to the new tables. The down migration removes the three sections only if no article uses them.

Local verification: the migration applied cleanly on a fresh Postgres 16 database, rolled down and applied again. A seeded review, an Index week, a Called It entry and tips from both the API and the browser form all rendered correctly at 1440px and 390px with no horizontal overflow.

## Cloudflare (Workers Builds, no local terminal)

`wrangler.jsonc` names the production Worker `lumiere-index`. Cloudflare builds and deploys it from GitHub.

- Build command: `npm run ci:cloudflare:build`
- Deploy command: `npm run ci:cloudflare:deploy`

Add these encrypted build variables in the Worker's Settings → Build → Variables and secrets:

| Name | Value |
| --- | --- |
| `DATABASE_URI` | Restricted `lumiere_runtime` Supabase pooler string. The Worker reaches the database through Hyperdrive; this value must still pass validation. |
| `PAYLOAD_SECRET` | The newsroom secret, at least 32 characters |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Supabase Storage S3 key |
| `RESEND_API_KEY` | Resend sending key |
| `MIGRATION_DATABASE_URI` | Optional. The admin `postgres` session-pooler string. When it is set, each deploy runs `payload migrate` first. |

`scripts/cloudflare-ci.mjs` reads the non-secret settings from the `wrangler.jsonc` vars. It fails with a list of any missing names. It uploads the five runtime secrets with `wrangler deploy --secrets-file`, using a temporary file that it deletes afterwards. This avoids the dashboard's "Add variable and deploy" flow, which fails for this bundle size.

After verification on workers.dev, attach `lumiereindex.com` and `www.lumiereindex.com` as custom domains. This replaces the Netlify A and CNAME records. Then set `CMS_SERVER_URL=https://lumiereindex.com` and `LUMIERE_LAUNCH_READY=true` in `wrangler.jsonc`. Netlify stays as the rollback.
