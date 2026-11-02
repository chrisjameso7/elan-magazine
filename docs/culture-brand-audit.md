# ÉLAN culture-brand audit and release plan

## Existing architecture

Next.js 16 App Router, React 19, Tailwind 4, Payload 3, private `elan` PostgreSQL schema on the existing Supabase project, and S3-compatible photo uploads. The magazine and Payload admin have separate layouts. Public stories use a server-only adapter, request-time published reads, and existing article/feature/interview, category, author, and tag URLs. Head-admin authorization is deployment-configured and must remain unchanged.

The previous homepage is article-led with six legacy desks, The Next Wave, interviews, and The Edit. Search, responsive images, save/share controls, and compact blurred scrolling navigation are reusable.

## Findings

- All ten existing public stories have explicit development-sample credits despite `isDevMock=false`. Preserve them in admin, correctly mark them as demonstration records, and exclude demonstration content from public pages, search, and sitemap. Do not turn sample personalities into cover campaigns.
- A private newsletter schema and migration already exist in the live database. The earlier workspace contains its matching implementation, tests, and migration snapshot, which were never included on main. Reuse those exact tables and restore migration history before generating additional migrations. Sender-domain verification remains a delivery launch constraint.
- No cover, personality, or original-production records currently exist. Build real manageable formats and honest empty states; do not invent campaigns or publish filler.

## Implementation

1. Keep ÉLAN's serif wordmark and paired sans serif. Recompose the visual system around midnight ink, warm ivory, powder blue, and stone; retain restrained compact navigation blur.
2. Introduce Covers, People, Entertainment, Music, Style, Culture navigation. Preserve legacy Life/Places URLs with permanent redirects and normalize those desks into Culture. Retain legacy stored taxonomy values so historical records remain editable.
3. Extend Articles with linked personalities, gallery, production/video metadata, sponsorship disclosure, and request-time publication scheduling. Reuse articles for originals and franchise archives.
4. Add private, head-admin-managed Personalities and Covers collections. A cover campaign holds issue information, artwork, personalities, optional variations, interview/profile relationship, gallery, film, behind-the-scenes, related stories, and homepage placement.
5. Make public visibility require published status, release time reached, and non-demo content. Future-dated publication works at read time without depending on a cron worker. Draft and future content never enters public discovery.
6. Restore the existing durable newsletter subscription/unsubscribe workflow and redesign the invitation. Delivery stays explicitly gated until the real sender is verified; never simulate a successful signup or email.
7. Generate and review Payload migrations against the existing snapshots; test on a fresh isolated local database before applying additive changes to the existing schema.
8. Validate access, draft/future/demo exclusion, cover variations, media, newsletter errors, all public routes, responsive layouts, lint, types, tests, and production build. Publish the reviewed code and verify production.

## Content constraints

Production may initially have no verified editorial records after removing samples from public visibility. The opening brand composition and archive empty states must still form a complete experience. Editors can populate every section through admin; no campaign, subject, quote, credit, office, sponsor, or partnership is invented.

## Validation and release

- All 29 automated tests pass, including existing editing/media/access tests and added release guards, safe video parsing, curation deduplication, newsletter persistence/error semantics, and unsubscribe signatures.
- TypeScript and the production build pass. ESLint reports no errors; 21 existing warnings remain in the legacy preview composer, contributor image, and original migration.
- A fresh isolated local PostgreSQL database successfully applied all four tracked Payload migrations. The additive culture-brand migration was then applied to the existing Supabase project; all ten original article records remain stored and are now correctly marked demonstrations.
- Local owner login and anonymous write denial passed. Authenticated REST cover creation, draft privacy, publication, future scheduling, and demonstration exclusion passed. Anonymous user/subscriber access is denied.
- Local HTTP checks passed for the homepage, cover archive/detail, personality, Originals archive/detail, feature, series, Music, About, privacy, terms, newsletter, admin login, search, and sitemap. Missing, draft, scheduled, and demonstration story routes return 404.
- The newsletter form saved a local request with honest pending-delivery feedback. The record was verified through the owner API; signed one-click unsubscribe changed its persisted status. Invalid origins and missing consent were rejected. No real email was sent.
- Desktop cover and mobile cover/personality/Originals/launch layouts were visually inspected. The compact navigation remained accessible while scrolling. Long-name mobile overflow was fixed and verified. Native video controls and supported iframe sources were checked; the unavailable external livestream fixture was replaced with CC0 test footage.
- Fonts are self-hosted under their OFL licenses, removing build-time Google Fonts network dependence. No application dependency was added.

### Editorial launch constraints

No verified production story, personality, or cover campaign was present in the audited database. The production opening therefore uses the brand composition and honest archive states. The complete populated layouts were tested only with clearly identified local fixtures; none were copied into production. Newsletter requests can be collected, but email delivery remains gated pending verified sender configuration. Bulk newsletter editions are outside this implementation.
