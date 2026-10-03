import Stripe from "stripe";

/**
 * Stripe is optional until the account is connected. Everything that touches it
 * goes through here so the rest of the site can ask one question — is checkout
 * live? — rather than reading env vars in a dozen places.
 */

const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";

/**
 * A test key is a live site's worst state: the checkout opens, Stripe accepts
 * the payment method, the buyer is thanked — and no money moves, no order
 * exists and no receipt arrives. A customer hit exactly that on 3 October 2026.
 *
 * So production refuses a test key outright. The checkout then reports itself
 * not configured and points the buyer at WhatsApp, which is honest and keeps
 * them. Test keys still work everywhere else — preview deploys and local — so
 * the whole flow can be rehearsed before the live key goes in.
 */
const isTestKey = key.startsWith("sk_test_");

/**
 * The publishable key is the one Stripe prints in full on the API keys page;
 * the secret sits below it behind "Reveal". They get swapped, and when they do
 * every checkout fails with secret_key_required and the buyer sees a dead
 * button. Treat anything that is not a secret or restricted key as no key.
 */
const isNotASecretKey = Boolean(key) && !key.startsWith("sk_") && !key.startsWith("rk_");
if (isNotASecretKey) {
  console.error(
    `[stripe] STRIPE_SECRET_KEY starts "${key.slice(0, 3)}", which is not a secret key. Card checkout is off until it holds an sk_live_… key.`,
  );
}
// On Vercel, NODE_ENV is "production" for preview builds too, so VERCEL_ENV is
// the one that distinguishes the live site. NODE_ENV is only the fallback for
// a host that does not set it.
const vercelEnv = process.env.VERCEL_ENV;
const isProduction = vercelEnv
  ? vercelEnv === "production"
  : process.env.NODE_ENV === "production";
export const stripeKeyRejected = Boolean(key) && (isNotASecretKey || (isTestKey && isProduction));

if (isTestKey && isProduction) {
  console.error(
    "[stripe] Refusing a test key in production. Card checkout is switched off until STRIPE_SECRET_KEY is a live key (sk_live_…).",
  );
}

export const stripeEnabled = Boolean(key) && !stripeKeyRejected;

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (or your host's environment) to enable card checkout.",
    );
  }
  if (stripeKeyRejected) {
    throw new Error(
      isNotASecretKey
        ? "STRIPE_SECRET_KEY does not hold a secret key. Use the sk_live_… key from Developers → API keys, not the publishable pk_… one."
        : "STRIPE_SECRET_KEY is a test key and this is production. Card checkout is switched off rather than taking orders that collect no money.",
    );
  }
  if (!client) client = new Stripe(key);
  return client;
}
