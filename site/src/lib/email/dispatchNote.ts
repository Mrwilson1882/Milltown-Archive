import "server-only";
import { addressLine, siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { evriSettings, overweight, weightFor, type EvriOrder } from "@/lib/shipping/evri";

/**
 * The owner's own copy of a paid order — a picking list, not a receipt.
 *
 * Separate from the buyer's confirmation rather than a blind copy of it: this
 * one names what to pull off the rail and what it is worth, which is ours and
 * not theirs.
 *
 * No Evri sheet attached. One CSV per order is no use to someone who books a
 * day's labels in one go — it would be nine files to merge by hand. The
 * address is here to copy from, and the sheet is built from the day's orders
 * together.
 *
 * Deliberately plain. It gets read on a phone in a unit, usually one-handed.
 */
export function dispatchSubject(order: EvriOrder): string {
  const total = order.parcels.reduce((n, p) => n + p.valueGBP, 0);
  // The lot, or how many of them — enough to know what the order is without
  // opening it. Names are long, so only one is ever in the subject.
  const what =
    order.parcels.length === 1
      ? order.parcels[0].name
      : `${order.parcels.length} parcels`;
  return `PAID — ${formatPrice(total)} — ${what} — ${order.reference}`;
}

export function dispatchHtml(order: EvriOrder): string {
  const font = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const esc = (v: string) =>
    v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const parcelRows = order.parcels
    .map(
      (p, i) => `
      <tr>
        <td style="padding:9px 0;border-bottom:1px solid #E4E4E0;font:400 14px/1.4 ${font}">
          <strong>${esc(p.name)}</strong>
          <div style="color:#5B5B57;font-size:13px;padding-top:2px">
            Parcel ${i + 1} of ${order.parcels.length} · ${p.pieces} pieces · ${weightFor(p)}kg declared
          </div>
        </td>
        <td align="right" style="padding:7px 0;border-bottom:1px solid #E4E4E0;font:400 14px/1.4 ${font};white-space:nowrap">
          ${formatPrice(p.valueGBP)}
        </td>
      </tr>`,
    )
    .join("");

  const heavy = overweight(order.parcels);
  const heavyNote = heavy.length
    ? `<p style="font:400 14px/1.6 ${font};color:#000;background:#F4F4F2;border-left:3px solid #000;padding:12px 14px;margin:18px 0 0">
         <strong>Split before booking.</strong> ${heavy.length === 1 ? "One parcel comes" : `${heavy.length} parcels come`}
         out over Evri's ${evriSettings.maxParcelKg}kg limit at this lot's weighed figure.
         Split into two and edit the sheet before uploading, or the label will be refused.
       </p>`
    : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${esc(order.reference)}</title></head>
<body style="margin:0;background:#fff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%">
  <tr><td style="font:800 22px/1.1 ${font};text-transform:uppercase;letter-spacing:-0.02em">
    Order paid — ${esc(order.reference)}
  </td></tr>

  <tr><td style="padding-top:16px">
    <div style="font:700 10px/1.2 ${font};letter-spacing:0.16em;text-transform:uppercase;color:#5B5B57;padding-bottom:5px">Ship to</div>
    <div style="font:400 15px/1.6 ${font}">
      <strong>${esc(order.name)}</strong><br>
      ${[order.line1, order.line2, order.town, order.county, order.postcode]
        .filter(Boolean)
        .map(esc)
        .join("<br>")}
    </div>
    <div style="font:400 13px/1.6 ${font};color:#5B5B57;padding-top:8px">
      ${esc(order.email)}${order.phone ? ` · ${esc(order.phone)}` : " · no phone given"}
    </div>
  </td></tr>

  <tr><td style="padding-top:18px">
    <div style="font:700 10px/1.2 ${font};letter-spacing:0.16em;text-transform:uppercase;color:#5B5B57;padding-bottom:5px">To pick</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #000">
      ${parcelRows}
      <tr>
        <td style="padding:9px 0;font:800 15px/1.3 ${font};text-transform:uppercase">Goods</td>
        <td align="right" style="padding:9px 0;font:800 15px/1.3 ${font};white-space:nowrap">
          ${formatPrice(order.parcels.reduce((n, p) => n + p.valueGBP, 0))}
        </td>
      </tr>
    </table>
    <div style="font:400 12px/1.6 ${font};color:#5B5B57;padding-top:6px">
      Goods only — delivery was charged on top and is not shown here.
    </div>
  </td></tr>

  <tr><td>${heavyNote}</td></tr>

  <tr><td style="padding-top:22px;border-top:1px solid #E4E4E0;margin-top:20px;font:400 11px/1.6 ${font};color:#5B5B57">
    Dispatch within 24–48 hours of payment, then tracked next day — that is what the buyer has
    been told.<br>
    ${esc(siteConfig.companyNumber ? `Archivio Group Ltd · ${addressLine}` : addressLine)}
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export function dispatchText(order: EvriOrder): string {
  const goods = order.parcels.reduce((n, p) => n + p.valueGBP, 0);
  return [
    `ORDER PAID — ${order.reference}`,
    "",
    "SHIP TO",
    `  ${order.name}`,
    ...[order.line1, order.line2, order.town, order.county, order.postcode]
      .filter(Boolean)
      .map((l) => `  ${l}`),
    `  ${order.email}${order.phone ? ` · ${order.phone}` : " · no phone given"}`,
    "",
    "TO PICK",
    ...order.parcels.flatMap((p, i) => [
      `  ${p.name} — ${formatPrice(p.valueGBP)}`,
      `    Parcel ${i + 1} of ${order.parcels.length} · ${p.pieces} pieces · ${weightFor(p)}kg`,
    ]),
    `  GOODS — ${formatPrice(goods)} (delivery charged on top, not shown)`,
    "",
    ...(overweight(order.parcels).length
      ? [
          `SPLIT BEFORE BOOKING: ${overweight(order.parcels).length} parcel(s) exceed Evri's ${evriSettings.maxParcelKg}kg limit.`,
          "",
        ]
      : []),
    "Dispatch within 24-48 hours of payment, then tracked next day.",
  ].join("\n");
}
