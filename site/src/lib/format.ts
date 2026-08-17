const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

/** Prices are always shown with the £ symbol. Never a bare number. */
export function formatPrice(pounds: number): string {
  return gbp.format(pounds);
}

/** What a lot costs, or the enquiry wording when the owner hasn't priced it. */
export function priceLabel(priceGBP: number | null): string {
  return priceGBP === null ? "Price on request" : formatPrice(priceGBP);
}

/** Stripe works in the smallest currency unit. */
export function toPence(pounds: number): number {
  return Math.round(pounds * 100);
}
