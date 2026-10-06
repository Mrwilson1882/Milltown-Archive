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
 * Owner's rules: compensation is always the value of the goods excluding
 * delivery; next day; signature on delivery.
 */
export const evriSettings = {
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
  /** Evri will not take a parcel heavier than this. */
  maxParcelKg: 15,
};

/**
 * Weighed, boxed, per ten pieces. The owner's own scales, 6 October 2026.
 *
 * A flat rate across the catalogue was never going to hold: ten polos and ten
 * windbreakers are nearly double each other. Over-declaring is not free either
 * — Evri prices in weight bands, so a 3.4kg parcel sent as 6.5kg is paid for
 * twice over — which is why these are measured rather than rounded up.
 */
const KG_PER_TEN: Record<string, number> = {
  // Hoodies and sweats — 6kg.
  "mixed-premium-vintage-hoodies-sweatshirts": 6,
  "mixed-premium-vintage-hoodies": 6,
  "mixed-premium-vintage-sweatshirts": 6,
  // Windbreakers and track jackets — 6.5kg, the heaviest thing we send.
  "jackets-windbreaker-mix": 6.5,
  "track-jackets-windbreakers": 6.5,
  // Piqué polos — 3.4kg, the lightest. Weighed on Lacoste; Ralph Lauren
  // piqué is the same garment in the same quantity, so it takes the same
  // figure until anyone weighs a box of it and says otherwise.
  "lacoste-ralph-lauren-polos": 3.4,
  "ralph-lauren-polos": 3.4,
  "ralph-lauren-polo-box-10": 3.4,
  // Lacoste knitwear — 4.8kg.
  "lacoste-jumpers-cardigans": 4.8,
};

/**
 * What a lot nobody has weighed yet is declared at.
 *
 * The heaviest measured figure, because a parcel declared light and weighed
 * heavy picks up a surcharge and an argument. It is still a guess, and it is
 * wrong in the expensive direction for t-shirts and wrong in the dangerous
 * direction for sandals — see `unweighed` for what is still owed.
 */
const KG_PER_TEN_FALLBACK = 6.5;

/** Lots still going out on the fallback. Weigh a box of each and tell Claude. */
export function unweighed(slug: string): boolean {
  return !(slug in KG_PER_TEN);
}

export type EvriParcel = {
  /** The lot, as the buyer saw it named at checkout. */
  name: string;
  /** Catalogue slug, which is what the weight table is keyed on. */
  slug: string;
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

/** Declared weight for this parcel, to one decimal. */
export function weightFor(parcel: Pick<EvriParcel, "slug" | "pieces">): number {
  const perTen = KG_PER_TEN[parcel.slug] ?? KG_PER_TEN_FALLBACK;
  return Math.round((parcel.pieces / 10) * perTen * 10) / 10;
}

/** Parcels the owner has to split before they can be booked. */
export function overweight(parcels: EvriParcel[]): EvriParcel[] {
  return parcels.filter((p) => weightFor(p) > evriSettings.maxParcelKg);
}



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
  "Compensation(\u00a3)",
  "Signature(y/n)",
  "Reference",
  "Contents",
  "Parcel_value(\u00a3)",
  "Delivery_phone",
  "Delivery_instructions",
  "Service",
] as const;

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

/**
 * One sheet for a batch of orders.
 *
 * A row per parcel across every order in the run, so a morning's labels are
 * one upload rather than nine. References carry a suffix only where an order
 * is more than one parcel, which keeps the common case short enough to read
 * down a phone.
 */
export function evriCsv(orders: EvriOrder[]): string {
  const rows: string[] = [];
  for (const order of orders) {
    const [first, last] = splitName(order.name);
    const multi = order.parcels.length > 1;
    order.parcels.forEach((parcel, i) => {
      const ref = multi ? `${order.reference}-${i + 1}` : order.reference;
      rows.push(
        [
          order.line1,
          order.line2,
          order.town,
          order.county,
          order.postcode,
          first,
          last,
          order.email,
          weightFor(parcel),
          parcel.valueGBP.toFixed(2),
          evriSettings.signature,
          ref,
          evriSettings.contents,
          parcel.valueGBP.toFixed(2),
          order.phone ?? "",
          "",
          evriSettings.service,
        ]
          .map(cell)
          .join(","),
      );
    });
  }
  return [HEADER.join(","), ...rows].join("\r\n") + "\r\n";
}

/** Named here so the dispatch note and the sheet never disagree. */
export const dispatchFrom = siteConfig.address.town;
