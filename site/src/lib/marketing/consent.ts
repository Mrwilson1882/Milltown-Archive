import type Stripe from "stripe";

/** The key of the checkout question, shared by the checkout and every reader. */
export const MARKETING_FIELD = "marketing";

/**
 * What one order says about email marketing.
 *
 * "Not asked" is kept apart from "No" on purpose: orders from before the
 * question existed were never given the choice, so they are neither a yes nor
 * a refusal. A question shown and left blank is not consent, and is counted as
 * a no.
 */
export type MarketingAnswer = "Yes" | "No" | "Not asked";

export function marketingAnswer(session: Stripe.Checkout.Session): MarketingAnswer {
  const field = session.custom_fields?.find((f) => f.key === MARKETING_FIELD);
  if (!field) return "Not asked";
  return field.dropdown?.value === "yes" ? "Yes" : "No";
}
