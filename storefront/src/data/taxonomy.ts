/**
 * How the shop is organised.
 *
 * Three ways in, all rendering the same filterable grid:
 *
 *   /shop/<type>        garment type    — Polos, Jackets, Knitwear …
 *   /edit/<edit>        a curated edit  — New In, Y2K, Sale …
 *   /brands/<brand>     brand           — built from whatever brands the CSV contains
 *
 * Adding a section here is enough to give it a page, a place in the navigation
 * and a sitemap entry. Which listings land in it is decided by the matchers in
 * `src/lib/classify.ts`, which run once at build time.
 *
 * This file is deliberately free of functions and `fs` so it can be imported
 * from client components as well as server ones.
 */

export type Section = {
  slug: string;
  name: string;
  /** One line under the page title. */
  blurb: string;
  /** Longer block at the foot of the section page, for search engines. */
  seoCopy: string;
  /** Artwork key under /public/images/art, used until a photo is available. */
  art: string;
  /** Shown in the home page grid. */
  featured?: boolean;
};

/** Garment types — the spine of the navigation. */
export const productTypes: Section[] = [
  {
    slug: "polos",
    name: "Polos",
    blurb: "Piqué polos — Ralph Lauren, Lacoste and the rest of the rail.",
    seoCopy:
      "Vintage polo shirts, each one photographed and graded individually. Ralph Lauren pony polos, Lacoste croc polos and branded piqué in men's and women's sizing. Every polo is a single piece — when it sells, it is gone.",
    art: "polos",
    featured: true,
  },
  {
    slug: "t-shirts",
    name: "T-Shirts",
    blurb: "Spellouts, graphics and single-stitch tees.",
    seoCopy:
      "Vintage t-shirts from the archive — branded spellouts, graphic prints and plain single-stitch tees. Sizes are measured and stated, condition is graded, and every tee is a one-off.",
    art: "tees",
    featured: true,
  },
  {
    slug: "jackets",
    name: "Jackets & Coats",
    blurb: "Track tops, shells, windbreakers and outerwear.",
    seoCopy:
      "Vintage jackets and coats — Nike and Adidas track tops, nylon shells, windbreakers, bombers and heavier outerwear. The strongest category in the archive and the fastest to move.",
    art: "jackets",
    featured: true,
  },
  {
    slug: "hoodies-sweats",
    name: "Hoodies & Sweats",
    blurb: "Hooded sweats, crewnecks and heavyweight fleece.",
    seoCopy:
      "Vintage hoodies and sweatshirts — hooded sweats, crewnecks and heavyweight fleece from the sportswear labels. Graded, measured and sold as single pieces.",
    art: "sweats",
    featured: true,
  },
  {
    slug: "knitwear",
    name: "Knitwear",
    blurb: "Jumpers, cardigans and knitted collars.",
    seoCopy:
      "Vintage knitwear — jumpers, cardigans, knitted polos and zip-through collars. Lacoste, Ralph Lauren and the heritage labels, one piece at a time.",
    art: "knitwear",
    featured: true,
  },
  {
    slug: "shirts",
    name: "Shirts",
    blurb: "Button-downs, checks and overshirts.",
    seoCopy:
      "Vintage shirts — oxford button-downs, tartan and check flannels, and overshirts. Each shirt is graded and measured, and sold as a single piece.",
    art: "shirts",
  },
  {
    slug: "tops",
    name: "Tops",
    blurb: "Vests, bralettes, camis and going-out tops.",
    seoCopy:
      "Vintage women's tops — bralettes, vests, camis and going-out pieces, largely Y2K. Single pieces, graded and measured.",
    art: "tops",
  },
  {
    slug: "bottoms",
    name: "Bottoms",
    blurb: "Jeans, track pants, shorts and cargos.",
    seoCopy:
      "Vintage bottoms — denim, track pants, cargos and shorts. Waist and leg measurements are stated on every listing rather than left to a size label.",
    art: "bottoms",
  },
  {
    slug: "dresses-skirts",
    name: "Dresses & Skirts",
    blurb: "Slips, minis and printed pieces.",
    seoCopy:
      "Vintage dresses and skirts from the archive — slip dresses, minis, printed and pleated pieces. Sold as single one-off garments.",
    art: "dresses",
  },
  {
    slug: "footwear",
    name: "Footwear",
    blurb: "Trainers, sandals and boots.",
    seoCopy:
      "Vintage footwear — trainers, Birkenstock sandals and boots, graded honestly with wear stated and photographed.",
    art: "footwear",
  },
  {
    slug: "accessories",
    name: "Accessories",
    blurb: "Bags, caps, belts and the small stuff.",
    seoCopy:
      "Vintage accessories — bags, caps, belts, scarves and small leather goods. The finishing pieces, sold individually.",
    art: "accessories",
  },
];

