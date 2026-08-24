/**
 * The three ways a customer can browse: by product type, by brand, and by
 * collection. All three render the same filterable grid, so adding a category
 * here is enough to give it a page, a home-page tile, a footer link and a
 * sitemap entry.
 *
 * `seoCopy` is the keyword-rich paragraph at the foot of the category page.
 */

export type CategoryKind = "brand" | "type" | "collection";

export type Category = {
  slug: string;
  name: string;
  /** One line under the page title. */
  blurb: string;
  /** Longer SEO block at the foot of the category page. */
  seoCopy: string;
  /** Path under /public/images/tiles, without extension. */
  art: string;
  /** Shown on the home page grid. */
  featured?: boolean;
};

export const productTypes: Category[] = [
  {
    slug: "polos-t-shirts",
    name: "Polos & T-Shirts",
    blurb: "Branded piqué polos and tees, sold in fives and up.",
    seoCopy:
      "Wholesale vintage polos and t-shirts from a UK supplier. Lacoste and Ralph Lauren piqué polos, Champion tees, mixed branded tee lots, Carhartt and Dickies workwear tees, and designer mixes — available in quantities from five pieces up to a hundred so you can test a line before you commit to volume.",
    art: "grid-green",
    featured: true,
  },
  {
    slug: "jumpers-sweats",
    name: "Jumpers & Sweats",
    blurb: "Premium vintage hoodies, sweatshirts, jumpers and cardigans.",
    seoCopy:
      "Wholesale vintage hoodies and sweatshirts, plus Lacoste jumpers and cardigans. Premium vintage sweats are the most consistent repeat category in UK vintage retail — bought in mixed lots from five pieces, or in depth up to a hundred.",
    art: "bands-ink",
    featured: true,
  },
  {
    slug: "jackets",
    name: "Jackets",
    blurb: "Festival track jackets and designer outerwear.",
    seoCopy:
      "Vintage jacket wholesale in the UK. Festival track jackets for the summer season and designer outerwear lots in small runs — the highest single-piece margin of anything we sell, and the fastest category to clear at a festival or market stall.",
    art: "diagonal-green",
    featured: true,
  },
  {
    slug: "footwear",
    name: "Footwear",
    blurb: "Birkenstock sandals, sold by the pair in graded lots.",
    seoCopy:
      "Wholesale vintage footwear — Birkenstock sandals in lots of five to fifty pairs. Footwear sells alongside a clothing rail without competing with it, and Birkenstocks hold their resale value better than almost anything else in second-hand footwear.",
    art: "blocks-green",
    featured: true,
  },
  {
    slug: "accessories",
    name: "Accessories",
    blurb: "Bags and finishing pieces for the counter.",
    seoCopy:
      "Vintage accessories wholesale — bags and small pieces that sell from the counter rather than the rail. Low-ticket add-ons that lift the average basket on a market stall or in a shop.",
    art: "halftone-ink",
  },
];

