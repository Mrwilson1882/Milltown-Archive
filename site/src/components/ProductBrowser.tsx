"use client";

import { useMemo, useState } from "react";
import { fromPrice, type Product } from "@/data/catalogue";
import { ProductCard } from "@/components/ProductCard";
import type { Category } from "@/data/taxonomy";

type SortKey = "featured" | "price-asc" | "price-desc" | "lot-desc" | "lot-asc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "lot-desc", label: "Largest lot size" },
  { value: "lot-asc", label: "Smallest lot size" },
  { value: "name", label: "Name A–Z" },
];

/** Biggest lot a product offers, for sorting. */
function maxLot(product: Product): number {
  return product.variants.reduce((max, v) => Math.max(max, v.pieces), 0);
}

/** Smallest lot a product offers — the entry point for a first order. */
function minLot(product: Product): number {
  return product.variants.reduce(
    (min, v) => Math.min(min, v.pieces),
    product.variants[0]?.pieces ?? Number.MAX_SAFE_INTEGER,
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Category[];
  value: string | null;
  onChange: (next: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
      <span className="eyebrow w-20 shrink-0 text-slate">{label}</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-pressed={value === null}
          className={`border px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors ${
            value === null
              ? "border-forest bg-forest text-paper"
              : "border-ash text-ink hover:border-ink"
          }`}
        >
          All
        </button>
        {options.map((option) => (
          <button
            key={option.slug}
            type="button"
            onClick={() => onChange(value === option.slug ? null : option.slug)}
            aria-pressed={value === option.slug}
            className={`border px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors ${
              value === option.slug
                ? "border-forest bg-forest text-paper"
                : "border-ash text-ink hover:border-ink"
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Filterable, sortable grid. Pass `hide` on a category page so the page's own
 * facet isn't offered again as a filter.
 */
export function ProductBrowser({
  products,
  brands,
  productTypes,
  collections,
  hide = [],
  demote,
}: {
  products: Product[];
  brands: Category[];
  productTypes: Category[];
  collections: Category[];
  hide?: ("brand" | "type" | "collection")[];
  /**
   * Collection whose lots sink to the bottom of the default order. On a
   * product-type page the counted lots are the point — a polos page should
   * lead with the Lacoste and Ralph Lauren polos, not the mixed starter boxes
   * that happen to contain a polo or two.
   */
  demote?: string;
}) {
  const [brand, setBrand] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [collection, setCollection] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");
  // Filters stay folded away until asked for. On a page with a handful of
  // lots the products are the point; a wall of brand chips above them was
  // pulling the eye. They are buttons, not links, so hiding them costs
  // nothing in search — the crawlable brand and category links sit under
  // the grid instead.
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Only offer options that would actually match something on this page.
  // Cheap enough to do each render: a few dozen products, a few dozen slugs.
  const present = (list: Category[], key: "brandSlugs" | "typeSlugs" | "collectionSlugs") =>
    list.filter((c) => products.some((p) => p[key].includes(c.slug)));
  const options = {
    types: hide.includes("type") ? [] : present(productTypes, "typeSlugs"),
    brands: hide.includes("brand") ? [] : present(brands, "brandSlugs"),
    collections: hide.includes("collection") ? [] : present(collections, "collectionSlugs"),
  };

  const visible = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (!brand || p.brandSlugs.includes(brand)) &&
        (!type || p.typeSlugs.includes(type)) &&
        (!collection || p.collectionSlugs.includes(collection)),
    );

    const isDemoted = (p: Product) => demote !== undefined && p.collectionSlugs.includes(demote);

    const sorted = [...filtered];
    switch (sort) {
      case "lot-desc":
        sorted.sort((a, b) => maxLot(b) - maxLot(a));
        break;
      case "lot-asc":
        sorted.sort((a, b) => minLot(a) - minLot(b));
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
      case "price-desc": {
        // Unpriced products always sit at the end, whichever way you sort.
        sorted.sort((a, b) => {
          const pa = fromPrice(a);
          const pb = fromPrice(b);
          if (pa === null && pb === null) return a.name.localeCompare(b.name);
          if (pa === null) return 1;
          if (pb === null) return -1;
          return sort === "price-asc" ? pa - pb : pb - pa;
        });
        break;
      }
      default:
        sorted.sort(
          (a, b) =>
            Number(isDemoted(a)) - Number(isDemoted(b)) ||
            Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
        );
    }
    return sorted;
  }, [products, brand, type, collection, sort, demote]);

  const hasFilters = brand !== null || type !== null || collection !== null;
  const activeCount = [brand, type, collection].filter((v) => v !== null).length;
  // A facet with one option filters nothing; a page with three lots needs no filter at all.
  const rows = [
    { key: "type", label: "Product", options: options.types, value: type, onChange: setType },
    { key: "brand", label: "Brand", options: options.brands, value: brand, onChange: setBrand },
    { key: "collection", label: "Collection", options: options.collections, value: collection, onChange: setCollection },
  ].filter((row) => row.options.length >= 2);
  const canFilter = rows.length > 0 && products.length > 3;
  const showPanel = canFilter && (filtersOpen || hasFilters);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-ash py-3">
        <p className="text-xs font-bold tracking-wide uppercase">
          {visible.length} {visible.length === 1 ? "product" : "products"}
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setBrand(null);
                setType(null);
                setCollection(null);
              }}
              className="ml-3 font-bold text-forest underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </p>

        <div className="flex items-center gap-2">
          {canFilter && (
            <button
              type="button"
              onClick={() => setFiltersOpen(!showPanel)}
              aria-expanded={showPanel}
              aria-controls="browser-filters"
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors ${
                showPanel ? "border-forest text-forest" : "border-ash text-ink hover:border-ink"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filter
              {activeCount > 0 && <span className="text-forest">({activeCount})</span>}
            </button>
          )}

          <label className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-ash bg-paper px-3 py-1.5 text-xs font-bold uppercase focus:border-forest focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {showPanel && (
        <div id="browser-filters" className="space-y-4 border-b border-ash py-5">
          {rows.map((row) => (
            <FilterRow
              key={row.key}
              label={row.label}
              options={row.options}
              value={row.value}
              onChange={row.onChange}
            />
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-20 text-center text-sm text-slate">
          Nothing matches that combination right now. Clear a filter, or{" "}
          <a href="/contact" className="font-bold text-forest underline underline-offset-4">
            tell us what you are looking for
          </a>{" "}
          — intake changes weekly.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) => (
            <ProductCard key={product.slug} product={product} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
