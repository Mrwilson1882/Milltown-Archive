/**
 * Search across the archive.
 *
 * Runs on the server at request time over the in-memory catalogue — no index
 * to build, nothing to keep in step with the CSV. Every word in the query has
 * to hit something, so "lacoste large" finds a large Lacoste rather than
 * everything Lacoste plus everything large.
 */

import type { Listing } from "@/types/listing";

type Field = { text: string; weight: number };

function fieldsOf(listing: Listing): Field[] {
  return [
    { text: listing.title, weight: 6 },
    { text: listing.brand ?? "", weight: 5 },
    { text: listing.tags.join(" "), weight: 3 },
    { text: listing.size ?? "", weight: 3 },
    { text: listing.colour ?? "", weight: 2 },
    { text: listing.secondaryColour ?? "", weight: 1 },
    { text: listing.era ?? "", weight: 2 },
    { text: listing.conditionLabel ?? "", weight: 1 },
    { text: listing.sku ?? "", weight: 1 },
    { text: listing.description.join(" "), weight: 1 },
  ];
}

export function searchListings(listings: Listing[], query: string): Listing[] {
  const terms = query.toLowerCase().split(/\s+/).map((term) => term.trim()).filter(Boolean);
  if (terms.length === 0) return [];

  const scored: { listing: Listing; score: number }[] = [];

  for (const listing of listings) {
    const fields = fieldsOf(listing).map((field) => ({
      text: field.text.toLowerCase(),
      weight: field.weight,
    }));

    let total = 0;
    const everyTermHit = terms.every((term) => {
      let best = 0;
      for (const field of fields) {
        if (!field.text.includes(term)) continue;
        // A word that starts a field counts for more than one buried in it.
        const exact = new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(field.text);
        best = Math.max(best, field.weight * (exact ? 1 : 0.5));
      }
      total += best;
      return best > 0;
    });

    if (everyTermHit) scored.push({ listing, score: total });
  }

  return scored
    .sort((a, b) => b.score - a.score || b.listing.sourceRow - a.listing.sourceRow)
    .map((entry) => entry.listing);
}
