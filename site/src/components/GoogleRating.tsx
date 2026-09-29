import { siteConfig } from "@/config/site";

/**
 * The Google review rating, shown as a short line of stars.
 *
 * Deliberately text and SVG only, with no schema.org aggregateRating: Google
 * does not allow a business to mark up its own rating on its own site, and
 * doing it anyway risks a manual penalty. The rating still reads as a trust
 * signal to a visitor and to an AI assistant summarising the page — it just
 * is not claimed as machine-readable review data.
 *
 * Set siteConfig.googleReviewUrl to turn the line into a link to the real
 * listing, which is what makes the claim checkable.
 */
export function GoogleRating({ className = "" }: { className?: string }) {
  const stars = (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-forest">
          <path d="M10 1.6l2.47 5.2 5.53.77-4.02 3.96.96 5.67L10 14.5l-4.94 2.7.96-5.67L2 7.57l5.53-.77z" />
        </svg>
      ))}
    </span>
  );

  const label = (
    <>
      {stars}
      <span className="text-xs font-bold tracking-wide text-ink uppercase">
        Rated 5 stars on Google
      </span>
    </>
  );

  return siteConfig.googleReviewUrl ? (
    <a
      href={siteConfig.googleReviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 transition-opacity hover:opacity-70 ${className}`}
    >
      {label}
      <span className="sr-only">Read our reviews on Google</span>
    </a>
  ) : (
    <p className={`inline-flex items-center gap-2 ${className}`}>{label}</p>
  );
}
