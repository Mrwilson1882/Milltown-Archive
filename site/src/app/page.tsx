import Link from "next/link";
import type { Metadata } from "next";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  brands,
  collections,
  productTypes,
  type Category,
  type CategoryKind,
} from "@/data/taxonomy";
import { featuredProducts, productsInCategory } from "@/data/catalogue";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Vintage Clothing Wholesale UK — Boxes, Lots & By The Kilo",
  description:
    "Archive Wholesale supplies UK retailers with branded vintage — Lacoste, Ralph Lauren, Nike, Champion and more. Fixed-price reseller boxes, counted lots from five pieces, or buy by the kilo.",
  alternates: { canonical: "/" },
};

/**
 * The home grid is product types then collections. Brands are deliberately left
 * out of it — they have their own page in the nav, and putting twenty-odd labels
 * here buried the way we actually sell, which is by lot.
 */
const homeTiles: { kind: CategoryKind; category: Category }[] = [
  ...productTypes.filter((t) => t.featured).map((category) => ({ kind: "type" as const, category })),
  ...collections
    .filter((c) => c.featured)
    .map((category) => ({ kind: "collection" as const, category })),
];

const heroTiles = homeTiles.slice(0, 4);
const resellerBoxes = productsInCategory("collection", "reseller-boxes");

