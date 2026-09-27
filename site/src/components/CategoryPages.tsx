import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductBrowser } from "@/components/ProductBrowser";
import { PageHeader, SeoBlock } from "@/components/PageHeader";
import {
  brands,
  categoryGroups,
  categoryPath,
  collections,
  findCategory,
  productTypes,
  type CategoryKind,
} from "@/data/taxonomy";
import { productsInCategory, type Product } from "@/data/catalogue";

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

/**
 * Real links to the brands, garments and collections represented on this
 * page. These do the job the filter chips never could for search: a crawler
 * following "Reseller Boxes" reaches Juicy Couture, Von Dutch and Diesel by
 * name, and each brand page picks up an internal link with the brand as its
 * anchor text.
 */
function RelatedLinks({ kind, slug, matching }: { kind: CategoryKind; slug: string; matching: Product[] }) {
  const present = (list: { slug: string; name: string }[], key: "brandSlugs" | "typeSlugs" | "collectionSlugs") =>
    list.filter((c) => c.slug !== slug && c.slug !== "mixed-brands" && matching.some((p) => p[key].includes(c.slug)));
  const groups: { label: string; kind: CategoryKind; items: { slug: string; name: string }[] }[] = [
    { label: "Brands you may see", kind: "brand" as const, items: present(brands, "brandSlugs") },
    { label: "Garments", kind: "type" as const, items: present(productTypes, "typeSlugs") },
    { label: "Also in", kind: "collection" as const, items: present(collections, "collectionSlugs") },
  ].filter((g) => g.kind !== kind && g.items.length > 0);
  if (groups.length === 0) return null;

  return (
    <nav aria-label="Related pages" className="mt-12 border-t border-ash pt-8">
      <dl className="space-y-4">
        {groups.map((group) => (
          <div key={group.kind} className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <dt className="eyebrow w-40 shrink-0 text-slate">{group.label}</dt>
            <dd className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={categoryPath(group.kind, item.slug)}
                  className="border border-ash px-3 py-1 text-xs font-bold tracking-wide text-ink uppercase transition-colors hover:border-forest hover:text-forest"
                >
                  {item.name}
                </Link>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </nav>
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
            demote={kind === "type" ? "reseller-boxes" : undefined}
          />
        )}
        {matching.length > 0 && <RelatedLinks kind={kind} slug={slug} matching={matching} />}
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
