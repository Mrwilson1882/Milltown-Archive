import Link from "next/link";
import type { Metadata } from "next";
import { KiloEnquiry } from "@/components/KiloEnquiry";
import { PageHeader, SeoBlock } from "@/components/PageHeader";
import { productTypes } from "@/data/taxonomy";

export const metadata: Metadata = {
  title: "Buy Vintage Wholesale By The Kilo",
  description:
    "Buy vintage clothing wholesale by the kilo in the UK — from 25kg up to 1,000kg, sorted by category. Tell us the weight and category and we will quote a rate per kilo.",
  alternates: { canonical: "/by-kilo" },
};

const steps = [
  {
    n: "01",
    title: "Pick a category and a weight",
    body: "Anything from a first 25kg through to a full tonne. Sorted by category, or mixed if you would rather we picked.",
  },
  {
    n: "02",
    title: "We quote the rate",
    body: "Rate per kilo depends on the category and the volume — larger orders land at a lower rate per kilo. We come back with the figure and what is in the current sort.",
  },
  {
    n: "03",
    title: "Pay and it ships",
    body: "We invoice for the goods and the freight together, then it goes out on a pallet or a tracked parcel depending on the weight.",
  },
];

export default function ByKiloPage() {
  return (
    <>
      <PageHeader
        eyebrow="For volume buyers"
        title="Buy by the kilo"
        intro="For shops and traders working at volume. Buy sorted vintage by weight rather than by the piece, from 25kg up to 1,000kg."
        crumbs={[{ href: "/", label: "Home" }]}
      />

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
              We sort by category first, so a kilo of polos is a kilo of polos rather than a lucky
              dip. Mixed is available too if you would rather we picked across the intake.
            </p>
            <p>
              Rate per kilo falls as the weight goes up. If you are not sure where to start, 100kg
              is the usual first order and gives a real sense of the sort before you commit to a
              pallet.
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

        <KiloEnquiry categories={productTypes.map((t) => ({ slug: t.slug, name: t.name }))} />
      </div>

      <SeoBlock heading="Vintage clothing by the kilo, UK">
        <p>
          Archive Wholesale supplies vintage clothing by the kilo to UK and European buyers, in
          increments from 25kg up to 1,000kg. Stock is sorted by category before it is weighed —
          polos and t-shirts, jumpers and sweats, jackets, footwear and accessories — so you are
          buying a known category rather than unsorted bulk.
        </p>
        <p>
          Buying by weight suits shops with an established customer and traders who move volume:
          market stalls, container buyers, and online sellers listing at pace. If you are still
          testing what sells, start with counted lots or a reseller box and move to weight once you
          know your numbers.
        </p>
      </SeoBlock>
    </>
  );
}
