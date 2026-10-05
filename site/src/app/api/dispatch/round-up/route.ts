import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendEmail, ORDER_BCC, emailEnabled } from "@/lib/email/send";
import { formatPrice } from "@/lib/format";
import { paidSessionsBetween, toEvriOrder } from "@/lib/orders/fromStripe";
import { evriCsv, overweight, weightFor } from "@/lib/shipping/evri";
import { stripeEnabled } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The twice-daily Evri sheet.
 *
 * Fired by Vercel cron at 9am and 3pm. Each run asks Stripe for the orders
 * paid since the previous run and emails one sheet covering all of them, so a
 * batch of labels is a single upload rather than one file per customer.
 *
 * Nothing is stored between runs. Stripe already holds every order, so the
 * window is worked out from the clock and the orders are read back on demand
 * — no database, no state to go stale, and a run can be repeated safely.
 *
 * The windows are deliberately contiguous and non-overlapping: the 9am run
 * covers 15:00 yesterday to 09:00 today, the 3pm run covers 09:00 to 15:00.
 * An order can therefore appear on exactly one sheet, which matters because a
 * duplicate row is a duplicate label and a duplicate label costs money.
 *
 * Also callable by hand with ?hours=N, which is the way to recover a window
 * if a scheduled run fails.
 */

/**
 * Scheduled hours, UTC. Must match the crons in vercel.json exactly.
 *
 * UTC rather than UK local on purpose. Cron fires in UTC and does not know
 * about British Summer Time, so a schedule written in local hours and a
 * window worked out in local hours disagree by an hour for half the year —
 * and the disagreement is a gap, which means an order in it is never put on
 * any sheet. Both sides use UTC and always line up. The cost is that the
 * emails land at 9am and 3pm through the winter and 10am and 4pm through the
 * summer; say the word at the clock change and it is a one-line shift.
 */
const RUNS = [9, 15];

/**
 * The window this run covers, as unix seconds.
 *
 * Worked out in UK local time because that is what the schedule is written
 * in. Vercel fires cron in UTC, so the hour drifts by one over the summer;
 * the window is derived from the actual time of the run rather than assumed,
 * so a drifting trigger still produces touching windows rather than a gap.
 */
function windowFor(now: Date, hoursOverride: number | null): { from: number; to: number } {
  const to = Math.floor(now.getTime() / 1000);
  if (hoursOverride !== null) return { from: to - hoursOverride * 3600, to };
  return { from: to - hoursSincePrevious(now.getUTCHours()) * 3600, to };
}

/**
 * Hours back to the run before this one, wrapping across midnight.
 *
 * At 09:00 the run before was 15:00 yesterday, eighteen hours ago. At 15:00
 * it was 09:00, six hours ago. Together the two windows cover the day exactly
 * once — no gap for an order to fall into, and no overlap to put a second
 * label on a parcel that already has one.
 */
function hoursSincePrevious(hour: number): number {
  const before = RUNS.filter((h) => h < hour);
  if (before.length > 0) return hour - before[before.length - 1];
  return hour + 24 - RUNS[RUNS.length - 1];
}

export async function GET(request: Request) {
  // Vercel sends this header on scheduled runs when CRON_SECRET is set. It is
  // the only thing standing between a public URL and anyone being able to
  // pull every customer address we hold, so an unset secret closes the route
  // rather than opening it.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "cron_secret_not_set" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }
  if (!stripeEnabled) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const raw = url.searchParams.get("hours");
  const hours = raw ? Math.min(Math.max(Number(raw), 1), 168) : null;
  const { from, to } = windowFor(new Date(), Number.isFinite(hours) ? hours : null);

  let sessions: Stripe.Checkout.Session[];
  try {
    sessions = await paidSessionsBetween(from, to);
  } catch (error) {
    console.error("[round-up] could not read Stripe", error);
    return NextResponse.json({ error: "stripe_read_failed" }, { status: 502 });
  }

  const orders = sessions.map(toEvriOrder).filter((o) => o.parcels.length > 0 && o.postcode);

  // Quiet when there is nothing. A sheet with no rows in it every morning
  // trains you to ignore the one that matters.
  if (orders.length === 0) {
    console.log("[round-up] nothing to send", { from, to });
    return NextResponse.json({ ok: true, orders: 0, from, to });
  }

  if (!emailEnabled || !ORDER_BCC) {
    return NextResponse.json({ error: "email_not_configured", orders: orders.length }, { status: 503 });
  }

  const parcels = orders.reduce((n, o) => n + o.parcels.length, 0);
  const goods = orders.reduce(
    (n, o) => n + o.parcels.reduce((m, p) => m + p.valueGBP, 0),
    0,
  );
  const heavy = orders.flatMap((o) => overweight(o.parcels));
  const stamp = new Date(to * 1000).toLocaleString("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines = orders.map(
    (o) =>
      `  ${o.reference} — ${o.name}, ${o.postcode} — ${o.parcels
        .map((p) => `${p.name} (${p.pieces}pc, ${weightFor(p.pieces)}kg)`)
        .join(" + ")}`,
  );

  const text = [
    `EVRI ROUND-UP — ${stamp}`,
    "",
    `${orders.length} ${orders.length === 1 ? "order" : "orders"}, ${parcels} ${
      parcels === 1 ? "parcel" : "parcels"
    }, ${formatPrice(goods)} of goods.`,
    "",
    ...lines,
    "",
    ...(heavy.length
      ? [`SPLIT BEFORE BOOKING: ${heavy.length} parcel(s) are over Evri's 15kg limit.`, ""]
      : []),
    "The attached sheet is every parcel above. Upload it in the Evri business portal.",
  ].join("\n");

  const html = `<pre style="font:14px/1.6 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap">${text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")}</pre>`;

  const filename = `evri-${new Date(to * 1000).toISOString().slice(0, 16).replace(/[:T]/g, "-")}.csv`;
  const result = await sendEmail({
    to: ORDER_BCC,
    subject: `Evri round-up — ${orders.length} ${orders.length === 1 ? "order" : "orders"}, ${parcels} ${parcels === 1 ? "parcel" : "parcels"} — ${stamp}`,
    text,
    html,
    attachments: [{ filename, content: evriCsv(orders) }],
  });

  if (!result.ok) {
    console.error("[round-up] send failed", result.reason);
    return NextResponse.json({ error: "send_failed", reason: result.reason }, { status: 502 });
  }

  console.log("[round-up] sent", { orders: orders.length, parcels, from, to });
  return NextResponse.json({ ok: true, orders: orders.length, parcels, from, to });
}
