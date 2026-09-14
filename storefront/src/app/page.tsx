import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SectionTile } from "@/components/SectionTile";
import { ProductImage } from "@/components/ProductImage";
import {
  allBrands,
  allListings,
  coverImageFor,
  listingsInEdit,
  listingsInType,
  stockedEdits,
  stockedTypes,
} from "@/data/catalogue";
import { siteConfig } from "@/config/site";

export const metadata = {
  alternates: { canonical: "/" },
};

/** What the shop promises, in three lines. Nothing here is decoration. */
const PRINCIPLES = [
  {
    title: "One of one",
    body: "Every listing is a single garment. No sizes dropdown, no restock — when it sells, the page says sold and that is the end of it.",
  },
  {
    title: "Faults stated",
    body: "Marks, fades and cut labels are written on the listing and photographed. A blank faults line means nothing was found, not that nothing was looked for.",
  },
  {
    title: "Graded by hand",
    body: "Each piece is graded against the same scale, by the person who sorted it. The grading guide explains exactly what each grade means.",
  },
];

export default function HomePage() {
  const listings = allListings();
  const newIn = listings.slice(0, 8);
  const types = stockedTypes();
  const edits = stockedEdits().filter(({ section }) => section.slug !== "new-in");
  const brands = allBrands().slice(0, 10);
  const heroPieces = listings.slice(0, 3);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="mx-auto max-w-[1400px] px-4 pt-12 pb-16 sm:px-6 lg:px-10 lg:pt-20">
        <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="eyebrow">{siteConfig.location}</p>
            <h1 className="display mt-4 text-[3.25rem] leading-[0.98] sm:text-[4.5rem] lg:text-[5.25rem]">
              Vintage,
              <br />
              <span className="italic text-brick">one piece</span>
              <br />
              at a time.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-2">
              Branded vintage, sorted and graded by hand in Lancashire. Every
              garment photographed, measured and listed on its own — because
              there is only ever one of it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-brick"
              >
                Shop the archive
              </Link>
              <Link
                href="/edit/new-in"
                className="border rule px-7 py-3.5 text-sm transition-colors hover:border-brick hover:text-brick"
              >
                What&rsquo;s new in
              </Link>
            </div>
          </div>

          {heroPieces.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {heroPieces.map((listing, index) => (
                <Link
                  key={listing.slug}
                  href={`/product/${listing.slug}`}
                  className={[
                    index === 1 ? "translate-y-6" : "",
                    // Three plates need three columns; on a phone the third
                    // would be too small to read, so it steps aside.
                    index === 2 ? "hidden sm:block" : "",
                  ].join(" ")}
                >
                  <ProductImage
                    src={listing.images[0]}
                    alt={listing.title}
                    seed={listing.slug}
                    priority={index === 0}
                    sizes="(max-width: 1024px) 33vw, 16vw"
                    note={false}
                    className="rounded-card"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------- New in */}
      {newIn.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-baseline justify-between gap-4 border-t rule pt-8">
            <h2 className="display text-3xl sm:text-4xl">Just in</h2>
            <Link href="/edit/new-in" className="text-sm text-brick hover:underline">
              See everything new →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
            {newIn.map((listing, index) => (
              <ProductCard
                key={listing.slug}
                listing={listing}
                priority={index < 2}
                sizes="(max-width: 640px) 50vw, 23vw"
              />
            ))}
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- Categories */}
      {types.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-baseline justify-between gap-4 border-t rule pt-8">
            <h2 className="display text-3xl sm:text-4xl">Browse by piece</h2>
            <Link href="/shop" className="text-sm text-brick hover:underline">
              Everything →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {types.map(({ section, count }) => (
              <SectionTile
                key={section.slug}
                section={section}
                href={`/shop/${section.slug}`}
                cover={coverImageFor(listingsInType(section.slug))}
                count={count}
              />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- How it works */}
      <section className="mt-24 border-y rule bg-paper-2">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
          <h2 className="display text-3xl sm:text-4xl">How the archive works</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title}>
                <h3 className="display text-2xl text-brick">{principle.title}</h3>
                <p className="mt-3 text-sm text-ink-2">{principle.body}</p>
              </div>
            ))}
          </div>
          <Link
            href="/condition-guide"
            className="mt-10 inline-block text-sm text-brick hover:underline"
          >
            Read the grading guide →
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- Edits */}
      {edits.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <h2 className="display text-3xl sm:text-4xl">Edits</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {edits.map(({ section, count }) => (
              <SectionTile
                key={section.slug}
                section={section}
                href={`/edit/${section.slug}`}
                cover={coverImageFor(listingsInEdit(section.slug))}
                count={count}
              />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ Brands */}
      {brands.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-baseline justify-between gap-4 border-t rule pt-8">
            <h2 className="display text-3xl sm:text-4xl">Labels in the archive</h2>
            <Link href="/brands" className="text-sm text-brick hover:underline">
              All labels →
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {brands.map((brand) => (
              <li key={brand.slug}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="inline-flex items-baseline gap-2 border rule px-4 py-2 text-sm transition-colors hover:border-brick hover:text-brick"
                >
                  {brand.name}
                  <span className="numeric text-xs text-ink-3">{brand.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ----------------------------------------------------------- Closing */}
      <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="border rule bg-brick-tint px-6 py-12 text-center sm:px-12">
          <h2 className="display text-3xl sm:text-4xl">Looking for something in particular?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-2">
            Plenty of the archive is sorted but not yet listed. Tell us the label,
            the size or the era you are after and we will look through what has
            just come in.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-block bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-brick"
          >
            Ask us
          </Link>
        </div>
      </section>
    </>
  );
}
