/**
 * The two adverts, as content.
 *
 * Every price, brand and claim in here is lifted from the web build — the
 * reseller boxes and the Ralph/Tommy/Lacoste lot in site/src/data/catalogue.ts,
 * the grade from the catalogue default, the wording from the product
 * descriptions and the home page. Nothing is invented and no price is inferred,
 * which is the standing rule in pricing-notes.md.
 */

const SITE = "ARCHIVEWHOLESALE.CO.UK";

/** Closes both adverts, per REPRESENTATIVE_NOTE in the catalogue. */
const FINE_PRINT =
  "Items shown are a representative example of the line, not necessarily the stock you receive. Brands and colourways vary with each intake.";

const V = (name) => `videos/products/${name}`;
const P = (name) => `images/products/${name}`;

/* ===========================================================================
   ADVERT ONE — the reseller boxes, and the introduction
   =========================================================================== */

export const boxesAd = {
  id: "reseller-boxes",
  duration: 14.4,
  /** What plays in the media window. The two cards paint over it. */
  shots: [
    // From the top: the Chaps Ralph Lauren spellout is on screen for the first
    // second or so, then the piece is turned over. Starting any later opens on
    // the pile underneath it instead.
    { dur: 2.8, kind: "video", src: V("starter-box-10/02.mp4"), ss: 0, fit: "cover" },
    { dur: 2.6, kind: "video", src: V("starter-box-10/01.mp4"), ss: 0.6, fit: "cover" },
    { dur: 5.6, kind: "plain" },
    { dur: 3.4, kind: "plain" },
  ],

  /** What is written over it. */
  scenes: [
    {
      start: 0,
      end: 2.8,
      words: ["BOXED.", "GRADED.", "PRICED."],
    },
    {
      start: 2.8,
      end: 5.4,
      kicker: "NEW OUT OF LANCASHIRE",
      headline: "WE SORT AND GRADE IT HERE",
      body: "Branded vintage for vintage shops, market traders and online resellers.",
    },
    {
      /**
       * All three boxes on one card. The two Mix boxes are priced identically,
       * so the ladder is written per price rather than per box — each figure
       * appears once, and the Starter Box keeps its own £90 because it is not
       * the same price and has no twenty.
       */
      start: 5.4,
      end: 11.0,
      boxes: {
        headline: "THREE RESELLER BOXES",
        items: [
          { photo: P("starter-box-10/01.jpg"), name: "STARTER\nBOX" },
          { photo: P("designer-male-mix-box/01.jpg"), name: "DESIGNER\nMALE MIX" },
          { photo: P("y2k-designer-female-mix-box/01.jpg"), name: "Y2K DESIGNER\nFEMALE MIX" },
        ],
        rows: [
          ["STARTER BOX · 10", "£90"],
          ["EITHER MIX BOX · 10", "£100"],
          ["EITHER MIX BOX · 20", "£180"],
        ],
      },
    },
    {
      start: 11.0,
      end: 14.4,
      card: {
        headline: "WE SORT IT.\nYOU SELL IT.",
        sub: "Graded A/B · Lacoste · Ralph Lauren · Nike · Champion · Carhartt",
        url: SITE,
        fine: FINE_PRINT,
      },
    },
  ],
};

/* ===========================================================================
   ADVERT TWO — Ralph, Tommy, Lacoste Mix
   =========================================================================== */

export const rtlAd = {
  id: "ralph-tommy-lacoste-mix",
  duration: 14.0,
  /** One unbroken take — the flip-through is the advert. */
  shots: [
    { dur: 14.0, kind: "video", src: V("ralph-tommy-lacoste-mix/01.mp4"), ss: 0.15, fit: "cover" },
  ],

  scenes: [
    {
      start: 0,
      end: 2.6,
      words: ["RALPH.", "TOMMY.", "LACOSTE."],
    },
    {
      start: 2.6,
      end: 5.4,
      kicker: "ONE LOT, THREE LABELS",
      headline: "RALPH, TOMMY, LACOSTE MIX",
      body: "The three designer labels that carry a rail on their own.",
    },
    {
      start: 5.4,
      end: 8.2,
      kicker: "COLOUR-LED",
      headline: "BRIGHT FROM ACROSS A MARKET HALL",
      body: "Graded A/B and picked to sell straight off the rail.",
    },
    {
      start: 8.2,
      end: 11.4,
      kicker: "BUY IT BY THE LOT",
      rows: [
        ["10 PIECES", "£95"],
        ["25 PIECES", "£225"],
        ["50 PIECES", "£425"],
      ],
    },
    {
      start: 11.4,
      end: 14.0,
      card: {
        headline: "TEST TEN.\nTHEN BUY\nIN DEPTH.",
        sub: "Ralph Lauren · Tommy Hilfiger · Lacoste · Graded A/B",
        url: SITE,
        fine: FINE_PRINT,
      },
    },
  ],
};

export const ADS = [boxesAd, rtlAd];
