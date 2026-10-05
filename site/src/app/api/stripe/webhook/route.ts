import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { dispatchHtml, dispatchSubject, dispatchText } from "@/lib/email/dispatchNote";
import {
  orderConfirmationHtml,
  orderConfirmationSubject,
  orderConfirmationText,
  type OrderEmailData,
} from "@/lib/email/orderConfirmation";
import { ORDER_BCC, emailEnabled, sendEmail } from "@/lib/email/send";
import type { EvriOrder } from "@/lib/shipping/evri";
import { getStripe, stripeEnabled } from "@/lib/stripe";

export const runtime = "nodejs";
/** Stripe signs the raw body — this route must never be cached or pre-rendered. */
export const dynamic = "force-dynamic";

/**
 * Order notifications from Stripe.
 *
 * Point a webhook endpoint at https://www.archivewholesale.co.uk/api/stripe/webhook
 * in the Stripe dashboard, subscribe to `checkout.session.completed`, and put
 * the signing secret in STRIPE_WEBHOOK_SECRET.
 *
 * A paid order is logged and the buyer gets their confirmation. Stripe's own
 * receipt covers the money; this covers the order — what is coming, when it
 * ships, and everything a first-time buyer asks after the box lands.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeEnabled || !secret) {
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    // An unverified payload is not from Stripe. Never act on it.
    console.error("[stripe-webhook] signature verification failed", error);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handlePaidOrder(event.data.object);
  }

  return NextResponse.json({ received: true });
}

async function handlePaidOrder(session: Stripe.Checkout.Session) {
  console.log("[stripe-webhook] paid order", {
    id: session.id,
    email: session.customer_details?.email,
    amountTotal: session.amount_total,
    currency: session.currency,
    lots: session.metadata?.lots,
  });

  const email = session.customer_details?.email;
  if (!email) {
    console.error("[stripe-webhook] no email on session, cannot confirm", session.id);
    return;
  }
  if (!emailEnabled) {
    console.warn("[stripe-webhook] RESEND_API_KEY not set — no confirmation sent", session.id);
    return;
  }

  try {
    // The event payload carries no line items, so the order has to be read
    // back. Expanded rather than listed separately: one call, one round trip.
    const full = await getStripe().checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    const order = toOrderEmail(full, email);
    // The buyer's copy carries no attachment: the Evri sheet is ours.
    const result = await sendEmail({
      to: email,
      subject: orderConfirmationSubject(order),
      html: orderConfirmationHtml(order),
      text: orderConfirmationText(order),
    });

    if (result.ok) {
      console.log("[stripe-webhook] confirmation sent", { session: session.id, id: result.id });
    } else {
      console.error("[stripe-webhook] confirmation failed", {
        session: session.id,
        reason: result.reason,
      });
    }

    await sendDispatchNote(full, order);
  } catch (error) {
    // Never rethrow. Stripe retries a non-2xx, and a retry loop on a mailbox
    // problem means the buyer gets the same email five times when it recovers.
    console.error("[stripe-webhook] confirmation threw", session.id, error);
  }
}

const pounds = (pence: number | null | undefined): number => (pence ?? 0) / 100;

/**
 * An order reference the buyer can quote and we can find.
 *
 * Stripe session ids are `cs_live_` plus a long random tail. The tail is what
 * makes it unique, so the reference is the last eight characters of it,
 * uppercased — short enough to read down a phone and still ours to search.
 */
function reference(sessionId: string): string {
  return `AW-${sessionId.slice(-8).toUpperCase()}`;
}

function toOrderEmail(session: Stripe.Checkout.Session, email: string): OrderEmailData {
  const details = session.customer_details;
  const shipping = session.collected_information?.shipping_details ?? null;
  const address = shipping?.address ?? details?.address ?? null;

  const lines = (addr: Stripe.Address | null | undefined): string[] =>
    [addr?.line1 ?? "", addr?.line2 ?? "", addr?.city ?? "", addr?.postal_code ?? ""].filter(
      Boolean,
    );

  return {
    reference: reference(session.id),
    placedOn: new Date((session.created ?? Date.now() / 1000) * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/London",
    }),
    billingName: details?.name || shipping?.name || "",
    billingLines: lines(details?.address),
    email,
    phone: details?.phone ?? undefined,
    name: shipping?.name || details?.name || "",
    addressLines: lines(address),
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
 * Turn the session's own record of what was bought into parcels.
 *
 * The checkout route writes `lots` into the session metadata as
 * `slug/pieces×qty`, in the same order the line items were built, which makes
 * it the reliable source for how many parcels and of what size — the line
 * item's description is prose and would have to be parsed back out of English.
 * Prices still come from the line items, matched by position.
 */
function parcelsFrom(session: Stripe.Checkout.Session): EvriOrder["parcels"] {
  const lots = (session.metadata?.lots ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const items = session.line_items?.data ?? [];

  const parcels: EvriOrder["parcels"] = [];
  lots.forEach((lot, i) => {
    const match = lot.match(/\/(\d+)[×x](\d+)$/);
    if (!match) return;
    const pieces = Number(match[1]);
    const qty = Number(match[2]);
    // Each lot ships as its own parcel, so a quantity of two is two parcels.
    const unit = pounds(items[i]?.price?.unit_amount);
    // The line item's own wording, which is what the buyer saw and what the
    // owner will be looking for on the rail. Falls back to the slug.
    const name = items[i]?.description ?? lot.split("/")[0] ?? "Lot";
    for (let n = 0; n < qty; n += 1) parcels.push({ name, pieces, valueGBP: unit });
  });
  return parcels;
}

/**
 * The owner's picking list: what to pull, what it is worth, where it goes.
 *
 * No Evri sheet attached. Labels are booked a day at a time, and one CSV per
 * order would be a folder of single-row files to merge by hand before any of
 * them could be uploaded.
 */
async function sendDispatchNote(
  session: Stripe.Checkout.Session,
  order: OrderEmailData,
): Promise<void> {
  if (!ORDER_BCC) return;

  const shipping = session.collected_information?.shipping_details ?? null;
  const address = shipping?.address ?? session.customer_details?.address ?? null;

  const evri: EvriOrder = {
    reference: order.reference,
    name: order.name,
    email: order.email,
    phone: order.phone,
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    town: address?.city ?? "",
    county: address?.state ?? "",
    postcode: address?.postal_code ?? "",
    parcels: parcelsFrom(session),
  };

  const result = await sendEmail({
    to: ORDER_BCC,
    subject: dispatchSubject(evri),
    html: dispatchHtml(evri),
    text: dispatchText(evri),
  });

  if (!result.ok) {
    console.error("[stripe-webhook] dispatch note failed", {
      session: session.id,
      reason: result.reason,
    });
  }
}
