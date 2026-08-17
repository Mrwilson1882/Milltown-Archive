"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/useCart";

export function AddToCart({ slug, disabled = false }: { slug: string; disabled?: boolean }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  if (disabled) {
    return (
      <p className="border-2 border-ash px-6 py-4 text-center text-sm font-bold tracking-wide uppercase text-slate">
        Sold out
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <label className="flex items-center border-2 border-ink">
          <span className="sr-only">Quantity</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3.5 py-3 text-lg leading-none font-bold transition-colors hover:text-forest"
            aria-label="Decrease quantity"
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
            aria-label="Increase quantity"
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
    </div>
  );
}
