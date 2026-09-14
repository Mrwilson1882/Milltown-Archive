import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { Price } from "@/components/Price";
import type { Listing } from "@/types/listing";

/**
 * One piece in a grid.
 *
 * Size and condition sit on the card rather than only on the product page:
 * in one-of-one vintage they are the two things that decide whether a shopper
 * bothers to click, and hiding them wastes everybody's time.
 */
export function ProductCard({
  listing,
  priority = false,
  sizes,
}: {
  listing: Listing;
  priority?: boolean;
  sizes?: string;
}) {
  const soldOut = !listing.inStock;
  const meta =
    [listing.size, listing.conditionLabel].filter(Boolean).join(" · ") || "Details inside";
  const reduced =
    listing.priceGBP !== null &&
    listing.originalPriceGBP !== null &&
    listing.originalPriceGBP > listing.priceGBP;

  return (
    <article className="group relative">
      <Link href={`/product/${listing.slug}`} className="block">
        <div className="relative">
          <ProductImage
            src={listing.images[0]}
            alt={listing.title}
            seed={listing.slug}
            priority={priority}
            sizes={sizes}
            className="rounded-card transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.012]"
          />

          {(soldOut || reduced) && (
            <span
              className={`absolute left-3 top-3 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] ${
                soldOut ? "bg-ink text-paper" : "bg-brick text-white"
              }`}
            >
              {soldOut ? "Sold" : "Reduced"}
            </span>
          )}
        </div>

        <div className="mt-3 space-y-1">
          {listing.brand && <p className="eyebrow">{listing.brand}</p>}
          <h3 className="text-[0.9375rem] leading-snug group-hover:underline underline-offset-4 decoration-line">
            {listing.title}
          </h3>
          <div className="flex items-baseline justify-between gap-x-3">
            <Price
              priceGBP={listing.priceGBP}
              originalPriceGBP={listing.originalPriceGBP}
              size="sm"
            />
            <p className="min-w-0 truncate text-right text-xs text-ink-3" title={meta}>
              {meta}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
