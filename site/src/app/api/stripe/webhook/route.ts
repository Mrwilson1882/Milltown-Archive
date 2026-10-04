import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  orderConfirmationHtml,
  orderConfirmationSubject,
  orderConfirmationText,
  type OrderEmailData,
} from "@/lib/email/orderConfirmation";
import { ORDER_BCC, emailEnabled, sendEmail } from "@/lib/email/send";
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
    const result = await sendEmail({
      to: email,
      bcc: ORDER_BCC || undefined,
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
