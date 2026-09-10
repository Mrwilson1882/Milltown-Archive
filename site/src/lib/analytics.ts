import { track } from "@vercel/analytics";

/**
 * Every click we care about, named once. These land in Vercel Web Analytics →
 * Events (custom events need the Pro plan; page views and referrers work on
 * any plan). Page views already tell us which products get *looked at*; these
 * tell us which ones get *acted on*, and through which door.
 *
 * `source` is where on the site the click happened, so an enquiry from a
 * product page, the bulk builder, the basket and the floating button can be
 * told apart even though they all end up in the same WhatsApp inbox.
 */

export type EnquirySource = "product" | "bulk" | "basket" | "float" | "grading" | "contact";
export type EnquiryChannel = "whatsapp" | "email";

type Events = {
  /** Someone tapped Via WhatsApp / Via email anywhere on the site. */
  enquiry_click: {
    channel: EnquiryChannel;
    source: EnquirySource;
    product?: string;
    pieces?: number;
    page?: string;
  };
  /** A lot went into the basket. */
  add_to_basket: { product: string; pieces: number; qty: number };
  /** Secure checkout was pressed (whether or not Stripe is connected yet). */
  checkout_start: { lots: number; total_gbp: number };
  /** The bulk quote builder was submitted. */
  bulk_quote: { channel: EnquiryChannel; format: string; kg: number; category: string };
};

export function trackEvent<K extends keyof Events>(name: K, props: Events[K]) {
  try {
    // Vercel's track() accepts flat string/number/boolean/null values only;
    // strip undefined so optional fields don't get sent as the string "undefined".
    const clean = Object.fromEntries(
      Object.entries(props).filter(([, v]) => v !== undefined),
    ) as Record<string, string | number | boolean | null>;
    track(name, clean);
  } catch {
    // Analytics must never break a click. Swallow and move on.
  }
}
