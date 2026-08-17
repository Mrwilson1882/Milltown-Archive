import { findVariant, getProduct, type Product, type Variant } from "@/data/catalogue";

/** v2: cart lines gained a `pieces` field when products gained quantity options. */
export const CART_STORAGE_KEY = "archive-wholesale-cart-v2";

/** One chosen quantity option of one product, plus how many of them. */
export type CartLine = { slug: string; pieces: number; qty: number };

export type ResolvedLine = {
  product: Product;
  variant: Variant;
  qty: number;
  /** Null when this variant has no price set — enquiry only. */
  lineTotalGBP: number | null;
};

/** A cart line is identified by product *and* quantity option. */
export function lineKey(slug: string, pieces: number): string {
  return `${slug}@${pieces}`;
}

/** Drop anything no longer in the catalogue, out of stock, or with no such option. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(line.slug);
    if (!product || !product.inStock) return [];
    const variant = findVariant(product, line.pieces);
    if (!variant) return [];
    const qty = Math.max(1, Math.min(99, Math.floor(line.qty)));
    return [
      {
        product,
        variant,
        qty,
        lineTotalGBP: variant.priceGBP === null ? null : variant.priceGBP * qty,
      },
    ];
  });
}

/** Total of the priced lines only. Enquiry-only lines are counted separately. */
export function cartTotals(resolved: ResolvedLine[]) {
  const payable = resolved.filter((l) => l.lineTotalGBP !== null);
  const enquiryOnly = resolved.filter((l) => l.lineTotalGBP === null);
  return {
    payable,
    enquiryOnly,
    payableTotalGBP: payable.reduce((sum, l) => sum + (l.lineTotalGBP ?? 0), 0),
    itemCount: resolved.reduce((sum, l) => sum + l.qty, 0),
  };
}

export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (typeof entry !== "object" || entry === null) return [];
      const { slug, pieces, qty } = entry as Record<string, unknown>;
      if (typeof slug !== "string") return [];
      if (typeof pieces !== "number" || !Number.isFinite(pieces)) return [];
      if (typeof qty !== "number" || !Number.isFinite(qty)) return [];
      return [
        { slug, pieces: Math.floor(pieces), qty: Math.max(1, Math.min(99, Math.floor(qty))) },
      ];
    });
  } catch {
    return [];
  }
}
