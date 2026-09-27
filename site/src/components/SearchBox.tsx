"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { coverImage, fromPrice, quantityLabel } from "@/data/catalogue";
import { categoryPath } from "@/data/taxonomy";
import { trackEvent } from "@/lib/analytics";
import { perPiece } from "@/lib/format";
import { searchCatalogue } from "@/lib/search";

export function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

/**
 * The search field with live suggestions underneath as you type. Enter, or
 * the button, goes to the full results page; a suggestion goes straight to
 * the product. Suggestions come from the same matcher as the results page,
 * so what you see in the dropdown is what the page would show first.
 */
export function SearchBox({
  initialQuery = "",
  autoFocus = false,
  suggest = true,
  onNavigate,
}: {
  initialQuery?: string;
  autoFocus?: boolean;
  /** Show the dropdown of live matches under the field. */
  suggest?: boolean;
  /** Called when a result is chosen or a search submitted, so a header can close. */
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => (suggest ? searchCatalogue(query, 5) : null), [query, suggest]);
  const showList = Boolean(results) && query.trim().length >= 2;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    trackEvent("search", { query: q.toLowerCase().slice(0, 80), results: searchCatalogue(q).products.length });
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="relative">
      <form role="search" onSubmit={submit} className="flex border-2 border-ink bg-paper focus-within:border-forest">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search products and brands
        </label>
        <input
          id={`${listId}-input`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Search lots, brands, garments…"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={showList ? listId : undefined}
          aria-expanded={showList}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-slate"
        />
        <button
          type="submit"
          aria-label="Search"
          className="inline-flex items-center gap-2 bg-ink px-4 text-paper transition-colors hover:bg-forest"
        >
          <SearchIcon />
          <span className="hidden text-sm font-bold tracking-wide uppercase sm:inline">Search</span>
        </button>
      </form>

      {showList && results && (
        <div
          id={listId}
          className="absolute inset-x-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto border-2 border-ink bg-paper shadow-xl"
        >
          {results.products.length === 0 && results.categories.length === 0 ? (
            <p className="px-4 py-4 text-sm text-slate">
              Nothing matches “{query.trim()}”. Try a brand, a garment, or press Enter to search everything.
            </p>
          ) : (
            <>
              {results.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 border-b border-ash px-4 py-3">
                  {results.categories.map(({ kind, category }) => (
                    <Link
                      key={`${kind}-${category.slug}`}
                      href={categoryPath(kind, category.slug)}
                      onClick={onNavigate}
                      className="border border-forest px-3 py-1 text-xs font-bold tracking-wide text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
              <ul>
                {results.products.map((product) => {
                  const cover = coverImage(product);
                  const price = fromPrice(product);
                  const cheapest = product.variants
                    .filter((v) => v.priceGBP !== null)
                    .sort((a, b) => a.priceGBP! / a.pieces - b.priceGBP! / b.pieces)[0];
                  return (
                    <li key={product.slug} className="border-b border-ash last:border-b-0">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onNavigate}
                        className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-smoke"
                      >
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-smoke">
                          <Image
                            src={cover.src}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="display block truncate text-sm">{product.name}</span>
                          <span className="block text-xs text-slate">
                            {product.inStock ? `Lots of ${quantityLabel(product)}` : "Sold out"}
                          </span>
                        </span>
                        {price !== null && cheapest && (
                          <span className="shrink-0 text-sm font-bold">
                            <span className="mr-1 text-xs font-semibold text-slate">from</span>
                            {perPiece(cheapest.priceGBP as number, cheapest.pieces)}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={submit}
                className="block w-full px-4 py-3 text-left text-xs font-bold tracking-wide text-forest uppercase hover:bg-smoke"
              >
                See all results for “{query.trim()}” →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
