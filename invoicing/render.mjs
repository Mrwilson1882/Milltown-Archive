/**
 * Renders one Archive Wholesale invoice to a self-contained HTML document.
 *
 * Brand comes from site/src/app/globals.css — ink on paper, forest green as the
 * only accent, Archivo, 2px rules, 2px radius. Nothing here invents a colour.
 *
 * The output is one file with the logo embedded, so it opens anywhere, survives
 * being emailed as an attachment, and prints to A4 as a PDF with no assets to
 * chase.
 */

const BRAND = {
  ink: "#000000",
  paper: "#ffffff",
  forest: "#0f4a2e",
  forestDark: "#0a3520",
  smoke: "#f4f4f2",
  ash: "#e4e4e0",
  slate: "#5b5b57",
  /* The one non-brand hue in the document: the incomplete-invoice warning.
     It is deliberately outside the palette so it can never read as decoration. */
  alert: "#8a1c1c",
  alertWash: "#fbf0f0",
};

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

export const money = (n) => gbp.format(n);

/** en-GB long date, e.g. 14 September 2026. Never a numeric format that a
 *  customer could read the American way round. */
export function longDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const lines = (arr) =>
  (arr ?? []).filter(Boolean).map((l) => `<span>${esc(l)}</span>`).join("");

function addressBlock(addr) {
  if (!addr) return "";
  const all = [...(addr.lines ?? []), addr.postcode].filter(Boolean);
  return lines(all);
}

