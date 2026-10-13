import { NextResponse } from "next/server";
import { refuse } from "@/lib/cronAuth";
import { ORDER_BCC, emailEnabled, sendEmail } from "@/lib/email/send";
import { buildCustomerList, customerWorkbook } from "@/lib/marketing/customers";
import { stripeEnabled } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Archive Wholesale Customers — the marketing list.
 *
 * Sent once a week, with every customer who has ever bought, one row each.
 * It is rebuilt from the whole order history on every run rather than added
 * to, so it cannot drift, cannot lose its place, and the same spreadsheet can
 * be produced twice without the two disagreeing.
 *
 * Fired by the Monday morning cron, and callable by hand at any time for a
 * fresh copy — see sendCustomerList, which the round-up route calls.
 */
export async function GET(request: Request) {
  const denied = refuse(request);
  if (denied) return denied;
  if (!stripeEnabled) return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });

  const result = await sendCustomerList();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

export async function sendCustomerList(): Promise<{
  ok: boolean;
  customers?: number;
  reason?: string;
}> {
  let customers;
  try {
    customers = await buildCustomerList();
  } catch (error) {
    console.error("[customers] could not read Stripe", error);
    return { ok: false, reason: "stripe_read_failed" };
  }

  if (customers.length === 0) return { ok: true, customers: 0 };
  if (!emailEnabled || !ORDER_BCC) return { ok: false, reason: "email_not_configured" };

  const repeat = customers.filter((c) => c.orders > 1).length;
  const allowed = customers.filter((c) => c.marketing === "Yes").length;
  const spent = customers.reduce((n, c) => n + c.spentGBP, 0);
  const stamp = new Date().toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const text = [
    `ARCHIVE WHOLESALE CUSTOMERS — ${stamp}`,
    "",
    `${customers.length} ${customers.length === 1 ? "customer" : "customers"}, ${repeat} of whom have bought more than once.`,
    `£${spent.toFixed(2)} taken from them in total.`,
    "",
    "The spreadsheet is every customer since the first order, one row each,",
    "best first. It is rebuilt in full each week rather than added to, so it",
    "always holds everyone — there is no older copy you need to keep.",
    "",
    `${allowed} of them said yes to marketing emails at checkout. They are on`,
    "the Marketing Allowed tab, and that tab is the only one to send offers to.",
    "Everyone else is on Marketing Not Allowed: they said no, or bought before",
    "checkout asked. Put an unsubscribe link in every email, and move anyone",
    "who asks to come off straight onto the second tab.",
  ].join("\n");

  const file = await customerWorkbook(customers);
  const result = await sendEmail({
    to: ORDER_BCC,
    subject: `Archive Wholesale Customers — ${customers.length} on the list — ${stamp}`,
    text,
    html: `<pre style="font:14px/1.6 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre>`,
    attachments: [
      {
        filename: `Archive-Wholesale-Customers-${new Date().toISOString().slice(0, 10)}.xlsx`,
        content: file,
      },
    ],
  });

  if (!result.ok) {
    console.error("[customers] send failed", result.reason);
    return { ok: false, reason: result.reason };
  }
  console.log("[customers] sent", { customers: customers.length });
  return { ok: true, customers: customers.length };
}
