/**
 * The catalogue, read once per build.
 *
 * Server-side only — it reaches for the file system. Client components receive
 * plain `Listing` objects as props instead of importing anything from here.
 */

import { importListings, type ImportReport } from "@/lib/import";
import { brandDisplayNames, productTypes, departments, edits } from "@/data/taxonomy";
import type { Listing } from "@/types/listing";

let cached: ImportReport | null = null;

export function catalogue(): ImportReport {
  cached ??= importListings();
  return cached;
}

/** Newest first, which is the order a shopper expects to browse in. */
export function allListings(): Listing[] {
  return [...catalogue().listings].sort((a, b) => b.sourceRow - a.sourceRow);
}

export function listingBySlug(slug: string): Listing | undefined {
  return catalogue().listings.find((listing) => listing.slug === slug);
}

export function listingsInType(slug: string): Listing[] {
  return allListings().filter((listing) => listing.typeSlugs.includes(slug));
}

export function listingsInDepartment(slug: string): Listing[] {
  return allListings().filter((listing) => listing.departmentSlugs.includes(slug));
}

export function listingsInEdit(slug: string): Listing[] {
  return allListings().filter((listing) => listing.editSlugs.includes(slug));
}

export function listingsByBrand(slug: string): Listing[] {
  return allListings().filter((listing) => listing.brandSlug === slug);
}

export type BrandSummary = { slug: string; name: string; count: number };

/**
 * Brands are not a hand-kept list — they are whatever the CSV contains, which
 * means a new label appears on the site the moment it appears in stock.
 */
export function allBrands(): BrandSummary[] {
  const counts = new Map<string, { name: string; count: number }>();

  for (const listing of catalogue().listings) {
    if (!listing.brandSlug || !listing.brand) continue;
    const existing = counts.get(listing.brandSlug);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(listing.brandSlug, {
        name: brandDisplayNames[listing.brandSlug] ?? listing.brand,
        count: 1,
      });
    }
  }

  return [...counts.entries()]
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function brandBySlug(slug: string): BrandSummary | undefined {
  return allBrands().find((brand) => brand.slug === slug);
}

/** Sections that actually have something in them, for navigation and tiles. */
export function stockedTypes() {
  return productTypes
    .map((section) => ({ section, count: listingsInType(section.slug).length }))
    .filter((entry) => entry.count > 0);
}

export function stockedDepartments() {
  return departments
    .map((section) => ({ section, count: listingsInDepartment(section.slug).length }))
    .filter((entry) => entry.count > 0);
}

export function stockedEdits() {
  return edits
    .map((section) => ({ section, count: listingsInEdit(section.slug).length }))
    .filter((entry) => entry.count > 0);
}

/**
 * The picture on a category tile is a real garment from that category rather
 * than an abstract pattern, wherever one has a photograph.
 */
export function coverImageFor(listings: Listing[]): string | null {
  return listings.find((listing) => listing.images.length > 0)?.images[0] ?? null;
}

/** Distinct values for the shop filters, in a sensible order. */
export function facetsFor(listings: Listing[]) {
  const sizes = new Map<string, number>();
  const colours = new Map<string, number>();
  const conditions = new Map<string, number>();
  const eras = new Map<string, number>();
  const brands = new Map<string, number>();

  const bump = (map: Map<string, number>, key: string | null) => {
    if (!key) return;
    map.set(key, (map.get(key) ?? 0) + 1);
  };

  for (const listing of listings) {
    bump(sizes, listing.size);
    bump(colours, listing.colour);
    bump(conditions, listing.conditionLabel);
    bump(eras, listing.era);
    bump(brands, listing.brand);
  }

  const toOptions = (map: Map<string, number>) =>
    [...map.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

  return {
    sizes: toOptions(sizes),
    colours: toOptions(colours),
    conditions: toOptions(conditions),
    eras: toOptions(eras),
    brands: toOptions(brands),
  };
}

export type Facets = ReturnType<typeof facetsFor>;

/** Highest price in stock, so the price slider has an honest top end. */
export function priceCeiling(listings: Listing[]): number {
  const prices = listings.map((l) => l.priceGBP).filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.ceil(Math.max(...prices)) : 100;
}
