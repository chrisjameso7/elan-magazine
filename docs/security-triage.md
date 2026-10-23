# Dependency triage: 2026-10-23

Audited the PR head using `npm audit --json` and `npm audit --omit=dev --json`.
The original 18 findings were not all development dependencies: Next.js had
critical advisories affecting server routes and image optimization; DOMPurify
in the CMS editor also had a critical XSS advisory.

| Component | Resolution | Exposure |
| --- | --- | --- |
| Next.js 16.3.6 | Updated to 16.4.2; matching eslint-config-next | Public server/runtime and image optimizer; fixed before merge |
| DOMPurify 3.4.15 via Monaco | Override 3.4.17 | Editor browser sanitization; fixed before CMS activation |
| Sass 1.77.4 chain | Override 1.106.1 | Compilation/watching tooling; old chokidar/braces chain removed |
| source-map-js | Override 1.2.2 | Source-map parsing; affected package replaced |
| sharp 0.35.5 | No advisory reported | Installed for Payload; no upload collection or uploaded-buffer endpoint configured |

After remediation:

- Production tree: **0 high, 0 critical, 5 moderate**.
- Full tree: **5 high, 0 critical, 5 moderate**.
- The five production-labelled moderate findings are one migration-tool chain:
  @payloadcms/db-postgres -> drizzle-kit -> @esbuild-kit/esm-loader ->
  @esbuild-kit/core-utils -> esbuild. Its advisory concerns the esbuild serve
  development server, which this app does not invoke or expose through a route.
  These are bundled tools in a production dependency, not omitted dev packages.
- The five high findings in the full tree are the ESLint glob dependency chain:
  eslint-config-next, @next/eslint-plugin-next, fast-glob, micromatch, braces.
  They run during local/CI linting and do not receive public HTTP requests or
  uploaded media buffers. The audit's proposed Next 14 tooling downgrade was
  not applied because it would break the aligned Next 16 tooling stack.

The lockfile and overrides are committed. Production builds, lint, adapter tests,
and live publishing/access-control checks validate the patched dependency set.
This is an exposure assessment of the current routes and configuration, not a
claim that every future feature using these packages is safe.

## Database access

Only the server reads DATABASE_URI. Payload connects as the schema owner and
applies its access rules: anonymous article reads require published status;
anonymous writes are denied. Drafts are excluded from public rendering/search.
The migration uses a dedicated elan schema and revokes direct access from
PUBLIC and Supabase anon/authenticated roles. The schema must remain outside
Supabase's exposed Data API schemas. No Supabase client key is embedded.

The staging migration was exercised against a fresh local database with schema
push disabled. Never apply the initial migration to an already-pushed local
database or a project containing conflicting elan tables without a migration plan.

Selected upstream advisory references:

- [Next.js image optimization RCE](https://github.com/advisories/GHSA-2464-fhr4-w9xw)
- [DOMPurify template sanitization bypass](https://github.com/advisories/GHSA-cg2g-xh64-v4q7)
- [esbuild development server](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
- [braces stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
