/**
 * ===========================================================================
 * THE IMPORTER
 * ===========================================================================
 *
 * The shop is built from one file: `data/listings.csv`, which is the same
 * Crosslist listing export that is uploaded to the marketplaces. Nothing is
 * typed twice — one CSV feeds Crosslist and this site.
 *
 * Two optional lookups sit beside it, both exported from the same Crosslist
 * workbook. They are optional because the site works without them; supplying
 * them just makes sizes and categories read properly:
 *
 *   data/categories.csv   the workbook's "Categories" sheet  (id → name)
 *   data/sizes.csv        the workbook's "Sizes" sheet       (id → name)
 *
 * Crosslist stores both as opaque ids, so without these files a size id is a
 * UUID and there is nothing honest to print. In that case the size is simply
 * left off the listing rather than filled in with a guess.
 *
 * This module runs at build time only. It reads from disk, so it must never be
 * imported from a client component — go through `src/data/catalogue.ts`.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseCsvRecords } from "@/lib/csv";
import {
  humanise,
  parseBoolean,
  parsePrice,
  paragraphs,
  slugify,
  splitPipes,
} from "@/lib/text";
import {
  departmentSlugsFor,
  editSlugsFor,
  typeSlugsFor,
  NEW_IN_COUNT,
  type ClassifyInput,
} from "@/lib/classify";
import { brandDisplayNames } from "@/data/taxonomy";
import type { ConditionCode, Listing } from "@/types/listing";

const DATA_DIR = join(process.cwd(), "data");

/* -------------------------------------------------------------------------
   Columns
   ------------------------------------------------------------------------- */

/**
 * Every column the importer understands, keyed by the canonical Crosslist
 * field name. `aliases` covers the other spellings a column arrives under —
 * the repository's own `inventory.csv`, and the usual Shopify and eBay
 * variants — so an export does not have to be reshaped before it is used.
 *
 * `private` marks a column that is read but never rendered. Cost of goods and
 * internal notes are in the same file as the public listing and must not leak
 * onto a product page.
 */
type FieldSpec = { aliases: string[]; private?: boolean };

const FIELDS = {
  id: { aliases: ["id", "listing id", "crosslist id"] },
  title: { aliases: ["title", "product name", "name", "item name"] },
  description: { aliases: ["description", "colour clarity/description", "colour clarity description", "details"] },
  price: { aliases: ["price", "sale price"] },
  originalPrice: { aliases: ["original price", "compare at price", "compare-at price", "rrp", "msrp"] },
  brand: { aliases: ["brand", "make", "manufacturer"] },
  categoryId: { aliases: ["category id", "category"] },
  sizeId: { aliases: ["size id"] },
  size: { aliases: ["size", "size text"] },
  condition: { aliases: ["condition", "item condition"] },
  colour: { aliases: ["color", "colour", "primary color", "primary colour"] },
  secondaryColour: { aliases: ["secondary color", "secondary colour"] },
  images: { aliases: ["images", "image", "photo", "photos", "image url", "picture"] },
  quantity: { aliases: ["quantity", "qty", "stock"] },
  shippingWeight: { aliases: ["shipping weight"] },
  shippingWeightUnit: { aliases: ["shipping weight unit"] },
  shippingHeight: { aliases: ["shipping height"] },
  shippingWidth: { aliases: ["shipping width"] },
  shippingLength: { aliases: ["shipping length"] },
  domesticShipping: { aliases: ["domestic shipping price"] },
  worldwideShipping: { aliases: ["worldwide shipping price"] },
  freeDomestic: { aliases: ["free domestic shipping"] },
  freeWorldwide: { aliases: ["free worldwide shipping"] },
  tags: { aliases: ["tags", "keywords"] },
  sku: { aliases: ["sku", "stock keeping unit"] },
  whoMade: { aliases: ["who made"], private: true },
  whenMade: { aliases: ["when made", "era", "decade"] },
  smartPricing: { aliases: ["smart pricing"], private: true },
  smartPricingPrice: { aliases: ["smart pricing price"], private: true },
  acceptOffers: { aliases: ["accept offers"] },
  isAuction: { aliases: ["is auction"], private: true },
  auctionStartingPrice: { aliases: ["auction starting price"], private: true },
  internalNote: { aliases: ["internal note"], private: true },
  costOfGoods: { aliases: ["cost of goods"], private: true },
  // Columns the repository's own ledger carries that Crosslist does not.
  defects: { aliases: ["defects", "faults"] },
  dateAdded: { aliases: ["date added", "added"] },
  itemNo: { aliases: ["item no.", "item no", "item number"], private: true },
} satisfies Record<string, FieldSpec>;