const css = `
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --ink: ${BRAND.ink};
    --paper: ${BRAND.paper};
    --forest: ${BRAND.forest};
    --forest-dark: ${BRAND.forestDark};
    --smoke: ${BRAND.smoke};
    --ash: ${BRAND.ash};
    --slate: ${BRAND.slate};
    --alert: ${BRAND.alert};
    --alert-wash: ${BRAND.alertWash};
    --font: "Archivo", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color-scheme: light;
  }

  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    background: var(--smoke);
    color: var(--ink);
    font-family: var(--font);
    font-size: 10.5pt;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
    padding-block: 28px;
    padding-left: 16px;
    padding-right: 16px;
  }

  /* ---- the sheet -------------------------------------------------------- */
  .sheet {
    background: var(--paper);
    color: var(--ink);
    width: 100%;
    max-width: 210mm;
    margin: 0 auto;
    padding: 16mm 14mm 14mm;
    border: 2px solid var(--ink);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    gap: 9mm;
  }

  .display {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 0.95;
    margin: 0;
  }

  .eyebrow {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 7.5pt;
    color: var(--slate);
    margin: 0;
  }

  .num { font-variant-numeric: tabular-nums; }

  /* ---- masthead --------------------------------------------------------- */
  .masthead {
    display: flex;
    flex-wrap: wrap;
    gap: 8mm;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 2px solid var(--ink);
    padding-bottom: 6mm;
  }

  .masthead img { display: block; height: 15mm; width: auto; max-width: 100%; }

  .trading-line {
    margin: 3mm 0 0;
    font-size: 8pt;
    color: var(--slate);
    max-width: 72mm;
    text-wrap: balance;
  }

  .doc-title { text-align: right; }
  .doc-title h1 { font-size: 24pt; }
  .doc-note {
    margin: 1.5mm 0 0;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--slate);
  }

  .doc-title .ref {
    margin: 2mm 0 0;
    font-size: 13pt;
    font-weight: 700;
    color: var(--forest);
    letter-spacing: 0.02em;
  }

  /* ---- warning band ----------------------------------------------------- */
  .incomplete {
    border: 2px solid var(--alert);
    background: var(--alert-wash);
    color: var(--alert);
    border-radius: 2px;
    padding: 4mm 5mm;
  }
  .incomplete h2 { font-size: 9pt; margin: 0 0 2mm; }
  .incomplete ul { margin: 0; padding-left: 5mm; font-size: 9pt; }
  .incomplete li { margin-bottom: 1mm; }

  /* ---- parties / meta --------------------------------------------------- */
  .parties {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(72mm, 1fr));
    gap: 7mm;
  }

  .party span { display: block; }
  .party .name { font-weight: 700; }
  .party .body { margin-top: 2.5mm; font-size: 9.5pt; }
  .party .body span { line-height: 1.5; }
  .party .muted { color: var(--slate); }

  .meta { display: grid; gap: 1.5mm; }
  .meta .row {
    display: flex;
    justify-content: space-between;
    gap: 4mm;
    font-size: 9.5pt;
    border-bottom: 1px solid var(--ash);
    padding-bottom: 1.2mm;
  }
  .meta .row dt { color: var(--slate); margin: 0; }
  .meta .row dd { margin: 0; font-weight: 700; text-align: right; }

  /* ---- line items ------------------------------------------------------- */
  .items-wrap { overflow-x: auto; }

  table.items {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
  }

  table.items thead th {
    text-align: left;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 7.5pt;
    color: var(--paper);
    background: var(--forest);
    padding: 2.5mm 3mm;
  }

  table.items th.r, table.items td.r { text-align: right; }
  table.items th.c, table.items td.c { text-align: center; }
  table.items thead th { white-space: nowrap; }
  table.items td.c, table.items td.r { white-space: nowrap; }
  table.items col.qty { width: 20mm; }
  table.items col.unit { width: 28mm; }
  table.items col.amount { width: 30mm; }

  table.items tbody td {
    padding: 3mm;
    border-bottom: 1px solid var(--ash);
    vertical-align: top;
  }

  table.items tbody tr:last-child td { border-bottom: 2px solid var(--ink); }

  .item-name { font-weight: 700; }
  .item-detail { display: block; margin-top: 1mm; color: var(--slate); font-size: 8.5pt; }
  .item-empty td { color: var(--slate); font-style: italic; }


  /* On a narrow screen — a phone, or a preview panel — a four-column money
     table pushes Unit price and Amount off the right edge, which reads as an
     invoice with no prices on it. Below 640px each line becomes a block and
     every figure carries its own label, so nothing is ever out of sight. */
  @media screen and (max-width: 640px) {
    table.items, table.items tbody, table.items tr, table.items td { display: block; width: 100%; }
    table.items colgroup { display: none; }
    table.items thead {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
    }
    table.items tbody tr { border-bottom: 1px solid var(--ash); padding: 3mm 0; }
    table.items tbody tr:last-child { border-bottom: 2px solid var(--ink); }
    /* The cell rules belong to the column layout; in stacked mode the row
       carries the only rule, so they are cleared at matching specificity. */
    table.items tbody td,
    table.items tbody tr:last-child td { border: 0; padding: 0; text-align: left; white-space: normal; }
    table.items tbody td[data-label] {
      display: flex; justify-content: space-between; align-items: baseline;
      gap: 4mm; margin-top: 1.5mm;
    }
    table.items tbody td[data-label]::before {
      content: attr(data-label);
      color: var(--slate); font-size: 7.5pt; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em; flex: none;
    }
  }

  /* ---- totals ----------------------------------------------------------- */
  .totals {
    display: flex;
    flex-wrap: wrap;
    gap: 6mm;
    align-items: flex-start;
    justify-content: space-between;
  }
  .totals-inner { width: 100%; max-width: 85mm; margin-left: auto; }

  .lot-summary { max-width: 78mm; }
  .lot-summary dl { margin: 2.5mm 0 0; display: grid; gap: 1.2mm; font-size: 9.5pt; }
  .lot-summary .row { display: flex; justify-content: space-between; gap: 4mm; }
  .lot-summary .row dt { margin: 0; color: var(--slate); }
  .lot-summary .row dd { margin: 0; font-weight: 700; }

  .totals .row {
    display: flex;
    justify-content: space-between;
    gap: 6mm;
    padding: 1.8mm 0;
    font-size: 9.5pt;
    border-bottom: 1px solid var(--ash);
  }
  .totals .row dt { margin: 0; color: var(--slate); }
  .totals .row dd { margin: 0; font-weight: 700; }

  .total-due {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 6mm;
    background: var(--forest);
    color: var(--paper);
    padding: 4mm 5mm;
    margin-top: 3mm;
    border-radius: 2px;
  }
  .total-due .label {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 8.5pt;
  }
  .total-due .amount { font-size: 17pt; font-weight: 800; letter-spacing: -0.02em; }

  .vat-statement {
    margin: 3mm 0 0;
    font-size: 8.5pt;
    color: var(--slate);
    text-align: right;
  }

  /* ---- payment + terms -------------------------------------------------- */
  .pay {
    background: var(--smoke);
    border: 1px solid var(--ash);
    border-left: 3px solid var(--forest);
    border-radius: 2px;
    padding: 5mm;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(58mm, 1fr));
    gap: 6mm;
  }

  .pay dl { margin: 2.5mm 0 0; display: grid; gap: 1.2mm; font-size: 9.5pt; }
  .pay .row { display: flex; justify-content: space-between; gap: 4mm; }
  .pay .row dt { margin: 0; color: var(--slate); }
  .pay .row dd { margin: 0; font-weight: 700; text-align: right; }
  .pay .missing { color: var(--alert); font-weight: 700; }
  .pay a { color: var(--forest); font-weight: 700; word-break: break-all; }
  .pay p { margin: 2.5mm 0 0; font-size: 9pt; }

  .notes .eyebrow, .terms .eyebrow, .lot-summary .eyebrow { margin-bottom: 0; }
  .notes p { margin: 0; font-size: 9.5pt; }
  .terms ol { margin: 0; padding-left: 5mm; font-size: 8.5pt; color: var(--slate); }
  .terms li { margin-bottom: 1.2mm; }

  /* ---- foot ------------------------------------------------------------- */
  .foot {
    border-top: 2px solid var(--ink);
    padding-top: 4mm;
    display: flex;
    flex-wrap: wrap;
    gap: 3mm 8mm;
    justify-content: space-between;
    font-size: 8pt;
    color: var(--slate);
  }
  .foot a { color: var(--forest); text-decoration: none; font-weight: 700; }
  .foot .reg { max-width: 105mm; }

  /* ---- print ------------------------------------------------------------ */
  /* 10mm, not the browser default: a short order then lands on one sheet, which
     measured at 279mm of content against 273mm of usable page at 12mm. */
  @page { size: A4; margin: 10mm; }

  @media print {
    body { background: var(--paper); padding: 0; }
    .sheet {
      border: 0;
      max-width: none;
      width: auto;
      padding: 0;
      gap: 3mm;
      font-size: 9pt;
    }
    /* Almost every block sets its own absolute pt size, so the sheet's
       font-size alone changes nothing on paper. These are the sizes that
       actually decide how tall the document prints. */
    .party .body, .meta, table.items, .totals .row, .pay dl, .lot-summary dl { font-size: 8.5pt; }
    .item-detail { font-size: 7.5pt; }
    .pay p, .vat-statement, .notes p { font-size: 8pt; }
    .trading-line { font-size: 7.5pt; }

    .masthead { padding-bottom: 4mm; gap: 6mm; }
    .masthead img { height: 11mm; }
    .parties { gap: 5mm; }
    .party .body { margin-top: 2mm; }
    .meta { gap: 1mm; }
    .meta .row { padding-bottom: 0.8mm; }
    table.items tbody td { padding: 2mm 3mm; }
    table.items thead th { padding: 2mm 3mm; }
    .totals .row { padding: 0.8mm 0; }
    .total-due { padding: 3mm 5mm; margin-top: 1.5mm; }
    .total-due .amount { font-size: 15pt; }
    .pay { padding: 3.5mm; gap: 5mm; }
    .pay dl, .lot-summary dl { margin-top: 2mm; }
    .pay p { margin-top: 2mm; }
    .vat-statement { margin-top: 2mm; }
    /* Two columns halves the depth of the terms, which is what decides whether
       a short order comes off the printer as one sheet or two. */
    .terms ol { font-size: 7.5pt; columns: 2; column-gap: 8mm; padding-left: 4mm; }
    .terms li { margin-bottom: 0.4mm; break-inside: avoid; }
    .foot { padding-top: 2mm; border-top-width: 1px; font-size: 7pt; }
    table.items thead { display: table-header-group; }
    table.items tr, .pay, .total-due, .incomplete { break-inside: avoid; }
    .foot { break-inside: avoid; }
  }

  @media (max-width: 560px) {
    body { font-size: 11pt; padding-block: 16px; }
    .sheet { padding: 10mm 6mm; }
    .doc-title { text-align: left; }
    .total-due .amount { font-size: 15pt; }
  }
`;

