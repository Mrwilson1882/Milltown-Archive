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
   * parcel declared heavy and weighed light costs nothing extra.
   *
   * Confirmed against the heaviest line we sell: ten Lacoste cardigans weigh
   * 5kg (owner, 5 October 2026). Knitwear is the worst case, so every other
   * ten-piece lot lands under this and the figure is safe across the range.
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
  /** The lot, as the buyer saw it named at checkout. */
  name: string;
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

/** Declared weight for a parcel of this many pieces, to one decimal. */
export function weightFor(pieces: number): number {
  return Math.round((pieces / 10) * evriSettings.kgPerTenPieces * 10) / 10;
}

/** Parcels the owner has to split before they can be booked. */
export function overweight(parcels: EvriParcel[]): EvriParcel[] {
  return parcels.filter((p) => weightFor(p.pieces) > evriSettings.maxParcelKg);
}

/** Named here so the dispatch note and the sheet never disagree. */
export const dispatchFrom = siteConfig.address.town;
