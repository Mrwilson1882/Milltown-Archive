import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="display mt-3 text-[2.75rem] leading-tight">
        That one isn&rsquo;t here.
      </h1>
      <p className="mt-5 text-ink-2">
        Either the address is wrong, or the piece has sold — everything in the
        archive is one of one, and sold pieces come down.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="bg-ink px-6 py-3 text-sm text-paper hover:bg-brick">
          Shop the archive
        </Link>
        <Link href="/search" className="border rule px-6 py-3 text-sm hover:border-brick hover:text-brick">
          Search
        </Link>
      </div>
    </div>
  );
}
