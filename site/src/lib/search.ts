import { fromPrice, products, type Product } from "@/data/catalogue";
import { allCategories, type Category, type CategoryKind } from "@/data/taxonomy";

/**
 * Site search over the catalogue file. Everything is static, so the index is
 * built once at module load and searched in the browser — no request, no
 * latency, works offline once the page is open.
 *
 * Matching is deliberately forgiving: "t shirt", "t-shirt" and "tshirts" all
 * find the tee lots, "north face" finds the windbreaker mix through its brand
 * list, and a trailing "s" is tried without ("hoodies" → "hoodie"). Every word
 * typed has to match somewhere, so "nike jacket" narrows rather than widens.
 */

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const squash = (s: string) => norm(s).replace(/\s/g, "");

export type CategoryHit = { kind: CategoryKind; category: Category };
export type SearchResults = { products: Product[]; categories: CategoryHit[] };

const categories = allCategories();
const namesOf = (kind: CategoryKind, slugs: string[]) =>
  slugs
    .map((slug) => categories.find((c) => c.kind === kind && c.category.slug === slug)?.category.name ?? "")
    .join(" ");

const index = products.map((product) => ({
  product,
  // Name and category names count for more than a passing mention in the copy.
  strong: squash(
    [
      product.name,
      namesOf("brand", product.brandSlugs),
      namesOf("type", product.typeSlugs),
      namesOf("collection", product.collectionSlugs),
    ].join(" "),
  ),
  weak: squash([product.summary, ...product.description].join(" ")),
}));

function tokens(query: string): string[] {
  return norm(query)
    .split(" ")
    .filter((t) => t.length >= 2);
}

/** True when the token, or the token without a plural "s", appears in the text. */
function hit(text: string, token: string): boolean {
  if (text.includes(token)) return true;
  return token.length > 3 && token.endsWith("s") && text.includes(token.slice(0, -1));
}

export function searchCatalogue(query: string, limit = 12): SearchResults {
  const words = tokens(query);
  if (words.length === 0) return { products: [], categories: [] };

  const scored: { product: Product; score: number }[] = [];
  for (const { product, strong, weak } of index) {
    let score = 0;
    let matched = true;
    for (const word of words) {
      if (hit(strong, word)) score += 3;
      else if (hit(weak, word)) score += 1;
      else {
        matched = false;
        break;
      }
    }
    if (!matched) continue;
    if (product.featured) score += 1;
    if (!product.inStock) score -= 2;
    scored.push({ product, score });
  }
  scored.sort(
    (a, b) => b.score - a.score || (fromPrice(a.product) ?? Infinity) - (fromPrice(b.product) ?? Infinity),
  );

  const categoryHits = categories.filter(
    (c) => c.category.slug !== "mixed-brands" && words.every((w) => hit(squash(c.category.name), w)),
  );

  return {
    products: scored.slice(0, limit).map((s) => s.product),
    categories: categoryHits.slice(0, 6),
  };
}
