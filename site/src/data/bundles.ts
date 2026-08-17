/**
 * ===========================================================================
 * SAMPLE CATALOGUE — replace with real stock before launch.
 * ===========================================================================
 *
 * The bundle names, piece counts, size runs and descriptions below are
 * placeholders written to show the shape of a listing. Swap them for real
 * intake as bundles are photographed and made up.
 *
 * PRICES ARE DELIBERATELY BLANK. `priceGBP: null` renders as "Price on
 * request" and routes the customer to WhatsApp or email instead of the cart.
 * The owner sets every price — see ../../../pricing-notes.md in this repo.
 * To put a bundle on sale, set `priceGBP` to the price in POUNDS, e.g.
 *
 *     priceGBP: 249.99,
 *
 * and it becomes buyable through Stripe checkout immediately.
 */

export type Bundle = {
  slug: string;
  name: string;
  /** Short line used on cards and in meta descriptions. */
  summary: string;
  /** Paragraphs for the product page. */
  description: string[];
  brandSlugs: string[];
  typeSlugs: string[];
  collectionSlugs: string[];
  /** Number of garments in the lot. */
  pieces: number;
  /** Approximate weight, kg. Wholesale buyers price freight from this. */
  weightKg: number;
  /** Free text size run, written the way the owner describes it. */
  sizeRun: string;
  /** Condition in the owner's own wording, matching inventory.csv. */
  condition: string;
  /** Anything a buyer should know before purchase. Empty array = none noted. */
  notes: string[];
  /** Price in pounds, or null for "price on request". */
  priceGBP: number | null;
  /** Placeholder artwork key under /public/images/tiles until photos land. */
  art: string;
  /** Real photography, once available: paths under /public. Wins over `art`. */
  photos?: { src: string; alt: string }[];
  inStock: boolean;
  featured?: boolean;
};

