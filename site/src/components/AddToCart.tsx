"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/useCart";
import { EnquiryActions } from "@/components/EnquiryActions";
import type { Product } from "@/data/catalogue";
import { perPiece, priceLabel } from "@/lib/format";
import { vatSuffix } from "@/config/site";

/**
 * Quantity-option picker plus add-to-cart. Products are sold in runs — 5, 10,
 * 25, 50, 100 — so the customer picks the lot size first, then how many of that
 * lot they want.
 */
export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [selected, setSelected] = useState(product.variants[0]?.pieces ?? 0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.pieces === selected);
  const multipleOptions = product.variants.length > 1;

  function handleAdd() {
    if (!variant) return;
    add(product.slug, variant.pieces, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
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
            subject={`Enquiry: ${product.name} (${variant.pieces} ${product.unit})`}
            message={`Hi Archive Wholesale, I'd like a price for ${variant.pieces} ${product.unit} of "${product.name}".`}
          />
        </div>
      ) : (
        <>
      <div className="flex gap-3">
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

        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 bg-forest px-6 py-3 font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark"
        >
          Add to cart
        </button>
      </div>

      <p aria-live="polite" className="min-h-5 text-sm">
        {added && (
          <span className="font-semibold text-forest">
            Added to your cart.{" "}
            <Link href="/cart" className="underline underline-offset-4">
              View cart
            </Link>
          </span>
        )}
      </p>
        </>
      )}
    </div>
  );
}
