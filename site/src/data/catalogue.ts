/**
 * ===========================================================================
 * THE CATALOGUE
 * ===========================================================================
 *
 * Products are the wholesale lots on sale. Most are sold in a choice of
 * quantities — "10, 25, 50" becomes three variants of the same product,
 * each with its own price and its own line in the cart.
 *
 * PRICES
 * ------
 * `priceGBP` is set only where the owner has given a price. Anything without
 * one is `null`, which renders as "Price on request" and routes the customer to
 * WhatsApp or email rather than the cart. No price on this site is inferred —
 * see pricing-notes.md.
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
 *   - track-jackets-windbreakers             (listed with no quantities)
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
  /**
   * Condition grade as shown on the listing, e.g. "A/B". Defaults to "A/B"
   * for every lot; set it here to say otherwise. Defined at /grading-guide.
   */
  grade?: string;
  /**
   * Where a lot grades differently from the site-wide norm, say so here in
   * words, e.g. "roughly 85% Grade A, 15% Grade B". Shown after the grade.
   */
  gradeNote?: string;
  /** Placeholder artwork key under /public/images/tiles until photos land. */
  art: string;
  /** Real photography, once available: paths under /public. Wins over `art`. */
  photos?: { src: string; alt: string }[];
  /**
   * Short square clips of the actual line — a look along the rail. Shown in
   * the product reel after the photographs. `poster` is the still shown
   * before play and in the thumbnail; the transcode step writes one per clip.
   */
  videos?: {
    src: string;
    poster: string;
    alt: string;
    /**
     * The same clip as shot: 10-bit HEVC in HLG, the iPhone's own HDR format.
     * Offered first; browsers that can play it (Safari, most Android) show the
     * footage with its original light and colour, others fall back to `src`.
     */
    hdr?: string;
  }[];
  inStock: boolean;
  featured?: boolean;
};

/** Shorthand for a run of unpriced quantity options. */
const qty = (...counts: number[]): Variant[] =>
  counts.map((pieces) => ({ pieces, priceGBP: null }));

/**
 * A priced lot, entered per piece — `at(25, 8)` is 25 pieces at £8 each.
 * VAT follows siteConfig.vat.registered — off at present, so these are the
 * prices shown and charged as they stand.
 */
const at = (pieces: number, perPiece: number): Variant => ({
  pieces,
  priceGBP: Math.round(pieces * perPiece * 100) / 100,
});

