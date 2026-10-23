export const storageConfigured = (env: Record<string, string | undefined> = process.env): boolean =>
  ['S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_BUCKET'].every((key) => !!env[key]?.trim());
export const PHOTO_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
export const MAX_PHOTO_BYTES = 20 * 1024 * 1024;
