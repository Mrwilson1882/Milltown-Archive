import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms you buy under at Milltown Archive.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms" crumbs={[{ href: "/", label: "Home" }]} />

      <div className="mx-auto max-w-[70ch] px-4 py-10 sm:px-6 lg:px-10">
        <div className="space-y-5 text-base text-ink-2">
          <p>
            This shop is operated by {siteConfig.legalName}, a company registered
            in England and Wales, number {siteConfig.companyNumber}, trading as{" "}
            {siteConfig.name}.
          </p>

          <h2 className="display pt-4 text-2xl text-ink">One of each</h2>
          <p>
            Every listing is a single second-hand garment. Once it sells it comes
            down and cannot be reordered. Where two pieces look alike, they are
            still two different garments with their own condition and their own
            listing.
          </p>

          <h2 className="display pt-4 text-2xl text-ink">Condition</h2>
          <p>
            Everything sold here is used unless the listing says otherwise, and is
            described as accurately as we can manage — see the{" "}
            <Link href="/condition-guide" className="text-brick underline underline-offset-4">
              condition guide
            </Link>
            . Colours shift between screens, and vintage sizing varies; ask for
            measurements before ordering if fit is tight.
          </p>

          <h2 className="display pt-4 text-2xl text-ink">Prices and orders</h2>
          <p>
            Prices are in pounds sterling and include VAT where it applies. A
            listing marked &ldquo;price on request&rdquo; has not been priced yet and
            is not on sale until it has been. Your order is accepted when we
            confirm it by email; until then we can decline it — for instance if a
            piece has sold elsewhere in the meantime — and refund you in full.
          </p>

          <h2 className="display pt-4 text-2xl text-ink">Returns</h2>
          <p>
            Your cancellation and return rights are set out on the{" "}
            <Link href="/delivery-returns" className="text-brick underline underline-offset-4">
              delivery &amp; returns
            </Link>{" "}
            page. Nothing in these terms reduces your statutory rights.
          </p>

          <h2 className="display pt-4 text-2xl text-ink">Law</h2>
          <p>
            These terms are governed by the law of England and Wales, and the
            courts of England and Wales have jurisdiction.
          </p>
        </div>
      </div>
    </>
  );
}
