import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-28 text-center sm:px-6">
      <p className="eyebrow text-forest">404</p>
      <h1 className="display mt-4 text-4xl sm:text-5xl">That page has been sold on</h1>
      <p className="mt-6 text-base leading-relaxed text-slate">
        The page you were after is not here. Intake changes weekly, so a lot you bookmarked may
        already have gone.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="inline-flex items-center bg-ink px-7 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest"
        >
          Browse products
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center border-2 border-forest px-7 py-4 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
        >
          Ask us what&apos;s in
        </Link>
      </div>
    </div>
  );
}
