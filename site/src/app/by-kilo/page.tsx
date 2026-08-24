import Link from "next/link";
import type { Metadata } from "next";
import { BulkEnquiry, type BulkFormat } from "@/components/BulkEnquiry";
import { PageHeader, SeoBlock } from "@/components/PageHeader";
import { productTypes } from "@/data/taxonomy";

export const metadata: Metadata = {
  title: "Buy Vintage Wholesale In Bulk — Bags, Bales & Pallets",
  description:
    "Buy vintage clothing wholesale by the kilo in the UK — 5kg to 25kg bags, 50kg to 300kg bales and 200kg to 1,000kg pallets. Tell us the format, weight and category and we quote a rate per kilo.",
  alternates: { canonical: "/by-kilo" },
};

/**
 * Three formats by weight — the units bulk vintage is actually traded in, so a
 * buyer comparing suppliers is comparing like with like.
 */
export const bulkFormats: BulkFormat[] = [
  {
    slug: "bags",
    name: "Bags",
    range: "5kg – 25kg",
    min: 5,
    max: 25,
    quick: [5, 10, 15, 25],
    who: "Shops and online sellers buying weight for the first time, or topping up a category between intakes. Small enough to arrive on a normal courier and to sell through in a few weeks.",
  },
  {
    slug: "bales",
    name: "Bales",
    range: "50kg – 300kg",
    min: 50,
    max: 300,
    quick: [50, 100, 200, 300],
    who: "Established shops and market traders working real volume. The rate per kilo drops here, and the sort can be specified more tightly than at bag level.",
  },
  {
    slug: "pallets",
    name: "Pallets",
    range: "200kg – 1,000kg",
    min: 200,
    max: 1000,
    quick: [200, 400, 600, 1000],
    who: "Distributors, container buyers and multi-site retailers. Shipped on a pallet by freight, at the lowest rate per kilo we quote.",
  },
];

const steps = [
  {
    n: "01",
    title: "Pick a format and a weight",
    body: "A 5kg bag to a full tonne on a pallet. Sorted by category, or mixed if you would rather we picked across the intake.",
  },
  {
    n: "02",
    title: "We quote the rate",
    body: "Rate per kilo depends on the format, the category and the volume — the bigger the format, the lower the rate. You get the figure, what is in the current sort, and a delivered price.",
  },
  {
    n: "03",
    title: "Pay and it ships",
    body: "Invoiced for goods and freight together. Bags go on a tracked courier; bales and pallets go on freight, and we confirm the lead time before you commit.",
  },
];

export default function BulkPage() {
  return (
    <>
      <PageHeader
        eyebrow="For volume buyers"
        title="Bulk — bags, bales & pallets"
        intro="Buy sorted vintage by weight rather than by the piece. Three formats, from a 5kg bag to a 1,000kg pallet, quoted per kilo."
        crumbs={[{ href: "/", label: "Home" }]}
      />

      {/* ------------------------------------------------------------- Formats */}
      <section className="border-b border-ash bg-smoke">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="eyebrow text-forest">Three formats</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">Pick the one that fits your shop</h2>
          <div className="mt-9 grid gap-px bg-ash md:grid-cols-3">
            {bulkFormats.map((format) => (
              <div key={format.slug} className="flex flex-col bg-paper p-6">
                <p className="display text-2xl text-forest">{format.range}</p>
                <h3 className="display mt-1 text-xl">{format.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{format.who}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate">
            Rate per kilo falls as the format goes up. If you are not sure where to start, a 50kg
            bale is the usual first volume order and gives a real sense of the sort before you
            commit to a pallet.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------- Why, steps, enquiry */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="display text-2xl sm:text-3xl">Why buy by weight</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate">
            <p>
              Buying by the piece is the right way to start and the wrong way to scale. Once you are
              turning over a rail a week, weight is the cheaper unit — you take the sort as it comes
              and price it yourself.
            </p>
            <p>
              We sort by category first, so a bale of polos is a bale of polos rather than a lucky
              dip. Mixed is available too if you would rather we picked across the intake.
            </p>
          </div>

          <ol className="mt-9 grid gap-px bg-ash">
            {steps.map((step) => (
              <li key={step.n} className="bg-paper p-5 sm:flex sm:gap-5">
                <span className="display text-2xl text-forest sm:shrink-0">{step.n}</span>
                <div className="mt-2 sm:mt-0">
                  <h3 className="display text-base">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-sm leading-relaxed text-slate">
            Prefer to buy in counted lots?{" "}
            <Link href="/products" className="font-bold text-forest underline underline-offset-4">
              Browse the products
            </Link>{" "}
            — most come in runs from five pieces to a hundred.
          </p>
        </div>

        <BulkEnquiry
          formats={bulkFormats}
          categories={productTypes.map((t) => ({ slug: t.slug, name: t.name }))}
        />
      </div>

      <SeoBlock heading="Vintage clothing in bulk — bags, bales and pallets, UK">
        <p>
          Archive Wholesale supplies vintage clothing in bulk to UK and European buyers in three
          formats: 5kg to 25kg bags, 50kg to 300kg bales, and 200kg to 1,000kg pallets. Stock is
          sorted by category before it is weighed — polos and t-shirts, jumpers and sweats, jackets,
          footwear and accessories — so you are buying a known category rather than unsorted bulk.
        </p>
        <p>
          Buying by weight suits shops with an established customer and traders who move volume:
          market stalls, container buyers, distributors and online sellers listing at pace. If you
          are still testing what sells, start with counted lots or a reseller box and move to weight
          once you know your numbers.
        </p>
      </SeoBlock>
    </>
  );
}
