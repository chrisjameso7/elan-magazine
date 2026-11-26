import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { brand, siteURL } from "@/lib/brand";
import { mono, sans, serif } from "./fonts";
import "../magazine.css";

export const metadata: Metadata = {
  metadataBase: siteURL(),
  title: { default: brand.fullName, template: `%s | ${brand.name}` },
  icons: { icon: "/brand/mark.svg", apple: "/brand/apple-touch-icon.png" },
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
  },
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
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