const catalogue: Product[] = [
  // ---------------------------------------------------------------- Reseller boxes
  {
    slug: "starter-box-10",
    name: "Starter Box — 10 Items",
    summary: "Ten branded pieces, made up and priced. The smallest way in.",
    description: [
      "A ten-piece box put together to open a rail rather than fill one — branded, mixed across tops, tees and outerwear, and made up ready to sell.",
      "The smallest box we do. It exists so a first order can be tested at a low outlay before committing to a bigger box or a fifty-piece lot.",
      "Made up, priced and sold as a single box. Nothing to specify and nothing to quote: order it and it ships.",
    ],
    brandSlugs: ["mixed-brands", "nike", "harley-davidson"],
    typeSlugs: ["polos-t-shirts", "jumpers-sweats", "jackets"],
    collectionSlugs: ["reseller-boxes", "y2k"],
    variants: [at(10, 9)],
    unit: "pieces",
    notes: [],
    art: "bands-green-3",
    photos: [
      {
        src: "/images/products/starter-box-10/01.jpg",
        alt: "A ten-piece starter box laid out on white: a cream Harley-Davidson three-quarter-sleeve top with a world-map print, a navy and red Nike windbreaker, a black Nike Just Do It t-shirt and a black velour zip hoodie with pink shoulder stripes.",
      },
    ],
    videos: [
      {
        src: "/videos/products/starter-box-10/01.mp4",
        poster: "/videos/products/starter-box-10/01-poster.jpg",
        alt: "A look through a Starter Box intake, turned over piece by piece: a tan Carhartt pocket tee, a grey Lacoste quarter-zip, a red The North Face fleece and mixed branded layers.",
      },
      {
        src: "/videos/products/starter-box-10/02.mp4",
        poster: "/videos/products/starter-box-10/02-poster.jpg",
        alt: "A second Starter Box intake: a Chaps Ralph Lauren crew, a grey Lacoste quarter-zip, a navy shell jacket, a grey Nike hoodie, a green Champion tee and a pair of jeans.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "ralph-lauren-polo-box-10",
    name: "Ralph Lauren Polo Box — 10 Items",
    summary: "Ten Polo Ralph Lauren piqué polos, made up and priced. One label, one box.",
    description: [
      "A ten-piece box of Polo Ralph Lauren piqué polos — mixed colourways and sizes, the pony on every chest — made up and ready to sell.",
      "Made up, priced and sold as a single box. Nothing to specify and nothing to quote: order it and it ships. Want depth in the line? The same polos come as counted lots of 25 and 50.",
    ],
    brandSlugs: ["ralph-lauren"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: ["reseller-boxes", "mens"],
    // Priced at the Ralph Lauren Polos 10-lot rate, £9 a piece.
    variants: [at(10, 9)],
    unit: "pieces",
    notes: [],
    art: "grid-green-2",
    photos: [
      {
        src: "/images/products/ralph-lauren-polos/01.jpg",
        alt: "Four Polo Ralph Lauren piqué polos on white: navy, black and white stripe, pink marl and green marl.",
      },
      {
        src: "/images/products/ralph-lauren-polos/02.jpg",
        alt: "A Polo Ralph Lauren piqué polo laid flat on white: navy and cream block stripes, navy collar and the pony embroidered on the chest.",
      },
      {
        src: "/images/products/ralph-lauren-polos/03.jpg",
        alt: "The same navy and cream striped Ralph Lauren polo laid flat on white, shown full length.",
      },
    ],
    // Shot portrait and at two different speeds; evened out to one pace,
    // graded to take the glare off, and cropped square. No HDR rendition:
    // the corrected grade is the point, so every browser sees the same thing.
    videos: [
      {
        src: "/videos/products/ralph-lauren-polo-box-10/01.mp4",
        poster: "/videos/products/ralph-lauren-polo-box-10/01-poster.jpg",
        alt: "A look through a Ralph Lauren Polo Box, turned over piece by piece: piqué polos in red, green, navy, pale blue, white and mint, each with the pony on the chest.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "y2k-designer-female-mix-box",
    name: "Y2K Designer Female Mix",
    summary: "Women's Y2K designer pieces, made up and ready to sell — ten or twenty.",
    description: [
      "A ready-made box of women's Y2K designer pieces — the late-90s and early-2000s cuts, logos and colourways that resale is asking for. Ten pieces to test it, twenty to fill a rail.",
      "Made up, priced and sold as a single box, so there is nothing to specify and nothing to quote. Order it and it ships. This is the quickest way to start with us, and the box most first-time buyers come back for.",
      "Sized in true women's sizing rather than pulled out of a men's lot.",
    ],
    brandSlugs: ["mixed-brands", "harley-davidson", "von-dutch", "juicy-couture", "nike", "adidas", "patagonia", "morgan", "reebok", "ralph-lauren"],
    typeSlugs: ["polos-t-shirts", "jumpers-sweats"],
    collectionSlugs: ["reseller-boxes", "y2k", "womens"],
    variants: [at(10, 10), at(20, 9)],
    unit: "pieces",
    notes: [],
    art: "halftone-green-3",
    photos: [
      {
        src: "/images/products/y2k-designer-female-mix-box/01.jpg",
        alt: "A women's Y2K mix laid out on white: a white and grey Reebok shell jacket, a black Harley-Davidson Indiana long-sleeve top, a red Ralph Lauren polo and a pair of brown Birkenstock sandals.",
      },
    ],
    videos: [
      {
        src: "/videos/products/y2k-designer-female-mix-box/01.mp4",
        hdr: "/videos/products/y2k-designer-female-mix-box/01-hdr.mp4",
        poster: "/videos/products/y2k-designer-female-mix-box/01-poster.jpg",
        alt: "A look through the Y2K Designer Female Mix: a pink and grey The North Face fleece, a pink velour zip hoodie, a blue shell jacket and embellished denim.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "designer-male-mix-box",
    name: "Designer Male Mix",
    summary: "Men's designer pieces, made up and ready to sell — ten or twenty.",
    description: [
      "A ready-made box of men's designer pieces — branded, logo-forward and picked to sell straight off a rail. Ten pieces to test it, twenty to fill a rail.",
      "Made up, priced and sold as a single box. No specification needed and no quote to wait for: order it and it ships.",
      "Runs alongside the women's box, so a stall can open with both sides of the rail covered for £200 — or £360 for the full forty.",
    ],
    brandSlugs: ["mixed-brands", "diesel", "hugo-boss", "lacoste", "nike"],
    typeSlugs: ["polos-t-shirts", "jumpers-sweats", "jackets"],
    collectionSlugs: ["reseller-boxes", "mens"],
    variants: [at(10, 10), at(20, 9)],
    unit: "pieces",
    notes: [],
    art: "halftone-ink-3",
    photos: [
      {
        src: "/images/products/designer-male-mix-box/01.jpg",
        alt: "A men's designer mix on white: a cream Diesel brushstroke tee, a navy-striped Boss Sport polo, a blue Lacoste V-neck knit and a black and yellow Nike shell jacket.",
      },
    ],
    inStock: true,
    featured: true,
  },

  // --------------------------------------------------------------- Polos & T-shirts
  {
    slug: "lacoste-ralph-lauren-polos",
    name: "Lacoste / Ralph Lauren Polos",
    summary: "Croc and pony piqué polos mixed, in tens, twenty-fives and fifties.",
    description: [
      "Branded piqué polos split across Lacoste and Polo Ralph Lauren — the two labels that turn over most reliably in this category, kept in one lot so a rail reads as a designer rail rather than a single-brand run.",
      "Roughly 85% men's and 15% women's across the lot.",
      "Available in ten, twenty-five or fifty. Start small to test the line, then buy in depth once you know it sells.",
      "Mixed colourways across solids, stripes and check.",
    ],
    brandSlugs: ["lacoste", "ralph-lauren"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: ["mens"],
    variants: [at(10, 8.5), at(25, 8), at(50, 7.5)],
    unit: "pieces",
    notes: [],
    art: "grid-green-3",
    photos: [
      {
        src: "/images/products/lacoste-ralph-lauren-polos/01.jpg",
        alt: "Three vintage piqué polos laid flat on white: a faded navy Ralph Lauren with a red pony, a cream Ralph Lauren, and a Lacoste striped in teal, lilac and cream.",
      },
      {
        src: "/images/products/lacoste-ralph-lauren-polos/02.jpg",
        alt: "A Lacoste colour-block piqué polo on white: a grey marl body with cream sleeves, a charcoal collar and placket, and the croc on the chest.",
      },
      {
        src: "/images/products/lacoste-ralph-lauren-polos/04.jpg",
        alt: "A brown Lacoste piqué polo laid flat on white, with a two-button placket and the croc on the chest.",
      },
      {
        src: "/images/products/lacoste-ralph-lauren-polos/06.jpg",
        alt: "The back of the brown Lacoste piqué polo, laid flat on white.",
      },
      {
        src: "/images/products/lacoste-ralph-lauren-polos/05.jpg",
        alt: "Close-up of a brown Lacoste polo: the ribbed collar, buttoned placket, woven Lacoste label and the embroidered croc.",
      },
    ],
    videos: [
      {
        src: "/videos/products/lacoste-ralph-lauren-polos/01.mp4",
        poster: "/videos/products/lacoste-ralph-lauren-polos/01-poster.jpg",
        alt: "A look along the polo rail, turned over piece by piece: Lacoste croc polos in red and Polo Ralph Lauren pony polos in white, grey, red, yellow, black and blue.",
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
    variants: [at(10, 9), at(25, 8), at(50, 7.5)],
    unit: "pieces",
    notes: [],
    art: "grid-ink-2",
    photos: [
      {
        src: "/images/products/ralph-lauren-polos/01.jpg",
        alt: "Four Polo Ralph Lauren piqué polos on white: navy, black and white stripe, pink marl and green marl.",
      },
      {
        src: "/images/products/ralph-lauren-polos/02.jpg",
        alt: "A Polo Ralph Lauren piqué polo laid flat on white: navy and cream block stripes, navy collar and the pony embroidered on the chest.",
      },
      {
        src: "/images/products/ralph-lauren-polos/03.jpg",
        alt: "The same navy and cream striped Ralph Lauren polo laid flat on white, shown full length.",
      },
    ],
    // Same rail as the Ralph Lauren Polo Box — one shoot, both listings.
    videos: [
      {
        src: "/videos/products/ralph-lauren-polo-box-10/01.mp4",
        poster: "/videos/products/ralph-lauren-polo-box-10/01-poster.jpg",
        alt: "A look along the Ralph Lauren polo rail, turned over piece by piece: piqué polos in red, green, navy, pale blue, white and mint, each with the pony on the chest.",
      },
    ],
    inStock: true,
  },
  {
    slug: "carhartt-dickies-t-shirts",
    name: "Carhartt / Dickies T-Shirts",
    summary: "Workwear tees mixed across both labels, in tens, twenty-fives and fifties.",
    description: [
      "Branded workwear t-shirts split across Carhartt and Dickies.",
      "Workwear has its own buyer and rarely competes with the sportswear rail, which makes it a useful second category rather than more of the same. Sold in tens, twenty-fives and fifties.",
    ],
    brandSlugs: ["carhartt", "dickies"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: ["mens"],
    variants: [at(10, 7.5), at(25, 7.25), at(50, 7.5)],
    unit: "pieces",
    notes: [],
    art: "blocks-ink-3",
    photos: [
      {
        src: "/images/products/carhartt-dickies-t-shirts/01.jpg",
        alt: "Four workwear t-shirts laid flat on white: a grey Carhartt pocket tee, a navy Carhartt Action Electric print tee, a tan Dickies pocket tee with a wave graphic and a charcoal Carhartt long-sleeve pocket tee.",
      },
    ],
    videos: [
      {
        src: "/videos/products/carhartt-dickies-t-shirts/01.mp4",
        hdr: "/videos/products/carhartt-dickies-t-shirts/01-hdr.mp4",
        poster: "/videos/products/carhartt-dickies-t-shirts/01-poster.jpg",
        alt: "A look through the Carhartt / Dickies T-Shirts: a black Carhartt pocket tee, a navy long-sleeve and layered tan and green workwear tees.",
      },
    ],
    inStock: true,
  },
  {
    slug: "ralph-tommy-lacoste-mix",
    name: "Ralph, Tommy, Lacoste Mix",
    summary: "Branded designer pieces across the three labels, in tens, twenty-fives and fifties.",
    description: [
      "Branded pieces split across Ralph Lauren, Tommy Hilfiger and Lacoste — the three designer labels that carry a rail on their own.",
      "Colour-led and built to look bright from across a market hall. Sold in ten, twenty-five or fifty.",
    ],
    brandSlugs: ["ralph-lauren", "tommy-hilfiger", "lacoste"],
    typeSlugs: ["polos-t-shirts"],
    collectionSlugs: ["mens"],
    variants: [at(10, 9.5), at(25, 9), at(50, 8.5)],
    unit: "pieces",
    notes: [],
    art: "stripes-green-3",
    photos: [
      {
        src: "/images/products/ralph-tommy-lacoste-mix/01.jpg",
        alt: "A Ralph, Tommy and Lacoste mix on white: a cream Lacoste diagonal-stripe knit, a mint Polo Ralph Lauren piqué polo, a red, navy and white Tommy Hilfiger striped polo and a red-striped Ralph Lauren shirt.",
      },
    ],
    videos: [
      {
        src: "/videos/products/ralph-tommy-lacoste-mix/01.mp4",
        poster: "/videos/products/ralph-tommy-lacoste-mix/01-poster.jpg",
        alt: "A look through the Ralph, Tommy, Lacoste Mix: Ralph Lauren piqué polos in pink, yellow and blue, a brown Lacoste jumper, an orange Lacoste cardigan and a red gingham shirt.",
      },
    ],
    inStock: true,
    featured: true,
  },

  // -------------------------------------------------------------- Jumpers & sweats
  {
    slug: "mixed-premium-vintage-hoodies-sweatshirts",
    name: "Mixed Premium Vintage Hoodies & Sweatshirts",
    summary: "Premium hoods and sweats mixed, in tens, twenty-fives and fifties.",
    description: [
      "Premium vintage hoodies and sweatshirts in one mixed lot — branded, heavyweight and graded up from general intake.",
      "The most consistent repeat category we sell. Sweats hold their ticket, sell year-round, and fill the middle of a rail without competing with your hero pieces.",
      "Available in ten, twenty-five or fifty.",
    ],
    brandSlugs: ["mixed-brands", "chaps-ralph-lauren", "nautica", "champion", "nike", "guess"],
    typeSlugs: ["jumpers-sweats"],
    collectionSlugs: ["premium-vintage", "winter"],
    variants: [at(10, 9.5), at(25, 9), at(50, 8.5)],
    unit: "pieces",
    notes: [],
    art: "bands-ink-3",
    photos: [
      {
        src: "/images/products/mixed-premium-vintage-hoodies-sweatshirts/01.jpg",
        alt: "A mixed hoodie and sweatshirt lot on white: a navy Nautica Sailsports crewneck, a white Guess crewneck, a purple Lacoste zip hoodie and a green three-stripe Adidas hoodie.",
      },
    ],
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
    brandSlugs: ["mixed-brands", "chaps-ralph-lauren", "nautica", "champion", "nike", "ralph-lauren", "adidas"],
    typeSlugs: ["jumpers-sweats"],
    collectionSlugs: ["premium-vintage", "winter"],
    variants: [at(10, 9.5), at(25, 9), at(50, 8.5)],
    unit: "pieces",
    notes: [],
    art: "grid-ink-3",
    photos: [
      {
        src: "/images/products/mixed-premium-vintage-hoodies/01.jpg",
        alt: "Three vintage hoodies laid flat on white: a red and navy Polo Ralph Lauren colour-block hood with sleeve spellout, a green adidas three-stripe hood, and a grey Universal Studios Florida embroidered hood.",
      },
      {
        src: "/images/products/mixed-premium-vintage-hoodies/02.jpg",
        alt: "A Trussardi zip-through hoodie laid flat on white: charcoal body with a patterned grey, black and white banded yoke and hood, and a full-length zip.",
      },
      {
        src: "/images/products/mixed-premium-vintage-hoodies/03.jpg",
        alt: "Close-up of the Trussardi hoodie's banded hood and the embossed metal logo badge above the zip.",
      },
    ],
    videos: [
      {
        src: "/videos/products/mixed-premium-vintage-hoodies/01.mp4",
        hdr: "/videos/products/mixed-premium-vintage-hoodies/01-hdr.mp4",
        poster: "/videos/products/mixed-premium-vintage-hoodies/01-poster.jpg",
        alt: "A look through the Mixed Premium Vintage Hoodies: a navy Nike swoosh hoodie, a royal blue Nike hoodie and layered grey and red hoods.",
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
    brandSlugs: ["mixed-brands", "chaps-ralph-lauren", "nautica", "champion", "nike", "guess"],
    typeSlugs: ["jumpers-sweats"],
    collectionSlugs: ["premium-vintage", "winter"],
    variants: [at(10, 10), at(25, 9.5), at(50, 9.25)],
    unit: "pieces",
    notes: [],
    art: "diagonal-ink-3",
    photos: [
      {
        src: "/images/products/mixed-premium-vintage-sweatshirts/01.jpg",
        alt: "Three premium vintage crewnecks laid out on white: a white Guess sweatshirt with tipped ribbing, a navy Nautica Sailsports sweatshirt and a grey Chaps Ralph Lauren V-neck.",
      },
    ],
    inStock: true,
  },
  {
    slug: "lacoste-jumpers-cardigans",
    name: "Lacoste Jumpers & Cardigans",
    summary: "Croc-logo jumpers and cardigans, graded around 85% A, in tens, twenty-fives and fifties.",
    description: [
      "Lacoste knitwear on its own — crew and v-neck jumpers, button and zip cardigans, patterned knits — every piece with the croc on the chest.",
      "Graded higher than our standard lots: roughly 85% Grade A to 15% Grade B, so nearly all of it goes straight on the rail. Knitwear holds its ticket better than jersey, and the croc does the selling.",
      "Available in ten, twenty-five or fifty.",
    ],
    brandSlugs: ["lacoste"],
    typeSlugs: ["jumpers-sweats"],
    collectionSlugs: ["premium-vintage", "winter", "mens"],
    variants: [at(10, 12), at(25, 11), at(50, 10)],
    unit: "pieces",
    notes: [],
    gradeNote: "roughly 85% Grade A, 15% Grade B",
    art: "grid-ink",
    photos: [
      {
        src: "/images/products/lacoste-jumpers-cardigans/01.jpg",
        alt: "Four Lacoste knits laid flat on white: a pale blue IZOD Lacoste button cardigan, a green v-neck jumper, a navy crew with red, white and blue tipping, and a navy zip-through with the croc on the chest.",
      },
      {
        src: "/images/products/lacoste-jumpers-cardigans/02.jpg",
        alt: "A Lacoste lambswool crew-neck jumper laid flat on white: royal blue with navy and red striped ribbing at the hem and cuffs, and the croc embroidered on the chest.",
      },
      {
        src: "/images/products/lacoste-jumpers-cardigans/03.jpg",
        alt: "The back of the royal blue Lacoste lambswool jumper, showing the navy and red striped hem.",
      },
      {
        src: "/images/products/lacoste-jumpers-cardigans/04.jpg",
        alt: "A cream Lacoste V-neck jumper laid flat on white, the croc embroidered on the chest.",
      },
      {
        src: "/images/products/lacoste-jumpers-cardigans/05.jpg",
        alt: "The back of the cream Lacoste V-neck jumper, laid flat on white.",
      },
      {
        src: "/images/products/lacoste-jumpers-cardigans/06.jpg",
        alt: "A green IZOD Lacoste V-neck jumper laid flat on white, the croc embroidered on the chest.",
      },
      {
        src: "/images/products/lacoste-jumpers-cardigans/07.jpg",
        alt: "Close-up of the embroidered croc and the knitted V-neck on a green Lacoste jumper.",
      },
    ],
    videos: [
      {
        src: "/videos/products/lacoste-jumpers-cardigans/01.mp4",
        hdr: "/videos/products/lacoste-jumpers-cardigans/01-hdr.mp4",
        poster: "/videos/products/lacoste-jumpers-cardigans/01-poster.jpg",
        alt: "A look through the Lacoste Jumpers & Cardigans lot, turned over piece by piece: a navy button cardigan, a navy quarter-zip knit and a black crew, each with the croc on the chest.",
      },
    ],
    inStock: true,
    featured: true,
  },

  // ---------------------------------------------------------------------- Jackets
  {
    slug: "track-jackets-windbreakers",
    name: "Track Jackets & Windbreakers",
    summary: "Branded zip-through track tops and windbreakers, mixed.",
    description: [
      "Branded zip-through track tops and windbreakers — bright, recognisable shells from the sportswear labels, picked so the colour reads from across a rail.",
      "Outerwear earns its space on a rail: a single track top or windbreaker carries a higher ticket than almost anything else sold by the piece.",
    ],
    brandSlugs: ["mixed-brands"],
    typeSlugs: ["jackets"],
    collectionSlugs: ["festival"],
    variants: [at(10, 12.5), at(25, 11), at(50, 9)],
    unit: "pieces",
    notes: [],
    art: "stripes-ink-3",
    photos: [
      {
        src: "/images/products/track-jackets-windbreakers/01.jpg",
        alt: "Four vintage track jackets on white: a blue and pink Reebok shell, a black and white Adidas taped track top, a navy and red Nike shell and a purple Adidas trefoil jacket.",
      },
      {
        src: "/images/products/track-jackets-windbreakers/02.jpg",
        alt: "An adidas hooded windbreaker laid flat on white: pale blue nylon with crimson three-stripe taping down the sleeves, a crimson-lined hood and a half-length zip.",
      },
      {
        src: "/images/products/track-jackets-windbreakers/03.jpg",
        alt: "The back of the pale blue adidas hooded windbreaker, showing the crimson shoulder taping and the hood up.",
      },
      {
        src: "/images/products/track-jackets-windbreakers/05.jpg",
        alt: "A Fila track jacket laid flat on white: a green nylon body with black shoulders and a white chevron running across the chest and down the sleeves, full-length zip and elasticated hem.",
      },
      {
        src: "/images/products/track-jackets-windbreakers/06.jpg",
        alt: "The back of the green, black and white Fila track jacket, showing the chevron across the shoulders and the Fila F box at the neck.",
      },
      {
        src: "/images/products/track-jackets-windbreakers/07.jpg",
        alt: "An adidas track jacket on white: a navy body with a royal blue chest band and a cream yoke and collar, with the adidas wordmark on the chest.",
      },
      {
        src: "/images/products/track-jackets-windbreakers/08.jpg",
        alt: "A royal blue adidas Clima365 windbreaker laid flat on white, with navy raglan panels and three stripes down the zip.",
      },
      {
        src: "/images/products/track-jackets-windbreakers/09.jpg",
        alt: "A Reebok track jacket on white: royal blue with black side and underarm panels and the Reebok vector logo on the chest.",
      },
      {
        src: "/images/products/track-jackets-windbreakers/04.jpg",
        alt: "Close-up of the adidas windbreaker: the crimson-lined hood, half zip, woven adidas neck label and the trefoil logo on the chest.",
      },
    ],
    // The same rail as the Jackets & Windbreaker Mix: the owner shoots these
    // jackets as one line, so both pages carry the clip.
    videos: [
      {
        src: "/videos/products/jackets-windbreaker-mix/01.mp4",
        hdr: "/videos/products/jackets-windbreaker-mix/01-hdr.mp4",
        poster: "/videos/products/jackets-windbreaker-mix/01-poster.jpg",
        alt: "A look through the track jacket and windbreaker rail, turned over piece by piece: a navy, white and green Nike shell jacket, a green Champion half-zip pullover and layered branded windbreakers.",
      },
    ],
    inStock: true,
    featured: true,
  },

  // --------------------------------------------------------------------- Footwear
  {
    slug: "birkenstock-sandals",
    name: "Birkenstock Sandals",
    summary: "Birkenstocks by the pair, in tens, twenty-fives and fifties.",
    description: [
      "Second-hand Birkenstock sandals sold by the pair, in lots of ten, twenty-five or fifty.",
      "Footwear sits alongside a clothing rail without competing with it, and Birkenstocks hold their resale value better than almost anything else in second-hand footwear.",
    ],
    brandSlugs: ["birkenstock"],
    typeSlugs: ["footwear"],
    collectionSlugs: ["summer-mix"],
    variants: [at(10, 8), { pieces: 25, priceGBP: null }, { pieces: 50, priceGBP: null }],
    unit: "pairs",
    notes: [],
    art: "blocks-green",
    photos: [
      {
        src: "/images/products/birkenstock-sandals/01.jpg",
        alt: "Six pairs of second-hand Birkenstock sandals on white: four brown nubuck pairs in two-strap and toe-post styles, one white toe-post pair and one metallic snake-print pair.",
      },
      {
        src: "/images/products/birkenstock-sandals/02.jpg",
        alt: "A pair of pink patent Birkenstock sandals on white: two buckled straps, an ankle strap and the contoured cork footbed.",
      },
      {
        src: "/images/products/birkenstock-sandals/03.jpg",
        alt: "A pair of brown oiled-leather Birkenstock Gizeh toe-post sandals on white, with the cork footbed worn in.",
      },
      {
        src: "/images/products/birkenstock-sandals/04.jpg",
        alt: "A pair of silver-grey Birkenstock Madrid two-strap sandals on white, buckles open, cork footbed showing.",
      },
      {
        src: "/images/products/birkenstock-sandals/05.jpg",
        alt: "A pair of black and grey woven-strap Birkenstock sandals on white, the straps crossed over the cork footbed.",
      },
      {
        src: "/images/products/birkenstock-sandals/06.jpg",
        alt: "A pair of black shearling-lined Birkenstock sandals on white: two buckled leather straps over a fleece-lined footbed.",
      },
    ],
    inStock: false, // Marked out of stock by the owner, 16 Sep 2026.
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
    variants: qty(10, 25, 50), // Quantities and detail to be confirmed by the owner.
    unit: "pieces",
    notes: [],
    art: "halftone-ink",
    inStock: false,
  },

  // --------------------------------------------------------------- Brand-led lots
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
    variants: [at(10, 6.5), at(25, 6), at(50, 5.5)],
    unit: "pieces",
    notes: [],
    art: "bands-ink-4",
    photos: [
      {
        src: "/images/products/t-shirt-mix/01.jpg",
        alt: "Four branded vintage t-shirts laid flat on white: a purple Champion script tee, a blue Nike swoosh tee, a navy Fila logo tee and a black adidas trefoil tee.",
      },
      {
        src: "/images/products/t-shirt-mix/02.jpg",
        alt: "A Trussardi V-neck t-shirt laid flat on white: grey marl with a deep red TRU Trussardi collegiate print across the chest.",
      },
      {
        src: "/images/products/t-shirt-mix/03.jpg",
        alt: "The grey marl Trussardi V-neck t-shirt laid flat on white, showing the full collegiate chest print.",
      },
    ],
    videos: [
      {
        src: "/videos/products/t-shirt-mix/01.mp4",
        hdr: "/videos/products/t-shirt-mix/01-hdr.mp4",
        poster: "/videos/products/t-shirt-mix/01-poster.jpg",
        alt: "A look through the Branded T-Shirt Mix: a navy Nike graphic tee, a grey Puma logo tee, an olive long-sleeve and layered branded tees.",
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
      "Lightweight branded outerwear mixed across labels — quarter-zip pullovers, hooded shells and fleece-lined windbreakers from Sergio Tacchini, adidas, Nike, Fila, Columbia, The North Face, Reebok, Tommy Hilfiger and Ralph Lauren.",
      "Outerwear carries the highest single-piece ticket on a vintage rail, and this category picks up from late summer onwards.",
    ],
    brandSlugs: ["mixed-brands", "sergio-tacchini", "adidas", "nike", "fila", "columbia", "the-north-face", "reebok", "tommy-hilfiger", "ralph-lauren"],
    typeSlugs: ["jackets"],
    collectionSlugs: ["festival", "winter"],
    variants: [at(10, 10.75), at(25, 10.5), at(50, 10)],
    unit: "pieces",
    notes: [],
    art: "diagonal-green-4",
    photos: [
      {
        src: "/images/products/jackets-windbreaker-mix/01.jpg",
        alt: "Four vintage jackets laid flat on white: a navy Nike quarter-zip pullover, a red Chaps Ralph Lauren hooded pullover, a grey and navy Tommy Hilfiger hooded jacket and a white and red Reebok fleece-lined jacket.",
      },
      {
        src: "/images/products/jackets-windbreaker-mix/02.jpg",
        alt: "A vintage Nike windbreaker laid flat on white: a navy body with green and white colour-blocked panels across the chest and sleeves, a full-length zip and an elasticated hem.",
      },
      {
        src: "/images/products/jackets-windbreaker-mix/03.jpg",
        alt: "The back of the same navy, green and white Nike windbreaker, showing the colour-blocked yoke and the elasticated cuffs.",
      },
      {
        src: "/images/products/jackets-windbreaker-mix/04.jpg",
        alt: "A Nike quarter-zip windbreaker pullover on white: two tones of blue with a navy ribbed collar, a yellow zip pull and a yellow lining showing at the hem.",
      },
      {
        src: "/images/products/jackets-windbreaker-mix/05.jpg",
        alt: "The back of the two-tone blue Nike quarter-zip pullover, laid flat on white.",
      },
      {
        src: "/images/products/jackets-windbreaker-mix/06.jpg",
        alt: "Close-up of a navy Nike windbreaker: the embroidered Nike script and swoosh beside a full-length metal zip and the original woven neck label.",
      },
    ],
    videos: [
      {
        src: "/videos/products/jackets-windbreaker-mix/01.mp4",
        hdr: "/videos/products/jackets-windbreaker-mix/01-hdr.mp4",
        poster: "/videos/products/jackets-windbreaker-mix/01-poster.jpg",
        alt: "A look through the Jackets & Windbreaker Mix, turned over piece by piece: a navy, white and green Nike shell jacket, a green Champion half-zip pullover and layered branded windbreakers.",
      },
    ],
    inStock: true,
    featured: true,
  },
  {
    slug: "mens-luxury-winter-mix",
    name: "Men's Luxury Winter Mix",
    summary: "Designer knitwear, sweatshirts, hoodies, jackets and shirts — Missoni, Valentino, Stone Island, Lacoste.",
    description: [
      "Designer knitwear, sweatshirts, hoodies, jackets and shirts a clear tier above general premium vintage: Missoni Sport, Valentino, Stone Island and Lacoste in one lot.",
      "These are pieces that price on the label rather than the category, aimed at shops with an established customer for designer menswear. Small lots by nature — this is not a volume line.",
    ],
    brandSlugs: ["missoni", "valentino", "stone-island", "lacoste"],
    typeSlugs: ["jumpers-sweats", "jackets"],
    collectionSlugs: ["luxury", "premium-vintage", "mens", "winter"],
    // Ten only for now — the owner's call; not a volume line.
    variants: [at(10, 16)],
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
    variants: [at(10, 10), at(25, 9), at(50, 8)],
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
    slug: "designer-jackets",
    name: "Designer Jackets",
    summary: "Moncler, Burberry, Versace and Polo Ralph Lauren jackets, sold in tens.",
    description: [
      "Luxury outerwear and tailoring kept apart from the general jacket lots — Moncler quilted down, Burberry field jackets, Versace tailoring and Polo Ralph Lauren shells.",
      "These pieces price on the label rather than the category, which is exactly why they are not bundled in with windbreakers. One Moncler jacket can carry a rail on its own.",
      "Sold in lots of ten. Contents change with every intake, so the exact labels in a lot vary.",
    ],
    brandSlugs: ["moncler", "burberry", "versace", "ralph-lauren"],
    typeSlugs: ["jackets"],
    collectionSlugs: ["luxury", "mens", "winter"],
    variants: [at(10, 30)],
    unit: "pieces",
    notes: ["Contents change with each intake."],
    art: "bands-ink-5",
    photos: [
      {
        src: "/images/products/designer-jackets/01.jpg",
        alt: "A designer jackets lot on white: a red Polo Jeans Co zip jacket, a black quilted Moncler, a navy Burberry field jacket and a black Versace blazer with gold buttons.",
      },
    ],
    inStock: false, // Marked out of stock by the owner, 3 Oct 2026.
    featured: true,
  },
];

/**
 * A lot with no photograph is not offered for sale.
 *
 * Buyers will not commit to a fifty-piece run off a description alone, and an
 * abstract tile next to a price reads as a placeholder rather than as stock. So
 * anything unphotographed is forced out of stock here: it stays listed, stays
 * indexed and still takes enquiries, but it cannot be added to the cart or
 * bought. Photograph it and it comes back on its own — there is no second flag
 * to remember to flip.
 *
 * `inStock` in the catalogue above therefore means "we have it"; this is the
 * separate question of whether we can show it.
 */
/**
 * Closes every product description. Lots are graded from a fresh intake, so
 * what is pictured is the line, not the pieces that will be picked — and the
 * owner wants that said in the description itself, not only in the caption
 * under the photograph, so it travels with the text wherever it is reused.
 */
export const REPRESENTATIVE_NOTE =
  "The items shown are a representative example of this line, not necessarily the stock you will receive. Items, brands and colourways vary with each intake.";

export const products: Product[] = catalogue.map((product) => ({
  ...product,
  description: [...product.description, REPRESENTATIVE_NOTE],
  grade: product.grade ?? "A/B",
  // A lot needs something to show before it can sell: a photograph or a video.
  inStock:
    product.inStock && ((product.photos?.length ?? 0) > 0 || (product.videos?.length ?? 0) > 0),
}));

/** Lots held back only for want of a photograph — the shot list, in effect. */
export const awaitingPhotography = catalogue.filter(
  (p) => p.inStock && (p.photos?.length ?? 0) === 0,
);

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

/** Dearest priced variant — the top of the range for structured data. */
export function toPrice(product: Product): number | null {
  const priced = product.variants
    .map((v) => v.priceGBP)
    .filter((p): p is number => p !== null);
  return priced.length > 0 ? Math.max(...priced) : null;
}

/** How many lot sizes actually carry a price. */
export function pricedCount(product: Product): number {
  return product.variants.filter((v) => v.priceGBP !== null).length;
}

/** Cheapest priced variant, for card display and price sorting. */
export function fromPrice(product: Product): number | null {
  const priced = product.variants
    .map((v) => v.priceGBP)
    .filter((p): p is number => p !== null);
  return priced.length > 0 ? Math.min(...priced) : null;
}

/** The quantity options as a readable run, e.g. "10, 25 or 50". */
export function quantityLabel(product: Product): string {
  if (product.variants.length === 0) return "Quantities on request";
  const counts = product.variants.map((v) => v.pieces);
  if (counts.length === 1) return `${counts[0]} ${product.unit}`;
  const last = counts[counts.length - 1];
  return `${counts.slice(0, -1).join(", ")} or ${last} ${product.unit}`;
}

/**
 * PAGE ONE — the "Popular lots" on the home page, in the order they appear.
 *
 * This is the knob the weekly review turns. Reorder it from the analytics:
 * page views, add_to_basket and enquiry_click per product. Hottest first.
 * Anything sold out drops off automatically; anything listed here that is not
 * in the catalogue is ignored rather than crashing the build.
 *
 * Seeded with what was on page one before the list existed, so nothing moved
 * the day it was introduced.
 */
/**
 * Selling order. Lots with a rail video convert best, so they lead; the
 * home page "Popular lots" takes the first six in stock, and the default
 * sort on every grid follows the same order. `sinkSlugs` always sit last.
 */
export const homeFeatured = [
  "ralph-tommy-lacoste-mix",
  "starter-box-10",
  "y2k-designer-female-mix-box",
  "ralph-lauren-polo-box-10",
  "lacoste-jumpers-cardigans",
  "jackets-windbreaker-mix",
  "mixed-premium-vintage-hoodies",
  "t-shirt-mix",
  "track-jackets-windbreakers",
  "carhartt-dickies-t-shirts",
  "lacoste-ralph-lauren-polos",
  "ralph-lauren-polos",
  "mixed-premium-vintage-hoodies-sweatshirts",
  "mixed-premium-vintage-sweatshirts",
  "womens-y2k-summer-mix",
];

/** Lots the owner wants kept low on every page: high ticket, niche, or paused. */
export const sinkSlugs = ["designer-jackets", "birkenstock-sandals", "mens-luxury-winter-mix"];

/** Lower is more prominent. Ties fall back to catalogue order. */
export function merchRank(product: Product): number {
  const i = products.findIndex((p) => p.slug === product.slug);
  if (sinkSlugs.includes(product.slug)) return 9000 + i;
  if (!product.inStock) return 8000 + i;
  const spot = homeFeatured.indexOf(product.slug);
  if (spot >= 0) return spot;
  if ((product.videos?.length ?? 0) > 0) return 1000 + i;
  if (product.featured) return 2000 + i;
  return 3000 + i;
}

export const featuredProducts: Product[] = homeFeatured
  .map((slug) => products.find((p) => p.slug === slug))
  .filter((p): p is Product => Boolean(p) && (p as Product).inStock);

/**
 * The picture that fronts a lot on cards, tiles and search: its first
 * photograph, else the poster of its first video, else the placeholder art.
 */
export function coverImage(product: Product): { src: string; alt: string; video: boolean } {
  const photo = product.photos?.[0];
  if (photo) return { src: photo.src, alt: photo.alt, video: false };
  const video = product.videos?.[0];
  if (video) return { src: video.poster, alt: video.alt, video: true };
  return { src: `/images/tiles/${product.art}.svg`, alt: `${product.name} — ${product.summary}`, video: false };
}
