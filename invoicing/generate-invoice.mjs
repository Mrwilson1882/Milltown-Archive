#!/usr/bin/env node
/**
 * Archive Wholesale — invoice generator.
 *
 *   node invoicing/generate-invoice.mjs invoicing/jobs/<job>.json
 *   node invoicing/generate-invoice.mjs --blank
 *
 * A job file says who the customer is and what they bought. Prices come from
 * the live website catalogue (site/src/data/catalogue.ts) so an invoice can
 * never quote a figure the site does not — unless a price is deliberately
 * overridden on the line, which is then labelled as agreed on the invoice.
 *
 * The rule from pricing-notes.md carries over: no price is ever inferred. A lot
 * the owner has not priced comes through as an error naming the lot, not as a
 * guess.
 *
 * Output: invoicing/out/<invoice-number>.html — one self-contained file. Open it
 * in a browser and print to PDF for sending.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderInvoice, money } from "./render.mjs";
import { takeNext as takeOrderNumber, claim as claimOrderNumber, earmark as earmarkOrderNumber } from "./reserve-order-numbers.mjs";

/* Node reports the catalogue as a "typeless package" because it strips the
   TypeScript types at load. That is expected here and says nothing useful, so
   it is filtered out rather than printed over the invoice summary. */
process.removeAllListeners("warning");
process.on("warning", (w) => {
  if (w.code !== "MODULE_TYPELESS_PACKAGE_JSON") console.warn(w.stack ?? w.message);
});

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");
const OUT_DIR = join(HERE, "out");
const COUNTER = join(HERE, "next-number.json");
const PF_COUNTER = join(HERE, "next-proforma-number.json");
const LOGO = join(REPO, "site", "public", "logo.png");

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const today = () => new Date().toISOString().slice(0, 10);

/** Money in, money out — pence-accurate, so totals never drift by a penny. */
const round2 = (n) => Math.round(n * 100) / 100;

function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** "Due on receipt" has no date; "30 days" does. Terms are free text, so this
 *  only computes a date when the terms actually state a number of days. */
function dueDateFor(terms, invoiceDate) {
  const m = /(\d+)\s*days?/i.exec(terms ?? "");
  return m ? addDays(invoiceDate, Number(m[1])) : "";
}

/** Pro formas and invoices run separate sequences. A pro forma that is never
 *  taken up must not leave a hole in the invoice run, so it never touches it. */
const counterFor = (status) => (status === "proforma" ? PF_COUNTER : COUNTER);

function counterState(status) {
  const file = counterFor(status);
  if (existsSync(file)) return readJson(file);
  return status === "proforma"
    ? { prefix: "PF", next: 1, padding: 4 }
    : { prefix: "AW", next: 1, padding: 4 };
}

const formatRef = (state) =>
  `${state.prefix}-${String(state.next).padStart(state.padding, "0")}`;

/** The next number, reserved and written back immediately so the same number is
 *  never issued twice. Sequential numbering is what makes a set of documents
 *  auditable. */
function nextInvoiceNumber(status) {
  const state = counterState(status);
  const number = formatRef(state);
  writeFileSync(
    counterFor(status),
    `${JSON.stringify({ ...state, next: state.next + 1 }, null, 2)}\n`,
  );
  return number;
}

function peekInvoiceNumber(status) {
  return formatRef(counterState(status));
}

/**
 * Turn one job line into a printable line.
 *
 * Three shapes, all valid:
 *   { slug, pieces, qty }                  catalogue lot at the catalogue price
 *   { slug, pieces, qty, unitPrice }       catalogue lot at an agreed price
 *   { description, qty, unit, unitPrice }  anything else — kilos, carriage, a one-off
 */
