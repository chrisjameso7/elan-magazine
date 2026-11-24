import { getCloudflareContext } from "@opennextjs/cloudflare";
import { postgresPool } from "../lib/postgres-pool";
export function cloudflarePostgresPool(connectionString: string) {
  if (
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers"
  ) {
    const { env } = getCloudflareContext();
    const binding = (
      env as unknown as { HYPERDRIVE?: { connectionString: string } }
    ).HYPERDRIVE;
    if (!binding)
      throw Error("The newsroom requires its configured Hyperdrive binding.");
    // Origin TLS verification and connection pooling are enforced by Hyperdrive.
    // Never keep query connections for reuse across independent Worker requests.
    return {
      connectionString: binding.connectionString,
      max: 20,
      maxUses: 1,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 20000,
    };
  }
  return postgresPool(connectionString);
}
