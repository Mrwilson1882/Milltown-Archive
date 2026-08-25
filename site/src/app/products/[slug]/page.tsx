import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { EnquiryActions } from "@/components/EnquiryActions";
import { ProductCard } from "@/components/ProductCard";
import { fromPrice, getProduct, products, quantityLabel } from "@/data/catalogue";
import { findCategory, type CategoryKind } from "@/data/taxonomy";
import { siteConfig } from "@/config/site";
import { formatPrice, perPiece } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: `${product.summary} Available in ${quantityLabel(product).toLowerCase()}. Wholesale vintage from Archive Wholesale, UK.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.summary,
      url: `${siteConfig.url}/products/${product.slug}`,
    },
  };
}

function CategoryTags({
  kind,
  slugs,
  basePath,
}: {
  kind: CategoryKind;
  slugs: string[];
  basePath: string;
}) {
  const found = slugs.map((slug) => findCategory(kind, slug)).filter((c) => c !== undefined);
  return (
    <>
      {found.map((category) => (
        <Link
          key={`${kind}-${category.slug}`}
          href={`${basePath}/${category.slug}`}
          className="border border-forest px-3 py-1 text-xs font-bold tracking-wide text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
        >
          {category.name}
        </Link>
      ))}
    </>
  );
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const gallery =
    product.photos && product.photos.length > 0
      ? product.photos
      : [
          {
            src: `/images/tiles/${product.art}.svg`,
            alt: `${product.name} — placeholder artwork, photography to follow`,
          },
        ];

  const related = products
    .filter(
      (p) =>
        p.slug !== product.slug &&
        (p.brandSlugs.some((s) => product.brandSlugs.includes(s)) ||
          p.typeSlugs.some((s) => product.typeSlugs.includes(s))),
    )
    .slice(0, 3);

  const cheapest = fromPrice(product);
  const buyable = product.variants.some((v) => v.priceGBP !== null);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    brand: { "@type": "Brand", name: siteConfig.name },
    url: `${siteConfig.url}/products/${product.slug}`,
    // Availability is always declared, even for a lot with no published sizes —
    // otherwise a sold-out product gives search engines no signal at all.
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      ...(product.variants.length > 0 ? { offerCount: product.variants.length } : {}),
      ...(cheapest !== null ? { lowPrice: cheapest.toFixed(2) } : {}),
    },
  };

  const enquiryMessage = `Hi Archive Wholesale, I'd like to enquire about "${product.name}".`;

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the local catalogue file, not from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-slate uppercase">
            <li>
              <Link href="/" className="hover:text-forest">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-forest">
                All Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>
      </div>

      <article className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden border border-ash bg-smoke">
            <Image
              src={gallery[0].src}
              alt={gallery[0].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(1, 5).map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-square overflow-hidden border border-ash bg-smoke"
                >
                  <Image src={photo.src} alt={photo.alt} fill sizes="25vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {!product.photos && (
            <p className="text-xs text-slate">
              Photography for this lot is being shot. Ask us for current pictures before you order.
            </p>
          )}
        </div>

        <div>
          <h1 className="display text-3xl sm:text-4xl lg:text-5xl">{product.name}</h1>
          <p className="mt-4 text-base leading-relaxed text-slate">{product.summary}</p>

          <div className="mt-8">
            {product.variants.length === 0 ? (
              <div className="border-2 border-forest p-5">
                <p className="display text-xl text-forest">Quantities on request</p>
                <p className="mt-3 text-sm leading-relaxed">
                  We have not published lot sizes for this line yet. Tell us the volume you are
                  after and we will come back with what we can put together, with a price and
                  current photos.
                </p>
                <div className="mt-4">
                  <EnquiryActions
                    compact
                    subject={`Enquiry: ${product.name}`}
                    message={enquiryMessage}
                  />
                </div>
              </div>
            ) : buyable ? (
              <AddToCart product={product} />
            ) : (
              <div className="border-2 border-forest p-5">
                <p className="display text-xl text-forest">Price on request</p>
                <p className="mt-2 text-sm font-semibold">
                  Available in {quantityLabel(product).toLowerCase()}.
                </p>
                <p className="mt-3 text-sm leading-relaxed">
                  Message us with the lot size you want and we will come back the same working day
                  with a price, photos and delivery cost.
                </p>
                <div className="mt-4">
                  <EnquiryActions
                    compact
                    subject={`Enquiry: ${product.name}`}
                    message={enquiryMessage}
                  />
                </div>
              </div>
            )}
          </div>

          <dl className="mt-9 divide-y divide-ash border-y border-ash text-sm">
            <div className="flex gap-6 py-3">
              <dt className="w-36 shrink-0 font-bold">Lot sizes</dt>
              <dd className="text-slate">{quantityLabel(product)}</dd>
            </div>
            {product.variants.length > 0 && (
              <div className="flex gap-6 py-3">
                <dt className="w-36 shrink-0 font-bold">Sold by</dt>
                <dd className="text-slate">The {product.unit === "pairs" ? "pair" : "piece"}, in lots</dd>
              </div>
            )}
            {product.sizeRun && (
              <div className="flex gap-6 py-3">
                <dt className="w-36 shrink-0 font-bold">Size run</dt>
                <dd className="text-slate">{product.sizeRun}</dd>
              </div>
            )}
            <div className="flex gap-6 py-3">
              <dt className="w-36 shrink-0 font-bold">Availability</dt>
              <dd className="text-slate">{product.inStock ? "In stock" : "Sold out"}</dd>
            </div>
            {product.notes.length > 0 && (
              <div className="flex gap-6 py-3">
                <dt className="w-36 shrink-0 font-bold">Please note</dt>
                <dd className="space-y-1 text-slate">
                  {product.notes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </dd>
              </div>
            )}
          </dl>

          {product.variants.length > 1 && buyable && (
            <table className="mt-6 w-full border border-ash text-sm">
              <caption className="px-4 py-2.5 text-left text-xs text-slate">
                  Prices by lot size. All prices exclude VAT — VAT is added at checkout.
                </caption>
              <thead>
                <tr className="bg-smoke text-left">
                  <th scope="col" className="px-4 py-2.5 text-xs font-bold tracking-wide uppercase">
                    Lot size
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-xs font-bold tracking-wide uppercase">
                    Per {product.unit === "pairs" ? "pair" : "piece"}
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-xs font-bold tracking-wide uppercase">
                    Lot price
                  </th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => (
                  <tr key={variant.pieces} className="border-t border-ash">
                    <td className="px-4 py-2.5 font-semibold">
                      {variant.pieces} {product.unit}
                    </td>
                    <td className="px-4 py-2.5 font-semibold">
                      {variant.priceGBP === null
                        ? "On request"
                        : perPiece(variant.priceGBP, variant.pieces)}
                    </td>
                    <td className="px-4 py-2.5 text-slate">
                      {variant.priceGBP === null ? "—" : formatPrice(variant.priceGBP)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-8 space-y-4 text-base leading-relaxed text-slate">
            {product.description.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <CategoryTags kind="type" slugs={product.typeSlugs} basePath="/types" />
            <CategoryTags kind="brand" slugs={product.brandSlugs} basePath="/brands" />
            <CategoryTags kind="collection" slugs={product.collectionSlugs} basePath="/collections" />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-ash bg-smoke">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <h2 className="display text-2xl sm:text-3xl">You might also want</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
