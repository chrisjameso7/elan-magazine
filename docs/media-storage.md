# Photo uploads

Payload 3.91.0 uses `@payloadcms/storage-s3`, backed by `@payloadcms/plugin-cloud-storage`. Both are pinned to the same CMS version.

The `media` collection accepts JPG, PNG, WebP, AVIF, and GIF files up to 20 MB. Only the configured head administrator can create, update, delete, or authorize direct browser uploads. Photos are selected through upload fields in covers, story image blocks, image duos, interview portraits, and contributor profiles. Existing external URLs remain valid. An uploaded selection takes priority; story alt text, captions, and credits can override the asset metadata.

## Supabase Storage

The private `elan-media` bucket is already provisioned with the same MIME and size restrictions. The additive Payload migration is applied to Supabase. Media metadata stays in the private `elan` database schema. Anonymous Supabase roles receive no new table privileges; images are delivered through Payload's file route.

Create S3 credentials in Supabase Storage → Configuration → S3. Keep them server-only. These are distinct from the database password and publishable API key.

Configure these variables in both Vercel Production and Preview, then redeploy:

```ini
S3_ENDPOINT=https://wpqsmcczmdbzvsioydmy.storage.supabase.co/storage/v1/s3
S3_REGION=eu-west-1
S3_BUCKET=elan-media
S3_ACCESS_KEY_ID=<S3 access key ID>
S3_SECRET_ACCESS_KEY=<S3 secret access key>
```

The Supabase S3 endpoint supports the required browser PUT CORS request and If-None-Match header. Direct client uploads use temporary signed URLs, bypassing Vercel's server upload-body limit. Keys are never sent to the browser. Signed file names are collision protected by Payload's plugin.

Without S3 settings, local development saves photos under ignored `media/`. Vercel refuses uploads with a clear configuration error instead of relying on ephemeral disk. Existing stories keep rendering. `alwaysInsertFields` keeps the database schema the same before and after credentials are enabled; the S3 client upload component is included in the checked-in import map.

## Cloudflare R2 alternative

The same S3 adapter works with an R2 bucket and scoped R2 S3 credentials. Set `S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com`, `S3_REGION=auto`, and the other three values for that bucket. Allow CORS PUT from your production and preview origins with Content-Type and If-None-Match headers. Keep the bucket private; public delivery still uses Payload.

## Deployment and migration

Use `npm run payload -- migrate` with the intended server environment before deploying this schema. Do not use schema push in Production or Preview. The migration preserves existing articles, blocks, and image URLs; rollback is refused while uploaded media records exist.

Local validation verified authenticated upload, public file delivery, draft creation using uploaded covers and image/duo blocks, and anonymous upload denial. Temporary test records and files were removed. The supplied S3 credentials also passed a real Supabase upload/download/delete test. Vercel credentials are configured as server Secrets.
