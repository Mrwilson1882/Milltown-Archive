import { bundles, type Bundle } from "@/data/bundles";

export const CART_STORAGE_KEY = "archive-wholesale-cart-v1";

export type CartLine = { slug: string; qty: number };

export type ResolvedLine = {
  bundle: Bundle;
  qty: number;
  /** Null when the bundle has no price set — enquiry only. */
  lineTotalGBP: number | null;
};

/** Drop anything that no longer exists in the catalogue or is out of stock. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const bundle = bundles.find((b) => b.slug === line.slug);
    if (!bundle || !bundle.inStock) return [];
    const qty = Math.max(1, Math.min(99, Math.floor(line.qty)));
    return [
      {
        bundle,
        qty,
        lineTotalGBP: bundle.priceGBP === null ? null : bundle.priceGBP * qty,
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
      const { slug, qty } = entry as { slug?: unknown; qty?: unknown };
      if (typeof slug !== "string" || typeof qty !== "number" || !Number.isFinite(qty)) return [];
      return [{ slug, qty: Math.max(1, Math.min(99, Math.floor(qty))) }];
    });
  } catch {
    return [];
  }
}
