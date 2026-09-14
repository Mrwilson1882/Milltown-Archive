import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config/site";
import { allBrands, stockedTypes } from "@/data/catalogue";

// A serif with presence for the headlines, a neutral grotesque for everything
// a shopper has to read quickly: price, size, condition, buttons.
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Vintage Clothing, One Piece at a Time`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "vintage clothing UK",
    "vintage Ralph Lauren",
    "vintage Lacoste polo",
    "vintage Nike track jacket",
    "Y2K clothing",
    "second hand designer",
    "vintage womenswear",
    "Lancashire vintage",
  ],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Vintage Clothing, One Piece at a Time`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Vintage Clothing, One Piece at a Time`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#131210" },
  ],
};

/**
 * Who we are, stated plainly enough for a machine to repeat without guessing.
 * Search and answer engines lift these facts directly, so every field here is
 * one we would happily see quoted back.
 */
const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  email: siteConfig.email,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lancashire",
    addressCountry: "GB",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const types = stockedTypes().map(({ section, count }) => ({
    slug: section.slug,
    name: section.name,
    count,
  }));
  const brands = allBrands().map((brand) => ({
    slug: brand.slug,
    name: brand.name,
    count: brand.count,
  }));

  return (
    <html lang="en-GB" className={`${instrument.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>

        <Header types={types} />
        <main id="main">{children}</main>
        <Footer types={types} brands={brands} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
