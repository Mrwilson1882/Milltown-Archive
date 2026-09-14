"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { formatGBP } from "@/lib/text";
import type { Listing } from "@/types/listing";

/**
 * The filterable grid every browsing page renders.
 *
 * Filtering happens in the browser over the whole section, which is what makes
 * it instant: the catalogue is one-of-one stock measured in hundreds, not
 * hundreds of thousands, so there is nothing to gain by going back to a server
 * for every tick box.
 *
 * Facet counts are worked out with that facet's own selection lifted out, so
 * ticking "Large" does not knock every other size down to zero — the counts
 * keep telling you what is there if you change your mind.
 */

type FacetKey = "brand" | "size" | "colour" | "condition" | "era";

type Selections = Record<FacetKey, string[]>;

const EMPTY: Selections = { brand: [], size: [], colour: [], condition: [], era: [] };

const FACET_LABELS: Record<FacetKey, string> = {
  brand: "Brand",
  size: "Size",
  colour: "Colour",
  condition: "Condition",
  era: "Era",
};

type Sort = "newest" | "price-asc" | "price-desc" | "title";

const SORT_LABELS: Record<Sort, string> = {
  newest: "Newest first",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  title: "A to Z",
};

function valueOf(listing: Listing, facet: FacetKey): string | null {
  switch (facet) {
    case "brand": return listing.brand;
    case "size": return listing.size;
    case "colour": return listing.colour;
    case "condition": return listing.conditionLabel;
    case "era": return listing.era;
  }
}

export function ShopBrowser({
  listings,
  priceCeiling,
  emptyMessage = "Nothing in here just yet.",
}: {
  listings: Listing[];
  priceCeiling: number;
  emptyMessage?: string;
}) {
  const [selections, setSelections] = useState<Selections>(EMPTY);
  const [maxPrice, setMaxPrice] = useState<number>(priceCeiling);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("newest");
  const [panelOpen, setPanelOpen] = useState(false);

  /** Does a listing pass? `skip` lifts one facet out, for counting. */
  const passes = useMemo(
    () => (listing: Listing, skip?: FacetKey) => {
      for (const facet of Object.keys(FACET_LABELS) as FacetKey[]) {
        if (facet === skip) continue;
        const chosen = selections[facet];
        if (chosen.length === 0) continue;
        const value = valueOf(listing, facet);
        if (!value || !chosen.includes(value)) return false;
      }
      if (inStockOnly && !listing.inStock) return false;
      // A piece with no price is never filtered out by a price cap — there is
      // no number to compare, and hiding it would hide real stock.
      if (listing.priceGBP !== null && listing.priceGBP > maxPrice) return false;
      return true;
    },
    [selections, inStockOnly, maxPrice],
  );

  const visible = useMemo(() => {
    const filtered = listings.filter((listing) => passes(listing));

    return filtered.sort((a, b) => {
      switch (sort) {
        case "price-asc":
        case "price-desc": {
          // Unpriced pieces sit at the end of either ordering rather than
          // pretending to be worth nothing.
          if (a.priceGBP === null) return b.priceGBP === null ? 0 : 1;
          if (b.priceGBP === null) return -1;
          return sort === "price-asc" ? a.priceGBP - b.priceGBP : b.priceGBP - a.priceGBP;
        }
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return b.sourceRow - a.sourceRow;
      }
    });
  }, [listings, passes, sort]);

  const facets = useMemo(() => {
    const result = {} as Record<FacetKey, { value: string; count: number }[]>;

    for (const facet of Object.keys(FACET_LABELS) as FacetKey[]) {
      const counts = new Map<string, number>();
      for (const listing of listings) {
        if (!passes(listing, facet)) continue;
        const value = valueOf(listing, facet);
        if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
      }
      result[facet] = [...counts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
    }

    return result;
  }, [listings, passes]);

  const activeCount =
    Object.values(selections).reduce((total, values) => total + values.length, 0) +
    (inStockOnly ? 1 : 0) +
    (maxPrice < priceCeiling ? 1 : 0);

  const toggle = (facet: FacetKey, value: string) =>
    setSelections((current) => ({
      ...current,
      [facet]: current[facet].includes(value)
        ? current[facet].filter((entry) => entry !== value)
        : [...current[facet], value],
    }));

  const reset = () => {
    setSelections(EMPTY);
    setMaxPrice(priceCeiling);
    setInStockOnly(false);
  };

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <p className="eyebrow">Maximum price</p>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={1}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="mt-3 w-full accent-[var(--color-brick)]"
          aria-label="Maximum price"
        />
        <p className="numeric mt-1 text-sm text-ink-2">
          Up to {formatGBP(maxPrice)}
        </p>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(event) => setInStockOnly(event.target.checked)}
          className="h-4 w-4 accent-[var(--color-brick)]"
        />
        Available only
      </label>

      {(Object.keys(FACET_LABELS) as FacetKey[]).map((facet) => {
        const options = facets[facet];
        if (options.length === 0) return null;

        return (
          <fieldset key={facet}>
            <legend className="eyebrow">{FACET_LABELS[facet]}</legend>
            <div className="mt-3 max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selections[facet].includes(option.value)}
                    onChange={() => toggle(facet, option.value)}
                    className="h-4 w-4 shrink-0 accent-[var(--color-brick)]"
                  />
                  <span className="truncate">{option.value}</span>
                  <span className="numeric ml-auto text-xs text-ink-3">{option.count}</span>
                </label>
              ))}
            </div>
          </fieldset>
        );
      })}

      {activeCount > 0 && (
        <button type="button" onClick={reset} className="text-sm text-brick hover:underline">
          Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );

  return (
    <div className="lg:flex lg:gap-12">
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-6">
          {filterPanel}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex flex-wrap items-center gap-3 border-b rule pb-4">
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="border rule px-3 py-1.5 text-sm lg:hidden"
          >
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>

          <p className="numeric text-sm text-ink-3">
            {visible.length} {visible.length === 1 ? "piece" : "pieces"}
          </p>

          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="sr-only sm:not-sr-only sm:text-ink-3">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              className="border rule bg-paper px-2 py-1.5 text-sm"
            >
              {(Object.keys(SORT_LABELS) as Sort[]).map((option) => (
                <option key={option} value={option}>
                  {SORT_LABELS[option]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <div className="py-20 text-center">
            <p className="display text-2xl">{emptyMessage}</p>
            {activeCount > 0 && (
              <button type="button" onClick={reset} className="mt-3 text-sm text-brick hover:underline">
                Clear the filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((listing, index) => (
              <ProductCard
                key={listing.slug}
                listing={listing}
                priority={index < 4}
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 22vw"
              />
            ))}
          </div>
        )}
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setPanelOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-paper p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="display text-xl">Filters</p>
              <button type="button" onClick={() => setPanelOpen(false)} className="p-2" aria-label="Close filters">
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                  <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="mt-8 w-full bg-ink py-3 text-sm text-paper"
            >
              Show {visible.length} {visible.length === 1 ? "piece" : "pieces"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
