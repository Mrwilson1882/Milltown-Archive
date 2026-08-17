import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { BundleCard } from "@/components/BundleCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { bundles, getBundle } from "@/data/bundles";
import { findCategory, type CategoryKind } from "@/data/taxonomy";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";
import { priceLabel } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return bundles.map((bundle) => ({ slug: bundle.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getBundle(slug);
  if (!bundle) return { title: "Bundle not found" };

  return {
    title: bundle.name,
    description: `${bundle.summary} ${bundle.pieces} pieces, approx. ${bundle.weightKg}kg, sizes ${bundle.sizeRun}. Wholesale vintage from Archive Wholesale, UK.`,
    alternates: { canonical: `/bundles/${bundle.slug}` },
    openGraph: {
      type: "website",
      title: bundle.name,
      description: bundle.summary,
      url: `${siteConfig.url}/bundles/${bundle.slug}`,
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
  if (found.length === 0) return null;
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

export default async function BundlePage({ params }: Params) {
  const { slug } = await params;
  const bundle = getBundle(slug);
  if (!bundle) notFound();

  const gallery =
    bundle.photos && bundle.photos.length > 0
      ? bundle.photos
      : [{ src: `/images/tiles/${bundle.art}.svg`, alt: `${bundle.name} — placeholder artwork, photography to follow` }];

  const related = bundles
    .filter(
      (b) =>
        b.slug !== bundle.slug &&
        (b.brandSlugs.some((s) => bundle.brandSlugs.includes(s)) ||
          b.typeSlugs.some((s) => bundle.typeSlugs.includes(s))),
    )
    .slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.name,
    description: bundle.summary,
    brand: { "@type": "Brand", name: siteConfig.name },
    url: `${siteConfig.url}/bundles/${bundle.slug}`,
    weight: { "@type": "QuantitativeValue", value: bundle.weightKg, unitCode: "KGM" },
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      url: `${siteConfig.url}/bundles/${bundle.slug}`,
      availability: bundle.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      ...(bundle.priceGBP !== null ? { price: bundle.priceGBP.toFixed(2) } : {}),
    },
  };

  const enquiryMessage = `Hi Archive Wholesale, I'd like to enquire about the "${bundle.name}" bundle.`;

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
              <Link href="/bundles" className="hover:text-forest">
                All Bundles
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink">{bundle.name}</li>
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
            <span className="absolute top-4 left-4 bg-forest px-3 py-1.5 text-xs font-bold tracking-wider text-paper uppercase">
              {bundle.pieces} pieces
            </span>
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

          {!bundle.photos && (
            <p className="text-xs text-slate">
              Photography for this bundle is being shot. Ask us for current pictures before you
              order.
            </p>
          )}
        </div>

        <div>
          <h1 className="display text-3xl sm:text-4xl lg:text-5xl">{bundle.name}</h1>
          <p className="mt-4 text-base leading-relaxed text-slate">{bundle.summary}</p>

          <p
            className={`mt-7 font-bold ${
              bundle.priceGBP === null ? "display text-2xl text-forest" : "display text-4xl"
            }`}
          >
            {priceLabel(bundle.priceGBP)}
          </p>
          {bundle.priceGBP !== null && (
            <p className="mt-1 text-xs text-slate">
              £{(bundle.priceGBP / bundle.pieces).toFixed(2)} per piece · excludes delivery
            </p>
          )}

          <div className="mt-7">
            {bundle.priceGBP === null ? (
              <div className="border-2 border-forest p-5">
                <p className="text-sm leading-relaxed">
                  This bundle is priced on enquiry. Message us for the current price, photos and
                  delivery cost — we usually come back the same working day.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {hasWhatsApp && (
                    <a
                      href={whatsappUrl(enquiryMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-forest px-6 py-3 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      Enquire on WhatsApp
                    </a>
                  )}
                  <a
                    href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Enquiry: ${bundle.name}`)}`}
                    className="inline-flex items-center border-2 border-ink px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest"
                  >
                    Email us
                  </a>
                </div>
              </div>
            ) : (
              <AddToCart slug={bundle.slug} disabled={!bundle.inStock} />
            )}
          </div>

          <dl className="mt-9 divide-y divide-ash border-y border-ash text-sm">
            {[
              { k: "Pieces", v: `${bundle.pieces} garments` },
              { k: "Approx. weight", v: `${bundle.weightKg}kg` },
              { k: "Size run", v: bundle.sizeRun },
              { k: "Condition", v: bundle.condition },
              { k: "Availability", v: bundle.inStock ? "In stock" : "Sold out" },
            ].map((row) => (
              <div key={row.k} className="flex gap-6 py-3">
                <dt className="w-36 shrink-0 font-bold">{row.k}</dt>
                <dd className="text-slate">{row.v}</dd>
              </div>
            ))}
            {bundle.notes.length > 0 && (
              <div className="flex gap-6 py-3">
                <dt className="w-36 shrink-0 font-bold">Please note</dt>
                <dd className="space-y-1 text-slate">
                  {bundle.notes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-slate">
            {bundle.description.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <CategoryTags kind="brand" slugs={bundle.brandSlugs} basePath="/brands" />
            <CategoryTags kind="type" slugs={bundle.typeSlugs} basePath="/types" />
            <CategoryTags kind="collection" slugs={bundle.collectionSlugs} basePath="/collections" />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-ash bg-smoke">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <h2 className="display text-2xl sm:text-3xl">You might also want</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BundleCard key={item.slug} bundle={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