const routes = [
  {
    title: "Reseller boxes",
    body: "Fixed-price boxes of branded pieces, made up and ready to sell. Order in one click.",
    href: "/collections/reseller-boxes",
    cta: "Shop the boxes",
  },
  {
    title: "Counted lots",
    body: "Pick a product and a lot size — five, ten, twenty-five, fifty or a hundred pieces. Test a line, then buy it in depth.",
    href: "/products",
    cta: "Browse products",
  },
  {
    title: "Bulk by weight",
    body: "For volume buyers. Bags from 5kg, bales to 300kg, pallets to a full tonne — sorted by category and quoted per kilo.",
    href: "/by-kilo",
    cta: "See how it works",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="border-b border-ash">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="eyebrow text-forest">Vintage wholesale · United Kingdom</p>
            <h1 className="display mt-5 text-4xl sm:text-6xl lg:text-7xl">
              Branded vintage,
              <br />
              <span className="text-forest">by the box,</span>
              <br />
              the lot or the kilo.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
              Lacoste, Ralph Lauren, Nike, Champion, Carhartt and more — sorted and graded in the UK
              for vintage shops, market traders and online resellers. Start with a £90 reseller box
              or buy a tonne. No mystery bales.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/collections/reseller-boxes"
                className="inline-flex items-center bg-ink px-7 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest"
              >
                Shop reseller boxes
              </Link>
              {hasWhatsApp ? (
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-forest px-7 py-4 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Enquire on WhatsApp
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex items-center border-2 border-forest px-7 py-4 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
                >
                  Trade enquiries
                </Link>
              )}
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ash pt-6">
              {[
                { k: "Boxes from", v: "£90" },
                { k: "Lots from", v: "5 pieces" },
                { k: "Bulk to", v: "1,000kg" },
              ].map((stat) => (
                <div key={stat.k}>
                  <dt className="eyebrow text-slate">{stat.k}</dt>
                  <dd className="display mt-1 text-sm sm:text-base">{stat.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {heroTiles.map(({ kind, category }, i) => (
              <CategoryTile
                key={`${kind}-${category.slug}`}
                kind={kind}
                category={category}
                priority={i < 2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Three ways to buy */}
      <section className="border-b border-ash bg-smoke">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="eyebrow text-forest">Three ways to buy</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">However you are set up</h2>
          <div className="mt-9 grid gap-px bg-ash md:grid-cols-3">
            {routes.map((route) => (
              <div key={route.href} className="flex flex-col bg-paper p-6">
                <h3 className="display text-xl">{route.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{route.body}</p>
                <Link
                  href={route.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold tracking-wide text-forest uppercase underline underline-offset-8 hover:text-ink"
                >
                  {route.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Reseller boxes */}
      {resellerBoxes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-forest">Ready to go</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">Reseller boxes</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">
                Ten or twenty designer pieces, made up and priced. Nothing to specify, nothing to
                quote — the quickest way to start.
              </p>
            </div>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resellerBoxes.map((product, i) => (
              <ProductCard key={product.slug} product={product} priority={i < 2} />
            ))}
            <div className="flex flex-col justify-center border-2 border-dashed border-ash p-8 text-center">
              <p className="display text-lg">More boxes coming</p>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                Tell us what sells for you and we will make up a box to suit — brand-led,
                garment-led or sized to your rail.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center justify-center self-center border-2 border-forest px-6 py-3 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
              >
                Ask for a custom box
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------- Category grid */}
      <section className="border-y border-ash bg-smoke">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-forest">Browse the archive</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">
                Shop by product or collection
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold tracking-wide text-forest uppercase underline underline-offset-8 hover:text-ink"
            >
              View everything →
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {homeTiles.map(({ kind, category }) => (
              <CategoryTile key={`${kind}-${category.slug}`} kind={kind} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-forest">In stock now</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Popular lots</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold tracking-wide text-forest uppercase underline underline-offset-8 hover:text-ink"
          >
            All products →
          </Link>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts
            .filter((p) => !p.collectionSlugs.includes("reseller-boxes"))
            .slice(0, 6)
            .map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
        </div>
      </section>

      {/* ------------------------------------------------------- Brand statement */}
      <section className="border-t border-ash">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow text-forest">Who we are</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">
                A wholesaler that grades like a retailer
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate">
                <p>
                  {siteConfig.name} is the trade arm of {siteConfig.parent}. We buy, sort and grade
                  branded vintage in {siteConfig.location}, and sell it on to the shops, stalls and
                  online sellers who put it in front of customers.
                </p>
                <p>
                  Everything is checked by hand. Counts are real counts, and where a garment carries
                  a defect we say so rather than bury it in the middle of a bale. That is the whole
                  proposition: you know what is arriving before it arrives.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center bg-ink px-7 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest"
              >
                Talk to us
              </Link>
            </div>

            <div className="bg-smoke p-8">
              <h3 className="display text-xl">What we carry</h3>
              <ul className="mt-5 grid gap-x-8 gap-y-2.5 text-sm sm:grid-cols-2">
                {[
                  ...productTypes.map((t) => ({ href: `/types/${t.slug}`, label: t.name })),
                  ...brands.slice(0, 5).map((b) => ({ href: `/brands/${b.slug}`, label: b.name })),
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-semibold transition-colors hover:text-forest"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- SEO copy block */}
      <section className="border-t border-ash bg-smoke">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="display text-2xl sm:text-3xl">Vintage clothing wholesale in the UK</h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate">
            <p>
              Archive Wholesale is a UK vintage clothing wholesaler supplying branded vintage to
              retailers, market traders and online sellers. We carry Lacoste and Ralph Lauren polos,
              mixed branded tee lots, Carhartt and Dickies workwear, designer knitwear,
              premium vintage hoodies and sweatshirts, Lacoste knitwear, festival track jackets,
              designer outerwear and Birkenstock sandals.
            </p>
            <p>
              Buy however suits your business. Fixed-price reseller boxes, from ten pieces up,
              are made up and ready to sell. Counted lots run from five pieces to a hundred, so you
              can test a line before you commit. And for volume buyers we sell by the kilo, in
              increments up to 1,000kg, sorted by category rather than shipped as unsorted bulk.
            </p>
            <p>
              We ship across the United Kingdom and into Europe from {siteConfig.location}. Whether
              you run a vintage shop, a market stall, a Depop or Vinted operation or a growing
              online store, you can start with a single box and scale from there. For custom lots,
              larger volumes or current photography, get in touch — intake changes weekly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
