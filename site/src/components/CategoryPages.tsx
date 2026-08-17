import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryTile } from "@/components/CategoryTile";
import { BundleBrowser } from "@/components/BundleBrowser";
import { PageHeader, SeoBlock } from "@/components/PageHeader";
import {
  brands,
  categoryGroups,
  collections,
  findCategory,
  productTypes,
  type CategoryKind,
} from "@/data/taxonomy";
import { bundlesInCategory } from "@/data/bundles";

const kindNoun: Record<CategoryKind, string> = {
  brand: "brand",
  type: "product type",
  collection: "collection",
};

/** The /brands, /types and /collections landing pages — a grid of tiles. */
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

/** A single brand / type / collection page: filtered grid plus SEO copy. */
export function CategoryDetail({ kind, slug }: { kind: CategoryKind; slug: string }) {
  const category = findCategory(kind, slug);
  if (!category) notFound();

  const group = categoryGroups.find((g) => g.kind === kind)!;
  const matching = bundlesInCategory(kind, slug);

  return (
    <>
      <PageHeader
        eyebrow={`${kindNoun[kind]} · ${matching.length} ${matching.length === 1 ? "bundle" : "bundles"}`}
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
            <Link href="/bundles" className="font-bold text-forest underline underline-offset-4">
              browse everything
            </Link>
            .
          </p>
        ) : (
          <BundleBrowser
            bundles={matching}
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
          Bundles are hand-graded before dispatch and every listing states its piece count, size run
          and condition. Need a bigger volume, a tighter size run or current photography?{" "}
          <Link href="/contact" className="font-bold text-forest underline underline-offset-4">
            Send us an enquiry
          </Link>{" "}
          and we will build the lot from the next sort.
        </p>
      </SeoBlock>
    </>
  );
}
