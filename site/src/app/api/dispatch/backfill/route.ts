import { NextResponse } from "next/server";
import { refuse } from "@/lib/cronAuth";
import {
  orderConfirmationHtml,
  orderConfirmationSubject,
  orderConfirmationText,
} from "@/lib/email/orderConfirmation";
import { emailEnabled, sendEmail } from "@/lib/email/send";
import { paidSessionsBetween, toOrderEmail } from "@/lib/orders/fromStripe";
import { stripeEnabled } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Send the confirmation and invoice to people who bought before it existed.
 *
 * Card payments went live on 3 October; the confirmation email did not follow
 * until the 5th. Everyone in between paid and heard nothing from us except
 * Stripe's receipt, which covers the money and says nothing about the order.
 *
 * Run by hand, never on a schedule. It takes the same window and the same
 * template as the live path, so what those buyers get is exactly what a buyer
 * gets today, with one line at the top owning the delay.
 *
 *   dry run:  /api/dispatch/backfill?hours=96
 *   send:     /api/dispatch/backfill?hours=96&send=yes
 *
 * Sending is opt-in on purpose. Without it the route lists who *would* be
 * written to and stops — there is no undo on an email, and no record of who
 * has already had one, so the only protection against sending twice is
 * looking at the list first.
 */
export async function GET(request: Request) {
  const denied = refuse(request);
  if (denied) return denied;
  if (!stripeEnabled) return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });

  const url = new URL(request.url);
  const hours = Math.min(Math.max(Number(url.searchParams.get("hours") ?? 96), 1), 720);
  const send = url.searchParams.get("send") === "yes";

  const to = Math.floor(Date.now() / 1000);
  const from = to - hours * 3600;

  let sessions;
  try {
    sessions = await paidSessionsBetween(from, to);
  } catch (error) {
    console.error("[backfill] could not read Stripe", error);
    return NextResponse.json({ error: "stripe_read_failed" }, { status: 502 });
  }

  const orders = sessions
    .map((s) => {
      const email = s.customer_details?.email;
      return email ? { order: toOrderEmail(s, email), email } : null;
    })
    .filter((o): o is NonNullable<typeof o> => o !== null);

  if (!send) {
    return NextResponse.json({
      dryRun: true,
      hours,
      would_email: orders.map((o) => ({
        reference: o.order.reference,
        to: o.email,
        name: o.order.name,
        total: o.order.totalGBP,
      })),
      note: "Nothing was sent. Add &send=yes to send for real.",
    });
  }

  if (!emailEnabled) {
    return NextResponse.json({ error: "email_not_configured" }, { status: 503 });
  }

  const sent: string[] = [];
  const failed: { reference: string; reason: string }[] = [];

  for (const { order, email } of orders) {
    const result = await sendEmail({
      to: email,
      subject: orderConfirmationSubject(order),
      html: orderConfirmationHtml(order, { late: true }),
      text: orderConfirmationText(order, { late: true }),
    });
    if (result.ok) sent.push(order.reference);
    else failed.push({ reference: order.reference, reason: result.reason });
  }

  console.log("[backfill] done", { sent: sent.length, failed: failed.length });
  return NextResponse.json({ ok: true, sent, failed });
}