export const bundles: Bundle[] = [
  {
    slug: "nike-track-jacket-bundle-25",
    name: "Nike Track Jacket Bundle — 25 Piece",
    summary: "Twenty-five branded Nike zip-throughs, mixed sizes and colourways.",
    description: [
      "Twenty-five Nike track jackets pulled from 90s and Y2K intake — shell, tricot and mesh-lined zip-throughs with embroidered and printed swoosh branding.",
      "Sizes run through the middle of the range with a handful of oversized pieces, which is how this category sells fastest. Colourways are mixed on purpose so a rail reads as a rail rather than a repeat.",
      "Every piece is checked for zips, cuffs and holes before it goes in the bundle. Anything with a mark that a customer would notice is either graded down or pulled.",
    ],
    brandSlugs: ["nike"],
    typeSlugs: ["track-jackets"],
    collectionSlugs: ["y2k"],
    pieces: 25,
    weightKg: 14,
    sizeRun: "S–XXL, weighted to M/L/XL",
    condition: "Very good vintage condition",
    notes: ["A small number of pieces carry light wear consistent with their age."],
    priceGBP: null,
    art: "diagonal-green",
    inStock: true,
    featured: true,
  },
  {
    slug: "rl-lacoste-polo-mix-40",
    name: "Ralph Lauren & Lacoste Polo Mix — 40 Piece",
    summary: "Forty branded piqué polos split across Ralph Lauren and Lacoste.",
    description: [
      "Forty polo shirts split across Polo Ralph Lauren and Lacoste, the two labels that turn over most reliably in this category.",
      "Mixed colourways with a spread of solids, stripes and check. Men's and women's sizing kept in the same lot so a stall can serve both sides of the rail.",
      "Graded on collar condition, pony or croc integrity and colour fade. Pieces with cut labels are included and noted — they sell fine and are priced accordingly.",
    ],
    brandSlugs: ["ralph-lauren", "lacoste"],
    typeSlugs: ["polos"],
    collectionSlugs: [],
    pieces: 40,
    weightKg: 12,
    sizeRun: "UK S–XXL across men's and women's",
    condition: "Very good condition",
    notes: ["Includes a proportion of pieces with cut labels."],
    priceGBP: null,
    art: "grid-green",
    inStock: true,
    featured: true,
  },
  {
    slug: "womens-y2k-mix-30",
    name: "Women's Y2K Mix — 30 Piece",
    summary: "Thirty women's pieces cut and sized for the Y2K rail.",
    description: [
      "Thirty women's garments picked specifically for Y2K demand — cropped polos, fitted track tops, cardigans, bralettes and logo-forward layers.",
      "This lot is sized in true women's sizing rather than small men's, which is the difference between a rail that sells and a rail that gets picked over.",
      "Branded and unbranded pieces sit alongside each other here; the selection is led by cut and colour rather than label.",
    ],
    brandSlugs: ["mixed-brands"],
    typeSlugs: ["polos", "knitwear"],
    collectionSlugs: ["y2k", "womens"],
    pieces: 30,
    weightKg: 9,
    sizeRun: "UK 8–16",
    condition: "Very good condition",
    notes: [],
    priceGBP: null,
    art: "halftone-green-2",
    inStock: true,
    featured: true,
  },
  {
    slug: "adidas-tracksuit-sets-10",
    name: "Adidas Tracksuit Sets — 10 Pairs",
    summary: "Ten matched Adidas top-and-bottom sets, kept as pairs.",
    description: [
      "Ten complete Adidas tracksuits with tops and bottoms matched and kept together — three-stripe tricot and shell sets across the 90s and early 2000s.",
      "Full sets carry the highest ticket in the sportswear category and are the hardest thing to put together from a mixed intake, which is why they are sold as their own lot.",
      "Each pair is checked as a pair: matching colourway, matching size, both halves wearable.",
    ],
    brandSlugs: ["adidas"],
    typeSlugs: ["tracksuits", "track-jackets"],
    collectionSlugs: ["premium-picks"],
    pieces: 20,
    weightKg: 13,
    sizeRun: "M–XL",
    condition: "Very good vintage condition",
    notes: ["Sold as 10 matched pairs (20 garments in total)."],
    priceGBP: null,
    art: "stripes-green",
    inStock: true,
    featured: true,
  },
  {
    slug: "branded-hoodie-bundle-20",
    name: "Branded Hoodie Bundle — 20 Piece",
    summary: "Twenty heavyweight branded hoods, spellout and embroidered.",
    description: [
      "Twenty heavyweight hoodies carrying recognised sportswear branding — spellout chest prints, embroidered logos and centre-front pockets.",
      "Weighted towards the larger end of the size run because that is where hoodie demand sits.",
      "Checked for drawcords, cuff stretch and print cracking. Light print crack is kept in where it reads as age rather than damage.",
    ],
    brandSlugs: ["mixed-brands", "nike", "adidas"],
    typeSlugs: ["hoodies", "sweatshirts"],
    collectionSlugs: [],
    pieces: 20,
    weightKg: 16,
    sizeRun: "M–XXL, weighted to L/XL",
    condition: "Very good condition",
    notes: [],
    priceGBP: null,
    art: "bands-ink",
    inStock: true,
  },
  {
    slug: "sweatshirt-crewneck-mix-25",
    name: "Crewneck Sweatshirt Mix — 25 Piece",
    summary: "Twenty-five branded crewnecks and quarter-zips.",
    description: [
      "Twenty-five branded crewneck sweatshirts and quarter-zips across the sportswear labels we carry.",
      "A steady repeat category — less seasonal than outerwear, and it fills the middle of a rail without competing with your hero pieces.",
      "Mixed colourways with the neutrals kept in rather than pulled out.",
    ],
    brandSlugs: ["mixed-brands"],
    typeSlugs: ["sweatshirts"],
    collectionSlugs: [],
    pieces: 25,
    weightKg: 15,
    sizeRun: "S–XXL",
    condition: "Very good condition",
    notes: [],
    priceGBP: null,
    art: "halftone-ink",
    inStock: true,
  },
  {
    slug: "outerwear-shell-jackets-15",
    name: "Shell Jacket & Windbreaker Lot — 15 Piece",
    summary: "Fifteen branded shells, coach jackets and windbreakers.",
    description: [
      "Fifteen lightweight outerwear pieces — shells, coach jackets and packable windbreakers with branded chest and back detail.",
      "Bought for the autumn rail. Outerwear carries the strongest single-piece margin of anything we bundle.",
      "Zips, poppers and linings all checked. Any piece with a failed zip is pulled rather than graded down.",
    ],
    brandSlugs: ["mixed-brands", "nike", "adidas"],
    typeSlugs: ["jackets-outerwear", "track-jackets"],
    collectionSlugs: [],
    pieces: 15,
    weightKg: 11,
    sizeRun: "M–XXL",
    condition: "Very good vintage condition",
    notes: [],
    priceGBP: null,
    art: "blocks-green",
    inStock: true,
  },
  {
    slug: "womens-summer-mix-30",
    name: "Women's Summer Mix — 30 Piece",
    summary: "Thirty lightweight women's pieces for the warm-weather rail.",
    description: [
      "Thirty lightweight women's garments for spring and summer trading — polos, tees, thin knits, bralettes and short-sleeve layers.",
      "Colour-led rather than label-led. This lot is built to make a rail look bright from across a market hall.",
      "Sized in true women's sizing and graded on fabric condition, which matters more on lightweight pieces than anywhere else.",
    ],
    brandSlugs: ["mixed-brands"],
    typeSlugs: ["polos", "knitwear"],
    collectionSlugs: ["summer-mix", "womens"],
    pieces: 30,
    weightKg: 7,
    sizeRun: "UK 8–16",
    condition: "Very good condition",
    notes: [],
    priceGBP: null,
    art: "bands-green-2",
    inStock: true,
  },
  {
    slug: "lacoste-knitwear-lot-15",
    name: "Lacoste Knitwear Lot — 15 Piece",
    summary: "Fifteen Lacoste jumpers and cardigans, croc-branded.",
    description: [
      "Fifteen pieces of Lacoste knitwear — crew and v-neck jumpers, zip-through cardigans and a small number of patterned knits.",
      "A specialist lot rather than a volume one. Knitwear sells slower but holds its ticket, and the croc does the work on the label.",
      "Graded hard on bobbling, moth and cuff stretch — knitwear is where condition grading actually matters.",
    ],
    brandSlugs: ["lacoste"],
    typeSlugs: ["knitwear"],
    collectionSlugs: ["premium-picks"],
    pieces: 15,
    weightKg: 8,
    sizeRun: "UK S–XL",
    condition: "Very good vintage condition",
    notes: [],
    priceGBP: null,
    art: "grid-ink",
    inStock: true,
  },
  {
    slug: "premium-picks-10",
    name: "Premium Picks — 10 Piece",
    summary: "Ten hand-pulled hero pieces from across the current intake.",
    description: [
      "Ten single pieces pulled from the top of the current intake before anything is bundled — the jackets, sets and rarer colourways that would otherwise anchor a full lot.",
      "This is a small, high-grade selection for retailers who sell on piece quality rather than volume. Contents change with every intake.",
      "Photographed individually on request before purchase.",
    ],
    brandSlugs: ["mixed-brands", "nike", "adidas", "ralph-lauren", "lacoste"],
    typeSlugs: ["track-jackets", "jackets-outerwear"],
    collectionSlugs: ["premium-picks"],
    pieces: 10,
    weightKg: 6,
    sizeRun: "Mixed — stated per piece on request",
    condition: "Very good vintage condition",
    notes: ["Contents change with each intake. Ask for current photos before ordering."],
    priceGBP: null,
    art: "diagonal-green-2",
    inStock: true,
  },
  {
    slug: "ralph-lauren-polo-lot-20",
    name: "Ralph Lauren Polo Lot — 20 Piece",
    summary: "Twenty Polo Ralph Lauren piqué polos, brand-pure.",
    description: [
      "Twenty Polo Ralph Lauren polo shirts kept brand-pure for buyers who merchandise by label.",
      "Solids, stripes and a small number of check and colour-block pieces, across men's and women's sizing.",
      "Pony condition, collar shape and colour fade all checked. Cut-label pieces are noted rather than hidden.",
    ],
    brandSlugs: ["ralph-lauren"],
    typeSlugs: ["polos"],
    collectionSlugs: [],
    pieces: 20,
    weightKg: 6,
    sizeRun: "UK S–XXL",
    condition: "Very good condition",
    notes: [],
    priceGBP: null,
    art: "diagonal-ink",
    inStock: true,
  },
  {
    slug: "mixed-brand-starter-50",
    name: "Mixed Brand Starter Lot — 50 Piece",
    summary: "Fifty pieces spanning the full archive — a rail in one purchase.",
    description: [
      "Fifty garments spanning every category we carry: track tops, polos, hoodies, sweats, knitwear and a small amount of outerwear.",
      "Built for a first order — enough breadth to open a stall or fill an online shop without committing to a single category.",
      "Sizes and colourways spread deliberately wide. If you want depth in one category instead, buy the category lots.",
    ],
    brandSlugs: ["mixed-brands", "nike", "adidas", "lacoste", "ralph-lauren"],
    typeSlugs: ["track-jackets", "polos", "hoodies", "sweatshirts", "knitwear"],
    collectionSlugs: [],
    pieces: 50,
    weightKg: 28,
    sizeRun: "S–XXL across men's and women's",
    condition: "Very good condition",
    notes: [],
    priceGBP: null,
    art: "halftone-green",
    inStock: true,
    featured: true,
  },
];

export function getBundle(slug: string): Bundle | undefined {
  return bundles.find((b) => b.slug === slug);
}

export function bundlesInCategory(kind: "brand" | "type" | "collection", slug: string): Bundle[] {
  const key = kind === "brand" ? "brandSlugs" : kind === "type" ? "typeSlugs" : "collectionSlugs";
  return bundles.filter((b) => b[key].includes(slug));
}

export const featuredBundles = bundles.filter((b) => b.featured);
