/**
 * Working out which sections a listing belongs to.
 *
 * Crosslist stores its category as an opaque id ("Category id"), so unless a
 * Categories export is present to translate it we have nothing but words to go
 * on. These tables read the words — title, tags, size and the resolved
 * Crosslist category name — against an explicit keyword list per section.
 *
 * Two rules, both deliberate:
 *
 *   1. Matching is whole-word. "men" must never match inside "women's".
 *   2. Nothing is invented. A listing that matches no type is simply in no
 *      type: it still appears in /shop and in search, and `npm run
 *      import:check` reports it so the wording can be fixed at source.
 */

import { hasWord } from "@/lib/text";

type Rule = {
  slug: string;
  include: string[];
  /** A hit on any of these vetoes the rule, however the include list scored. */
  exclude?: string[];
};

/**
 * Garment type. A piece can legitimately sit in more than one — a knitted polo
 * is both — so every rule is tested rather than stopping at the first hit.
 */
const TYPE_RULES: Rule[] = [
  {
    slug: "polos",
    include: ["polo", "polos", "polo shirt"],
    exclude: ["polo neck", "poloneck"],
  },
  {
    slug: "t-shirts",
    include: ["t-shirt", "t shirt", "tshirt", "t-shirts", "tee", "tees", "baby tee"],
  },
  {
    slug: "shirts",
    include: ["shirt", "shirts", "blouse", "flannel", "overshirt", "button-down", "oxford"],
    exclude: ["t-shirt", "t shirt", "tshirt", "polo", "sweatshirt", "sweat shirt"],
  },
  {
    slug: "jackets",
    include: [
      "jacket", "jackets", "coat", "windbreaker", "windrunner", "shell", "bomber",
      "parka", "puffer", "gilet", "anorak", "track top", "overcoat", "raincoat", "cagoule",
    ],
  },
  {
    slug: "hoodies-sweats",
    include: ["hoodie", "hoody", "hooded", "sweatshirt", "sweat", "sweats", "crewneck", "crew neck", "fleece"],
  },
  {
    slug: "knitwear",
    include: ["jumper", "jumpers", "knit", "knitted", "cardigan", "sweater", "pullover", "polo neck", "turtleneck"],
  },
  {
    slug: "tops",
    include: ["vest", "bralette", "cami", "camisole", "bodysuit", "corset", "crop top", "tank top", "halter"],
  },
  {
    slug: "bottoms",
    include: ["jeans", "trousers", "joggers", "shorts", "cargos", "cargo pants", "track pants", "leggings", "chinos"],
  },
  {
    slug: "dresses-skirts",
    include: ["dress", "dresses", "skirt", "skirts", "gown"],
  },
  {
    slug: "footwear",
    include: [
      "trainers", "sneakers", "shoes", "boots", "sandals", "birkenstock", "birkenstocks",
      "flip flops", "loafers", "heels",
    ],
  },
  {
    slug: "accessories",
    include: [
      "bag", "bags", "cap", "hat", "beanie", "belt", "scarf", "gloves", "sunglasses",
      "wallet", "purse", "backpack", "tote", "necklace",
    ],
  },
];

const DEPARTMENT_RULES: Rule[] = [
  { slug: "womens", include: ["women", "womens", "women's", "ladies", "female", "girls", "womenswear"] },
  { slug: "mens", include: ["men", "mens", "men's", "male", "boys", "menswear"] },
];

/** Words that put a piece in the Summer edit. */
const SUMMER_WORDS = [
  "summer", "shorts", "vest", "bralette", "sandals", "swim", "bikini", "cami",
  "tank top", "sun", "beach", "festival",
];

/** Crosslist "When made" values that count as Y2K. */
const Y2K_ERAS = new Set(["From2000To2006", "From2007To2009"]);

function matches(haystack: string, rule: Rule): boolean {
  if (rule.exclude?.some((word) => hasWord(haystack, word))) return false;
  return rule.include.some((word) => hasWord(haystack, word));
}

/**
 * Everything a matcher is allowed to read. Description is deliberately left
 * out: a sentence mentioning "goes well with jeans" would file a polo under
 * Bottoms, and the owner cannot see why.
 */
export type ClassifyInput = {
  title: string;
  tags: string[];
  size: string | null;
  /** Resolved Crosslist category name, where a Categories export is present. */
  categoryName: string | null;
  era: string | null;
  priceGBP: number | null;
  originalPriceGBP: number | null;
};

function haystackFor(input: ClassifyInput): string {
  return [input.title, input.categoryName ?? "", input.size ?? "", ...input.tags]
    .join(" ")
    .toLowerCase();
}

export function typeSlugsFor(input: ClassifyInput): string[] {
  const haystack = haystackFor(input);
  return TYPE_RULES.filter((rule) => matches(haystack, rule)).map((rule) => rule.slug);
}

export function departmentSlugsFor(input: ClassifyInput): string[] {
  const haystack = haystackFor(input);
  return DEPARTMENT_RULES.filter((rule) => matches(haystack, rule)).map((rule) => rule.slug);
}

/**
 * Edits other than New In, which depends on where a listing sits in the file
 * as a whole and so is applied by the importer once every row is read.
 */
export function editSlugsFor(input: ClassifyInput): string[] {
  const haystack = haystackFor(input);
  const slugs: string[] = [];

  if ((input.era && Y2K_ERAS.has(input.era)) || hasWord(haystack, "y2k")) {
    slugs.push("y2k");
  }
  if (SUMMER_WORDS.some((word) => hasWord(haystack, word))) {
    slugs.push("summer");
  }
  if (
    input.priceGBP !== null &&
    input.originalPriceGBP !== null &&
    input.originalPriceGBP > input.priceGBP
  ) {
    slugs.push("sale");
  }
  if (input.priceGBP !== null && input.priceGBP <= 15) {
    slugs.push("under-15");
  }

  return slugs;
}

/** How many of the most recently added listings make up the New In edit. */
export const NEW_IN_COUNT = 24;