/** Who it is cut for. Kept separate from type so both can be filtered at once. */
export const departments: Section[] = [
  {
    slug: "womens",
    name: "Women's",
    blurb: "Everything cut for women, across every category.",
    seoCopy:
      "Women's vintage clothing — Y2K tops, polos, track jackets, knitwear and dresses. Every piece is a single garment, measured and graded before it goes up.",
    art: "womens",
    featured: true,
  },
  {
    slug: "mens",
    name: "Men's",
    blurb: "Everything cut for men, across every category.",
    seoCopy:
      "Men's vintage clothing — branded polos, track jackets, sweats and knitwear from the sportswear and heritage labels. One-off pieces, graded and measured.",
    art: "mens",
    featured: true,
  },
];

/** Curated edits. Membership is worked out from the data, not hand-listed. */
export const edits: Section[] = [
  {
    slug: "new-in",
    name: "New In",
    blurb: "The most recent pieces to go up, newest first.",
    seoCopy:
      "The newest additions to the Milltown Archive. Stock is added in small batches as it is sorted, photographed and graded, so this page changes often and pieces rarely come back.",
    art: "new-in",
    featured: true,
  },
  {
    slug: "y2k",
    name: "Y2K",
    blurb: "Late nineties into the early 2000s.",
    seoCopy:
      "Y2K vintage clothing — the late nineties into the early 2000s. Baby tees, bralettes, track jackets, logo-heavy sportswear and the cuts that define the era.",
    art: "y2k",
    featured: true,
  },
  {
    slug: "summer",
    name: "Summer",
    blurb: "Lighter weights for the warm months.",
    seoCopy:
      "Summer vintage — polos, tees, vests, bralettes, shorts and lightweight shells. The lighter end of the archive, picked out for the warm months.",
    art: "summer",
  },
  {
    slug: "sale",
    name: "Sale",
    blurb: "Pieces reduced from their original price.",
    seoCopy:
      "Reduced vintage clothing. Anything here has been marked down from the price it first went up at — same grading, same photographs, lower price.",
    art: "sale",
  },
  {
    slug: "under-15",
    name: "Under £15",
    blurb: "Everything on the rail at £15 or less.",
    seoCopy:
      "Vintage clothing under £15. The entry point to the archive — graded pieces at or below fifteen pounds, across every category.",
    art: "under-15",
    featured: true,
  },
];

/**
 * Display spellings for brands. The CSV is the source of truth for which
 * brands exist; this only fixes how a name is written when the spreadsheet
 * says "levis" or "ralph lauren". Anything not listed is shown as typed.
 */
export const brandDisplayNames: Record<string, string> = {
  levis: "Levi's",
  "levi-s": "Levi's",
  "ralph-lauren": "Ralph Lauren",
  "polo-ralph-lauren": "Ralph Lauren",
  lacoste: "Lacoste",
  nike: "Nike",
  adidas: "Adidas",
  champion: "Champion",
  carhartt: "Carhartt",
  "tommy-hilfiger": "Tommy Hilfiger",
  "harley-davidson": "Harley Davidson",
  "the-north-face": "The North Face",
  "stone-island": "Stone Island",
  berghaus: "Berghaus",
  reebok: "Reebok",
  puma: "Puma",
  umbro: "Umbro",
  kappa: "Kappa",
  fila: "Fila",
  dickies: "Dickies",
  burberry: "Burberry",
  "fred-perry": "Fred Perry",
  ellesse: "Ellesse",
  "skinny-minnie": "Skinny Minnie",
};

export const allSections = [...productTypes, ...departments, ...edits];

export function findSection(sections: Section[], slug: string): Section | undefined {
  return sections.find((section) => section.slug === slug);
}
