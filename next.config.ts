import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
const config: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/drizzle-kit/api.*",
      "./node_modules/pg-cloudflare/dist/**/*",
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};
export default withPayload(config);
