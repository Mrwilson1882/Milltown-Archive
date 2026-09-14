/**
 * The bag.
 *
 * Held in localStorage so it survives a refresh without an account, and kept
 * deliberately thin: enough to draw the bag page, never enough to be trusted.
 * The checkout route looks every line up again in the catalogue and prices it
 * there, so a tampered localStorage buys nothing at the wrong price.
 */

export const CART_STORAGE_KEY = "milltown-archive-bag-v1";
export const CART_CHANGED_EVENT = "milltown-archive-bag-changed";

/** What is stored per line: identity, plus a snapshot purely for display. */
export type CartLine = {
  slug: string;
  quantity: number;
  /** Display snapshot. Re-checked server-side before any money moves. */
  title: string;
  priceGBP: number | null;
  image: string | null;
  size: string | null;
  brand: string | null;
};

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return typeof line.slug === "string" && typeof line.quantity === "number";
}

/**
 * Parse a stored bag. Anything unreadable — a half-written value, something
 * from an older version of the site, hand-edited nonsense — comes back empty
 * rather than throwing on a page the shopper is trying to use.
 */
export function parseCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartLine) : [];
  } catch {
    return [];
  }
}

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    return parseCart(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    // Private browsing or cleared site data.
    return [];
  }
}

export function writeCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage full or blocked. The bag still works for this page view.
  }
  window.dispatchEvent(new CustomEvent(CART_CHANGED_EVENT));
}

/**
 * Add a line. Stock is one-of-one, so a piece already in the bag is not added
 * twice — `stock` caps it at whatever the Quantity column actually says.
 */
export function addLine(line: Omit<CartLine, "quantity">, stock = 1): CartLine[] {
  const lines = readCart();
  const existing = lines.find((entry) => entry.slug === line.slug);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + 1, Math.max(stock, 1));
  } else {
    lines.push({ ...line, quantity: 1 });
  }

  writeCart(lines);
  return lines;
}

export function removeLine(slug: string): CartLine[] {
  const lines = readCart().filter((line) => line.slug !== slug);
  writeCart(lines);
  return lines;
}

export function setQuantity(slug: string, quantity: number, stock = 1): CartLine[] {
  const capped = Math.max(0, Math.min(Math.round(quantity), Math.max(stock, 1)));
  const lines = capped === 0
    ? readCart().filter((line) => line.slug !== slug)
    : readCart().map((line) => (line.slug === slug ? { ...line, quantity: capped } : line));
  writeCart(lines);
  return lines;
}

export function clearCart(): void {
  writeCart([]);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/** Bag total, ignoring any line with no price — those go to enquiry instead. */
export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce(
    (total, line) => total + (line.priceGBP ?? 0) * line.quantity,
    0,
  );
}

export function hasUnpricedLine(lines: CartLine[]): boolean {
  return lines.some((line) => line.priceGBP === null);
}
