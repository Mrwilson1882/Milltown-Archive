import Link from "next/link";

/**
 * The wordmark. Set in the display serif, with "Archive" italic so the two
 * halves read as one name rather than two words.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-baseline gap-[0.3em] ${className}`}
      aria-label="Milltown Archive — home"
    >
      <span className="display text-[1.35rem] sm:text-[1.6rem] leading-none">Milltown</span>
      <span className="display italic text-[1.35rem] sm:text-[1.6rem] leading-none text-brick">
        Archive
      </span>
    </Link>
  );
}
