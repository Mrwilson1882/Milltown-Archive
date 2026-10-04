/**
 * Single place for the details that change as the business grows.
 * Everything here is safe to edit without touching component code.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Archive Wholesale",
  legalName: "Archivio Group Ltd",
  /** Registered trading address, one line per part. */
  address: {
    unit: "Vo-10, Empire Business Park",
    street: "2 Empire Way",
    town: "Burnley",
    county: "Lancashire",
    postcode: "BB12 6HA",
    country: "United Kingdom",
  },
  /** Companies House registration number for Archivio Group Ltd. */
  companyNumber: "17064831",
  /** Year Archivio Group Ltd was incorporated. */
  established: 2025,
  /**
   * An unrelated "Archive Wholesale Ltd" was dissolved in 2019. Anyone who
   * searches the name finds that first, so the site says plainly, in words
   * and in structured data, that this business is live and separate.
   */
  activeNotice:
    "An active, trading business established in 2025 — not connected with any earlier company of a similar name.",
  tagline: "Branded vintage sportswear, wholesale.",
  description:
    "UK vintage clothing wholesale. Branded vintage — Lacoste, Ralph Lauren, Nike, Champion, Carhartt and more — sorted and graded into reseller boxes, counted lots of ten, twenty-five or fifty.",
  /** Canonical origin, no trailing slash. */
  url: (rawSiteUrl && rawSiteUrl.replace(/\/$/, "")) || "https://www.archivewholesale.co.uk",
  /**
   * Contact inbox shown on the site. On the .co.uk from 4 October 2026: in the
   * UK trade a .co.uk reads as a British supplier and a .com does not, which
   * matters more here than matching the old address. The .com forwards in, so
   * anyone holding the old one still reaches us.
   */
  email: "info@archivewholesale.co.uk",
  /**
   * WhatsApp business number in full international format, digits only.
   * 07897 740194 is 44 7897 740194. NEXT_PUBLIC_WHATSAPP_NUMBER overrides it,
   * which is how you point staging at a different handset.
   */
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447897740194").replace(/\D/g, ""),
  /** Pre-filled text for the click-to-chat link. */
  whatsappMessage: "Hi Archive Wholesale, I'm interested in: ",
  location: "Lancashire, United Kingdom",
  /**
   * Link to the Google Business Profile reviews. Set this and the star line
   * on the home page becomes a link to the real listing, which is what makes
   * the rating checkable rather than a claim. Leave blank for plain text.
   */
  googleReviewUrl: "https://maps.app.goo.gl/JqgGCd5vjdakXPFW9",
  /**
   * The email capture pop-up, and the discount it promises.
   *
   * Off until card checkout is live: the code is redeemed at the Stripe
   * checkout, so offering it before payments work would be a promise the
   * site cannot keep. Flip `newsletterPopup` to true once Stripe is set up
   * and the matching promotion code exists in the Stripe dashboard.
   */
  newsletter: {
    popup: false,
    discountPercent: 10,
    code: "ARCHIVE10",
  },
  /**
   * Prices on the site are quoted EXCLUDING VAT, the way the trade quotes them.
   * VAT is added as its own line in the cart and as its own line item at
   * checkout, so the customer pays the correct total.
   */
  /**
   * UK delivery, banded by lot size and charged per lot: a 10 costs £10, a 25
   * costs £20, a 50 costs £35. Two lots of 10 is £20, because that is two
   * parcels. Tracked, next day. Set by the owner on 3 October 2026.
   */
  delivery: {
    bands: [
      { upToPieces: 10, gbp: 10 },
      { upToPieces: 25, gbp: 20 },
      { upToPieces: 50, gbp: 35 },
    ],
  },

  vat: {
    /**
     * Flip to true once Archivio Group Ltd is VAT registered. Everything follows from
     * this one flag: the "+ VAT" suffix on prices, the VAT line in the cart,
     * the VAT line item at checkout and the wording on the price tables.
     */
    registered: false,
    ratePercent: 20,
  },
} as const;

/** "Vo-10, Empire Business Park, 2 Empire Way, Burnley BB12 6HA" */
export const addressLine = `${siteConfig.address.unit}, ${siteConfig.address.street}, ${siteConfig.address.town} ${siteConfig.address.postcode}`;

/**
 * UK delivery for one lot of this size. Bands are per lot, not per basket: a
 * buyer taking two lots of 10 is sent two parcels and pays for two. Anything
 * above the top band is charged pro-rata at that band's rate, so an unusually
 * large lot can never come out cheaper than a 50.
 */
export function deliveryForLotGBP(pieces: number): number {
  const bands = siteConfig.delivery.bands;
  const band = bands.find((b) => pieces <= b.upToPieces);
  if (band) return band.gbp;
  const top = bands[bands.length - 1];
  return Math.ceil((pieces / top.upToPieces) * top.gbp);
}

export const showVat = siteConfig.vat.registered;
export const vatRate = showVat ? siteConfig.vat.ratePercent / 100 : 0;
/** Suffix shown next to a price. Empty while not VAT registered. */
export const vatSuffix = showVat ? "+ VAT" : "";

export const hasWhatsApp = siteConfig.whatsappNumber.length > 0;

/** Build a wa.me click-to-chat URL with a pre-filled message. */
export function whatsappUrl(message: string = siteConfig.whatsappMessage): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { href: "/collections/reseller-boxes", label: "Reseller Boxes" },
  { href: "/types", label: "By Product" },
  { href: "/brands", label: "Brands" },
  { href: "/products", label: "All Products" },
  { href: "/contact", label: "Contact" },
] as const;
