/**
 * ===========================================================================
 * THE CATALOGUE
 * ===========================================================================
 *
 * Products are the wholesale lots on sale. Most are sold in a choice of
 * quantities — "5, 10, 25, 50, 100" becomes five variants of the same product,
 * each with its own price and its own line in the cart.
 *
 * PRICES
 * ------
 * `priceGBP` is set only where the owner has given a price. The two reseller
 * boxes are priced at £200. Everything else is `null`, which renders as
 * "Price on request" and routes the customer to WhatsApp or email rather than
 * the cart. No price on this site is inferred — see pricing-notes.md.
 *
 * To put a variant on sale, set its price in POUNDS:
 *
 *     { pieces: 25, priceGBP: 249.99 },
 *
 * and it is buyable through Stripe checkout immediately.
 *
 * STILL NEEDED FROM THE OWNER
 * ---------------------------
 * These products have no quantity options stated, so they show "Quantities on
 * request" and take enquiries instead of orders. Fill in `variants` when the
 * numbers are confirmed:
 *
 *   - ralph-lauren-polos                     (listed with no quantities)
 *   - mixed-premium-vintage-hoodies          (listed with no quantities)
 *   - mixed-premium-vintage-sweatshirts      (listed with no quantities)
 *   - festival-track-jackets                 (listed with no quantities)
 *   - bags                                   (listed with no detail at all)
 *
 *   - t-shirt-mix                            (first seen in the photography)
 *   - jackets-windbreaker-mix                (first seen in the photography)
 *   - mens-luxury-winter-mix                 (first seen in the photography)
 *   - womens-y2k-summer-mix                  (first seen in the photography)
 *
 * Note also: "Lacoste – Jumpers & Cardigans" and "Lacoste – Cardigans" were
 * listed separately with identical quantity options, so they are treated here
 * as one product (`lacoste-jumpers-cardigans`). Split them if they are in fact
 * two different lots.
 */

export type Variant = {
  /** How many garments (or pairs) in this option. */
  pieces: number;
  /** Price in pounds, or null for "price on request". */
  priceGBP: number | null;
};

export type Product = {
  slug: string;
  name: string;
  /** Short line used on cards and in meta descriptions. */
  summary: string;
  /** Paragraphs for the product page. */
  description: string[];
  brandSlugs: string[];
  typeSlugs: string[];
  collectionSlugs: string[];
  /** Quantity options. Empty array = quantities on request. */
  variants: Variant[];
  /** What one unit is, for labelling. */
  unit: "pieces" | "pairs";
  /** Size run, where the owner has stated one. */
  sizeRun?: string;
  /** Anything a buyer should know before ordering. */
  notes: string[];
  /** Placeholder artwork key under /public/images/tiles until photos land. */
  art: string;
  /** Real photography, once available: paths under /public. Wins over `art`. */
  photos?: { src: string; alt: string }[];
  inStock: boolean;
  featured?: boolean;
};

/** Shorthand for a run of unpriced quantity options. */
const qty = (...counts: number[]): Variant[] =>
  counts.map((pieces) => ({ pieces, priceGBP: null }));

