import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { brand, siteURL } from "@/lib/brand";
import { mono, sans, serif } from "./fonts";
import "../magazine.css";

export const metadata: Metadata = {
  metadataBase: siteURL(),
  title: { default: brand.fullName, template: `%s | ${brand.name}` },
  icons: {
    icon: [
      { url: "/brand/mark.svg", type: "image/svg+xml" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  description: brand.description,
  robots:
    process.env.LUMIERE_LAUNCH_READY === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
  openGraph: {
    siteName: brand.fullName,
    title: brand.fullName,
    description: brand.description,
    type: "website",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: brand.fullName }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/og.png"] },
};
const organization = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: brand.fullName,
  alternateName: brand.name,
  url: siteURL().href,
  logo: new URL("/brand/logo-512.png", siteURL()).href,
  email: "contact@lumiereindex.com",
};
export const viewport: Viewport = { themeColor: "#121212" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
