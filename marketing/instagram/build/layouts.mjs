/**
 * Archive Wholesale — Instagram ad layouts.
 *
 * Two canvases, one grammar: white ground, black display type, forest green
 * (#0F4A2E) as the only accent, and the footage in a square window.
 *
 * The footage is square — 1080 × 1080 straight off the phone — so the window
 * is square too and runs the full width of the canvas in both formats. Nothing
 * is cropped: a square source cannot be made taller without cutting the sides
 * off the garment, and the garments are the advert.
 *
 * That width is paid for out of the type. 9:16 carries the wordmark above the
 * window and the copy below it, inside Instagram's story safe area — nothing
 * that matters above y=250 or below y=1670, where the profile chip and the
 * reply bar land. 4:5 has only 270px left under a full-width square, so its
 * wordmark sits on the same line as the kicker and costs no height at all.
 */

export const BRAND = {
  ink: "#000000",
  paper: "#ffffff",
  forest: "#0F4A2E",
  forestLight: "#1C6B43",
  smoke: "#f4f4f2",
  ash: "#e4e4e0",
  slate: "#5b5b57",
};

export const LAYOUTS = {
  story: {
    id: "story",
    label: "Stories / Reels — 9:16",
    W: 1080,
    H: 1920,
    media: { x: 0, y: 340, w: 1080, h: 1080 },
    /** Wordmark only. The eyebrow line was the price of a full-width window. */
    chrome: { logoY: 252, logoH: 66 },
    copy: { x: 60, baseline: 1670, w: 960 },
    type: {
      eyebrow: 24,
      kicker: 26,
      word: 76,
      headline: 50,
      name: 52,
      price: 76,
      body: 29,
      sub: 27,
      ctaUrl: 52,
      fine: 21,
      rowK: 30,
      rowV: 40,
      rowPad: 7,
    },
  },
  feed: {
    id: "feed",
    label: "Feed post — 4:5",
    W: 1080,
    H: 1350,
    media: { x: 0, y: 0, w: 1080, h: 1080 },
    /** Rides the kicker line inside the copy block, so it costs no height. */
    chrome: { miniLogoH: 38 },
    copy: { x: 60, baseline: 1320, w: 960 },
    type: {
      eyebrow: 22,
      kicker: 24,
      word: 62,
      headline: 48,
      name: 46,
      price: 64,
      body: 28,
      sub: 26,
      ctaUrl: 42,
      fine: 18,
      rowK: 27,
      rowV: 37,
      rowPad: 7,
    },
  },
};