function resolveLine(line, catalogue, defaults) {
  const qty = line.qty ?? 1;

  if (line.slug) {
    const product = catalogue.getProduct(line.slug);
    if (!product) {
      throw new Error(
        `Unknown product slug "${line.slug}". Slugs are the keys in site/src/data/catalogue.ts.`,
      );
    }

    const variant = line.pieces == null
      ? product.variants[0]
      : catalogue.findVariant(product, line.pieces);

    if (!variant) {
      const offered = product.variants.map((v) => v.pieces).join(", ") || "none listed";
      throw new Error(
        `"${product.name}" has no ${line.pieces}-${product.unit} option. Listed: ${offered}. ` +
          `Use an explicit unitPrice on the line to invoice a lot size the site does not list.`,
      );
    }

    const overridden = line.unitPrice != null;
    const unitPrice = overridden ? Number(line.unitPrice) : variant.priceGBP;

    if (unitPrice == null) {
      throw new Error(
        `"${product.name}" (${variant.pieces} ${product.unit}) is "Price on request" on the site. ` +
          `No price is inferred — set unitPrice on the line with the figure agreed.`,
      );
    }

    const detailParts = [
      `${variant.pieces} ${product.unit} per lot`,
      `${money(round2(unitPrice / variant.pieces))} per ${product.unit === "pairs" ? "pair" : "piece"}`,
      `Grade ${line.grade ?? product.grade ?? defaults.grade}`,
    ];
    if (line.sizeRun ?? product.sizeRun) detailParts.push(`Sizes: ${line.sizeRun ?? product.sizeRun}`);
    if (overridden) detailParts.push("Price as agreed");
    if (line.note) detailParts.push(line.note);

    return {
      name: line.description ?? product.name,
      detail: detailParts.join(" · "),
      qtyLabel: `${qty} ${qty === 1 ? "lot" : "lots"}`,
      unitPrice: round2(unitPrice),
      lineTotal: round2(unitPrice * qty),
      pieces: variant.pieces * qty,
      lotPieces: variant.pieces,
      qty,
    };
  }

  if (!line.description) {
    throw new Error("A line needs either a catalogue `slug` or a `description`.");
  }
  if (line.unitPrice == null) {
    throw new Error(`Line "${line.description}" has no unitPrice. No price is inferred.`);
  }

  const unit = line.unit ?? "item";
  return {
    name: line.description,
    detail: line.note ?? "",
    qtyLabel: `${qty} ${unit}${qty === 1 || unit.endsWith("s") || unit === "kg" ? "" : "s"}`,
    unitPrice: round2(Number(line.unitPrice)),
    lineTotal: round2(Number(line.unitPrice) * qty),
    pieces: 0,
  };
}

/**
 * The standing carriage rate for this order, where the owner has set one.
 *
 * Only a single lot of a size named in company.json gets one — a bigger or
 * mixed order is quoted, because a rate for one parcel says nothing about two.
 * A job that states its own `delivery` always wins, including `0`.
 */
function defaultCarriage(lines, company) {
  const table = company.defaults?.carriage?.byLotSize;
  if (!table || lines.length !== 1) return 0;
  const [line] = lines;
  if (line.qty !== 1 || line.lotPieces == null) return 0;
  const rate = table[String(line.lotPieces)];
  return rate == null ? 0 : round2(Number(rate));
}

/** Everything that must be filled in before this invoice can go to a customer.
 *  Printed on the invoice itself, so an incomplete one cannot be sent by
 *  accident. */
function findMissing(inv, company) {
  const out = [];
  const office = company.registeredOffice ?? {};
  if (!(office.lines ?? []).filter(Boolean).length) {
    out.push(
      "Registered office address is not set in invoicing/company.json — a UK company must show it on its invoices.",
    );
  }
  // Only bank transfer needs bank details. Payment by link needs nothing here —
  // the link is sent alongside the invoice.
  if ((company.payment?.method ?? "bank") !== "link") {
    const bank = company.bank ?? {};
    if (!bank.accountName || !bank.sortCode || !bank.accountNumber) {
      out.push("Bank details are not set in invoicing/company.json — the customer has no way to pay.");
    }
  }
  if (!inv.customer.business && !inv.customer.contact) {
    out.push("No customer name on this invoice.");
  }
  // A pro forma is a quotation; it can go out before an address is known. A
  // sales invoice cannot.
  if (inv.status === "invoice" && !(inv.customer.lines ?? []).filter(Boolean).length) {
    out.push("No customer address on this invoice.");
  }
  if (!inv.lines.length) out.push("No line items on this invoice.");
  if (inv.status === "proforma" && inv.lines.some((l) => l.unitPrice === 0)) {
    out.push("A line has no price — a pro forma exists to state the cost, so every line needs one.");
  }
  return out;
}

