import "server-only";
import type Stripe from "stripe";
import type { OrderEmailData } from "@/lib/email/orderConfirmation";
import type { EvriOrder } from "@/lib/shipping/evri";
import { getStripe } from "@/lib/stripe";

/**
 * One reading of a paid order, shared by everything that needs one.
 *
 * The webhook, the twice-daily round-up and the backfill all have to turn a
 * Stripe Checkout session into the same shapes. Three copies of that mapping
 * is three places for the parcel count to drift from the invoice, so it lives
 * here once.
 */

const pounds = (pence: number | null | undefined): number => (pence ?? 0) / 100;

/**
 * An order reference the buyer can quote and we can find.
 *
 * Stripe session ids are `cs_live_` plus a long random tail. The tail is what
 * makes it unique, so the reference is the last eight characters of it,
 * uppercased — short enough to read down a phone and still ours to search.
 */
export function reference(sessionId: string): string {
  return `AW-${sessionId.slice(-8).toUpperCase()}`;
}

/**
 * Every order *paid for* between two instants, oldest first.
 *
 * Driven off charges rather than Checkout sessions, because a session is
 * stamped when checkout opens and not when the card goes through. Someone who
 * reaches the payment page at 08:55 and pays at 09:05 has a session in the
 * earlier window but was not paid when that window closed — keyed on the
 * session they would fall between two runs and appear in neither.
 */
export async function paidSessionsBetween(
  from: number,
  to: number,
): Promise<Stripe.Checkout.Session[]> {
  const stripe = getStripe();

  const charges: Stripe.Charge[] = [];
  let after: string | undefined;
  for (let page = 0; page < 10; page += 1) {
    const batch = await stripe.charges.list({
      created: { gte: from, lt: to },
      limit: 100,
      ...(after ? { starting_after: after } : {}),
    });
    charges.push(...batch.data.filter((c) => c.status === "succeeded" && !c.refunded));
    if (!batch.has_more || batch.data.length === 0) break;
    after = batch.data[batch.data.length - 1].id;
  }

  const sessions: Stripe.Checkout.Session[] = [];
  for (const charge of charges) {
    const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
    if (!pi) continue;
    const found = await stripe.checkout.sessions.list({
      payment_intent: pi,
      limit: 1,
      expand: ["data.line_items"],
    });
    const session = found.data[0];
    // A payment with no Checkout session behind it was taken some other way —
    // a payment link, or by hand. Not ours to act on.
    if (session && session.payment_status === "paid") sessions.push(session);
  }

  return sessions.reverse();
}

const addressLines = (addr: Stripe.Address | null | undefined): string[] =>
  [addr?.line1 ?? "", addr?.line2 ?? "", addr?.city ?? "", addr?.postal_code ?? ""].filter(Boolean);

/** What the buyer's confirmation and invoice is built from. */
export function toOrderEmail(session: Stripe.Checkout.Session, email: string): OrderEmailData {
  const details = session.customer_details;
  const shipping = session.collected_information?.shipping_details ?? null;
  const address = shipping?.address ?? details?.address ?? null;

  return {
    reference: reference(session.id),
    placedOn: new Date((session.created ?? Date.now() / 1000) * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/London",
    }),
    billingName: details?.name || shipping?.name || "",
    billingLines: addressLines(details?.address),
    email,
    phone: details?.phone ?? undefined,
    name: shipping?.name || details?.name || "",
    addressLines: addressLines(address),
    lines: (session.line_items?.data ?? []).map((item) => ({
      name: item.description ?? "Lot",
      qty: item.quantity ?? 1,
      unitGBP: pounds(item.price?.unit_amount),
      amountGBP: pounds(item.amount_total),
    })),
    deliveryGBP: pounds(session.shipping_cost?.amount_total),
    totalGBP: pounds(session.amount_total),
  };
}

/**
 * The parcels an order ships as.
 *
 * The checkout route writes `lots` into the session metadata as
 * `slug/pieces×qty`, in the same order the line items were built, which makes
 * it the reliable source for how many parcels and of what size — the line
 * item's description is prose and would have to be parsed back out of English.
 * Prices and names still come from the line items, matched by position.
 */
export function parcelsFrom(session: Stripe.Checkout.Session): EvriOrder["parcels"] {
  const items = session.line_items?.data ?? [];
  const parcels: EvriOrder["parcels"] = [];

  (session.metadata?.lots ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((lot, i) => {
      const match = lot.match(/\/(\d+)[×x](\d+)$/);
      if (!match) return;
      const slug = lot.split("/")[0] ?? "";
      const pieces = Number(match[1]);
      const qty = Number(match[2]);
      const unit = pounds(items[i]?.price?.unit_amount);
      const name = items[i]?.description ?? slug ?? "Lot";
      // Each lot ships as its own parcel, so a quantity of two is two parcels.
      for (let n = 0; n < qty; n += 1) parcels.push({ name, slug, pieces, valueGBP: unit });
    });

  return parcels;
}

/** What the Evri sheet and the picking list are built from. */
export function toEvriOrder(session: Stripe.Checkout.Session): EvriOrder {
  const details = session.customer_details;
  const shipping = session.collected_information?.shipping_details ?? null;
  const address = shipping?.address ?? details?.address ?? null;

  return {
    reference: reference(session.id),
    name: shipping?.name || details?.name || "",
    email: details?.email ?? "",
    phone: details?.phone ?? undefined,
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    town: address?.city ?? "",
    county: address?.state ?? "",
    postcode: address?.postal_code ?? "",
    parcels: parcelsFrom(session),
  };
}
