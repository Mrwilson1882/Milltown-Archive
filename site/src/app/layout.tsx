import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Analytics } from "@vercel/analytics/next";
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

/**
 * Who we are, stated so a machine can repeat it without guessing. Answer
 * engines lift entity facts straight from here, so every field is something we
 * would happily see quoted back: name, legal owner, where, what, how to reach us.
 */
const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  parentOrganization: { "@type": "Organization", name: siteConfig.parent },
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  email: siteConfig.email,
  telephone: `+${siteConfig.whatsappNumber}`,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  address: { "@type": "PostalAddress", addressLocality: "Lancashire", addressCountry: "GB" },
  areaServed: ["GB", "IE", "FR", "DE", "NL", "BE", "ES", "IT", "PL"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.email,
      telephone: `+${siteConfig.whatsappNumber}`,
      availableLanguage: "en",
      areaServed: "GB",
    },
  ],
  knowsAbout: [
    "vintage clothing wholesale",
    "Grade A vintage clothing",
    "Grade B vintage clothing",
    "vintage reseller boxes",
    "vintage clothing by the kilo",
    "branded vintage sportswear",
  ],
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
        {/* Vercel Web Analytics: page views and referrers, no cookies, no banner.
            Inert until Web Analytics is switched on for the project in Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
