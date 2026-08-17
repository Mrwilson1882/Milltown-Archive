import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductBrowser } from "@/components/ProductBrowser";
import { PageHeader, SeoBlock } from "@/components/PageHeader";
import {
  brands,
  categoryGroups,
  collections,
  findCategory,
  productTypes,
  type CategoryKind,
} from "@/data/taxonomy";
import { productsInCategory } from "@/data/catalogue";

const kindNoun: Record<CategoryKind, string> = {
  brand: "brand",
  type: "category",
  collection: "collection",
};

/** The /types, /brands and /collections landing pages — a grid of tiles. */
export function CategoryIndex({ kind }: { kind: CategoryKind }) {
  const group = categoryGroups.find((g) => g.kind === kind);
  if (!group) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Browse the archive"
        title={group.title}
        intro={group.intro}
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {group.items.map((category, i) => (
            <CategoryTile key={category.slug} kind={kind} category={category} priority={i < 4} />
          ))}
        </div>
      </div>
    </>
  );
}

/** A single type / brand / collection page: filtered grid plus SEO copy. */
export function CategoryDetail({ kind, slug }: { kind: CategoryKind; slug: string }) {
  const category = findCategory(kind, slug);
  if (!category) notFound();

  const group = categoryGroups.find((g) => g.kind === kind)!;
  const matching = productsInCategory(kind, slug);

  return (
    <>
      <PageHeader
        eyebrow={`${kindNoun[kind]} · ${matching.length} ${matching.length === 1 ? "product" : "products"}`}
        title={category.name}
        intro={category.blurb}
        crumbs={[
          { href: "/", label: "Home" },
          { href: group.path, label: group.title },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {matching.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate">
            Nothing made up in this {kindNoun[kind]} right now — intake changes weekly.{" "}
            <Link href="/contact" className="font-bold text-forest underline underline-offset-4">
              Ask us what is coming
            </Link>
            , or{" "}
            <Link href="/products" className="font-bold text-forest underline underline-offset-4">
              browse everything
            </Link>
            .
          </p>
        ) : (
          <ProductBrowser
            products={matching}
            brands={brands}
            productTypes={productTypes}
            collections={collections}
            hide={[kind]}
          />
        )}
      </div>

      <SeoBlock heading={`${category.name} — vintage wholesale`}>
        <p>{category.seoCopy}</p>
        <p>
          Lots are graded before dispatch and every listing states the quantities it comes in. Need
          a bigger volume, a tighter size run or current photography?{" "}
          <Link href="/contact" className="font-bold text-forest underline underline-offset-4">
            Send us an enquiry
          </Link>{" "}
          and we will build the lot from the next sort.
        </p>
      </SeoBlock>
    </>
  );
}