export const brands: Category[] = [
  {
    slug: "lacoste",
    name: "Lacoste",
    blurb: "Croc polos, jumpers and cardigans, in depth.",
    seoCopy:
      "Wholesale vintage Lacoste from a UK supplier. Croc-logo polo shirts, knitted jumpers and zip-through cardigans in lots from ten pieces to a hundred. Lacoste is one of the two labels our buyers reorder most.",
    art: "grid-green-2",
    featured: true,
  },
  {
    slug: "ralph-lauren",
    name: "Ralph Lauren",
    blurb: "Pony polos, men's and women's, in every quantity.",
    seoCopy:
      "Vintage Ralph Lauren wholesale in the UK. Polo Ralph Lauren pony polos in mixed colourways and sizing, sold on their own or mixed with Lacoste, from five pieces up to a hundred.",
    art: "diagonal-ink",
    featured: true,
  },
  {
    slug: "nike",
    name: "Nike",
    blurb: "Swoosh tees, shells and shorts across the mixed lots.",
    seoCopy:
      "Wholesale vintage Nike, UK stock. Swoosh and spellout tees, nylon shells and shorts, supplied within our mixed branded tee, jacket and Y2K lots rather than as a single-brand run.",
    art: "bands-green",
    featured: true,
  },
  {
    slug: "champion",
    name: "Champion",
    blurb: "Reverse weave and script-logo tees.",
    seoCopy:
      "Vintage Champion wholesale from the UK. Script-logo and reverse-weave tees in lots of five, ten or twenty — a reliable seller wherever American college sportswear has a following.",
    art: "stripes-ink",
    featured: true,
  },
  {
    slug: "hugo-boss",
    name: "Hugo Boss",
    blurb: "Men's designer mix, sold as a twenty-piece lot.",
    seoCopy:
      "Wholesale vintage Hugo Boss — men's designer mixed lots of twenty pieces. Branded designer menswear that prices above general vintage and gives a rail a premium end.",
    art: "blocks-ink",
  },
  {
    slug: "carhartt",
    name: "Carhartt",
    blurb: "Workwear tees in twenty-fives and fifties.",
    seoCopy:
      "Vintage Carhartt wholesale in the UK. Workwear t-shirts sold alongside Dickies in lots of twenty-five and fifty — a category with its own dedicated buyer that rarely overlaps with sportswear.",
    art: "halftone-green",
  },
  {
    slug: "dickies",
    name: "Dickies",
    blurb: "Workwear tees, bundled with Carhartt.",
    seoCopy:
      "Wholesale vintage Dickies workwear. Branded work tees in mixed lots with Carhartt, in twenty-fives and fifties, for shops selling into the workwear and skate market.",
    art: "stripes-green-2",
  },
  {
    slug: "tommy-hilfiger",
    name: "Tommy Hilfiger",
    blurb: "Flag-logo pieces in the designer mixes.",
    seoCopy:
      "Vintage Tommy Hilfiger wholesale, supplied within our Ralph, Tommy, Lacoste mix and our jackets and windbreaker lots. Flag-logo polos, tees and hooded outerwear.",
    art: "diagonal-green-3",
  },
  {
    slug: "birkenstock",
    name: "Birkenstock",
    blurb: "Sandals by the pair, five to fifty.",
    seoCopy:
      "Wholesale Birkenstock sandals from a UK vintage supplier. Sold by the pair in lots of five, ten, twenty-five and fifty — second-hand Birkenstocks hold their value and turn over fast in the right shop.",
    art: "blocks-green-2",
  },
  {
    slug: "adidas",
    name: "Adidas",
    blurb: "Three-stripe tees, hoods and track pieces.",
    seoCopy:
      "Wholesale vintage Adidas from a UK supplier. Trefoil and three-stripe tees, hooded sweats and track pieces, sold in mixed lots alongside the other sportswear labels we carry.",
    art: "bands-green-4",
    featured: true,
  },
  {
    slug: "reebok",
    name: "Reebok",
    blurb: "Shell jackets and 90s sportswear.",
    seoCopy:
      "Vintage Reebok wholesale in the UK. Shell jackets, windbreakers and 90s sportswear — a label that sells strongly to buyers working the terrace and festival end of the market.",
    art: "stripes-ink-4",
  },
  {
    slug: "fila",
    name: "Fila",
    blurb: "Logo tees and tape-detail pieces.",
    seoCopy:
      "Wholesale vintage Fila. Logo tees, tape-detail sportswear and colour-block pieces, included in our mixed branded tee and sportswear lots.",
    art: "grid-green-4",
  },
  {
    slug: "harley-davidson",
    name: "Harley-Davidson",
    blurb: "Dealer tees, vests and womenswear.",
    seoCopy:
      "Vintage Harley-Davidson wholesale in the UK. Dealer-print tees, long-sleeves and womenswear — a category with its own committed buyer that prices well above general vintage.",
    art: "diagonal-ink-4",
  },
  {
    slug: "stone-island",
    name: "Stone Island",
    blurb: "Badged knitwear and outerwear, sold in premium lots.",
    seoCopy:
      "Stone Island wholesale, sold within our men's luxury lots. Badged knitwear and outerwear at the top of the price ladder — for shops with an established customer for designer menswear.",
    art: "halftone-green-4",
    featured: true,
  },
  {
    slug: "missoni",
    name: "Missoni",
    blurb: "Patterned Italian knitwear.",
    seoCopy:
      "Vintage Missoni wholesale. Patterned Italian knitwear from the Missoni Sport line, supplied within our men's luxury winter lots — rare, distinctive, and priced accordingly.",
    art: "blocks-ink-4",
  },
  {
    slug: "valentino",
    name: "Valentino",
    blurb: "Designer knitwear, argyle and fine gauge.",
    seoCopy:
      "Valentino vintage wholesale, supplied within our luxury knitwear lots. Argyle and fine-gauge designer knits for retailers selling at the premium end.",
    art: "stripes-green-4",
  },
  {
    slug: "mixed-brands",
    name: "Mixed Brands",
    blurb: "Multi-label lots spanning the full intake.",
    seoCopy:
      "Mixed-brand vintage wholesale lots for buyers who want breadth. Each lot spans several recognised labels, picked to give a stall or online shop a full rail from a single purchase.",
    art: "halftone-ink-2",
  },
];

