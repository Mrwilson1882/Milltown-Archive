import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { dispatchHtml, dispatchSubject, dispatchText } from "@/lib/email/dispatchNote";
import {
  orderConfirmationHtml,
  orderConfirmationSubject,
  orderConfirmationText,
} from "@/lib/email/orderConfirmation";
import { ORDER_BCC, emailEnabled, sendEmail } from "@/lib/email/send";
import { toEvriOrder, toOrderEmail } from "@/lib/orders/fromStripe";
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

    await sendDispatchNote(full);
  } catch (error) {
    // Never rethrow. Stripe retries a non-2xx, and a retry loop on a mailbox
    // problem means the buyer gets the same email five times when it recovers.
    console.error("[stripe-webhook] confirmation threw", session.id, error);
  }
}

/**
 * The owner's picking list: what to pull, what it is worth, where it goes.
 *
 * No Evri sheet attached. Labels are booked a day at a time, and one CSV per
 * order would be a folder of single-row files to merge by hand before any of
 * them could be uploaded.
 */
async function sendDispatchNote(session: Stripe.Checkout.Session): Promise<void> {
  if (!ORDER_BCC) return;

  const evri: EvriOrder = toEvriOrder(session);

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
