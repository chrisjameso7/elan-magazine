import { isHostedRuntime } from "./hosting";
import { s3Storage } from "@payloadcms/storage-s3";
import { resendAdapter } from "@payloadcms/email-resend";
import { isStaff } from "./access";
export function newsroomIntegrations(
  env: Record<string, string | undefined> = process.env,
) {
  const hosted = env.MEDIA_STORAGE === "s3";
  if (isHostedRuntime(env) && !hosted)
    throw Error("Hosted deployments require durable S3 media storage.");
  if (hosted) {
    for (const name of [
      "S3_ENDPOINT",
      "S3_REGION",
      "S3_BUCKET",
      "S3_ACCESS_KEY_ID",
      "S3_SECRET_ACCESS_KEY",
      "S3_PREFIX",
    ])
      if (!env[name]) throw Error(`${name} is required for hosted media.`);
    if (new URL(env.S3_ENDPOINT!).protocol !== "https:")
      throw Error("S3 endpoint must use HTTPS.");
    if (!/^lumiere-index\/(preview|production)$/.test(env.S3_PREFIX!))
      throw Error("Media must use an isolated Lumière environment prefix.");
  }
  const sender = env.LUMIERE_SENDER_EMAIL?.trim();
  if (env.RESEND_API_KEY && !sender)
    throw Error(
      "LUMIERE_SENDER_EMAIL must explicitly identify the approved sender.",
    );
  const email =
    env.RESEND_API_KEY && sender
      ? resendAdapter({
          apiKey: env.RESEND_API_KEY,
          defaultFromAddress: sender,
          defaultFromName: "Lumière Index Newsroom",
        })
      : undefined;
  const storage = s3Storage({
    enabled: hosted,
    alwaysInsertFields: true,
    bucket: env.S3_BUCKET || "local-disabled",
    collections: {
      media: {
        prefix: env.S3_PREFIX || "lumiere-index/local",
        signedDownloads: { expiresIn: 60 },
      },
    },
    clientUploads: hosted ? { access: ({ req }) => isStaff(req.user) } : false,
    signedDownloads: { expiresIn: 60 },
    config: {
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION || "eu-west-1",
      forcePathStyle: true,
      credentials: hosted
        ? {
            accessKeyId: env.S3_ACCESS_KEY_ID!,
            secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
          }
        : undefined,
    },
  });
  return { email, storage };
}
