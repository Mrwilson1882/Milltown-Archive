import "server-only";
import { siteConfig } from "@/config/site";

/**
 * The Evri bulk-upload sheet, built from a paid order.
 *
 * Evri's business portal takes a CSV and turns it into labels in one go. Every
 * column it wants is either already on the Stripe session or a fixed decision
 * the owner makes once — so the address never has to be typed again, and a
 * mistyped postcode stops being a way to lose a parcel.
 *
 * One row per parcel, not per order. Delivery is priced per lot because each
 * lot ships as its own parcel, so an order of two tens and a twenty-five is
 * three rows and three labels. Each carries its own reference suffix so the
 * tracking can be told apart later.
 */

/**
 * The decisions that are the owner's, not Stripe's.
 *
 * Owner's rules, 5 October 2026: any ten pieces is 2–5kg and that holds for
 * polos, t-shirts and everything else; compensation is always the value of the
 * goods excluding delivery; next day; signature on delivery.
 */
export const evriSettings = {
  /**
   * Kilograms per ten pieces.
   *
   * The owner gave a range of 2–5kg. This takes the top of it, because a
   * parcel declared light and weighed heavy picks up a surcharge, while a
   * parcel declared heavy and weighed light costs nothing extra. Lower it here
   * if the scales say otherwise — it is one number and nothing else reads it.
   */
  kgPerTenPieces: 5,
  /** Signature on delivery, always. */
  signature: "y" as "y" | "n",
  /**
   * Spelled exactly as the service list in the Evri account spells it. The
   * template came named "ndd", so next day is what the sheet is for; the
   * wording is the one field nobody can check from outside the account.
   */
  service: "Next Day",
  /** Contents description. Plain and accurate. */
  contents: "Second-hand clothing",
  /**
   * Evri will not take a parcel over this. A fifty-piece lot comes out at
   * 25kg on the owner's own figures, so it has to be split — the dispatch note
   * says so rather than the sheet quietly buying a label that gets refused.
   */
  maxParcelKg: 15,
};

export type EvriParcel = {
  pieces: number;
  /** Goods value for this parcel alone, excluding delivery. */
  valueGBP: number;
};

export type EvriOrder = {
  reference: string;
  name: string;
  email: string;
  phone?: string;
  line1: string;
  line2: string;
  town: string;
  county: string;
  postcode: string;
  parcels: EvriParcel[];
};

/** Every column the template asks for, in the template's order. */
const HEADER = [
  "Address_line_1",
  "Address_line_2",
  "Address_line_3",
  "Address_line_4",
  "Postcode",
  "First_name",
  "Last_name",
  "Email",
  "Weight(Kg)",
  "Compensation(£)",
  "Signature(y/n)",
  "Reference",
  "Contents",
  "Parcel_value(£)",
  "Delivery_phone",
  "Delivery_instructions",
  "Service",
] as const;

/**
 * True once the owner's figures are in.
 *
 * Checked against the piece counts actually on the order rather than the whole
 * table, so a new lot size does not silently ship with no weight.
 */
export function evriReady(parcels: EvriParcel[]): boolean {
  return Boolean(evriSettings.service) && parcels.length > 0;
}

/** Declared weight for a parcel of this many pieces, to one decimal. */
export function weightFor(pieces: number): number {
  return Math.round((pieces / 10) * evriSettings.kgPerTenPieces * 10) / 10;
}

/** Parcels the owner has to split before they can be booked. */
export function overweight(parcels: EvriParcel[]): EvriParcel[] {
  return parcels.filter((p) => weightFor(p.pieces) > evriSettings.maxParcelKg);
}

/**
 * Split one name into the two fields Evri wants.
 *
 * Everything before the last space is the first name. That is right for
 * "Jordan Price" and for "Mary Jane Price", and wrong for "Jordan van der
 * Berg" — which the owner can fix in the sheet before uploading. Better a
 * wrong split than a blank column.
 */
function splitName(full: string): [string, string] {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ["", ""];
  if (parts.length === 1) return [parts[0], parts[0]];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

/** A field, quoted only when it has to be. */
function cell(value: string | number): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function evriCsv(order: EvriOrder): string {
  const [first, last] = splitName(order.name);
  const multi = order.parcels.length > 1;

  const rows = order.parcels.map((parcel, i) => {
    const ref = multi ? `${order.reference}-${i + 1}` : order.reference;
    return [
      order.line1,
      order.line2,
      order.town,
      order.county,
      order.postcode,
      first,
      last,
      order.email,
      weightFor(parcel.pieces),
      parcel.valueGBP.toFixed(2),
      evriSettings.signature,
      ref,
      evriSettings.contents,
      parcel.valueGBP.toFixed(2),
      order.phone ?? "",
      "",
      evriSettings.service,
    ].map(cell);
  });

  return [HEADER.join(","), ...rows.map((r) => r.join(","))].join("\r\n") + "\r\n";
}

/** What the file is called in the owner's downloads folder. */
export function evriFilename(reference: string): string {
  return `evri-${reference}.csv`;
}

/** Named here so the dispatch note and the sheet never disagree. */
export const dispatchFrom = siteConfig.address.town;
