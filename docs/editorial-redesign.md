# The Élan editorial redesign

## Audit and implementation plan

The existing application uses Next.js App Router, React, Tailwind 4, and Payload CMS. Published content is read through the server-only CMS adapter. With no database configured, the existing development preview uses explicitly marked sample stories. This redesign retains both paths without changing database configuration.

Existing routes include article, feature, interview, category, author, tag, about, privacy, terms, editorial preview, and Payload admin/API. Search reads the published article adapter through `/api/editorial/search`.

The live homepage and a representative culture article were inspected before implementation. Issues include an oversized header, overlapping lead composition, fashion-specific hardcoded sections, fabricated relative timestamps, repeated stories, hardcoded story destinations, inactive share/bookmark buttons, and a newsletter form that only sets local success state. Article templates also inject fabricated body copy and photo credits when fields are absent, and omit callout/divider blocks.

Implementation order:

1. Retain the licensed existing Playfair Display and Plus Jakarta Sans typography; establish ivory, ink, burgundy, divider, and spacing tokens.
2. Simplify the shared masthead and navigation, preserving search and all category routes. Add keyboard-safe mobile navigation and search dialogs.
3. Compose the homepage from real CMS flags: editorial lead, New Guard stories presented as The Next Wave, recent stories, a substantial feature/interview, and The Élan Edit. Omit sections without matching content. Avoid repeating stories within the homepage.
4. Share story imagery, links, metadata, body blocks, and reading foundations while preserving all three editorial URLs and the interview Q&A format.
5. Replace the simulated newsletter with existing reader contact/submission links. Keep real legal routes and secondary Lumière attribution.
6. Check tests, types, lint, production build, responsive layouts, story navigation, search, empty states, and content integrity.

## Content and integration constraints

- `new_guard` remains the stored franchise key; no data migration is required for The Next Wave.
- Existing sample subjects, credits, and biographies are development content, not independently verified reporting. Production editorial review is still required; the redesign must not create new people, images, dates, or claims.
- No newsletter provider or subscriber storage exists in the current codebase. Do not display a subscription form until a real integration is configured.
- Existing editorial/contact/submission email addresses are preserved from the About page. No social accounts are invented.
- No production database credentials are present in this checkout. Local validation can verify the existing preview path; production CMS writes and uploads must not be exercised against real content as part of visual QA.

## Implemented changes

- Compact ÉLAN masthead with People • Culture • Modern Life, all six desk routes, native modal mobile navigation, working search shortcut, focus restoration, and a skip link.
- Ivory/ink/burgundy visual foundation using the existing Playfair Display and Plus Jakarta Sans. Removed two unused font downloads. Shared spacing, readable sans-serif body text, serif headlines, restrained motion, and reduced-motion support.
- Homepage composed from published article data: editor-selected lead, The Next Wave from `new_guard`, varied latest-story layouts, a cinematic interview/feature, and The Élan Edit from `the_edit`. Stories are allocated once across sections. Unpopulated sections are omitted.
- The stored `new_guard` key remains unchanged; its editor-facing label is now The Next Wave. No database migration is needed.
- Shared article/feature/interview reading foundation, retaining format-specific presentation and all existing URLs. All seven blocks render, including previously omitted callouts and dividers. Captions and credits only render when supplied. No invented fallback reporting or photo credits.
- Existing tags, contributor pages, category browsing, Q&A, image focal points, and CMS/S3 image URLs are retained. Native responsive variants are supplied for existing Unsplash assets; the lead loads eagerly and lower imagery lazily.
- Save controls now store a per-story marker on the reader's device. Share invokes the native share sheet when supported, otherwise copies the URL and reports failures. No account or cross-device bookmarking is implied.
- The simulated newsletter form is replaced with a real link to existing submission information. Existing contact and legal destinations remain, with secondary Lumière attribution. No social accounts were added.
- Story canonical, Open Graph, and Twitter metadata, category metadata, robots, and a data-driven sitemap.
- No new dependencies. Framework, content reader, Payload collections/access rules, database/storage configuration, and deployment settings remain in place.

## Validation

- `npm ci`: passed (732 packages installed). npm's audit service returned a warning during installation; this was not a fresh vulnerability assessment.
- `npm test`: 19 tests passed, zero failed.
- `npm run typecheck`: passed.
- `npm run lint`: completed with zero errors and 21 existing warnings in PreviewComposer, author imagery, and migration arguments.
- `npm run build`: production compilation, TypeScript, and route generation passed.
- `node scripts/check-public-routes.mjs http://localhost:3101`: 62 public routes passed, plus 3 expected 404 routes. The search API returned 10 existing preview stories. Checks cover all current story, desk, author, tag, legal, sitemap, and robots URLs.
- Browser checks: search API → result → article, mobile navigation, Escape dismissal/focus restoration, save/remove feedback, imagery, representative feature/interview/category layouts, and browser console inspection.
- No page-level horizontal overflow on the homepage at 320, 375, 390, 430, 768, 1024, 1440, and 1920 px; standard article at 320, 375, 430, 768, 1024, 1440, and 1920 px; feature, interview, and People category at 320, 768, and 1440 px.
- This is local preview/production-build validation using the repository's existing sample path. Live production database login, uploads, and writes were not tested. No production data was edited.

## Remaining editorial work

1. Review and replace the development sample subjects, imagery descriptions, biographies, and credits before treating them as verified reporting. Several existing stories have no body text; these now show an honest unavailable-text message.
2. Add more approved emerging-talent stories and mark them The Next Wave in the CMS. The section currently has one existing matching story.
3. Connect an actual subscription provider before reintroducing newsletter signup.
4. Confirm real publication social accounts if social navigation is wanted; none were invented.
5. Live CMS validation requires the deployment's normal authorized credentials and environment.
