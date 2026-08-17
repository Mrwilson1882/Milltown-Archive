import Stripe from "stripe";

/**
 * Stripe is optional until the account is connected. Everything that touches it
 * goes through here so the rest of the site can ask one question — is checkout
 * live? — rather than reading env vars in a dozen places.
 */

export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

let client: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (or your host's environment) to enable card checkout.",
    );
  }
  if (!client) client = new Stripe(key);
  return client;
}