type FieldName = keyof typeof FIELDS;

/** Case, spacing and punctuation are all noise when comparing header names. */
function normaliseHeader(header: string): string {
  return header.toLowerCase().replace(/\s+/g, " ").replace(/[_]+/g, " ").trim();
}

const ALIAS_TO_FIELD = new Map<string, FieldName>();
for (const [field, spec] of Object.entries(FIELDS) as [FieldName, FieldSpec][]) {
  ALIAS_TO_FIELD.set(normaliseHeader(field.replace(/([a-z])([A-Z])/g, "$1 $2")), field);
  for (const alias of spec.aliases) ALIAS_TO_FIELD.set(normaliseHeader(alias), field);
}

/** Map the headers actually present in the file onto canonical field names. */
function resolveHeaders(headers: string[]): {
  columnFor: Map<FieldName, string>;
  unrecognised: string[];
} {
  const columnFor = new Map<FieldName, string>();
  const unrecognised: string[] = [];

  for (const header of headers) {
    const field = ALIAS_TO_FIELD.get(normaliseHeader(header));
    if (!field) {
      unrecognised.push(header);
      continue;
    }
    // First spelling wins, so a file carrying both "Size id" and "Size" keeps
    // whichever came first rather than flip-flopping between them.
    if (!columnFor.has(field)) columnFor.set(field, header);
  }

  return { columnFor, unrecognised };
}

/* -------------------------------------------------------------------------
   Value maps
   ------------------------------------------------------------------------- */

const CONDITION_LABELS: Record<ConditionCode, string> = {
  NewWithTags: "New with tags",
  NewWithoutTags: "New without tags",
  VeryGood: "Very good",
  Good: "Good",
  Fair: "Fair",
  Poor: "Poor",
};

/** Accepts the Crosslist code, and the way the same grade is spoken aloud. */
const CONDITION_ALIASES: Record<string, ConditionCode> = {
  newwithtags: "NewWithTags",
  newwithtag: "NewWithTags",
  bnwt: "NewWithTags",
  newwithouttags: "NewWithoutTags",
  bnwot: "NewWithoutTags",
  verygood: "VeryGood",
  verygoodcondition: "VeryGood",
  verygoodvintagecondition: "VeryGood",
  excellent: "VeryGood",
  good: "Good",
  goodcondition: "Good",
  goodvintagecondition: "Good",
  fair: "Fair",
  faircondition: "Fair",
  poor: "Poor",
  poorcondition: "Poor",
};

const ERA_LABELS: Record<string, string> = {
  MadeToOrder: "Made to order",
  From2020To2026: "2020s",
  From2010To2019: "2010s",
  From2007To2009: "2007–2009",
  From2000To2006: "2000–2006",
  From1990s: "1990s",
  From1980s: "1980s",
  From1970s: "1970s",
  From1960s: "1960s",
  From1950s: "1950s",
  From1940s: "1940s",
  From1930s: "1930s",
  From1920s: "1920s",
  From1910s: "1910s",
  From1900s: "1900s",
  From1800s: "1800s",
  From1700s: "1700s",
  Before1700: "Before 1700",
  Before2007: "Before 2007",
};

/* -------------------------------------------------------------------------
   Lookups
   ------------------------------------------------------------------------- */

/**
 * Read an id → name lookup out of an exported Crosslist sheet. The export has
 * no fixed column order, so the id column is whichever header contains "id"
 * and the name column is the first that does not.
 */
