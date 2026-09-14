/** Small string helpers shared by the importer and the UI. */

/** URL-safe slug: lower case, accents folded, punctuation collapsed to dashes. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** £12.99, or £13 when the pence are zero. Never a bare number. */
export function formatGBP(pounds: number): string {
  const rounded = Math.round(pounds * 100) / 100;
  return Number.isInteger(rounded)
    ? `£${rounded}`
    : `£${rounded.toFixed(2)}`;
}

/**
 * Read a price cell. Accepts "12.99", "£12.99", "12,99" and "1,299.00";
 * returns null for anything blank or unreadable rather than guessing a number.
 */
export function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[£$€\s]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(",", ".");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/** "VeryGood" and "very_good" both become "Very Good" for display fallbacks. */
export function humanise(input: string): string {
  return input
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split a description into paragraphs, dropping blank runs. */
export function paragraphs(input: string): string[] {
  return input
    .split(/\r?\n\s*\r?\n|\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Pipe-delimited Crosslist list column ("denim|jacket|vintage") to an array. */
export function splitPipes(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Truthy test for Crosslist's TRUE/FALSE booleans. */
export function parseBoolean(raw: string | undefined): boolean {
  if (!raw) return false;
  return /^(true|yes|y|1)$/i.test(raw.trim());
}

/** Whole-word search, so "women" never matches inside another word. */
export function hasWord(haystack: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(haystack);
}
