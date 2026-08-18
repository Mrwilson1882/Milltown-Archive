/**
 * Generates the square placeholder tiles used behind category and bundle cards
 * until real product photography is available.
 *
 *   node scripts/generate-placeholder-art.mjs
 *
 * Output: public/images/tiles/<pattern>-<tone>[-2].svg
 *
 * These are deliberately abstract — no text is baked into the SVG, because the
 * category name is rendered over the tile by the React component using the
 * real webfont. Delete a file and drop a photo in its place when one exists.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "tiles");

const INK = "#000000";
const GREEN = "#0F4A2E";
const PAPER = "#FFFFFF";
const SMOKE = "#F4F4F2";

const S = 1200; // square canvas

/** Deterministic pseudo-random so regenerating never churns the diff. */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0xffffffff;
  };
}

function seedFrom(str) {
  let h = 2166136261;
  for (const ch of str) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * These read as graphic panels, not as faint texture: solid black shapes on a
 * white ground with one forest-green element carrying the accent. They have to
 * hold their own next to real photography, and survive the white scrim the
 * category tile lays over the bottom third.
 */
const patterns = {
  /** Broad horizontal bands, alternating edge, one green. */
  bands(primary, accent, rand) {
    const parts = [];
    const count = 5;
    const gap = S / count;
    const accentIndex = 1 + Math.floor(rand() * (count - 1));
    for (let i = 0; i < count; i += 1) {
      const h = gap * (0.42 + rand() * 0.3);
      const y = i * gap + (gap - h) / 2;
      const w = S * (0.62 + rand() * 0.38);
      const x = i % 2 === 0 ? 0 : S - w;
      const isAccent = i === accentIndex;
      parts.push(
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${isAccent ? accent : primary}"/>`,
      );
    }
    return parts.join("");
  },

  /** Vertical rules thickening across the tile, like a barcode. */
  stripes(primary, accent, rand) {
    const parts = [];
    const count = 14;
    const accentIndex = 3 + Math.floor(rand() * 8);
    for (let i = 0; i < count; i += 1) {
      const t = i / (count - 1);
      const w = 10 + t * 52;
      const x = (S / count) * i + 10;
      parts.push(
        `<rect x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="${S}" fill="${i === accentIndex ? accent : primary}"/>`,
      );
    }
    return parts.join("");
  },

  /** Grid of squares, most solid black, a couple green, a couple outlined. */
  grid(primary, accent, rand) {
    const parts = [];
    const n = 5;
    const cell = S / n;
    const pad = cell * 0.12;
    for (let r = 0; r < n; r += 1) {
      for (let c = 0; c < n; c += 1) {
        const roll = rand();
        const x = c * cell + pad;
        const y = r * cell + pad;
        const size = cell - pad * 2;
        const box = `x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}"`;
        if (roll > 0.82) {
          parts.push(`<rect ${box} fill="${accent}"/>`);
        } else if (roll > 0.5) {
          parts.push(`<rect ${box} fill="${primary}"/>`);
        } else if (roll > 0.24) {
          parts.push(`<rect ${box} fill="none" stroke="${primary}" stroke-width="10"/>`);
        }
      }
    }
    return parts.join("");
  },

  /** Italic slashes echoing the logo's slant. */
  diagonal(primary, accent, rand) {
    const parts = [];
    const count = 7;
    const skew = 260;
    const accentIndex = 1 + Math.floor(rand() * (count - 2));
    for (let i = -2; i < count; i += 1) {
      const w = 90 + rand() * 70;
      const x = (S / count) * i * 1.3 - 120;
      parts.push(
        `<path d="M ${x.toFixed(1)} ${S} L ${(x + skew).toFixed(1)} 0 L ${(x + skew + w).toFixed(1)} 0 L ${(x + w).toFixed(1)} ${S} Z" fill="${i === accentIndex ? accent : primary}"/>`,
      );
    }
    return parts.join("");
  },

  /** Dot field growing across the diagonal. */
  halftone(primary, accent, rand) {
    const parts = [];
    const n = 9;
    const cell = S / n;
    for (let r = 0; r < n; r += 1) {
      for (let c = 0; c < n; c += 1) {
        const t = 1 - (r + c) / (2 * (n - 1));
        const radius = cell * 0.08 + cell * 0.4 * t;
        if (radius < 3) continue;
        const cx = c * cell + cell / 2;
        const cy = r * cell + cell / 2;
        const isAccent = rand() > 0.85;
        parts.push(
          `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius.toFixed(1)}" fill="${isAccent ? accent : primary}"/>`,
        );
      }
    }
    return parts.join("");
  },

  /** Three large offset rectangles, the middle one green. */
  blocks(primary, accent, rand) {
    const parts = [];
    for (let i = 0; i < 3; i += 1) {
      const w = S * (0.42 + rand() * 0.3);
      const h = S * (0.4 + rand() * 0.3);
      const x = rand() * (S - w);
      const y = rand() * (S - h);
      parts.push(
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${i === 1 ? accent : primary}"/>`,
      );
    }
    return parts.join("");
  },
};

async function main() {
  await mkdir(OUT, { recursive: true });

  /**
   * Two schemes, so a grid of tiles alternates between black-led and green-led
   * panels instead of reading as one flat texture. Both sit on a light ground,
   * which keeps the site predominantly white as the brand requires.
   */
  const tones = {
    green: { ground: PAPER, primary: INK, accent: GREEN },
    ink: { ground: SMOKE, primary: GREEN, accent: INK },
  };
  const variants = ["", "-2", "-3", "-4"];
  let written = 0;

  for (const [patternName, draw] of Object.entries(patterns)) {
    for (const [toneName, tone] of Object.entries(tones)) {
      for (const variant of variants) {
        const key = `${patternName}-${toneName}${variant}`;
        const rand = rng(seedFrom(key));
        const body = draw(tone.primary, tone.accent, rand);
        const svg =
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" role="presentation">` +
          `<rect width="${S}" height="${S}" fill="${tone.ground}"/>` +
          `<g>${body}</g>` +
          `<rect x="0.5" y="0.5" width="${S - 1}" height="${S - 1}" fill="none" stroke="${INK}" stroke-opacity="0.1"/>` +
          `</svg>`;
        await writeFile(join(OUT, `${key}.svg`), `${svg}\n`, "utf8");
        written += 1;
      }
    }
  }

  console.log(`Wrote ${written} placeholder tiles to public/images/tiles/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
