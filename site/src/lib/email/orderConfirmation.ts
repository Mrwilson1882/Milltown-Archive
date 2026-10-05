import "server-only";
import { addressLine, siteConfig, whatsappUrl } from "@/config/site";
import { formatPrice } from "@/lib/format";

/**
 * The order confirmation a buyer gets the moment a payment clears.
 *
 * It carries the order itself — what was bought, what was paid, where it is
 * going — and then the whole of the "just purchased" sheet: what happens next,
 * wash it before it goes on the rail, and the three things every buyer asks
 * after a first box lands. One email, so there is nothing for them to go and
 * find and nothing for us to send separately.
 *
 * Written as tables with inline styles because that is what email clients
 * render. Outlook has no flexbox and no grid, Gmail strips <style> blocks on
 * forwarded mail, and a dark-mode client will invert anything that does not
 * state its own colours. No web font either: Archivo will not load, so this
 * sets the same stack the site falls back to.
 */
export type OrderEmailLine = {
  name: string;
  qty: number;
  /** What one of them cost. Shown only when more than one was bought. */
  unitGBP: number;
  amountGBP: number;
};

export type OrderEmailData = {
  /** Doubles as the invoice number. Short, and unique to the order. */
  reference: string;
  placedOn: string;
  /** Who the invoice is made out to, from the billing details at checkout. */
  billingName: string;
  billingLines: string[];
  email: string;
  phone?: string;
  /** Who it ships to. Often the same, so the email only prints it once. */
  name: string;
  addressLines: string[];
  lines: OrderEmailLine[];
  deliveryGBP: number;
  totalGBP: number;
};

const INK = "#000000";
const FOREST = "#0F4A2E";
const SMOKE = "#F4F4F2";
const ASH = "#E4E4E0";
const SLATE = "#5B5B57";
const FONT = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The four numbers a buyer wants before they read a word. */
const glance: [string, string, string][] = [
  ["Dispatch", "24–48 hrs", "from payment"],
  ["UK delivery", "Next day", "tracked, after dispatch"],
  ["Courier", "Evri", "they text or email the tracking"],
  ["Grade", "A/B", "checked by hand"],
];

const steps: [string, string][] = [
  [
    "Picked and graded",
    "Your lot is pulled from the current intake and every piece is checked by hand before it is counted in.",
  ],
  [
    "Counted",
    "Counted out to the number on your order, then counted again as it goes into the parcel.",
  ],
  [
    "Packed and dispatched",
    "From our unit in Burnley, Lancashire, within 24–48 hours of payment, then sent tracked, next day.",
  ],
  [
    "Tracked",
    "Evri text or email you a tracking link as soon as the parcel is scanned into their network. It comes from them, not from us, and it goes to the details you gave at checkout. No tracking after 48 hours? Message us and we will chase it.",
  ],
];

const notes: [string, string][] = [
  [
    "The pieces are not the ones in the photographs.",
    "That is expected, and it is stated on the website and on the page of the lot you bought: the photographs are example pictures, not the items you receive. Lots are counted out from a fresh intake at dispatch, so the exact pieces, brands and colourways vary every time. What stays constant is the grade, the count and the kind of piece.",
  ],
  [
    "What condition should I expect?",
    "Vintage is second-hand by definition, and a good deal of its appeal is that a piece has been worn and lived in. Garments of a certain age are expected to carry some fading, and on a jumper twenty or thirty years old it does not cost the piece a grade. Our standard lots are Grade A/B, aimed at roughly 70% Grade A to 30% Grade B, with a 5–10% tolerance either side on larger lots. Grade A is clean: no stains, holes, tears or repairs. It will still carry fading in proportion to its age — a Grade A piece from the nineties has thirty years on it and will look it, and that is what Grade A means on a garment that old rather than a mark against it. Grade B is where honest wear is named and reflected in the price — a small hole, a small mark, light pilling, or a zip that no longer works. It is the grade that sells hardest as workwear, Carhartt, Dickies and Lacoste especially. What never goes into a lot is Grade C: a large hole, several holes, or a mark that would stop a piece being worn even as workwear.",
  ],
  [
    "Is everything genuine?",
    "Yes. Sourcing is done by people who know the labels, and every piece is checked again at grading by our in-house grading specialist, who has over sixteen years in the trade: labels, stitching, hardware and construction. If a piece raises a question, it never enters stock.",
  ],
];

const WASH_TITLE = "Wash it before it goes on the rail";
const WASH_BODY =
  "Lots ship as graded, not laundered. Everything is checked, counted and packed, but nothing is washed or pressed. Give it a wash and a press before it goes out and it will look twice the money. This is standard across the trade for vintage and mixed-rag, and it is the one thing that most separates a rail that sells from one that does not.";

