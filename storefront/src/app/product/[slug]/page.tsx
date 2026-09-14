import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { Price } from "@/components/Price";
import { allListings, catalogue, listingBySlug } from "@/data/catalogue";
import { productTypes } from "@/data/taxonomy";
import { siteConfig } from "@/config/site";
import type { Listing } from "@/types/listing";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogue().listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const listing = listingBySlug(slug);
  if (!listing) return {};

  const summary = [listing.brand, listing.size, listing.conditionLabel]
    .filter(Boolean)
    .join(" · ");

  return {
    title: listing.title,
    description:
      listing.description[0] ??
      `${listing.title}${summary ? ` — ${summary}` : ""}. One of one, from the Milltown Archive.`,
    alternates: { canonical: `/product/${listing.slug}` },
    openGraph: {
      type: "website",
      title: listing.title,
      description: summary || listing.title,
      images: listing.images.length > 0 ? [listing.images[0]] : undefined,
    },
  };
}

/** The measurements and facts, as a definition list rather than prose. */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b rule py-2.5 last:border-b-0">
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

/**
 * Faults, stated the way the ledger states them.
 *
 * Blank means "not stated" and says so. It never becomes "no faults" — that
 * is a claim only the owner can make, and only by writing "None".
 */
function Faults({ listing }: { listing: Listing }) {
  const stated = listing.defects?.trim();
  const saysNone = stated && /^none$/i.test(stated);

  return (
    <div className="border-l-2 border-brick bg-brick-tint px-4 py-3">
      <p className="eyebrow">Faults</p>
      {saysNone ? (
        <p className="mt-1 text-sm">No faults found on this piece.</p>
      ) : stated ? (
        <p className="mt-1 text-sm">{stated}</p>
      ) : (
        <p className="mt-1 text-sm text-ink-2">
          Not stated. Ask before ordering and the piece will be checked over for you.
        </p>
      )}
    </div>
  );
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const listing = listingBySlug(slug);
  if (!listing) notFound();

  const primaryType = productTypes.find((type) => listing.typeSlugs.includes(type.slug));

  // Related pieces: the same category first, then the same label, never the
  // piece itself, and only ever things that are actually still available.
  const related = allListings()
    .filter(
      (other) =>
        other.slug !== listing.slug &&
        other.inStock &&
        (other.typeSlugs.some((type) => listing.typeSlugs.includes(type)) ||
          (other.brandSlug !== null && other.brandSlug === listing.brandSlug)),
    )
    .slice(0, 4);

  const details: { label: string; value: string }[] = [
    listing.brand && { label: "Label", value: listing.brand },
    listing.size && { label: "Size", value: listing.size },
    listing.conditionLabel && { label: "Condition", value: listing.conditionLabel },
    listing.colour && {
      label: "Colour",
      value: [listing.colour, listing.secondaryColour].filter(Boolean).join(" / "),
    },
    listing.era && { label: "Era", value: listing.era },
    listing.sku && { label: "Sorted under", value: listing.sku },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description.join(" ") || listing.title,
    ...(listing.brand ? { brand: { "@type": "Brand", name: listing.brand } } : {}),
    ...(listing.sku ? { sku: listing.sku } : {}),
    ...(listing.images.length > 0
      ? { image: listing.images.map((image) => `${siteConfig.url}${image}`) }
      : {}),
    ...(listing.colour ? { color: listing.colour } : {}),
    ...(listing.size ? { size: listing.size } : {}),
    ...(listing.priceGBP !== null
      ? {
          offers: {
            "@type": "Offer",
            url: `${siteConfig.url}/product/${listing.slug}`,
            priceCurrency: "GBP",
            price: listing.priceGBP.toFixed(2),
            itemCondition: "https://schema.org/UsedCondition",
            availability: listing.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
            seller: { "@type": "Organization", name: siteConfig.name },
          },
        }
      : {}),
  };

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-3">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="hover:text-brick">Home</Link>
              <span aria-hidden>/</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Link href="/shop" className="hover:text-brick">Shop</Link>
              <span aria-hidden>/</span>
            </li>
            {primaryType && (
              <li className="flex items-center gap-1.5">
                <Link href={`/shop/${primaryType.slug}`} className="hover:text-brick">
                  {primaryType.name}
                </Link>
                <span aria-hidden>/</span>
              </li>
            )}
            <li aria-current="page" className="text-ink-2">{listing.title}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ProductGallery images={listing.images} title={listing.title} seed={listing.slug} />

          <div className="lg:sticky lg:top-24 lg:self-start">
            {listing.brand && (
              <Link href={`/brands/${listing.brandSlug}`} className="eyebrow hover:text-brick">
                {listing.brand}
              </Link>
            )}

            <h1 className="display mt-2 text-[2.25rem] leading-tight sm:text-[2.75rem]">
              {listing.title}
            </h1>

            <div className="mt-4">
              <Price
                priceGBP={listing.priceGBP}
                originalPriceGBP={listing.originalPriceGBP}
                size="lg"
              />
            </div>

            {(listing.size || listing.conditionLabel) && (
              <p className="mt-2 text-sm text-ink-2">
                {[listing.size && `Size ${listing.size}`, listing.conditionLabel]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}

            {listing.description.length > 0 && (
              <div className="mt-6 space-y-3 text-sm text-ink-2">
                {listing.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}

            <div className="mt-6">
              <Faults listing={listing} />
            </div>

            <div className="mt-8">
              <AddToCart listing={listing} />
            </div>

            {details.length > 0 && (
              <dl className="mt-10 border-t rule pt-2 text-sm">
                {details.map((row) => (
                  <DetailRow key={row.label} label={row.label} value={row.value} />
                ))}
              </dl>
            )}

            <div className="mt-8 space-y-2 text-xs text-ink-3">
              <p>
                <Link href="/sizing" className="underline underline-offset-4 hover:text-brick">
                  How we size and measure
                </Link>
              </p>
              <p>
                <Link href="/condition-guide" className="underline underline-offset-4 hover:text-brick">
                  What the condition grades mean
                </Link>
              </p>
              <p>
                <Link href="/delivery-returns" className="underline underline-offset-4 hover:text-brick">
                  Delivery &amp; returns
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <h2 className="display border-t rule pt-8 text-3xl">You might also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {related.map((other) => (
              <ProductCard key={other.slug} listing={other} sizes="(max-width: 640px) 50vw, 23vw" />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </>
  );
}
