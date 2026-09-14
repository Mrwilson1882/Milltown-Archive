"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/components/useCart";
import { cartSubtotal, hasUnpricedLine, removeLine, setQuantity } from "@/lib/cart";
import { formatGBP } from "@/lib/text";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";

/**
 * The bag.
 *
 * Two ways out of it. With Stripe configured, the checkout button hands the
 * bag to the server, which prices it from the catalogue and opens a Stripe
 * session. Without it — or with anything unpriced in the bag — the same button
 * writes the bag out as a message instead, so a shop with no card processing
 * still takes orders.
 */
export function CartView({ stripeEnabled }: { stripeEnabled: boolean }) {
  const { lines, ready, refresh } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartSubtotal(lines);
  const unpriced = hasUnpricedLine(lines);
  const canPayByCard = stripeEnabled && !unpriced && lines.length > 0;

  const enquiryMessage = () => {
    const body = lines
      .map((line) => `• ${line.title}${line.size ? ` (${line.size})` : ""} ×${line.quantity}`)
      .join("\n");
    return `Hi Milltown Archive, I'd like to order:\n${body}`;
  };

  const checkout = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
        }),
      });
      const payload: { url?: string; error?: string } = await response.json();

      if (!response.ok || !payload.url) {
        setError(payload.error ?? "Checkout could not be started.");
        return;
      }
      window.location.href = payload.url;
    } catch {
      setError("Checkout could not be reached. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return <p className="py-16 text-center text-sm text-ink-3">Fetching your bag…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="display text-3xl">Your bag is empty.</p>
        <p className="mt-3 text-ink-2">Everything in the archive is a single piece.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-brick"
        >
          Start looking
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
      <ul className="divide-y rule border-y rule">
        {lines.map((line) => (
          <li key={line.slug} className="flex gap-4 py-5">
            <Link href={`/product/${line.slug}`} className="w-20 shrink-0 sm:w-24">
              <ProductImage
                src={line.image}
                alt={line.title}
                seed={line.slug}
                sizes="96px"
                className="rounded-card"
              />
            </Link>

            <div className="min-w-0 flex-1">
              {line.brand && <p className="eyebrow">{line.brand}</p>}
              <Link href={`/product/${line.slug}`} className="text-sm hover:text-brick">
                {line.title}
              </Link>
              {line.size && <p className="mt-0.5 text-xs text-ink-3">Size {line.size}</p>}

              <div className="mt-3 flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-ink-3">
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(event) => {
                      setQuantity(line.slug, Number(event.target.value));
                      refresh();
                    }}
                    className="numeric w-14 border rule bg-paper px-2 py-1 text-sm text-ink"
                    aria-label={`Quantity of ${line.title}`}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    removeLine(line.slug);
                    refresh();
                  }}
                  className="text-xs text-ink-3 underline underline-offset-4 hover:text-brick"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="numeric shrink-0 text-sm">
              {line.priceGBP === null ? (
                <span className="text-ink-3">On request</span>
              ) : (
                formatGBP(line.priceGBP * line.quantity)
              )}
            </div>
          </li>
        ))}
      </ul>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border rule bg-paper-2 p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="numeric text-lg">{formatGBP(subtotal)}</span>
          </div>

          {unpriced && (
            <p className="mt-3 text-xs text-ink-2">
              Some pieces in your bag have not been priced yet, so they are not in this
              total. Send the bag over and they will be priced for you.
            </p>
          )}

          <p className="mt-3 text-xs text-ink-3">
            Postage is added at checkout. See{" "}
            <Link href="/delivery-returns" className="underline underline-offset-4">
              delivery &amp; returns
            </Link>
            .
          </p>

          {error && (
            <p className="mt-4 border-l-2 border-brick bg-brick-tint px-3 py-2 text-xs text-ink-2">
              {error}
            </p>
          )}

          {canPayByCard ? (
            <button
              type="button"
              onClick={checkout}
              disabled={busy}
              className="mt-5 w-full bg-ink py-3.5 text-sm text-paper transition-colors hover:bg-brick disabled:bg-ink-3"
            >
              {busy ? "Opening checkout…" : "Checkout"}
            </button>
          ) : (
            <div className="mt-5 space-y-3">
              {hasWhatsApp && (
                <a
                  href={whatsappUrl(enquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-ink py-3.5 text-center text-sm text-paper transition-colors hover:bg-brick"
                >
                  Send the bag on WhatsApp
                </a>
              )}
              <a
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                  "Order from Milltown Archive",
                )}&body=${encodeURIComponent(enquiryMessage())}`}
                className="block border rule py-3 text-center text-sm transition-colors hover:border-brick hover:text-brick"
              >
                Send the bag by email
              </a>
              <p className="text-xs text-ink-3">
                {stripeEnabled
                  ? "Card checkout is available once everything in the bag has a price."
                  : "Card checkout is not switched on yet."}
              </p>
            </div>
          )}
        </div>

        <Link href="/shop" className="mt-4 block text-sm text-brick hover:underline">
          ← Keep looking
        </Link>
      </aside>
    </div>
  );
}
