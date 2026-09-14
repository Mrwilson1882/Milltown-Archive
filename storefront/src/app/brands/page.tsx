import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ProductImage } from "@/components/ProductImage";
import { allBrands, coverImageFor, listingsByBrand } from "@/data/catalogue";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Every label currently in the Milltown Archive, from Ralph Lauren and Lacoste to Nike and the heritage names, with what is in stock under each.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  const brands = allBrands();

  return (
    <>
      <PageHeader
        eyebrow="Labels"
        title="Brands"
        blurb="Whatever is in the archive right now. Labels come and go with the sorting."
        crumbs={[{ href: "/", label: "Home" }]}
        count={brands.length}
      />

      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
        {brands.length === 0 ? (
          <p className="py-16 text-center text-ink-3">
            No labels are recorded on the current stock.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {brands.map((brand) => (
              <Link key={brand.slug} href={`/brands/${brand.slug}`} className="group block">
                <ProductImage
                  src={coverImageFor(listingsByBrand(brand.slug))}
                  alt={brand.name}
                  seed={brand.slug}
                  ratio="square"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="rounded-card transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.012]"
                />
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h2 className="display text-xl group-hover:text-brick transition-colors">
                    {brand.name}
                  </h2>
                  <span className="numeric text-xs text-ink-3">{brand.count}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