/**
 * @param {object} inv  the resolved invoice (see generate-invoice.mjs)
 * @param {object} company  company.json
 * @param {string} logoDataUri
 */
export function renderInvoice(inv, company, logoDataUri) {
  const missing = inv.missing ?? [];
  // A pro forma is a request for payment against an order that is not confirmed
  // yet. It is not a tax invoice and says so, so nobody's bookkeeper treats it
  // as one.
  const proforma = inv.status === "proforma";
  const docTitle = proforma ? "Pro forma" : "Invoice";

  const regOffice = addressBlock(company.registeredOffice) ||
    `<span class="muted">[registered office address not set]</span>`;
  const despatch = addressBlock(company.tradingAddress);

  const method = company.payment?.method ?? "bank";
  const showLink = method === "link" || method === "both";
  const showBank = method === "bank" || method === "both";
  const bank = company.bank ?? {};
  const bankRow = (label, value) =>
    `<div class="row"><dt>${esc(label)}</dt><dd class="${value ? "num" : "missing"}">${
      value ? esc(value) : "not set"
    }</dd></div>`;

  const itemRows = inv.lines.length
    ? inv.lines
        .map(
          (l) => `
            <tr>
              <td>
                <span class="item-name">${esc(l.name)}</span>
                ${l.detail ? `<span class="item-detail">${esc(l.detail)}</span>` : ""}
              </td>
              <td class="c num" data-label="Qty">${esc(l.qtyLabel)}</td>
              <td class="r num" data-label="Unit price">${money(l.unitPrice)}</td>
              <td class="r num" data-label="Amount">${money(l.lineTotal)}</td>
            </tr>`,
        )
        .join("")
    : `<tr class="item-empty">
         <td>No lines on this invoice yet</td>
         <td class="c" data-label="Qty">&mdash;</td>
         <td class="r" data-label="Unit price">&mdash;</td>
         <td class="r" data-label="Amount">&mdash;</td>
       </tr>`;

  const optionalTotal = (label, value) =>
    value ? `<div class="row"><dt>${esc(label)}</dt><dd class="num">${money(value)}</dd></div>` : "";

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Invoice ${esc(inv.invoiceNumber)} — Archive Wholesale</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&display=swap">
<style>${css}</style>
</head>
<body>
<main class="sheet">

  <header class="masthead">
    <div>
      <img src="${logoDataUri}" alt="Archive Wholesale">
      <p class="trading-line">${esc(company.tradingStatement)}</p>
    </div>
    <div class="doc-title">
      <h1 class="display">${docTitle}</h1>
      <p class="ref num">${esc(inv.invoiceNumber)}</p>
      ${proforma ? `<p class="doc-note">Not a tax invoice</p>` : ""}
    </div>
  </header>

  ${
    missing.length
      ? `<section class="incomplete">
           <h2 class="display">Not ready to send</h2>
           <ul>${missing.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
         </section>`
      : ""
  }

  <section class="parties">
    <div class="party">
      <p class="eyebrow">From</p>
      <div class="body">
        <span class="name">${esc(company.legalName)}</span>
        <span>t/a ${esc(company.tradingAs)}</span>
        ${regOffice}
        ${despatch ? `<span class="muted" style="margin-top:2mm">Despatch: ${esc((company.tradingAddress.lines ?? []).concat(company.tradingAddress.postcode).filter(Boolean).join(", "))}</span>` : ""}
      </div>
    </div>

    <div class="party">
      <p class="eyebrow">Details</p>
      <dl class="meta body">
        <div class="row"><dt>${proforma ? "Date" : "Invoice date"}</dt><dd>${esc(longDate(inv.invoiceDate))}</dd></div>
        ${inv.supplyDate ? `<div class="row"><dt>Date of supply</dt><dd>${esc(longDate(inv.supplyDate))}</dd></div>` : ""}
        ${inv.orderNumber ? `<div class="row"><dt>Order no.</dt><dd class="num">${esc(inv.orderNumber)}</dd></div>` : ""}
        ${proforma && inv.validUntil ? `<div class="row"><dt>Valid until</dt><dd>${esc(longDate(inv.validUntil))}</dd></div>` : ""}
        <div class="row"><dt>Payment terms</dt><dd>${esc(inv.paymentTerms)}</dd></div>
        ${inv.dueDate ? `<div class="row"><dt>Payment due</dt><dd>${esc(longDate(inv.dueDate))}</dd></div>` : ""}
        ${inv.poNumber ? `<div class="row"><dt>Your order ref</dt><dd>${esc(inv.poNumber)}</dd></div>` : ""}
        <div class="row"><dt>Company no.</dt><dd class="num">${esc(company.companyNumber)}</dd></div>
      </dl>
    </div>
  </section>

  <section class="parties">
    <div class="party">
      <p class="eyebrow">${proforma ? "To" : "Invoice to"}</p>
      <div class="body">
        ${
          inv.customer.business || inv.customer.contact
            ? `<span class="name">${esc(inv.customer.business || inv.customer.contact)}</span>
               ${inv.customer.business && inv.customer.contact ? `<span>FAO ${esc(inv.customer.contact)}</span>` : ""}
               ${addressBlock(inv.customer)}
               ${inv.customer.email ? `<span class="muted">${esc(inv.customer.email)}</span>` : ""}
               ${inv.customer.phone ? `<span class="muted">${esc(inv.customer.phone)}</span>` : ""}`
            : `<span class="muted">[customer not set]</span>`
        }
      </div>
    </div>

    <div class="party">
      <p class="eyebrow">Deliver to</p>
      <div class="body">
        ${
          addressBlock(inv.deliverTo) ||
          `<span class="muted">Same as invoice address</span>`
        }
      </div>
    </div>
  </section>

  <section class="items-wrap">
    <table class="items">
      <colgroup>
        <col>
        <col class="qty">
        <col class="unit">
        <col class="amount">
      </colgroup>
      <thead>
        <tr>
          <th scope="col">Description</th>
          <th scope="col" class="c">Qty</th>
          <th scope="col" class="r">Unit price</th>
          <th scope="col" class="r">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
  </section>

  <section class="totals">
    ${
      inv.lines.length
        ? `<div class="lot-summary">
             <p class="eyebrow">This consignment</p>
             <dl>
               <div class="row"><dt>Lines</dt><dd class="num">${inv.lines.length}</dd></div>
               ${inv.totalPieces ? `<div class="row"><dt>Pieces</dt><dd class="num">${inv.totalPieces}</dd></div>` : ""}
               <div class="row"><dt>Grade</dt><dd>${esc(company.defaults.grade)} unless stated</dd></div>
             </dl>
           </div>`
        : ""
    }
    <div class="totals-inner">
      <dl style="margin:0">
        <div class="row"><dt>Subtotal</dt><dd class="num">${money(inv.subtotal)}</dd></div>
        ${optionalTotal("Discount", inv.discount ? -inv.discount : 0)}
        ${optionalTotal("Delivery", inv.delivery)}
        ${
          company.vat.registered
            ? `<div class="row"><dt>VAT at ${esc(company.vat.ratePercent)}%</dt><dd class="num">${money(inv.vat)}</dd></div>`
            : `<div class="row"><dt>VAT</dt><dd>Not applicable</dd></div>`
        }
      </dl>
      <div class="total-due">
        <span class="label">${proforma ? "Total payable" : "Total due"}</span>
        <span class="amount num">${money(inv.total)}</span>
      </div>
      ${
        company.vat.registered
          ? ""
          : `<p class="vat-statement">${esc(
              proforma
                ? company.vat.notRegisteredStatement.replace(/\bthis invoice\b/gi, "this pro forma")
                : company.vat.notRegisteredStatement,
            )}</p>`
      }
    </div>
  </section>

  <section class="pay">
    <div>
      <p class="eyebrow">How to pay</p>
      <dl>
        ${showLink ? `<div class="row"><dt>Method</dt><dd>Secure payment link</dd></div>` : ""}
        ${showBank ? `
          ${bankRow("Account name", bank.accountName)}
          ${bankRow("Sort code", bank.sortCode)}
          ${bankRow("Account number", bank.accountNumber)}
          ${bank.bankName ? `<div class="row"><dt>Bank</dt><dd>${esc(bank.bankName)}</dd></div>` : ""}
          ${bank.iban ? `<div class="row"><dt>IBAN</dt><dd class="num">${esc(bank.iban)}</dd></div>` : ""}
          ${bank.swift ? `<div class="row"><dt>SWIFT/BIC</dt><dd class="num">${esc(bank.swift)}</dd></div>` : ""}` : ""}
        <div class="row"><dt>Amount to pay</dt><dd class="num">${money(inv.total)}</dd></div>
        <div class="row"><dt>Payment reference</dt><dd class="num">${esc(inv.invoiceNumber)}</dd></div>
      </dl>
      ${
        showLink
          ? `<p>${esc(
              proforma
                ? company.payment.linkStatement.replace(/\bthis invoice\b/gi, "this pro forma")
                : company.payment.linkStatement,
            )}${
              inv.paymentLink
                ? ` Pay online at <a href="${esc(inv.paymentLink)}">${esc(inv.paymentLink)}</a>.`
                : ""
            }</p>
             <p>Please quote <strong>${esc(inv.invoiceNumber)}</strong> if you need to reference this payment.${
               proforma
                 ? " Your order is held but not confirmed until payment is received, and a full invoice follows once it clears."
                 : ""
             }</p>`
          : `<p>Please quote <strong>${esc(inv.invoiceNumber)}</strong> as the payment reference so the payment can be matched to this invoice.</p>`
      }
    </div>
    <div>
      <p class="eyebrow">Queries</p>
      <dl>
        <div class="row"><dt>Email</dt><dd>${esc(company.contact.email)}</dd></div>
        ${company.contact.whatsapp ? `<div class="row"><dt>WhatsApp</dt><dd class="num">${esc(company.contact.whatsapp)}</dd></div>` : ""}
        ${company.contact.phone ? `<div class="row"><dt>Phone</dt><dd class="num">${esc(company.contact.phone)}</dd></div>` : ""}
        <div class="row"><dt>Web</dt><dd>${esc(company.contact.website)}</dd></div>
      </dl>
      <p>${esc(company.defaults.deliveryNote)}</p>
    </div>
  </section>

  ${
    inv.notes
      ? `<section class="notes"><p class="eyebrow">Notes</p><p>${esc(inv.notes)}</p></section>`
      : ""
  }

  <section class="terms">
    <p class="eyebrow">${proforma ? "Terms" : "Terms of sale"}</p>
    <ol>
      ${proforma ? `<li>This is a pro forma, not a tax invoice. It sets out what the order described would cost; no sale is made until it is paid.</li>` : ""}
      ${(company.defaults.terms ?? []).map((t) => `<li>${esc(t)}</li>`).join("")}
    </ol>
  </section>

  <footer class="foot">
    <span class="reg">Archive Wholesale is a trading name of ${esc(company.legalName)}, registered in ${esc(company.registeredIn)}, company number ${esc(company.companyNumber)}.${company.vat.registered && company.vat.number ? ` VAT number ${esc(company.vat.number)}.` : ""}</span>
    <span><a href="https://${esc(company.contact.website)}">${esc(company.contact.website)}</a></span>
  </footer>

</main>
</body>
</html>`;
}
