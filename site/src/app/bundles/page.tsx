import type { Metadata } from "next";
import { BundleBrowser } from "@/components/BundleBrowser";
import { PageHeader, SeoBlock } from "@/components/PageHeader";
import { bundles } from "@/data/bundles";
import { brands, collections, productTypes } from "@/data/taxonomy";

export const metadata: Metadata = {
  title: "All Wholesale Bundles",
  description:
    "Every vintage wholesale bundle currently available from Archive Wholesale. Filter branded vintage sportswear lots by brand, garment type and collection.",
  alternates: { canonical: "/bundles" },
};

export default function BundlesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The full list"
        title="All bundles"
        intro="Every lot we currently have made up, with piece counts, size runs and condition stated on each. Filter by brand, garment type or collection to narrow it down."
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <BundleBrowser
          bundles={bundles}
          brands={brands}
          productTypes={productTypes}
          collections={collections}
        />
      </div>

      <SeoBlock heading="Buying vintage clothing wholesale">
        <p>
          Every bundle on this page is a wholesale lot of branded vintage sportswear, hand-sorted
          and graded in the UK. Piece counts and approximate weights are listed so you can work out
          your cost per piece and your shipping before you commit.
        </p>
        <p>
          Bundles are made up from live intake, so the list changes week to week. If a lot you want
          has gone, or you need a custom mix — a specific brand, a specific size run, a bigger
          volume — get in touch and we will build it from the next sort.
        </p>
      </SeoBlock>
    </>
  );
}
