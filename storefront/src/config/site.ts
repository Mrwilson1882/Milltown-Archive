/**
 * The details that change as the business grows, in one place.
 *
 * Everything here is safe to edit without touching component code.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Milltown Archive",
  legalName: "MANCH LTD",
  /** Companies House registration number for MANCH LTD. */
  companyNumber: "17064831",
  tagline: "Vintage, one piece at a time.",
  description:
    "Hand-picked vintage clothing from Lancashire. Branded polos, track jackets, sweats and Y2K womenswear — every piece photographed, measured and graded, and only ever one of each.",
  /** Canonical origin, no trailing slash. */
  url: (rawSiteUrl && rawSiteUrl.replace(/\/$/, "")) || "https://www.milltownarchive.co.uk",
  email: "info@milltownarchive.co.uk",
  /**
   * WhatsApp business number in full international format, digits only.
   * Leave blank and every WhatsApp button disappears site-wide.
   */
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447897740194").replace(/\D/g, ""),
  whatsappMessage: "Hi Milltown Archive, I'm interested in: ",
  location: "Lancashire, United Kingdom",
  /** The trade side of the same business, linked from the footer. */
  wholesale: {
    name: "Archive Wholesale",
    url: "https://www.archivewholesale.co.uk",
    blurb: "Buying in volume? The trade side sells by the box, the lot and the kilo.",
  },
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    vinted: process.env.NEXT_PUBLIC_VINTED_URL || "",
    depop: process.env.NEXT_PUBLIC_DEPOP_URL || "",
    ebay: process.env.NEXT_PUBLIC_EBAY_URL || "",
  },
} as const;

export const hasWhatsApp = siteConfig.whatsappNumber.length > 0;

export function whatsappUrl(message: string = siteConfig.whatsappMessage): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** The top-level navigation. Category links are added from the catalogue. */
export const primaryNav = [
  { href: "/shop", label: "Shop all" },
  { href: "/women", label: "Women" },
  { href: "/men", label: "Men" },
  { href: "/edit/new-in", label: "New in" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
] as const;