function readLookup(fileName: string): Map<string, string> {
  const path = join(DATA_DIR, fileName);
  const lookup = new Map<string, string>();
  if (!existsSync(path)) return lookup;

  const { headers, rows } = parseCsvRecords(readFileSync(path, "utf8"));
  const idHeader = headers.find((h) => /\bid\b/i.test(h));
  const nameHeader = headers.find((h) => h !== idHeader && /name|category|size|label|title/i.test(h));
  if (!idHeader || !nameHeader) return lookup;

  for (const row of rows) {
    const id = row[idHeader];
    const name = row[nameHeader];
    if (id && name) lookup.set(id.trim(), name.trim());
  }
  return lookup;
}

/* -------------------------------------------------------------------------
   The import
   ------------------------------------------------------------------------- */

export type ImportReport = {
  listings: Listing[];
  /** Header names in the file that the importer does not know. */
  unrecognisedColumns: string[];
  /** Canonical columns the file does not carry at all. */
  missingColumns: FieldName[];
  /** One line per row that could not be used, or was used with a caveat. */
  warnings: string[];
  /** Where the catalogue was read from, for the check script to print. */
  source: string;
  /** True when no CSV was found and the shop is running empty. */
  empty: boolean;
};

/** Columns worth complaining about when they are absent. */
const EXPECTED: FieldName[] = ["title", "price", "brand", "condition", "images", "sku"];

/** 32-bit FNV-1a, used only to give near-identical titles distinct addresses. */
function shortHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36).padStart(6, "0").slice(0, 6);
}

