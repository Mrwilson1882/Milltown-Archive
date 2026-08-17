import { NextResponse } from "next/server";
import type Stripe from "stripe";
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
 * Right now a paid order is logged. When you want orders to land somewhere —
 * an inbox, a spreadsheet, the inventory ledger — add it in `handlePaidOrder`.
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
    bundles: session.metadata?.bundles,
  });
}
