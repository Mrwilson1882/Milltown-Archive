import "server-only";
import ExcelJS from "exceljs";
import type Stripe from "stripe";
import { paidSessionsBetween } from "@/lib/orders/fromStripe";

/**
 * The customer list, rebuilt from scratch every time.
 *
 * Nothing is stored between runs and nothing needs to be: Stripe holds every
 * order that has ever been taken, so the list is read back from the beginning
 * on each build. That is what makes it accumulate — not a file that is
 * appended to and could lose its place, but the whole history re-read. A run
 * that fails costs nothing, and the same list can be produced twice without
 * the two disagreeing.
 *
 * One row per person, not per order. Someone who has bought three times is a
 * better prospect than three separate rows suggest, so the row carries their
 * order count and what they have spent.
 */

/** Everything the site has ever taken. Comfortably before the first sale. */
const BEGINNING = Math.floor(new Date("2026-09-01T00:00:00Z").getTime() / 1000);

export type Customer = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  town: string;
  county: string;
  postcode: string;
  orders: number;
  spentGBP: number;
  firstOrder: string;
  lastOrder: string;
  lots: string;
};

function dateOf(session: Stripe.Checkout.Session): string {
  return new Date((session.created ?? 0) * 1000).toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Collapse every order into one row per email address.
 *
 * Keyed on the email because that is what a mailing list sends to, and the
 * same person ordering to two addresses is still one person to write to. The
 * address kept is the most recent one they used — an old address on a list is
 * worse than none, because it looks like we have not noticed they moved.
 */
export async function buildCustomerList(): Promise<Customer[]> {
  const sessions = await paidSessionsBetween(BEGINNING, Math.floor(Date.now() / 1000));
  const byEmail = new Map<string, Customer>();

  for (const session of sessions) {
    const details = session.customer_details;
    const email = (details?.email ?? "").trim().toLowerCase();
    if (!email) continue;

    const shipping = session.collected_information?.shipping_details ?? null;
    const address = shipping?.address ?? details?.address ?? null;
    const total = (session.amount_total ?? 0) / 100;
    const when = dateOf(session);
    const lots = (session.line_items?.data ?? [])
      .map((i) => i.description)
      .filter((d): d is string => Boolean(d))
      .join("; ");

    const existing = byEmail.get(email);
    if (existing) {
      existing.orders += 1;
      existing.spentGBP = Math.round((existing.spentGBP + total) * 100) / 100;
      existing.lastOrder = when;
      // Keep the newest address and the fullest set of lots.
      existing.name = shipping?.name || details?.name || existing.name;
      existing.phone = details?.phone ?? existing.phone;
      existing.line1 = address?.line1 ?? existing.line1;
      existing.line2 = address?.line2 ?? existing.line2;
      existing.town = address?.city ?? existing.town;
      existing.county = address?.state ?? existing.county;
      existing.postcode = address?.postal_code ?? existing.postcode;
      existing.lots = [existing.lots, lots].filter(Boolean).join("; ");
      continue;
    }

    byEmail.set(email, {
      name: shipping?.name || details?.name || "",
      email,
      phone: details?.phone ?? "",
      line1: address?.line1 ?? "",
      line2: address?.line2 ?? "",
      town: address?.city ?? "",
      county: address?.state ?? "",
      postcode: address?.postal_code ?? "",
      orders: 1,
      spentGBP: total,
      firstOrder: when,
      lastOrder: when,
      lots,
    });
  }

  // Best customers first — that is the order you would work down the list in.
  return [...byEmail.values()].sort((a, b) => b.spentGBP - a.spentGBP);
}

/** The list as a real .xlsx, ready to open or import. */
export async function customerWorkbook(customers: Customer[]): Promise<Buffer> {
  const book = new ExcelJS.Workbook();
  book.creator = "Archive Wholesale";
  book.created = new Date();

  const sheet = book.addWorksheet("Customers", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheet.columns = [
    { header: "Name", key: "name", width: 26 },
    { header: "Email", key: "email", width: 34 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Address 1", key: "line1", width: 28 },
    { header: "Address 2", key: "line2", width: 22 },
    { header: "Town", key: "town", width: 18 },
    { header: "County", key: "county", width: 18 },
    { header: "Postcode", key: "postcode", width: 12 },
    { header: "Orders", key: "orders", width: 9 },
    { header: "Spent (£)", key: "spentGBP", width: 12 },
    { header: "First order", key: "firstOrder", width: 13 },
    { header: "Last order", key: "lastOrder", width: 13 },
    { header: "Lots bought", key: "lots", width: 46 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0F4A2E" },
  };
  sheet.getRow(1).height = 20;

  customers.forEach((c) => sheet.addRow(c));

  sheet.getColumn("spentGBP").numFmt = "0.00";
  sheet.getColumn("orders").alignment = { horizontal: "center" };
  // Filters on every column, because the point of the list is slicing it.
  sheet.autoFilter = { from: "A1", to: { row: 1, column: sheet.columns.length } };

  const out = await book.xlsx.writeBuffer();
  return Buffer.from(out);
}
