"use client";

import { useMemo, useState } from "react";
import type { Bundle } from "@/data/bundles";
import { BundleCard } from "@/components/BundleCard";
import type { Category } from "@/data/taxonomy";

type SortKey = "featured" | "pieces-desc" | "pieces-asc" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "pieces-desc", label: "Most pieces" },
  { value: "pieces-asc", label: "Fewest pieces" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

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
 * Filterable, sortable grid. Pass `lockedFilters` on a category page so the
 * page's own facet isn't offered again as a filter.
 */
export function BundleBrowser({
  bundles,
  brands,
  productTypes,
  collections,
  hide = [],
}: {
  bundles: Bundle[];
  brands: Category[];
  productTypes: Category[];
  collections: Category[];
  hide?: ("brand" | "type" | "collection")[];
}) {
  const [brand, setBrand] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [collection, setCollection] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    const filtered = bundles.filter(
      (b) =>
        (!brand || b.brandSlugs.includes(brand)) &&
        (!type || b.typeSlugs.includes(type)) &&
        (!collection || b.collectionSlugs.includes(collection)),
    );

    const sorted = [...filtered];
    switch (sort) {
      case "pieces-desc":
        sorted.sort((a, b) => b.pieces - a.pieces);
        break;
      case "pieces-asc":
        sorted.sort((a, b) => a.pieces - b.pieces);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
      case "price-desc": {
        // Unpriced bundles always sit at the end, whichever way you sort.
        sorted.sort((a, b) => {
          if (a.priceGBP === null && b.priceGBP === null) return a.name.localeCompare(b.name);
          if (a.priceGBP === null) return 1;
          if (b.priceGBP === null) return -1;
          return sort === "price-asc" ? a.priceGBP - b.priceGBP : b.priceGBP - a.priceGBP;
        });
        break;
      }
      default:
        sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }
    return sorted;
  }, [bundles, brand, type, collection, sort]);

  const hasFilters = brand !== null || type !== null || collection !== null;

  return (
    <div>
      <div className="border-y border-ash py-5">
        <div className="space-y-4">
          {!hide.includes("brand") && (
            <FilterRow label="Brand" options={brands} value={brand} onChange={setBrand} />
          )}
          {!hide.includes("type") && (
            <FilterRow label="Type" options={productTypes} value={type} onChange={setType} />
          )}
          {!hide.includes("collection") && (
            <FilterRow
              label="Collection"
              options={collections}
              value={collection}
              onChange={setCollection}
            />
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-ash pt-4">
          <p className="text-xs font-bold tracking-wide uppercase">
            {visible.length} {visible.length === 1 ? "bundle" : "bundles"}
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

          <label className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
            Sort
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

      {visible.length === 0 ? (
        <p className="py-20 text-center text-sm text-slate">
          No bundles match that combination right now. Clear a filter, or{" "}
          <a href="/contact" className="font-bold text-forest underline underline-offset-4">
            tell us what you are looking for
          </a>{" "}
          — intake changes weekly.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((bundle, i) => (
            <BundleCard key={bundle.slug} bundle={bundle} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
