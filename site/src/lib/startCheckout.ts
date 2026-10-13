/**
 * Hand the buyer to Stripe.
 *
 * Shared by the basket and the product page's Buy now, so both send the same
 * request and fail the same way. Returns the Stripe URL to go to, or the
 * message to show; it never navigates itself, so the caller keeps control of
 * its own loading state.
 */
export type CheckoutItem = { slug: string; pieces: number; qty: number };

export async function startCheckout(
  items: CheckoutItem[],
  /** Where Stripe's back arrow returns to. Defaults to the basket. */
  cancelPath?: string,
): Promise<{ url: string } | { message: string }> {
  // A buyer left looking at "Opening checkout…" with nothing happening is a
  // buyer who leaves. Give up after 25 seconds and say so, so they can retry.
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 25_000);
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, cancelPath }),
      signal: controller.signal,
    });
    const data: { url?: string; message?: string } = await response.json();
    if (response.ok && data.url) return { url: data.url };
    return { message: data.message ?? "Checkout is unavailable right now. Please send us an enquiry." };
  } catch {
    return { message: "We could not reach checkout. Check your connection and try again." };
  } finally {
    window.clearTimeout(timer);
  }
}
