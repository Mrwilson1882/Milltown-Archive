/**
 * The three ways a customer can browse: by brand, by product type, and by
 * trend-led collection. All three render the same filterable grid, so adding a
 * category here is enough to give it a page, a home-page tile and a sitemap
 * entry.
 *
 * `seoCopy` is the short keyword-rich paragraph that sits at the foot of the
 * category page. Keep it factual and specific — it is written for customers
 * first and search engines second.
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

export const brands: Category[] = [
  {
    slug: "nike",
    name: "Nike",
    blurb: "Track jackets, windbreakers, tees and fleece from the swoosh archive.",
    seoCopy:
      "Wholesale vintage Nike from a UK supplier. Our Nike bundles are picked for retail-ready condition and cover 90s and Y2K track jackets, windbreakers, spellout tees, hoodies and fleece. Every lot is hand-sorted and graded in Manchester before it ships.",
    art: "bands-green",
    featured: true,
  },
  {
    slug: "adidas",
    name: "Adidas",
    blurb: "Three-stripe tracksuits, trefoil tees and terrace-ready outerwear.",
    seoCopy:
      "Buy vintage Adidas wholesale in the UK. Three-stripe track tops, full tracksuits, trefoil sweatshirts and tees, sorted by size and condition into mixed bundles for resellers, market traders and vintage shops.",
    art: "stripes-ink",
    featured: true,
  },
  {
    slug: "lacoste",
    name: "Lacoste",
    blurb: "Croc polos, knitwear and shell jackets, sorted by size and colour.",
    seoCopy:
      "Vintage Lacoste wholesale bundles from Archive Wholesale. Croc-logo polo shirts, knitted jumpers and shell jackets in mixed sizes and colourways, hand-graded so you know exactly what condition you are buying.",
    art: "grid-green",
    featured: true,
  },
  {
    slug: "ralph-lauren",
    name: "Ralph Lauren",
    blurb: "Pony polos, oxford shirts and knits, men's and women's.",
    seoCopy:
      "Wholesale vintage Ralph Lauren in the UK. Polo Ralph Lauren pony polos, oxford shirts, rugby tops and knitwear across men's and women's sizing, bundled by size run and condition grade.",
    art: "diagonal-ink",
    featured: true,
  },
  {
    slug: "mixed-brands",
    name: "Mixed Brands",
    blurb: "Branded sportswear lots spanning the full archive.",
    seoCopy:
      "Mixed-brand vintage sportswear bundles for buyers who want breadth. Each lot spans several recognised sportswear labels, picked to give a market stall or online shop a full rail from a single purchase.",
    art: "halftone-green",
  },
];

export const productTypes: Category[] = [
  {
    slug: "track-jackets",
    name: "Track Jackets",
    blurb: "Zip-through shell and tricot tops, 90s through Y2K.",
    seoCopy:
      "Vintage track jacket wholesale, UK stock. Shell, tricot and velour zip-throughs from the sportswear archive — the strongest-selling category we carry, bundled in mixed sizes and colourways.",
    art: "diagonal-green",
    featured: true,
  },
  {
    slug: "polos",
    name: "Polos",
    blurb: "Branded piqué polos across men's and women's sizing.",
    seoCopy:
      "Wholesale vintage polo shirts from Ralph Lauren, Lacoste and other branded labels. Piqué cotton polos in mixed sizes, colours and condition grades — a dependable repeat-order category for vintage retailers.",
    art: "grid-ink",
    featured: true,
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    blurb: "Heavyweight branded hoods, spellout and embroidered.",
    seoCopy:
      "Vintage hoodie wholesale from a UK supplier. Heavyweight branded hoods with spellout prints and embroidered logos, sorted for wearable condition and bundled by size run.",
    art: "bands-ink",
    featured: true,
  },
  {
    slug: "sweatshirts",
    name: "Sweatshirts",
    blurb: "Crewnecks and quarter-zips with the logos buyers ask for.",
    seoCopy:
      "Wholesale vintage sweatshirts — branded crewnecks, quarter-zips and fleece-lined tops. Mixed-brand and single-brand lots available, all hand-picked and graded before dispatch.",
    art: "halftone-ink",
    featured: true,
  },
  {
    slug: "tracksuits",
    name: "Tracksuits",
    blurb: "Matched top-and-bottom sets, sized as pairs.",
    seoCopy:
      "Full vintage tracksuit sets sold wholesale. Matched tops and bottoms kept together and sized as pairs — the highest-value sportswear category we bundle, aimed at shops with an established vintage customer.",
    art: "stripes-green",
  },
  {
    slug: "jackets-outerwear",
    name: "Jackets & Outerwear",
    blurb: "Coach jackets, windbreakers, puffers and shells.",
    seoCopy:
      "Vintage outerwear wholesale in the UK. Coach jackets, windbreakers, shells and puffers from branded sportswear labels — a seasonal category that carries the strongest margin from autumn onwards.",
    art: "blocks-green",
  },
  {
    slug: "knitwear",
    name: "Knitwear",
    blurb: "Cardigans, jumpers and patterned knits.",
    seoCopy:
      "Wholesale vintage knitwear — branded cardigans, crew and v-neck jumpers and patterned knits. Sorted by weight and condition so you can buy for the season you are selling into.",
    art: "blocks-ink",
  },
];

export const collections: Category[] = [
  {
    slug: "y2k",
    name: "Y2K",
    blurb: "Late 90s and early 2000s cuts, the pieces resale is asking for.",
    seoCopy:
      "Y2K vintage wholesale bundles. Late-90s and early-2000s sportswear and womenswear — cropped cuts, bold colourways and logo-forward pieces selected for the buyers currently driving resale demand.",
    art: "halftone-green-2",
    featured: true,
  },
  {
    slug: "womens",
    name: "Women's",
    blurb: "Womenswear picked and sized as its own category, not an afterthought.",
    seoCopy:
      "Women's vintage wholesale from Archive Wholesale. Womenswear is picked, sized and graded as its own category rather than sifted out of men's lots — polos, cardigans, bralettes, track tops and Y2K pieces in true women's sizing.",
    art: "grid-green-2",
    featured: true,
  },
  {
    slug: "summer-mix",
    name: "Summer Mix",
    blurb: "Lightweight layers for the warm-weather rail.",
    seoCopy:
      "Summer vintage wholesale bundles — lightweight branded tees, polos, shorts and thin layers for the warm-weather rail. Bought seasonally and priced to move volume through spring and summer.",
    art: "bands-green-2",
  },
  {
    slug: "premium-picks",
    name: "Premium Picks",
    blurb: "Single-piece grade selections from the top of each intake.",
    seoCopy:
      "Premium vintage picks — the strongest single pieces pulled from each intake before bundling. Small, high-grade lots for retailers who sell on piece quality rather than volume.",
    art: "diagonal-green-2",
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
    kind: "brand",
    path: "/brands",
    title: "Shop by Brand",
    intro: "The labels our buyers ask for by name, bundled brand-pure where the intake allows.",
    items: brands,
  },
  {
    kind: "type",
    path: "/types",
    title: "Shop by Type",
    intro: "Buying to fill a gap on the rail? Start from the garment.",
    items: productTypes,
  },
  {
    kind: "collection",
    path: "/collections",
    title: "Collections",
    intro: "Trend-led selections cut across brand and garment type.",
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
