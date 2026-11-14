import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { brand, siteURL } from "@/lib/brand";
import "../globals.css";
import "../lumiere.css";

export const metadata: Metadata = {
  metadataBase: siteURL(),
  title: { default: brand.name, template: `%s | ${brand.name}` },
  description: brand.description,
  robots:
    process.env.LUMIERE_LAUNCH_READY === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
  openGraph: {
    siteName: brand.name,
    title: brand.name,
    description: brand.description,
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="site-frame">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