export function buildInvoice(job, company, catalogue, { reserveNumber = true } = {}) {
  const invoiceDate = job.invoiceDate || today();
  const paymentTerms = job.paymentTerms || company.defaults.paymentTerms;

  const lines = (job.lines ?? []).map((l) => resolveLine(l, catalogue, company.defaults));
  const subtotal = round2(lines.reduce((s, l) => s + l.lineTotal, 0));
  const discount = round2(Number(job.discount ?? 0));
  const carriageDefaulted = job.delivery == null;
  const delivery = carriageDefaulted
    ? defaultCarriage(lines, company)
    : round2(Number(job.delivery));
  const net = round2(subtotal - discount + delivery);
  const vat = company.vat.registered ? round2(net * (company.vat.ratePercent / 100)) : 0;

  // Pro forma until the purchase is confirmed. That is the normal state of a
  // document sent with a payment link, so it is the default.
  const status = job.status === "invoice" ? "invoice" : "proforma";

  const invoiceNumber =
    job.invoiceNumber ||
    (reserveNumber ? nextInvoiceNumber(status) : peekInvoiceNumber(status));

  /* Order numbers belong to sales invoices, not pro formas: an order is not an
     order until it is confirmed and paid. A pro forma may still name the number
     earmarked for it, which is then held rather than used, so the run stays
     gap-free when it converts. */
  let orderNumber = job.orderNumber || "";
  if (status === "invoice") {
    if (orderNumber) {
      if (reserveNumber) claimOrderNumber(orderNumber, invoiceNumber);
    } else if (reserveNumber) {
      orderNumber = takeOrderNumber(invoiceNumber);
    }
  } else if (orderNumber && reserveNumber) {
    earmarkOrderNumber(orderNumber, invoiceNumber);
  }

  const inv = {
    status,
    invoiceNumber,
    orderNumber,
    validUntil: job.validUntil || "",
    invoiceDate,
    supplyDate: job.supplyDate || "",
    paymentTerms,
    dueDate: job.dueDate || dueDateFor(paymentTerms, invoiceDate),
    poNumber: job.poNumber || "",
    customer: {
      business: "",
      contact: "",
      lines: [],
      postcode: "",
      email: "",
      phone: "",
      ...(job.customer ?? {}),
    },
    deliverTo: job.deliverTo ?? null,
    lines,
    subtotal,
    discount,
    delivery,
    vat,
    total: round2(net + vat),
    paymentLink: job.paymentLink || "",
    notes: job.notes || "",
    carriageDefaulted: carriageDefaulted && delivery > 0,
    totalPieces: lines.reduce((s, l) => s + l.pieces, 0),
  };

  inv.missing = findMissing(inv, company);
  return inv;
}

async function main() {
  const args = process.argv.slice(2);
  const blank = args.includes("--blank");
  const jobPath = args.find((a) => !a.startsWith("--"));

  if (!blank && !jobPath) {
    console.error(
      "Usage:\n" +
        "  node invoicing/generate-invoice.mjs invoicing/jobs/<job>.json\n" +
        "  node invoicing/generate-invoice.mjs --blank\n",
    );
    process.exit(1);
  }

  const company = readJson(join(HERE, "company.json"));
  const catalogue = await import(join(REPO, "site", "src", "data", "catalogue.ts"));

  const job = blank
    ? { status: "proforma", invoiceNumber: peekInvoiceNumber("proforma"), lines: [] }
    : readJson(resolve(jobPath));

  const inv = buildInvoice(job, company, catalogue, { reserveNumber: !blank && !job.invoiceNumber });

  const logoDataUri = `data:image/png;base64,${readFileSync(LOGO).toString("base64")}`;
  const html = renderInvoice(inv, company, logoDataUri);

  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, `${blank ? "blank" : inv.invoiceNumber}.html`);
  writeFileSync(outPath, html);

  const label = inv.status === "proforma" ? "Pro forma" : "Invoice";
  const order = inv.orderNumber ? `  ·  order ${inv.orderNumber}` : "";
  console.log(`${label} ${inv.invoiceNumber}${order}  ->  ${outPath}`);
  console.log(`  ${inv.lines.length} line(s), ${inv.totalPieces} pieces, total ${money(inv.total)}`);
  if (inv.carriageDefaulted) {
    console.log(`  carriage ${money(inv.delivery)} from the standing rate for a ${inv.lines[0].lotPieces}-piece lot`);
  }
  if (inv.missing.length) {
    console.log("\n  NOT READY TO SEND:");
    for (const m of inv.missing) console.log(`  - ${m}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(`\nError: ${err.message}\n`);
    process.exit(1);
  });
}
