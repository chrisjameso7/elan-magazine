import { headers } from "next/headers";
import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import { getCMS } from "@/lib/cms";
import { isOwner } from "@/cms/access";
export const dynamic = "force-dynamic";
export async function GET() {
  const cms = await getCMS();
  const { user } = await cms.auth({ headers: await headers() });
  if (!isOwner(user))
    return Response.json({ error: "Owner access required." }, { status: 403 });
  const [storage, email] = await Promise.allSettled([
    (async () => {
      if (process.env.MEDIA_STORAGE !== "s3")
        return { ready: false, reason: "Durable media is disabled." };
      const client = new S3Client({
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true,
        maxAttempts: 1,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      });
      try {
        await client.send(
          new HeadBucketCommand({ Bucket: process.env.S3_BUCKET }),
        );
        return { ready: true, prefix: process.env.S3_PREFIX };
      } finally {
        client.destroy();
      }
    })(),
    (async () => {
      if (!process.env.RESEND_API_KEY)
        return { ready: false, reason: "Recovery email is not configured." };
      const response = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok)
        return {
          ready: false,
          reason:
            "Cannot verify the email sending domain with the configured provider key.",
        };
      const result = await response.json();
      const domain = result.data?.find(
        (d: { name: string }) => d.name === "lumiereindex.com",
      );
      return {
        ready: domain?.status === "verified",
        domain: "lumiereindex.com",
        status: domain?.status || "not_registered",
      };
    })(),
  ]);
  const status = (r: PromiseSettledResult<unknown>) =>
    r.status === "fulfilled"
      ? r.value
      : {
          ready: false,
          reason:
            "Provider check failed. Inspect server logs without exposing credentials.",
        };
  return Response.json(
    {
      database: { ready: true },
      storage: status(storage),
      email: status(email),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
