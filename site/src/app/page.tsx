import Link from "next/link";
import type { Metadata } from "next";
import { CategoryTile } from "@/components/CategoryTile";
import { BundleCard } from "@/components/BundleCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { brands, collections, productTypes, type Category, type CategoryKind } from "@/data/taxonomy";
import { featuredBundles } from "@/data/bundles";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Vintage Sportswear Wholesale UK — Branded Bundles",
  description:
    "Archive Wholesale supplies UK retailers with hand-graded bundles of branded vintage sportswear — Nike, Adidas, Lacoste and Ralph Lauren. Buy vintage wholesale by brand, garment type or collection.",
  alternates: { canonical: "/" },
};

/** The home grid mixes all three ways of browsing, exactly as buyers think. */
const homeTiles: { kind: CategoryKind; category: Category }[] = [
  ...brands.filter((b) => b.featured).map((category) => ({ kind: "brand" as const, category })),
  ...productTypes.filter((t) => t.featured).map((category) => ({ kind: "type" as const, category })),
  ...collections.filter((c) => c.featured).map((category) => ({ kind: "collection" as const, category })),
];

const heroTiles = homeTiles.slice(0, 4);

const steps = [
  {
    n: "01",
    title: "Pick your bundle",
    body: "Browse by brand, garment type or collection. Every lot states its piece count, size run, weight and condition before you buy.",
  },
  {
    n: "02",
    title: "Checkout or enquire",
    body: "Buy online with card, or message us on WhatsApp for current photos, custom lots and volume pricing.",
  },
  {
    n: "03",
    title: "Sorted and shipped",
    body: "Bundles are graded and packed in Manchester and go out on tracked delivery across the UK and Europe.",
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
              Branded vintage
              <br />
              sportswear,
              <br />
              <span className="text-forest">sold by the bundle.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
              Nike, Adidas, Lacoste and Ralph Lauren, hand-sorted and graded into wholesale lots for
              vintage shops, market traders and online resellers. No mystery bales — every bundle
              states what is in it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/bundles"
                className="inline-flex items-center bg-ink px-7 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest"
              >
                Shop all bundles
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
                { k: "Hand-graded", v: "Every piece" },
                { k: "Shipped from", v: "Manchester" },
                { k: "Minimum order", v: "One bundle" },
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
              <CategoryTile key={`${kind}-${category.slug}`} kind={kind} category={category} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Category grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-forest">Browse the archive</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Shop by brand, type or collection</h2>
          </div>
          <Link
            href="/bundles"
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
      </section>

      {/* ----------------------------------------------------- Featured bundles */}
      <section className="border-y border-ash bg-smoke">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-forest">In stock now</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">Featured bundles</h2>
            </div>
            <Link
              href="/bundles"
              className="text-sm font-bold tracking-wide text-forest uppercase underline underline-offset-8 hover:text-ink"
            >
              All bundles →
            </Link>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBundles.slice(0, 6).map((bundle) => (
              <BundleCard key={bundle.slug} bundle={bundle} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Brand statement */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-forest">Who we are</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">
              A wholesaler that grades like a retailer
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate">
              <p>
                {siteConfig.name} is the trade arm of {siteConfig.parent}. We buy, sort and grade
                branded vintage sportswear in {siteConfig.location}, and sell it on to the shops,
                stalls and online sellers who put it in front of customers.
              </p>
              <p>
                Everything is checked by hand. Piece counts are real counts, size runs are stated
                honestly, and where a garment carries a defect we say so rather than bury it in the
                middle of a bale. That is the whole proposition: you know what is arriving before it
                arrives.
              </p>
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center bg-ink px-7 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest"
            >
              Talk to us
            </Link>
          </div>

          <ol className="grid gap-px bg-ash sm:grid-cols-3 lg:grid-cols-1">
            {steps.map((step) => (
              <li key={step.n} className="bg-paper p-6 lg:flex lg:gap-6">
                <span className="display text-3xl text-forest lg:shrink-0">{step.n}</span>
                <div className="mt-3 lg:mt-0">
                  <h3 className="display text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --------------------------------------------------------- SEO copy block */}
      <section className="border-t border-ash bg-smoke">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="display text-2xl sm:text-3xl">Vintage clothing wholesale in the UK</h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate">
            <p>
              Archive Wholesale is a UK vintage clothing wholesaler specialising in branded vintage
              sportswear. We supply wholesale bundles of vintage Nike, Adidas, Lacoste and Ralph
              Lauren alongside mixed-brand lots, sorted into the categories that actually sell:
              track jackets, polos, hoodies, sweatshirts, tracksuits, outerwear and knitwear.
            </p>
            <p>
              Bundles are graded by hand before dispatch. Each listing states the piece count,
              approximate weight, size run and condition in plain language, so you can price your
              rail before the box lands. Trend-led collections such as Y2K and our women&apos;s
              range are picked separately, because womenswear sold as an afterthought is womenswear
              that sits on the rail.
            </p>
            <p>
              We ship across the United Kingdom and into Europe from {siteConfig.location}. Whether
              you run a vintage shop, a market stall, a Depop or Vinted operation or a growing
              online store, you can start with a single bundle and scale from there. For custom
              lots, larger volumes or current photography, get in touch — intake changes weekly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