export const collections: Category[] = [
  {
    slug: "reseller-boxes",
    name: "Reseller Boxes",
    blurb: "Ready-made twenty-piece boxes at a fixed price. The quickest way to start.",
    seoCopy:
      "Vintage reseller boxes from a UK wholesaler. Fixed-price boxes of twenty designer pieces, split into men's and women's Y2K mixes — made up and priced so you can order in one click and start selling the week it lands. The simplest entry point into vintage wholesale.",
    art: "bands-green-2",
    featured: true,
  },
  {
    slug: "y2k",
    name: "Y2K",
    blurb: "Late 90s and early 2000s designer, the cuts resale is asking for.",
    seoCopy:
      "Y2K vintage wholesale in the UK. Late-90s and early-2000s designer pieces — logo-forward, bold colourways and the cuts currently driving resale demand on Depop and Vinted.",
    art: "halftone-green-2",
    featured: true,
  },
  {
    slug: "premium-vintage",
    name: "Premium Vintage",
    blurb: "The graded top end of each intake.",
    seoCopy:
      "Premium vintage wholesale — the strongest pieces from each intake, graded up rather than bundled into general mixed lots. For retailers who sell on piece quality rather than volume.",
    art: "grid-ink",
    featured: true,
  },
  {
    slug: "summer-mix",
    name: "Summer Mix",
    blurb: "Lightweight branded layers for warm-weather trading.",
    seoCopy:
      "Summer vintage wholesale bundles — lightweight branded polos, tees and thin layers from Ralph Lauren, Tommy Hilfiger and Lacoste. Bought seasonally and priced to move volume through spring and summer.",
    art: "stripes-green",
    featured: true,
  },
  {
    slug: "festival",
    name: "Festival",
    blurb: "Track jackets and loud pieces built for the festival run.",
    seoCopy:
      "Festival vintage wholesale — track jackets and bold branded pieces for the summer festival circuit. Bright, recognisable and priced to sell fast at a temporary pitch.",
    art: "diagonal-ink-2",
  },
  {
    slug: "womens",
    name: "Women's",
    blurb: "Womenswear picked and sized as its own category.",
    seoCopy:
      "Women's vintage wholesale from Archive Wholesale. Womenswear is picked and sized as its own category rather than sifted out of men's lots — designer Y2K pieces in true women's sizing.",
    art: "bands-ink-2",
  },
  {
    slug: "mens",
    name: "Men's",
    blurb: "Men's designer and sportswear lots.",
    seoCopy:
      "Men's vintage wholesale — designer and sportswear lots across Lacoste, Ralph Lauren, Hugo Boss, Nike and Champion, in quantities from five pieces to a hundred.",
    art: "blocks-ink-2",
  },
];

export const categoryGroups: {
  kind: CategoryKind;
  path: string;
  title: string;
  intro: string;
  items: Category[];
}[] = [
  {
    kind: "type",
    path: "/types",
    title: "Shop by Product",
    intro: "Buying to fill a gap on the rail? Start from the garment.",
    items: productTypes,
  },
  {
    kind: "brand",
    path: "/brands",
    title: "Popular Brands",
    intro: "The labels our buyers ask for by name.",
    items: brands,
  },
  {
    kind: "collection",
    path: "/collections",
    title: "Collections",
    intro: "Ready-made boxes and trend-led selections, cutting across brand and garment.",
    items: collections,
  },
];

const byKind: Record<CategoryKind, { items: Category[]; path: string }> = {
  brand: { items: brands, path: "/brands" },
  type: { items: productTypes, path: "/types" },
  collection: { items: collections, path: "/collections" },
};

export function categoryPath(kind: CategoryKind, slug: string): string {
  return `${byKind[kind].path}/${slug}`;
}

export function findCategory(kind: CategoryKind, slug: string): Category | undefined {
  return byKind[kind].items.find((c) => c.slug === slug);
}

export function allCategories(): { kind: CategoryKind; category: Category }[] {
  return categoryGroups.flatMap((group) =>
    group.items.map((category) => ({ kind: group.kind, category })),
  );
}
