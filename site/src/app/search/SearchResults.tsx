"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { EnquiryActions } from "@/components/EnquiryActions";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { categoryPath } from "@/data/taxonomy";
import { searchCatalogue } from "@/lib/search";

export function SearchResults() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const results = useMemo(() => searchCatalogue(query, 60), [query]);
  const count = results.products.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <SearchBox key={query} initialQuery={query} suggest={false} autoFocus={query.length === 0} />
      </div>

      {query.length > 0 && (
        <p className="mt-6 text-sm text-slate" aria-live="polite">
          {count === 0 ? "No lots match" : `${count} ${count === 1 ? "lot matches" : "lots match"}`}{" "}
          <span className="font-bold text-ink">“{query}”</span>
        </p>
      )}

      {results.categories.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold tracking-wide text-slate uppercase">Browse</span>
          {results.categories.map(({ kind, category }) => (
            <Link
              key={`${kind}-${category.slug}`}
              href={categoryPath(kind, category.slug)}
              className="border border-forest px-3 py-1 text-xs font-bold tracking-wide text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {count > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.products.map((product, i) => (
            <ProductCard key={product.slug} product={product} priority={i < 3} />
          ))}
        </div>
      )}

      {query.length > 0 && count === 0 && (
        <div className="mt-10 max-w-xl border border-ash bg-smoke p-6">
          <p className="display text-lg">Not listed, but we may well have it.</p>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            Intake changes weekly and not everything is made up into a lot on the site. Tell us what
            you are after and we will say what is in.
          </p>
          <div className="mt-5">
            <EnquiryActions
              subject={`Stock enquiry: ${query}`}
              message={`Hi Archive Wholesale, I searched your site for "${query}". Do you have anything like that in?`}
              source="search"
              compact
            />
          </div>
        </div>
      )}
    </div>
  );
}
