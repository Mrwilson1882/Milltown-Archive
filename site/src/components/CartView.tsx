"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/useCart";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { cartTotals, lineKey, resolveLines } from "@/lib/cart";
import { formatPrice, perPiece } from "@/lib/format";
import { siteConfig, whatsappUrl } from "@/config/site";

export function CartView({
  stripeEnabled,
  whatsappAvailable,
}: {
  stripeEnabled: boolean;
  whatsappAvailable: boolean;
}) {
  const { lines, setQty, remove, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolved = useMemo(() => resolveLines(lines), [lines]);
  const { payable, enquiryOnly, payableTotalGBP, vatGBP, grossTotalGBP, itemCount } = useMemo(
    () => cartTotals(resolved),
    [resolved],
  );

  /** A plain-text basket the owner can read straight off WhatsApp. */
  const enquiryText = useMemo(() => {
    const list = resolved
      .map((l) => `• ${l.qty} × ${l.product.name} (${l.variant.pieces} ${l.product.unit})`)
      .join("\n");
    return `Hi Archive Wholesale, I'd like to order:\n${list}`;
  }, [resolved]);

  async function handleCheckout() {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: payable.map((l) => ({
            slug: l.product.slug,
            pieces: l.variant.pieces,
            qty: l.qty,
          })),
        }),
      });
      const data: { url?: string; message?: string } = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.message ?? "Checkout is unavailable right now. Please send us an enquiry.");
    } catch {
      setError("We could not reach checkout. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (resolved.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="display text-2xl">Your cart is empty</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate">
          Start with a reseller box, or pick a lot size from any product. Everything is sold
          wholesale — no single pieces.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/collections/reseller-boxes"
            className="inline-flex items-center bg-forest px-7 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark"
          >
            Reseller boxes
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center border-2 border-ink px-7 py-4 text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest"
          >
            All products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 py-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
      <div>
        <ul className="divide-y divide-ash border-y border-ash">
          {resolved.map(({ product, variant, qty, lineTotalGBP }) => (
            <li key={lineKey(product.slug, variant.pieces)} className="flex gap-4 py-5 sm:gap-6">
              <Link
                href={`/products/${product.slug}`}
                className="relative aspect-square w-24 shrink-0 overflow-hidden border border-ash bg-smoke sm:w-32"
              >
                <Image
                  src={product.photos?.[0]?.src ?? `/images/tiles/${product.art}.svg`}
                  alt={product.photos?.[0]?.alt ?? product.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                  <h2 className="display text-base sm:text-lg">
                    <Link href={`/products/${product.slug}`} className="hover:text-forest">
                      {product.name}
                    </Link>
                  </h2>
                  <p className={`font-bold ${lineTotalGBP === null ? "text-sm text-forest" : ""}`}>
                    {lineTotalGBP === null ? "Price on request" : formatPrice(lineTotalGBP)}
                  </p>
                </div>

                <p className="mt-1 text-xs font-semibold tracking-wide text-forest uppercase">
                  Lot of {variant.pieces} {product.unit}
                </p>
                {variant.priceGBP !== null && (
                  <p className="mt-0.5 text-xs text-slate">
                    {formatPrice(variant.priceGBP)} per lot · {perPiece(variant.priceGBP, variant.pieces)} per{" "}
                    {product.unit === "pairs" ? "pair" : "piece"}, excl. VAT
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                  <label className="flex items-center border border-ash">
                    <span className="sr-only">
                      Number of {variant.pieces}-{product.unit} lots of {product.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(product.slug, variant.pieces, qty - 1)}
                      className="px-3 py-1.5 font-bold hover:text-forest"
                      aria-label={`Decrease lots of ${product.name}`}
                    >
                      −
                    </button>
                    <span className="w-9 border-x border-ash py-1.5 text-center text-sm font-bold">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(product.slug, variant.pieces, qty + 1)}
                      className="px-3 py-1.5 font-bold hover:text-forest"
                      aria-label={`Increase lots of ${product.name}`}
                    >
                      +
                    </button>
                  </label>

                  <p className="text-xs text-slate">
                    {qty * variant.pieces} {product.unit} in total
                  </p>

                  <button
                    type="button"
                    onClick={() => remove(product.slug, variant.pieces)}
                    className="text-xs font-bold tracking-wide text-slate uppercase underline underline-offset-4 hover:text-forest"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/products"
            className="text-sm font-bold tracking-wide text-forest uppercase underline underline-offset-4"
          >
            ← Keep shopping
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-xs font-bold tracking-wide text-slate uppercase underline underline-offset-4 hover:text-forest"
          >
            Empty cart
          </button>
        </div>
      </div>

      <aside className="h-fit border-2 border-ink p-6 lg:sticky lg:top-36">
        <h2 className="display text-xl">Order summary</h2>

        <dl className="mt-5 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate">Lots</dt>
            <dd className="font-bold">{itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate">Goods (excl. VAT)</dt>
            <dd className="font-bold">{formatPrice(payableTotalGBP)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate">VAT at {siteConfig.vat.ratePercent}%</dt>
            <dd className="font-bold">{formatPrice(vatGBP)}</dd>
          </div>
          {enquiryOnly.length > 0 && (
            <div className="flex justify-between">
              <dt className="text-slate">On enquiry</dt>
              <dd className="font-bold text-forest">
                {enquiryOnly.length} {enquiryOnly.length === 1 ? "lot" : "lots"}
              </dd>
            </div>
          )}
          <div className="flex justify-between border-t border-ash pt-3">
            <dt className="text-slate">Delivery</dt>
            <dd className="text-right text-xs text-slate">Quoted on weight after checkout</dd>
          </div>
        </dl>

        {payable.length > 0 && (
          <>
            <div className="mt-5 flex items-baseline justify-between border-t-2 border-ink pt-4">
              <span className="display text-lg">Total</span>
              <span className="display text-2xl">{formatPrice(grossTotalGBP)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={submitting}
              className="mt-5 w-full bg-forest px-6 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Starting checkout…" : "Secure checkout"}
            </button>

            {!stripeEnabled && !error && (
              <p className="mt-3 text-xs leading-relaxed text-slate">
                Card payments are not switched on yet. Use the enquiry options below and we will
                invoice you directly.
              </p>
            )}
          </>
        )}

        {error && (
          <p role="alert" className="mt-4 border-l-2 border-forest bg-smoke p-3 text-xs leading-relaxed">
            {error}
          </p>
        )}

        <div className="mt-6 border-t border-ash pt-5">
          <p className="eyebrow text-slate">Rather talk to us? WhatsApp or email</p>
          <div className="mt-3 space-y-2">
            {whatsappAvailable && (
              <a
                href={whatsappUrl(enquiryText)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 border-2 border-forest px-5 py-3 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Send basket via WhatsApp
              </a>
            )}
            <a
              href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Wholesale order enquiry")}&body=${encodeURIComponent(enquiryText)}`}
              className="flex w-full items-center justify-center border-2 border-ink px-5 py-3 text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest"
            >
              Send basket via email
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
