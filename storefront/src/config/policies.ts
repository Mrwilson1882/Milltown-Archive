/**
 * The figures in the shop's policies.
 *
 * Left null until the owner states them. Nothing here is a default picked by
 * the site — a postage price is a commercial decision in exactly the way a
 * garment price is, and the pages read correctly with these unset.
 */
export const policies = {
  /** Flat UK postage in pounds, as shown on the delivery page. */
  ukPostageGBP: null as number | null,
  /** Order value above which UK postage is free. */
  freeUkPostageOverGBP: null as number | null,
  /** Working days from payment to dispatch, e.g. "1–2". */
  dispatchWorkingDays: null as string | null,
  /** Whether international orders are accepted at all. */
  shipsInternationally: false,
  /**
   * Statutory minimum under the Consumer Contracts Regulations 2013: a
   * customer buying at distance has 14 days from receipt to cancel and a
   * further 14 days to send the goods back. Raise this if a longer window is
   * offered; it is not something the site invents.
   */
  returnWindowDays: 14,
} as const;
