import { formatGBP } from "@/lib/text";

/**
 * A price, or the plain truth that there isn't one.
 *
 * No price on this site is inferred — see pricing-notes.md in the repository
 * root. A blank Price column shows "Price on request" and routes the shopper
 * to a message rather than to the bag.
 */
export function Price({
  priceGBP,
  originalPriceGBP = null,
  className = "",
  size = "base",
}: {
  priceGBP: number | null;
  originalPriceGBP?: number | null;
  className?: string;
  size?: "sm" | "base" | "lg";
}) {
  const scale = { sm: "text-sm", base: "text-base", lg: "text-2xl" }[size];

  if (priceGBP === null) {
    return (
      <span className={`${scale} text-ink-3 ${className}`}>Price on request</span>
    );
  }

  const reduced = originalPriceGBP !== null && originalPriceGBP > priceGBP;

  return (
    <span className={`numeric inline-flex items-baseline gap-2 ${scale} ${className}`}>
      <span className={reduced ? "text-brick font-medium" : "font-medium"}>
        {formatGBP(priceGBP)}
      </span>
      {reduced && (
        <span className="text-ink-3 line-through text-[0.85em]">
          {formatGBP(originalPriceGBP)}
        </span>
      )}
    </span>
  );
}
