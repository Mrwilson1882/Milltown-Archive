import { siteConfig } from "@/config/site";

/**
 * The Google review rating, as a bordered badge that reads at a glance.
 *
 * Stars are gold rather than brand green: gold is the universal review
 * signal, and a visitor should recognise it as a rating before they read a
 * word of it.
 *
 * Deliberately text and SVG only, with no schema.org aggregateRating: Google
 * does not allow a business to mark up its own rating on its own site, and
 * doing it anyway risks a manual penalty. The badge still works on a visitor
 * and on an AI assistant reading the page — it just is not claimed as
 * machine-readable review data.
 *
 * Set siteConfig.googleReviewUrl to turn it into a link to the real listing,
 * which is what makes the claim checkable.
 */
export function GoogleRating({ className = "" }: { className?: string }) {
  const inner = (
    <>
      <span className="inline-flex gap-1" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" className="h-5 w-5 fill-[#F5A623] sm:h-7 sm:w-7">
            <path d="M10 1.6l2.47 5.2 5.53.77-4.02 3.96.96 5.67L10 14.5l-4.94 2.7.96-5.67L2 7.57l5.53-.77z" />
          </svg>
        ))}
      </span>
      <span className="display hidden text-2xl leading-none sm:inline sm:text-3xl">5.0</span>
      <span className="hidden h-8 w-px bg-ash sm:inline-block" aria-hidden="true" />
      <span className="text-xs leading-tight font-bold tracking-wide uppercase sm:text-sm">
        Rated 5 stars
        <br />
        on Google
      </span>
    </>
  );

  const box = "inline-flex items-center gap-2.5 border-2 border-forest bg-paper px-4 py-3 sm:gap-4 sm:px-6";

  return siteConfig.googleReviewUrl ? (
    <a
      href={siteConfig.googleReviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${box} transition-colors hover:bg-smoke ${className}`}
    >
      {inner}
      <span className="sr-only">Read our reviews on Google</span>
    </a>
  ) : (
    <p className={`${box} ${className}`}>{inner}</p>
  );
}