/** Turn an Images cell into web paths under /images/products. */
function imagePaths(raw: string | undefined): string[] {
  return splitPipes(raw).map((entry) => {
    if (/^https?:\/\//i.test(entry) || entry.startsWith("/")) return entry;
    // Crosslist stores bare file names that match the uploaded photo zip.
    // Unzip that same folder into public/images/products and they line up.
    const withExtension = /\.[a-z0-9]{2,4}$/i.test(entry) ? entry : `${entry}.jpg`;
    return `/images/products/${withExtension}`;
  });
}

function readCondition(raw: string | undefined): ConditionCode | null {
  if (!raw) return null;
  const key = raw.toLowerCase().replace(/[^a-z]/g, "");
  return CONDITION_ALIASES[key] ?? null;
}

export function importListings(): ImportReport {
  const warnings: string[] = [];
  const candidates = ["listings.csv", "products.csv", "crosslist.csv"];
  const found = candidates.map((name) => join(DATA_DIR, name)).find(existsSync);

  if (!found) {
    return {
      listings: [],
      unrecognisedColumns: [],
      missingColumns: [],
      warnings: [
        `No catalogue found. Drop your Crosslist export at data/${candidates[0]} and rebuild.`,
      ],
      source: `data/${candidates[0]}`,
      empty: true,
    };
  }

  const { headers, rows } = parseCsvRecords(readFileSync(found, "utf8"));
  const { columnFor, unrecognised } = resolveHeaders(headers);
  const categoryNames = readLookup("categories.csv");
  const sizeNames = readLookup("sizes.csv");

  const cell = (row: Record<string, string>, field: FieldName): string | undefined => {
    const column = columnFor.get(field);
    if (!column) return undefined;
    const value = row[column];
    return value === "" ? undefined : value;
  };

  const usedSlugs = new Set<string>();
  const listings: Listing[] = [];

  rows.forEach((row, index) => {
    const sourceRow = index + 2; // +1 for the header, +1 for 1-based rows
    const title = cell(row, "title");

    if (!title) {
      warnings.push(`Row ${sourceRow}: no title, so the row was skipped.`);
      return;
    }

    const sku = cell(row, "sku") ?? null;
    const id = cell(row, "id") ?? sku ?? `row-${sourceRow}`;

    // Titles repeat constantly in one-off vintage — there are four "Ralph
    // Lauren Polo" rows in the ledger already — so every address carries a
    // short code derived from the listing's identity. Fill in the Crosslist
    // Id column and a piece keeps its URL for good.
    const slugBase = slugify(title) || "listing";
    let slug = `${slugBase}-${shortHash(id)}`;
    if (usedSlugs.has(slug)) {
      warnings.push(
        `Row ${sourceRow}: "${title}" shares an id with an earlier row, so its address was made unique. Give each row its own Id or SKU.`,
      );
      slug = `${slugBase}-${shortHash(`${id}#${sourceRow}`)}`;
    }
    usedSlugs.add(slug);

    const priceGBP = parsePrice(cell(row, "price"));
    if (priceGBP === null) {
      warnings.push(`Row ${sourceRow}: "${title}" has no price, so it shows "Price on request".`);
    }

    const originalPriceGBP = parsePrice(cell(row, "originalPrice"));
    const brandRaw = cell(row, "brand") ?? null;
    const brandSlug = brandRaw ? slugify(brandRaw) : null;
    const brand = brandSlug ? (brandDisplayNames[brandSlug] ?? brandRaw) : null;

    const sizeId = cell(row, "sizeId");
    const sizeText = cell(row, "size");
    const size = sizeText ?? (sizeId ? (sizeNames.get(sizeId) ?? null) : null);
    if (sizeId && !sizeText && !sizeNames.has(sizeId)) {
      warnings.push(
        `Row ${sourceRow}: size id "${sizeId}" is not in data/sizes.csv, so no size is shown. Export the Sizes sheet to fix every row at once.`,
      );
    }

    const categoryId = cell(row, "categoryId");
    const categoryName = categoryId ? (categoryNames.get(categoryId) ?? null) : null;

    const condition = readCondition(cell(row, "condition"));
    const eraCode = cell(row, "whenMade") ?? null;
    const tags = splitPipes(cell(row, "tags"));
    const images = imagePaths(cell(row, "images"));

    const descriptionText = cell(row, "description") ?? "";
    const defects = cell(row, "defects") ?? null;

    const quantityRaw = cell(row, "quantity");
    const quantity = quantityRaw !== undefined ? Number.parseInt(quantityRaw, 10) : 1;
    const safeQuantity = Number.isFinite(quantity) && quantity >= 0 ? quantity : 1;

    const classifyInput: ClassifyInput = {
      title,
      tags,
      size,
      categoryName,
      era: eraCode,
      priceGBP,
      originalPriceGBP,
    };

    listings.push({
      slug,
      id,
      title,
      description: paragraphs(descriptionText),
      priceGBP,
      originalPriceGBP,
      brand,
      brandSlug,
      size,
      condition,
      conditionLabel: condition ? CONDITION_LABELS[condition] : null,
      colour: cell(row, "colour") ? humanise(cell(row, "colour")!) : null,
      secondaryColour: cell(row, "secondaryColour") ? humanise(cell(row, "secondaryColour")!) : null,
      images,
      quantity: safeQuantity,
      inStock: safeQuantity > 0,
      tags,
      sku,
      era: eraCode ? (ERA_LABELS[eraCode] ?? humanise(eraCode)) : null,
      eraCode,
      defects,
      dateAdded: cell(row, "dateAdded") ?? null,
      acceptOffers: parseBoolean(cell(row, "acceptOffers")),
      shipping: {
        domesticGBP: parsePrice(cell(row, "domesticShipping")),
        worldwideGBP: parsePrice(cell(row, "worldwideShipping")),
        freeDomestic: parseBoolean(cell(row, "freeDomestic")),
        freeWorldwide: parseBoolean(cell(row, "freeWorldwide")),
      },
      typeSlugs: typeSlugsFor(classifyInput),
      departmentSlugs: departmentSlugsFor(classifyInput),
      editSlugs: editSlugsFor(classifyInput),
      sourceRow,
    });
  });

  // New In is the tail of the file — the most recently appended rows — which
  // is how the ledger grows: one row per voice note, always at the bottom.
  const newest = [...listings].sort((a, b) => b.sourceRow - a.sourceRow).slice(0, NEW_IN_COUNT);
  for (const listing of newest) listing.editSlugs.push("new-in");

  for (const listing of listings) {
    if (listing.typeSlugs.length === 0) {
      warnings.push(
        `Row ${listing.sourceRow}: "${listing.title}" did not match any category. It is in the shop and in search, but on no category page.`,
      );
    }
    if (listing.images.length === 0) {
      warnings.push(`Row ${listing.sourceRow}: "${listing.title}" has no photographs.`);
    }
  }

  return {
    listings,
    unrecognisedColumns: unrecognised,
    missingColumns: EXPECTED.filter((field) => !columnFor.has(field)),
    warnings,
    source: found.replace(`${process.cwd()}/`, ""),
    empty: listings.length === 0,
  };
}
