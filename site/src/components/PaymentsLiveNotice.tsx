import Link from "next/link";

/**
 * Card payments went live on 3 October 2026.
 *
 * Worth one quiet line. Anyone who came here before that was sent to WhatsApp
 * for a payment link, and the ones who bounced at that step have no way of
 * knowing it changed. It sits under the menu rather than above it so it reads
 * as a note rather than an announcement bar, and it is paper-on-smoke rather
 * than reversed out, because this is news and not a klaxon.
 *
 * Take it out once it stops being news — it is one line in the layout.
 */
export function PaymentsLiveNotice() {
  return (
    <div className="border-b border-ash bg-smoke">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs text-slate sm:px-6">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-forest"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="10.5" width="16" height="10.5" rx="1.6" />
          <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
        </svg>
        <span>
          <strong className="font-bold text-ink">Card payments are now live.</strong>{" "}
          <span className="hidden sm:inline">Order and pay on the site — </span>
          <Link
            href="/collections/reseller-boxes"
            className="font-bold text-forest underline decoration-1 underline-offset-2 hover:text-ink"
          >
            shop the boxes
          </Link>
        </span>
      </p>
    </div>
  );
}
