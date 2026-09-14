import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductGrid";
import { allListings } from "@/data/catalogue";
import { searchListings } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? searchListings(allListings(), query) : [];

  return (
    <>
      <PageHeader
        eyebrow="Search"
        title={query ? `“${query}”` : "Search the archive"}
        blurb={
          query
            ? undefined
            : "Try a label, a size, a colour or an era — “lacoste large”, “navy polo”, “y2k”."
        }
        crumbs={[{ href: "/", label: "Home" }]}
        count={query ? results.length : undefined}
      />

      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
        <form action="/search" role="search" className="mb-10 flex max-w-xl gap-3">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search the archive"
            aria-label="Search the archive"
            className="w-full border rule bg-paper px-4 py-3 text-base outline-none placeholder:text-ink-3 focus:border-brick"
          />
          <button type="submit" className="bg-ink px-6 py-3 text-sm text-paper hover:bg-brick">
            Search
          </button>
        </form>

        {query && results.length === 0 ? (
          <div className="py-16 text-center">
            <p className="display text-2xl">Nothing matched that.</p>
            <p className="mt-3 text-ink-2">
              Plenty of the archive is sorted but not yet listed.{" "}
              <Link href="/contact" className="text-brick underline underline-offset-4">
                Tell us what you are after
              </Link>{" "}
              and we will look.
            </p>
          </div>
        ) : (
          results.length > 0 && <ProductGrid listings={results} />
        )}
      </div>
    </>
  );
}
