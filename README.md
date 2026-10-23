# ÉLAN

A premium digital culture publication covering people, culture, and modern life.

## Editorial structure

The six primary desks are **CULTURE, PEOPLE, ENTERTAINMENT, STYLE, LIFE, PLACES**.
`DESKS` in `src/types/editorial.ts` supplies navigation, category pages, composer
filters, and Payload category options. Fashion, beauty, and design belong to Style;
travel belongs to Places. Existing article slugs stay unchanged.

Optional franchises: The New Guard, Élan Conversations, Portfolio, The Edit,
After Dark, and The Élan 50. Stories can also remain standalone.

## Story art direction

`Article.artDirection` supports:

```ts
{
  accentHex: '#6B2236',
  bgOverrideHex: '#11100F', // optional
  heroFocalPoint: { x: 50, y: 35 } // percentages, 0–100
}
```

Cards and reading templates scope their own CSS variables. Feature backgrounds
and foregrounds adapt together; colored badges select dark or light text, and
low-contrast accent text falls back to the surface foreground. Hero photos use
the focal point. Missing metadata uses a neutral ivory surface, oxblood accent,
and centered crop. Site navigation remains independent of story styling.

The prototype composer exposes franchise, accent, background, and framing fields.
Its opening paragraph and first quote controls update only those blocks. Remaining
paragraphs, headings, quotes, images, image duos, callouts, dividers, and interview
metadata stay in place. Clearing an existing quote keeps its block and metadata.

## Development

Next.js 16 App Router, React 19, TypeScript, Tailwind v4.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

## Payload v3 preparation

Payload and its Next.js, PostgreSQL, and Lexical packages use matching versions.
`sharp` is included. `src/payload.config.ts` registers Articles, Authors, and
Users; `src/collections/` defines every public editorial field and all seven
block variants, including structured interview Q&A and validated art direction.
Article and author IDs use text to preserve existing mock IDs. Articles support
drafts; unauthenticated reads are restricted to published records. Writes require
an authenticated user. Database schema auto-push is disabled.

**This prepares the schema; it does not activate persistent publishing.** The
public pages still read `MOCK_ARTICLES`, and `/admin` remains a session-only
prototype. Its saves do not persist across reloads or update public pages.

For the later integration:

1. Copy `.env.example` into `.env.local`, supply PostgreSQL and a random secret.
2. Wire Payload's Next.js route group, admin layout/import map, API handlers, and
   `withPayload` configuration. Move the prototype `/admin` out of the way first.
3. Generate and review PostgreSQL migrations, then migrate the target database.
   Bootstrap the initial authenticated editor through Payload's first-user flow.
4. Import authors before articles. `toStoredArticle` converts mock blocks and tags
   to native Payload shapes and replaces author objects with relationship IDs.
5. Query published articles with populated authors (`depth: 1`) and pass them
   through `toArticle` before rendering existing public components. The adapter
   restores block `type`, string tags, category labels, and formatted dates.
6. Replace the prototype save handler with authenticated CMS operations and add
   preview/revalidation behavior before enabling production publishing.

Native Payload blocks use `blockType` rather than `type`; conversion is isolated
in `src/lib/payload-adapter.ts`, following [Payload's blocks schema](https://payloadcms.com/docs/fields/blocks).

## Dependency audit

The installation audit reports 18 advisories, including critical findings in the
existing Next.js 16.3.6 dependency and DOMPurify bundled transitively through
Payload's Monaco editor. The latter is pinned by Monaco, so a normal transitive
update does not resolve it. Framework and editor dependency remediation remains
required before activating the CMS in production; no forced major upgrades or
security overrides are included in this preparation change.
