/**
 * Archive Wholesale — Instagram ad layouts.
 *
 * Two canvases, one grammar: white ground, black display type, forest green
 * (#0F4A2E) as the only accent, and a square media window with the footage or
 * the product photograph in it.
 *
 * 9:16 keeps everything inside Instagram's Stories safe area — nothing that
 * matters sits above y=250 or below y=1670, where the profile chip and the
 * reply bar land.
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
    // Square media window, inset from the edges.
    media: { x: 90, y: 430, w: 900, h: 900 },
    // Persistent brand chrome above the window, clear of the profile chip.
    chrome: { eyebrowY: 268, logoY: 302, logoH: 88, ruleY: 412 },
    // Copy block below the window, bottom-anchored clear of the reply bar.
    copy: { x: 90, baseline: 1666, w: 900 },
    type: {
      eyebrow: 25,
      kicker: 27,
      word: 84,
      headline: 58,
      name: 58,
      price: 84,
      body: 34,
      sub: 30,
      ctaUrl: 52,
      fine: 21,
    },
  },
  feed: {
    id: "feed",
    label: "Feed post — 4:5",
    W: 1080,
    H: 1350,
    media: { x: 0, y: 88, w: 1080, h: 940 },
    chrome: { barH: 88, logoH: 52 },
    copy: { x: 60, baseline: 1310, w: 960 },
    type: {
      eyebrow: 22,
      kicker: 24,
      word: 66,
      headline: 48,
      name: 44,
      price: 64,
      body: 28,
      sub: 26,
      ctaUrl: 42,
      fine: 18,
    },
  },
};
