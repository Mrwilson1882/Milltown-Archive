import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPage } from "@/components/SectionPage";
import { allBrands, brandBySlug, listingsByBrand } from "@/data/catalogue";

type Params = { params: Promise<{ slug: string }> };

/** Brand pages exist for exactly the labels the catalogue contains. */
export function generateStaticParams() {
  return allBrands().map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const brand = brandBySlug(slug);
  if (!brand) return {};

  return {
    title: `Vintage ${brand.name}`,
    description: `Vintage ${brand.name} in the Milltown Archive — ${brand.count} piece${
      brand.count === 1 ? "" : "s"
    }, each one graded, measured and sold on its own.`,
    alternates: { canonical: `/brands/${brand.slug}` },
  };
}

export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  const brand = brandBySlug(slug);
  if (!brand) notFound();

  return (
    <SectionPage
      eyebrow="Label"
      title={brand.name}
      blurb={`Everything under ${brand.name} in the archive right now.`}
      seoCopy={`Vintage ${brand.name} sold one piece at a time. Each garment is photographed, measured and graded on its own listing, with any faults written down rather than left for you to find. When a piece sells it is gone — there is only ever one of each.`}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/brands", label: "Brands" },
      ]}
      listings={listingsByBrand(brand.slug)}
    />
  );
}
