import type { Metadata } from "next";
import { ProductBrowser } from "@/components/ProductBrowser";
import { PageHeader, SeoBlock } from "@/components/PageHeader";
import { products } from "@/data/catalogue";
import { brands, collections, productTypes } from "@/data/taxonomy";

export const metadata: Metadata = {
  title: "All Wholesale Products",
  description:
    "Every wholesale lot available from Archive Wholesale — vintage polos, tees, hoodies, sweats, knitwear, jackets and Birkenstocks, in quantities from five pieces to a hundred.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="The full list"
        title="All products"
        intro="Every lot we carry, with its available quantities. Filter by product, brand or collection to narrow it down."
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <ProductBrowser
          products={products}
          brands={brands}
          productTypes={productTypes}
          collections={collections}
        />
      </div>

      <SeoBlock heading="Buying vintage clothing wholesale">
        <p>
          Everything on this page is a wholesale lot of branded vintage clothing, sorted and graded
          in the UK. Most products come in a choice of quantities — five, ten, twenty-five, fifty or
          a hundred pieces — so you can test a line on a stall before buying it in depth.
        </p>
        <p>
          Lots are made up from live intake, so availability changes week to week. If you need a
          custom mix, a specific size run or a bigger volume, get in touch and we will build it from
          the next sort. We also sell by the kilo for buyers working at volume.
        </p>
      </SeoBlock>
    </>
  );
}
