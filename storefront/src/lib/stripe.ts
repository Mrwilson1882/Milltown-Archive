import Stripe from "stripe";

/**
 * Stripe, if it has been set up.
 *
 * Until STRIPE_SECRET_KEY is present the shop runs in enquiry mode: the bag
 * still works, and the checkout button routes to WhatsApp or email instead of
 * card entry. Nothing 500s because a key is missing.
 */
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

let client: Stripe | null = null;

export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

/**
 * Flat UK postage, in pounds, added as a shipping option at checkout.
 *
 * Left unset until the owner states a figure — no postage price is invented
 * here any more than a garment price is. With no rate set, checkout still
 * collects the delivery address and postage is confirmed before dispatch.
 */
export function ukShippingGBP(): number | null {
  const raw = process.env.UK_SHIPPING_GBP?.trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}