export const products: Product[] = [
  // ---------------------------------------------------------------- Reseller boxes
  {
    slug: "y2k-designer-female-mix-box-20",
    name: "Y2K Designer Female Mix — Box of 20",
    summary: "Twenty women's Y2K designer pieces, made up and ready to sell.",
    description: [
      "A ready-made box of twenty women's Y2K designer pieces — the late-90s and early-2000s cuts, logos and colourways that resale is asking for.",
      "Made up, priced and sold as a single box, so there is nothing to specify and nothing to quote. Order it and it ships. This is the quickest way to start with us, and the box most first-time buyers come back for.",
      "Sized in true women's sizing rather than pulled out of a men's lot.",
    ],
    brandSlugs: ["mixed-brands", "reebok", "harley-davidson", "ralph-lauren"],
    typeSlugs: ["polos-t-shirts", "jumpers-sweats"],
    collectionSlugs: ["reseller-boxes", "y2k", "womens"],
    variants: [{ pieces: 20, priceGBP: 200 }],
    unit: "pieces",
    notes: [],
    art: "halftone-green-3",
    photos: [
      {
        src: "/images/products/y2k-designer-female-mix-box-20/01.jpg",
        alt: "A women's Y2K mix laid out on white: a white and grey Reebok shell jacket, a black Harley-Davidson Indiana long-sleeve top, a red Ralph Lauren polo and a pair of brown Birkenstock sandals.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "y2k-designer-male-mix-box-20",
    name: "Y2K Designer Male Mix — Box of 20",
    summary: "Twenty men's Y2K designer pieces, made up and ready to sell.",
    description: [
      "A ready-made box of twenty men's Y2K designer pieces — branded, logo-forward and cut the way the early 2000s cut it.",
      "Made up, priced and sold as a single box. No specification needed and no quote to wait for: order it and it ships.",
      "Runs alongside the women's box, so a stall can open with both sides of the rail covered for £400.",
    ],
    brandSlugs: ["mixed-brands", "diesel", "hugo-boss", "lacoste", "nike"],
    typeSlugs: ["polos-t-shirts", "jumpers-sweats", "jackets"],
    collectionSlugs: ["reseller-boxes", "y2k", "mens"],
    variants: [{ pieces: 20, priceGBP: 200 }],
    unit: "pieces",
    notes: [],
    art: "halftone-ink-3",
    inStock: true,
    featured: true,
  },

  // --------------------------------------------------------------- Polos & T-shirts
  {
    slug: "lacoste-ralph-lauren-polos",
    name: "Lacoste / Ralph Lauren Polos",
    summary: "Croc and pony piqué polos mixed, from five pieces to a hundred.",
    description: [
      "Branded piqué polos split across Lacoste and Polo Ralph Lauren — the two labels that turn over most reliably in this category, kept in one lot so a rail reads as a designer rail rather than a single-brand run.",
      "Available from five pieces up to a hundred. Start small to test the line, then buy in depth once you know it sells.",
      "Mixed colourways across solids, stripes and check.",
    ],
    brandSlugs: ["lacoste", "ralph-lauren"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: ["mens"],
    variants: qty(5, 10, 25, 50, 100),
    unit: "pieces",
    notes: [],
    art: "grid-green-3",
    photos: [
      {
        src: "/images/products/lacoste-ralph-lauren-polos/01.jpg",
        alt: "Three vintage piqué polos laid flat on white: a faded navy Ralph Lauren with a red pony, a cream Ralph Lauren, and a Lacoste striped in teal, lilac and cream.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "ralph-lauren-polos",
    name: "Ralph Lauren Polos",
    summary: "Polo Ralph Lauren piqué polos, brand-pure.",
    description: [
      "Polo Ralph Lauren polo shirts kept brand-pure, for buyers who merchandise by label rather than by garment.",
      "Solids, stripes and colour-block pieces across men's and women's sizing.",
    ],
    brandSlugs: ["ralph-lauren"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: [],
    variants: [], // Quantities to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "grid-ink-2",
    inStock: true,
  },
  {
    slug: "carhartt-dickies-t-shirts",
    name: "Carhartt / Dickies T-Shirts",
    summary: "Workwear tees mixed across both labels, in 25s and 50s.",
    description: [
      "Branded workwear t-shirts split across Carhartt and Dickies.",
      "Workwear has its own buyer and rarely competes with the sportswear rail, which makes it a useful second category rather than more of the same. Sold in twenty-fives and fifties.",
    ],
    brandSlugs: ["carhartt", "dickies"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: ["mens"],
    variants: qty(25, 50),
    unit: "pieces",
    notes: [],
    art: "blocks-ink-3",
    inStock: false,
  },
  {
    slug: "ralph-tommy-lacoste-mix",
    name: "Ralph, Tommy, Lacoste Mix",
    summary: "Twenty-five branded designer pieces across the three labels.",
    description: [
      "Twenty-five branded pieces split across Ralph Lauren, Tommy Hilfiger and Lacoste — the three designer labels that carry a rail on their own.",
      "Colour-led and built to look bright from across a market hall. Sold as a fixed twenty-five piece lot.",
    ],
    brandSlugs: ["ralph-lauren", "tommy-hilfiger", "lacoste"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: ["mens"],
    variants: qty(25),
    unit: "pieces",
    notes: [],
    art: "stripes-green-3",
    inStock: true,
    featured: true,
  },

  // -------------------------------------------------------------- Jumpers & sweats
  {
    slug: "mixed-premium-vintage-hoodies-sweatshirts",
    name: "Mixed Premium Vintage Hoodies & Sweatshirts",
    summary: "Premium hoods and sweats mixed, from five pieces to a hundred.",
    description: [
      "Premium vintage hoodies and sweatshirts in one mixed lot — branded, heavyweight and graded up from general intake.",
      "The most consistent repeat category we sell. Sweats hold their ticket, sell year-round, and fill the middle of a rail without competing with your hero pieces.",
      "Available from five pieces up to a hundred.",
    ],
    brandSlugs: ["mixed-brands", "guess", "nautica"],
    typeSlugs: ["jumpers-sweats"],
    collectionSlugs: ["premium-vintage"],
    variants: qty(5, 10, 25, 50, 100),
    unit: "pieces",
    notes: [],
    art: "bands-ink-3",
    inStock: true,
    featured: true,
  },
  {
    slug: "mixed-premium-vintage-hoodies",
    name: "Mixed Premium Vintage Hoodies",
    summary: "Hoods only, graded up from the premium intake.",
    description: [
      "Premium vintage hoodies on their own, for buyers who want hoods without the sweatshirts mixed in.",
      "Branded, heavyweight and weighted towards the larger end of the size run, because that is where hoodie demand sits.",
    ],
    brandSlugs: ["mixed-brands", "ralph-lauren", "adidas"],
    typeSlugs: ["jumpers-sweats"],
    collectionSlugs: ["premium-vintage"],
    variants: [], // Quantities to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "grid-ink-3",
    photos: [
      {
        src: "/images/products/mixed-premium-vintage-hoodies/01.jpg",
        alt: "Three vintage hoodies laid flat on white: a red and navy Polo Ralph Lauren colour-block hood with sleeve spellout, a green adidas three-stripe hood, and a grey Universal Studios Florida embroidered hood.",
      },
    ],
    inStock: true,
  },
  {
    slug: "mixed-premium-vintage-sweatshirts",
    name: "Mixed Premium Vintage Sweatshirts",
    summary: "Crewnecks and quarter-zips, no hoods.",
    description: [
      "Premium vintage sweatshirts on their own — crewnecks and quarter-zips, no hoods.",
      "The quieter half of the sweats category and the one that suits a shop with a more grown-up customer.",
    ],
    brandSlugs: ["mixed-brands", "guess", "nautica"],
    typeSlugs: ["jumpers-sweats"],
    collectionSlugs: ["premium-vintage"],
    variants: [], // Quantities to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "diagonal-ink-3",
    inStock: true,
  },
  {
    slug: "lacoste-jumpers-cardigans",
    name: "Lacoste Jumpers & Cardigans",
    summary: "Croc-branded knitwear, from ten pieces to a hundred.",
    description: [
      "Lacoste knitwear — crew and v-neck jumpers, zip-through cardigans and patterned knits, all croc-branded.",
      "Knitwear sells slower than jersey but holds its ticket, and the croc does the work on the label. Available in tens through to a hundred, so you can buy for a season rather than a weekend.",
    ],
    brandSlugs: ["lacoste"],
    typeSlugs: ["jumpers-sweats"],
    collectionSlugs: ["premium-vintage"],
    variants: qty(10, 20, 30, 40, 50, 75, 100),
    unit: "pieces",
    notes: [],
    art: "diagonal-green-2",
    photos: [
      {
        src: "/images/products/lacoste-jumpers-cardigans/01.jpg",
        alt: "Four Lacoste knits laid flat on white: a navy zip-through cardigan, a black zip cardigan, a black zip knit with cream striped collar and cuffs, and a green v-neck jumper.",
      },
    ],
    inStock: true,
    featured: true,
  },

  // ---------------------------------------------------------------------- Jackets
  {
    slug: "festival-track-jackets",
    name: "Festival Track Jackets",
    summary: "Loud branded zip-throughs, built for the festival run.",
    description: [
      "Track jackets picked for the festival circuit — bright, branded and recognisable from a distance.",
      "A seasonal buy with a short, sharp selling window. Festival pitches clear these faster than anything else on the rail.",
    ],
    brandSlugs: ["mixed-brands"],
    typeSlugs: ["jackets"],
    collectionSlugs: ["festival"],
    variants: [], // Quantities to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "stripes-ink-3",
    inStock: true,
    featured: true,
  },
  {
    slug: "designer-jackets",
    name: "Designer Jackets",
    summary: "Designer outerwear in small runs of five to twenty.",
    description: [
      "Designer outerwear sold in small runs — the highest single-piece margin of anything we carry.",
      "Kept to lots of five, ten, fifteen and twenty because depth in outerwear ties up more cash than most shops want to commit at once.",
    ],
    brandSlugs: ["mixed-brands"],
    typeSlugs: ["jackets"],
    collectionSlugs: ["premium-vintage"],
    variants: qty(5, 10, 15, 20),
    unit: "pieces",
    notes: [],
    art: "blocks-green-3",
    inStock: true,
  },

  // --------------------------------------------------------------------- Footwear
  {
    slug: "birkenstock-sandals",
    name: "Birkenstock Sandals",
    summary: "Birkenstocks by the pair, from five pairs to fifty.",
    description: [
      "Second-hand Birkenstock sandals sold by the pair, in lots of five, ten, twenty-five and fifty.",
      "Footwear sits alongside a clothing rail without competing with it, and Birkenstocks hold their resale value better than almost anything else in second-hand footwear.",
    ],
    brandSlugs: ["birkenstock"],
    typeSlugs: ["footwear"],
    collectionSlugs: ["summer-mix"],
    variants: qty(5, 10, 25, 50),
    unit: "pairs",
    notes: [],
    art: "blocks-green",
    photos: [
      {
        src: "/images/products/birkenstock-sandals/01.jpg",
        alt: "Six pairs of second-hand Birkenstock sandals on white: four brown nubuck pairs in two-strap and toe-post styles, one white toe-post pair and one metallic snake-print pair.",
      },
    ],
    inStock: true,
    featured: true,
  },

  // ------------------------------------------------------------------ Accessories
  {
    slug: "bags",
    name: "Bags",
    summary: "Vintage bags for the counter.",
    description: [
      "Vintage bags — the kind of low-ticket add-on that lifts a basket at the counter rather than filling a rail.",
      "Ask us what is in at the moment; this category turns over quickly and changes with each intake.",
    ],
    brandSlugs: ["mixed-brands"],
    typeSlugs: ["accessories"],
    collectionSlugs: [],
    variants: [], // Quantities and detail to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "halftone-ink",
    inStock: false,
  },

  // --------------------------------------------------------------- Brand-led lots
  {
    slug: "mixed-mens-lacoste-25",
    name: "Mixed Men's Lacoste — 25 Items",
    summary: "Twenty-five mixed men's Lacoste pieces.",
    description: [
      "Twenty-five mixed pieces of men's Lacoste — polos, knitwear and jersey in one lot rather than split by garment.",
      "For shops that sell Lacoste as a label in its own right. Sold as a fixed twenty-five piece mix.",
    ],
    brandSlugs: ["lacoste"],
    typeSlugs: ["polos-t-shirts", "jumpers-sweats"],
    collectionSlugs: ["mens"],
    variants: qty(25),
    unit: "pieces",
    notes: [],
    art: "grid-ink",
    inStock: true,
  },
  // ------------------------------------------- Lots first seen in the photography
  {
    slug: "t-shirt-mix",
    name: "Branded T-Shirt Mix",
    summary: "Mixed branded tees across the sportswear labels.",
    description: [
      "Branded vintage t-shirts mixed across labels rather than kept brand-pure — Champion, Nike, Fila and adidas in one lot.",
      "A mixed tee lot fills a rail faster than a single-brand run and suits a stall where the customer buys on colour and logo rather than by label.",
    ],
    brandSlugs: ["mixed-brands", "champion", "nike", "fila", "adidas"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: ["mens"],
    variants: [], // Quantities to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "bands-ink-4",
    photos: [
      {
        src: "/images/products/t-shirt-mix/01.jpg",
        alt: "Four branded vintage t-shirts laid flat on white: a purple Champion script tee, a blue Nike swoosh tee, a navy Fila logo tee and a black adidas trefoil tee.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "jackets-windbreaker-mix",
    name: "Jackets & Windbreaker Mix",
    summary: "Branded shells, pullovers and windbreakers, mixed.",
    description: [
      "Lightweight branded outerwear mixed across labels — quarter-zip pullovers, hooded shells and fleece-lined windbreakers from Nike, Ralph Lauren, Tommy Hilfiger and Reebok.",
      "Outerwear carries the highest single-piece ticket on a vintage rail, and this category picks up from late summer onwards.",
    ],
    brandSlugs: ["mixed-brands", "nike", "ralph-lauren", "tommy-hilfiger", "reebok"],
    typeSlugs: ["jackets"],
    collectionSlugs: ["festival"],
    variants: [], // Quantities to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "diagonal-green-4",
    photos: [
      {
        src: "/images/products/jackets-windbreaker-mix/01.jpg",
        alt: "Four vintage jackets laid flat on white: a navy Nike quarter-zip pullover, a red Chaps Ralph Lauren hooded pullover, a grey and navy Tommy Hilfiger hooded jacket and a white and red Reebok fleece-lined jacket.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "mens-luxury-winter-mix",
    name: "Men's Luxury Winter Mix",
    summary: "Designer knitwear — Missoni, Valentino, Stone Island, Lacoste.",
    description: [
      "Designer knitwear a clear tier above general premium vintage: Missoni Sport, Valentino, Stone Island and Lacoste in one lot.",
      "These are pieces that price on the label rather than the category, aimed at shops with an established customer for designer menswear. Small lots by nature — this is not a volume line.",
    ],
    brandSlugs: ["missoni", "valentino", "stone-island", "lacoste"],
    typeSlugs: ["jumpers-sweats"],
    collectionSlugs: ["luxury", "premium-vintage", "mens"],
    variants: [], // Quantities to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "halftone-ink-4",
    photos: [
      {
        src: "/images/products/mens-luxury-winter-mix/01.jpg",
        alt: "Four pieces of designer knitwear laid flat on white: a Missoni Sport patterned hooded gilet, a Valentino argyle v-neck jumper, a blue Lacoste button cardigan and a black Stone Island zip-through knit.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "womens-y2k-summer-mix",
    name: "Women's Y2K Summer Mix",
    summary: "Women's warm-weather Y2K — jerseys, shorts and vests.",
    description: [
      "Women's Y2K picked for summer trading: mesh sports jerseys, nylon shorts, cut denim and vest tops.",
      "Bright, cropped and logo-led — the pieces that photograph well and clear fast through spring and summer.",
    ],
    brandSlugs: ["mixed-brands", "champion", "nike", "harley-davidson"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: ["y2k", "womens", "summer-mix"],
    variants: [], // Quantities to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "grid-ink-4",
    photos: [
      {
        src: "/images/products/womens-y2k-summer-mix/01.jpg",
        alt: "A women's Y2K summer mix laid out on white: a green Champion number 4 football jersey, navy Nike shorts, distressed SLY denim shorts and a red Harley-Davidson vest top.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "luxury-outerwear-mix",
    name: "Luxury Outerwear Mix",
    summary: "Moncler, Burberry, Versace and Polo Ralph Lauren outerwear.",
    description: [
      "Luxury outerwear and tailoring kept apart from the general jacket lots — Moncler quilted down, Burberry field jackets, Versace tailoring and Polo Ralph Lauren shells.",
      "These pieces price on the label rather than the category, which is exactly why they are not bundled in with windbreakers. One Moncler jacket can carry a rail on its own.",
      "Small lots by nature. Contents change with every intake, and we photograph each piece individually before you commit.",
    ],
    brandSlugs: ["moncler", "burberry", "versace", "ralph-lauren"],
    typeSlugs: ["jackets"],
    collectionSlugs: ["luxury", "mens"],
    variants: [], // Quantities to be confirmed by the owner.
    unit: "pieces",
    notes: ["Contents change with each intake. Ask for current photos before ordering."],
    art: "bands-ink-5",
    inStock: true,
    featured: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findVariant(product: Product, pieces: number): Variant | undefined {
  return product.variants.find((v) => v.pieces === pieces);
}

export function productsInCategory(
  kind: "brand" | "type" | "collection",
  slug: string,
): Product[] {
  const key = kind === "brand" ? "brandSlugs" : kind === "type" ? "typeSlugs" : "collectionSlugs";
  return products.filter((p) => p[key].includes(slug));
}

/** Cheapest priced variant, for card display and price sorting. */
export function fromPrice(product: Product): number | null {
  const priced = product.variants
    .map((v) => v.priceGBP)
    .filter((p): p is number => p !== null);
  return priced.length > 0 ? Math.min(...priced) : null;
}

/** The quantity options as a readable run, e.g. "5, 10, 25, 50 or 100". */
export function quantityLabel(product: Product): string {
  if (product.variants.length === 0) return "Quantities on request";
  const counts = product.variants.map((v) => v.pieces);
  if (counts.length === 1) return `${counts[0]} ${product.unit}`;
  const last = counts[counts.length - 1];
  return `${counts.slice(0, -1).join(", ")} or ${last} ${product.unit}`;
}

export const featuredProducts = products.filter((p) => p.featured);
