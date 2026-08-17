/**
 * Single place for the details that change as the business grows.
 * Everything here is safe to edit without touching component code.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Archive Wholesale",
  legalName: "MANCH LTD",
  parent: "Milltown Archive",
  tagline: "Branded vintage sportswear, wholesale.",
  description:
    "UK vintage clothing wholesale. Branded vintage — Lacoste, Ralph Lauren, Nike, Champion, Carhartt and more — sorted and graded into reseller boxes, counted lots from five pieces, or by the kilo.",
  /** Canonical origin, no trailing slash. */
  url: (rawSiteUrl && rawSiteUrl.replace(/\/$/, "")) || "https://www.archivewholesale.co.uk",
  /**
   * Contact inbox shown on the site. Change this to an @archivewholesale.co.uk
   * address once that mailbox is live.
   */
  email: "info@milltownarchive.co.uk",
  /**
   * WhatsApp business number in full international format, digits only.
   * Set NEXT_PUBLIC_WHATSAPP_NUMBER in the environment. While it is blank,
   * every WhatsApp button on the site is hidden rather than shown broken.
   */
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  /** Pre-filled text for the click-to-chat link. */
  whatsappMessage: "Hi Archive Wholesale, I'd like to enquire about your vintage wholesale lots.",
  location: "Manchester, United Kingdom",
} as const;

export const hasWhatsApp = siteConfig.whatsappNumber.length > 0;

/** Build a wa.me click-to-chat URL with a pre-filled message. */
export function whatsappUrl(message: string = siteConfig.whatsappMessage): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { href: "/collections/reseller-boxes", label: "Reseller Boxes" },
  { href: "/types", label: "By Product" },
  { href: "/brands", label: "Brands" },
  { href: "/by-kilo", label: "By Kilo" },
  { href: "/products", label: "All Products" },
  { href: "/contact", label: "Contact" },
] as const;
