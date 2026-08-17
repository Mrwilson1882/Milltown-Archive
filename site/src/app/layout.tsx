import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { siteConfig } from "@/config/site";

// Archivo carries the same squared, athletic feel as the logo wordmark.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Vintage Sportswear Wholesale UK`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "vintage wholesale UK",
    "vintage clothing wholesale",
    "wholesale vintage sportswear",
    "vintage Nike wholesale",
    "vintage Adidas wholesale",
    "Lacoste wholesale",
    "Ralph Lauren wholesale",
    "vintage clothing bundles",
    "Y2K wholesale",
  ],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Vintage Sportswear Wholesale UK`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Vintage Sportswear Wholesale UK`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0F4A2E",
  width: "device-width",
  initialScale: 1,
};

const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  parentOrganization: siteConfig.parent,
  url: siteConfig.url,
  email: siteConfig.email,
  description: siteConfig.description,
  address: { "@type": "PostalAddress", addressLocality: "Manchester", addressCountry: "GB" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={archivo.variable}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          // Static, developer-authored JSON-LD — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-forest focus:px-4 focus:py-2 focus:font-bold focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
