"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/useCart";
import { EnquiryActions } from "@/components/EnquiryActions";
import type { Product } from "@/data/catalogue";
import { perPiece, priceLabel } from "@/lib/format";
import { deliveryForLotGBP, vatSuffix } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { startCheckout } from "@/lib/startCheckout";

/**
 * Quantity-option picker plus add-to-cart. Products are sold in runs — 10, 25,
 * 50 — so the customer picks the lot size first, then how many of that
 * lot they want.
 */
export function AddToCart({
  product,
  checkoutLive,
}: {
  product: Product;
  /** Whether card checkout is switched on. Buy now only shows when it is. */
  checkoutLive: boolean;
}) {
  const { add } = useCart();
  const [selected, setSelected] = useState(product.variants[0]?.pieces ?? 0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = product.variants.find((v) => v.pieces === selected);
  const multipleOptions = product.variants.length > 1;

  function handleAdd() {
    if (!variant) return;
    add(product.slug, variant.pieces, qty);
    trackEvent("add_to_basket", { product: product.slug, pieces: variant.pieces, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  /**
   * Straight to Stripe with this lot alone. The basket is left as it was: a
   * buyer who taps Buy now has decided on this lot, and folding in whatever
   * else they had saved would put a surprise on the payment page.
   */
  async function handleBuyNow() {
    if (!variant) return;
    trackEvent("buy_now", { product: product.slug, pieces: variant.pieces, qty });
    setBuying(true);
    setError(null);
    const result = await startCheckout(
      [{ slug: product.slug, pieces: variant.pieces, qty }],
      `/products/${product.slug}`,
    );
    if ("url" in result) {
      window.location.assign(result.url);
      return;
    }
    setError(result.message);
    setBuying(false);
  }

  if (!product.inStock) {
    return (
      <p className="border-2 border-ash px-6 py-4 text-center text-sm font-bold tracking-wide text-slate uppercase">
        Sold out
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {multipleOptions && (
        <fieldset>
          <legend className="eyebrow text-slate">
            Lot size — {product.unit} per lot
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((option) => {
              const isSelected = option.pieces === selected;
              return (
                <button
                  key={option.pieces}
                  type="button"
                  onClick={() => setSelected(option.pieces)}
                  aria-pressed={isSelected}
                  className={`min-w-16 border-2 px-4 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors ${
                    isSelected
                      ? "border-forest bg-forest text-paper"
                      : "border-ash text-ink hover:border-ink"
                  }`}
                >
                  {option.pieces}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {variant && (
        <div>
          <p className="display text-3xl">
            {priceLabel(variant.priceGBP)}
            {variant.priceGBP !== null && vatSuffix && (
              <span className="ml-2 text-sm font-semibold tracking-normal text-slate normal-case">
                {vatSuffix}
              </span>
            )}
          </p>
          {variant.priceGBP !== null && (
            <p className="mt-1 text-sm text-slate">
              {perPiece(variant.priceGBP, variant.pieces)} per{" "}
              {product.unit === "pairs" ? "pair" : "piece"} · {variant.pieces} {product.unit} per lot
            </p>
          )}
        </div>
      )}

      {variant && variant.priceGBP === null ? (
        // A lot size the owner hasn't priced yet — take the enquiry instead.
        <div>
          <p className="mb-3 text-sm leading-relaxed text-slate">
            This lot size is priced on enquiry. Message us and we will come back with a price,
            photos and delivery cost.
          </p>
          <EnquiryActions
            compact
            source="product"
            product={product.slug}
            pieces={variant.pieces}
            subject={`Enquiry: ${product.name} (${variant.pieces} ${product.unit})`}
            message={`Hi Archive Wholesale, I'd like a price for ${variant.pieces} ${product.unit} of "${product.name}".`}
          />
        </div>
      ) : (
        <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="flex items-center border-2 border-ink">
          <span className="sr-only">Number of lots</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3.5 py-3 text-lg leading-none font-bold transition-colors hover:text-forest"
            aria-label="Decrease number of lots"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
            className="w-12 border-x-2 border-ink py-3 text-center font-bold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="px-3.5 py-3 text-lg leading-none font-bold transition-colors hover:text-forest"
            aria-label="Increase number of lots"
          >
            +
          </button>
        </label>
        {variant?.priceGBP != null && (
          // The whole cost before they commit, delivery included, so nothing
          // on Stripe's page comes as a surprise.
          <p className="text-sm leading-snug text-slate">
            <span className="font-bold text-ink">{formatPrice(variant.priceGBP * qty)}</span>
            {vatSuffix && ` ${vatSuffix}`} + {formatPrice(deliveryForLotGBP(variant.pieces) * qty)} UK
            delivery
          </p>
        )}
      </div>

      <div className={checkoutLive ? "grid grid-cols-2 gap-3" : ""}>
        <button
          type="button"
          onClick={handleAdd}
          disabled={buying}
          className={`w-full px-4 py-4 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-60 ${
            checkoutLive
              ? "border-2 border-forest text-forest hover:bg-forest hover:text-paper"
              : "bg-forest text-paper hover:bg-forest-dark"
          }`}
        >
          Add to basket
        </button>
        {checkoutLive && (
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={buying}
            className="w-full border-2 border-forest bg-forest px-4 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:border-forest-dark hover:bg-forest-dark disabled:cursor-wait disabled:opacity-80"
          >
            {buying ? "Opening checkout…" : "Buy now"}
          </button>
        )}
      </div>

      {checkoutLive && (
        <p className="flex items-center gap-1.5 text-xs text-slate">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="5" y="11" width="14" height="10" rx="1.5" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          Secure checkout by Stripe · Card, Apple Pay, Klarna and more
        </p>
      )}

      {error && (
        <p role="alert" className="border-l-2 border-forest bg-smoke p-3 text-xs leading-relaxed">
          {error}
        </p>
      )}

      <p aria-live="polite" className="min-h-5 text-sm">
        {added && (
          <span className="font-semibold text-forest">
            Added to your basket.{" "}
            <Link href="/cart" className="underline underline-offset-4">
              View basket
            </Link>
          </span>
        )}
      </p>
        </>
      )}
    </div>
  );
}
