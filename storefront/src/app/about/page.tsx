import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About the archive",
  description:
    "Milltown Archive is a Lancashire vintage clothing archive. Every piece is sorted, photographed, measured and graded by hand, and sold on its own.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A room full of one-offs"
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto max-w-[70ch] px-4 py-10 sm:px-6 lg:px-10">
        <div className="space-y-5 text-base text-ink-2">
          <p>
            Milltown Archive is a vintage clothing archive in {siteConfig.location}.
            Stock comes in by the bale and the box, and every garment is looked at
            on its own: sorted, checked over, measured, photographed and written up
            before it goes anywhere near a listing.
          </p>
          <p>
            That is the whole difference between this and a rail of the same
            hoodie in four sizes. There is one of each. The listing you are
            reading is the garment you get — that colour, that fade, that mark on
            the sleeve.
          </p>

          <h2 className="display pt-6 text-2xl text-ink">What gets written down</h2>
          <p>
            Colour is stated separately from the description, because colour is
            the hardest thing to judge from a photograph and it matters. Faults
            get their own line, so a mark is never buried three sentences into a
            paragraph about how good the piece looks. And where a field has not
            been recorded, the listing says so rather than filling the gap in.
          </p>
          <p>
            A blank faults line means <em>not stated</em>. It does not mean there
            are none. If that matters for a piece you are looking at, ask and it
            will be checked over properly before you commit.
          </p>

          <h2 className="display pt-6 text-2xl text-ink">Pricing</h2>
          <p>
            Prices are set by hand, piece by piece. Demand, era, cut and condition
            all move a price in ways a formula does not catch, so there is no
            formula. Where a piece has not been priced yet, the listing says
            &ldquo;price on request&rdquo; rather than guessing at a number.
          </p>

          <h2 className="display pt-6 text-2xl text-ink">Buying in volume</h2>
          <p>
            If you are buying to resell rather than to wear,{" "}
            <a
              href={siteConfig.wholesale.url}
              className="text-brick underline underline-offset-4"
            >
              {siteConfig.wholesale.name}
            </a>{" "}
            is the trade side of the same business — the same stock, sold by the
            box, the counted lot and the kilo.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className="bg-ink px-6 py-3 text-sm text-paper hover:bg-brick">
            Shop the archive
          </Link>
          <Link href="/contact" className="border rule px-6 py-3 text-sm hover:border-brick hover:text-brick">
            Get in touch
          </Link>
        </div>
      </div>
    </>
  );
}