function sectionHeading(text: string): string {
  return `<tr><td style="padding:34px 28px 10px;font:800 19px/1.15 ${FONT};letter-spacing:-0.01em;text-transform:uppercase;color:${INK}">${esc(text)}</td></tr>`;
}

export function orderConfirmationSubject(order: OrderEmailData): string {
  return `Order confirmed & invoice ${order.reference} — Archive Wholesale`;
}

export function orderConfirmationHtml(order: OrderEmailData): string {
  const itemRows = order.lines
    .map(
      (line) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${ASH};font:400 14px/1.45 ${FONT};color:${INK}">
          ${esc(line.name)}
          ${line.qty > 1 ? `<div style="font:400 12px/1.4 ${FONT};color:${SLATE};padding-top:2px">${line.qty} × ${formatPrice(line.unitGBP)}</div>` : ""}
        </td>
        <td align="right" style="padding:10px 0 10px 14px;border-bottom:1px solid ${ASH};font:700 14px/1.45 ${FONT};color:${INK};white-space:nowrap">
          ${formatPrice(line.amountGBP)}
        </td>
      </tr>`,
    )
    .join("");

  const sameAddress =
    order.billingName === order.name &&
    order.billingLines.join("|") === order.addressLines.join("|");

  const billing = order.billingLines
    .filter(Boolean)
    .map((l) => esc(l))
    .join("<br>");

  const glanceCells = glance
    .map(
      ([label, value, note]) => `
      <td width="25%" style="padding:12px 14px;background:#ffffff;border:1px solid ${ASH};vertical-align:top">
        <div style="font:700 10px/1.2 ${FONT};letter-spacing:0.16em;text-transform:uppercase;color:${SLATE};padding-bottom:5px">${esc(label)}</div>
        <div style="font:800 16px/1.2 ${FONT};color:${INK}">${esc(value)}</div>
        <div style="font:400 11px/1.35 ${FONT};color:${SLATE};padding-top:3px">${esc(note)}</div>
      </td>`,
    )
    .join("");

  const stepRows = steps
    .map(
      ([title, body], i) => `
      <tr>
        <td width="34" valign="top" style="padding:0 0 14px;font:800 15px/1.4 ${FONT};color:${FOREST}">${String(i + 1).padStart(2, "0")}</td>
        <td valign="top" style="padding:0 0 14px">
          <div style="font:700 14px/1.4 ${FONT};color:${INK}">${esc(title)}</div>
          <div style="font:400 14px/1.55 ${FONT};color:${SLATE};padding-top:3px">${esc(body)}</div>
        </td>
      </tr>`,
    )
    .join("");

  const noteRows = notes
    .map(
      ([q, a]) => `
      <tr><td style="padding:14px 0;border-bottom:1px solid ${ASH}">
        <div style="font:700 15px/1.4 ${FONT};color:${INK}">${esc(q)}</div>
        <div style="font:400 14px/1.6 ${FONT};color:${SLATE};padding-top:6px">${esc(a)}</div>
      </td></tr>`,
    )
    .join("");

  const address = order.addressLines
    .filter(Boolean)
    .map((l) => esc(l))
    .join("<br>");

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>Order confirmed — Archive Wholesale</title>
</head>
<body style="margin:0;padding:0;background:${SMOKE}">
<!-- The line that shows next to the subject in an inbox. Hidden in the mail itself. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Payment received. Dispatched within 24–48 hours, then tracked next day. Everything else you need is in here.</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SMOKE}">
<tr><td align="center" style="padding:24px 12px">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border:1px solid ${ASH}">

  <tr><td style="background:${FOREST};padding:9px 16px;text-align:center;font:700 10px/1.3 ${FONT};letter-spacing:0.2em;text-transform:uppercase;color:#ffffff">Order confirmed · Thank you</td></tr>

  <tr><td style="padding:28px 28px 0">
    <div style="font:800 24px/1 ${FONT};letter-spacing:-0.02em;text-transform:uppercase;color:${INK}">Archive Wholesale</div>
    <div style="font:700 10px/1.3 ${FONT};letter-spacing:0.3em;text-transform:uppercase;color:${FOREST};padding-top:5px">Vintage clothing wholesale · Lancashire</div>
  </td></tr>

  <tr><td style="padding:22px 28px 0">
    <div style="font:800 28px/1 ${FONT};letter-spacing:-0.02em;text-transform:uppercase;color:${INK}">Payment received</div>
    <div style="font:400 15px/1.6 ${FONT};color:${SLATE};padding-top:12px">
      Thank you — your order is in. It is dispatched within 24–48 hours, then sent tracked, next day.
      Everything between here and your doorstep is below.
    </div>
  </td></tr>

  <tr><td style="padding:18px 28px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid ${FOREST};background:#E7F0EA">
      <tr><td style="padding:12px 14px">
        <div style="font:700 10px/1.2 ${FONT};letter-spacing:0.16em;text-transform:uppercase;color:${FOREST};padding-bottom:4px">Read this first</div>
        <div style="font:400 14px/1.55 ${FONT};color:${INK}">Your tracking comes from <strong>Evri</strong>, not from us. They text or email you a link as soon as the parcel is scanned into their network, using the details you gave at checkout — so it is worth checking those are right.</div>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:18px 28px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0">
      <tr>${glanceCells}</tr>
    </table>
  </td></tr>

  ${sectionHeading("Invoice")}
  <tr><td style="padding:0 28px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" valign="top" style="padding:0 10px 14px 0">
          <div style="font:700 10px/1.2 ${FONT};letter-spacing:0.16em;text-transform:uppercase;color:${SLATE};padding-bottom:5px">Invoice number</div>
          <div style="font:700 15px/1.4 ${FONT};color:${INK}">${esc(order.reference)}</div>
          <div style="font:400 13px/1.5 ${FONT};color:${SLATE};padding-top:2px">${esc(order.placedOn)}</div>
        </td>
        <td width="50%" valign="top" style="padding:0 0 14px 10px">
          <div style="font:700 10px/1.2 ${FONT};letter-spacing:0.16em;text-transform:uppercase;color:${SLATE};padding-bottom:5px">From</div>
          <div style="font:400 13px/1.55 ${FONT};color:${INK}">
            <strong>Archivio Group Ltd</strong><br>trading as Archive Wholesale<br>
            Company No. ${esc(siteConfig.companyNumber)}<br>${esc(addressLine)}
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0 0 14px">
          <div style="font:700 10px/1.2 ${FONT};letter-spacing:0.16em;text-transform:uppercase;color:${SLATE};padding-bottom:5px">Billed to</div>
          <div style="font:400 13px/1.55 ${FONT};color:${INK}"><strong>${esc(order.billingName)}</strong><br>${billing}</div>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid ${INK}">
      ${itemRows}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${ASH};font:400 14px/1.45 ${FONT};color:${INK}">UK delivery — tracked, next day</td>
        <td align="right" style="padding:10px 0 10px 14px;border-bottom:1px solid ${ASH};font:700 14px/1.45 ${FONT};color:${INK};white-space:nowrap">${formatPrice(order.deliveryGBP)}</td>
      </tr>
      <tr>
        <td style="padding:14px 0;border-top:2px solid ${INK};font:800 16px/1.3 ${FONT};text-transform:uppercase;color:${INK}">Total paid</td>
        <td align="right" style="padding:14px 0 14px 14px;border-top:2px solid ${INK};font:800 18px/1.3 ${FONT};color:${INK};white-space:nowrap">${formatPrice(order.totalGBP)}</td>
      </tr>
    </table>
    <div style="font:400 12px/1.6 ${FONT};color:${SLATE};padding-top:10px">
      Paid in full by card on ${esc(order.placedOn)}. Nothing further is owed.
      <br>
      No VAT has been charged: Archivio Group Ltd is not VAT registered, so this invoice carries no VAT to reclaim.
    </div>
  </td></tr>

  <tr><td style="padding:16px 28px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SMOKE}">
      <tr><td style="padding:14px 16px">
        <div style="font:700 10px/1.2 ${FONT};letter-spacing:0.16em;text-transform:uppercase;color:${SLATE};padding-bottom:6px">Delivering to</div>
        <div style="font:400 14px/1.6 ${FONT};color:${INK}">
          ${sameAddress ? "As billed above." : `<strong>${esc(order.name)}</strong><br>${address}`}
        </div>
        <div style="font:400 13px/1.6 ${FONT};color:${SLATE};padding-top:8px">
          ${esc(order.email)}${order.phone ? ` · ${esc(order.phone)}` : ""}
        </div>
        <div style="font:400 13px/1.55 ${FONT};color:${SLATE};padding-top:8px">
          Anything wrong here? Reply to this email straight away — we can still change it before it is packed.
        </div>
      </td></tr>
    </table>
  </td></tr>

  ${sectionHeading("What happens next")}
  <tr><td style="padding:0 28px">
    <div style="font:400 13px/1.5 ${FONT};color:${SLATE};padding-bottom:12px">Four steps, and we do all of them.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stepRows}</table>
  </td></tr>

  ${sectionHeading(WASH_TITLE)}
  <tr><td style="padding:0 28px">
    <div style="font:400 14px/1.6 ${FONT};color:${SLATE}">${esc(WASH_BODY)}</div>
  </td></tr>

  ${sectionHeading("Worth knowing")}
  <tr><td style="padding:0 28px">
    <div style="font:400 13px/1.5 ${FONT};color:${SLATE};padding-bottom:4px">The three things buyers ask after a first box lands.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${ASH}">${noteRows}</table>
  </td></tr>

  <tr><td style="padding:26px 28px 0">
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:${FOREST};padding:13px 22px">
          <a href="${esc(whatsappUrl("Hi Archive Wholesale, about my order " + order.reference + ": "))}" style="font:700 12px/1 ${FONT};letter-spacing:0.06em;text-transform:uppercase;color:#ffffff;text-decoration:none">Message us on WhatsApp</a>
        </td>
        <td width="10"></td>
        <td style="border:2px solid ${INK};padding:11px 20px">
          <a href="${esc(siteConfig.url)}/products" style="font:700 12px/1 ${FONT};letter-spacing:0.06em;text-transform:uppercase;color:${INK};text-decoration:none">Shop the lots</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:26px 28px 28px">
    <div style="border-top:1px solid ${ASH};padding-top:14px;font:400 12px/1.6 ${FONT};color:${SLATE}">
      <strong style="color:${INK}">Instagram @archivewholesaleuk</strong> — new lines go up there first, often before they reach the website. Tag us in what you have had from this lot and we will share it.
      <br><br>
      <strong style="color:${INK}">Archive Wholesale</strong> is a trading name of Archivio Group Ltd. Company No. ${esc(siteConfig.companyNumber)} · ${esc(addressLine)}
      <br>
      WhatsApp +44 7897 740194 · ${esc(siteConfig.email)} · <a href="${esc(siteConfig.url)}" style="color:${FOREST}">archivewholesale.co.uk</a>
    </div>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

/** The plain-text part. Some clients show it, and spam filters read it. */
export function orderConfirmationText(order: OrderEmailData): string {
  const items = order.lines
    .map(
      (l) =>
        `  ${l.name}${l.qty > 1 ? ` (${l.qty} x ${formatPrice(l.unitGBP)})` : ""} — ${formatPrice(l.amountGBP)}`,
    )
    .join("\n");

  return [
    "ARCHIVE WHOLESALE — PAYMENT RECEIVED",
    "",
    "Thank you — your order is in.",
    "Dispatched within 24-48 hours, then sent tracked, next day.",
    "",
    `INVOICE ${order.reference} — ${order.placedOn}`,
    "",
    "From:",
    "  Archivio Group Ltd, trading as Archive Wholesale",
    `  Company No. ${siteConfig.companyNumber}`,
    `  ${addressLine}`,
    "",
    "Billed to:",
    `  ${order.billingName}`,
    ...order.billingLines.filter(Boolean).map((l) => `  ${l}`),
    "",
    items,
    `  UK delivery — tracked, next day — ${formatPrice(order.deliveryGBP)}`,
    `  TOTAL PAID — ${formatPrice(order.totalGBP)}`,
    "",
    `Paid in full by card on ${order.placedOn}. Nothing further is owed.`,
    "No VAT has been charged: Archivio Group Ltd is not VAT registered, so this",
    "invoice carries no VAT to reclaim.",
    "",
    "DELIVERING TO",
    `  ${order.name}`,
    ...order.addressLines.filter(Boolean).map((l) => `  ${l}`),
    `  ${order.email}${order.phone ? ` · ${order.phone}` : ""}`,
    "  Anything wrong here? Reply to this email straight away.",
    "",
    "WHAT HAPPENS NEXT",
    ...steps.map(([t, b], i) => `  ${i + 1}. ${t}. ${b}`),
    "",
    WASH_TITLE.toUpperCase(),
    `  ${WASH_BODY}`,
    "",
    "WORTH KNOWING",
    ...notes.map(([q, a]) => `  ${q}\n  ${a}\n`),
    "Instagram @archivewholesaleuk — new lines go up there first.",
    "",
    `Archive Wholesale is a trading name of Archivio Group Ltd. Company No. ${siteConfig.companyNumber}`,
    addressLine,
    `WhatsApp +44 7897 740194 · ${siteConfig.email} · ${siteConfig.url}`,
  ].join("\n");
}
