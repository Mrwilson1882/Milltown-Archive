/**
 * Builds the overlay layer for one advert in one format: a single HTML page
 * that can be asked to draw any moment of the advert, then screenshotted with
 * a transparent background so ffmpeg can lay it over the footage.
 *
 * Everything outside the media window is painted white here rather than in the
 * footage, so the white ground and the square window always line up exactly.
 */

import fs from "node:fs";
import path from "node:path";
import { BRAND } from "./layouts.mjs";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Archivo, embedded — the site's typeface, so the ads match the storefront. */
function fontFaces(fontDir) {
  const weights = [400, 500, 700, 800, 900];
  return weights
    .map((w) => {
      const file = path.join(fontDir, `archivo-latin-${w}-normal.woff2`);
      const b64 = fs.readFileSync(file).toString("base64");
      return `@font-face{font-family:Archivo;font-style:normal;font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
    })
    .join("\n");
}

/** Multi-line text, each line its own element so lines can be staggered in. */
function lines(text, cls, baseIn, step = 0.08) {
  return String(text)
    .split("\n")
    .map(
      (l, i) =>
        `<div class="${cls}" data-in="${(baseIn + i * step).toFixed(2)}">${esc(l)}</div>`,
    )
    .join("");
}

function sceneBody(scene, L) {
  const t = L.type;
  const out = [];

  if (scene.card) {
    const c = scene.card;
    out.push(`<div class="card">
      <div class="card-inner">
        <img class="card-logo" src="LOGO_SRC" data-in="0.05">
        <div class="card-rule" data-in="0.18"></div>
        <div class="card-head">${lines(c.headline, "hl", 0.24, 0.09)}</div>
        ${c.sub ? `<div class="sub" data-in="0.52">${esc(c.sub)}</div>` : ""}
        ${c.url ? `<div class="url" data-in="0.64">${esc(c.url)}</div>` : ""}
        ${c.fine ? `<div class="fine" data-in="0.8">${esc(c.fine)}</div>` : ""}
      </div>
    </div>`);
    return out.join("");
  }

  const copy = [];
  if (scene.words) {
    copy.push(
      `<div class="words">${scene.words
        .map(
          (w, i) =>
            `<span class="word" data-in="${(0.18 + i * 0.34).toFixed(2)}">${esc(w)}</span>`,
        )
        .join(" ")}</div>`,
    );
  }
  if (scene.kicker) copy.push(`<div class="kicker" data-in="0.1">${esc(scene.kicker)}</div>`);
  if (scene.name) copy.push(`<div class="name" data-in="0.2">${esc(scene.name)}</div>`);
  if (scene.headline) copy.push(`<div class="headline">${lines(scene.headline, "hl", 0.2, 0.08)}</div>`);
  if (scene.price) copy.push(`<div class="price" data-in="0.34">${esc(scene.price)}</div>`);
  if (scene.rows) {
    copy.push(
      `<div class="rows">${scene.rows
        .map(
          (r, i) =>
            `<div class="row" data-in="${(0.24 + i * 0.22).toFixed(2)}"><span class="row-k">${esc(
              r[0],
            )}</span><span class="row-dot"></span><span class="row-v">${esc(r[1])}</span></div>`,
        )
        .join("")}</div>`,
    );
  }
  if (scene.body) copy.push(`<div class="body" data-in="0.44">${esc(scene.body)}</div>`);
  if (scene.sub) copy.push(`<div class="sub" data-in="0.46">${esc(scene.sub)}</div>`);

  out.push(`<div class="copy">${copy.join("")}</div>`);
  return out.join("");
}

export function buildHtml(ad, L, { fontDir, logoDataUri }) {
  const m = L.media;
  const t = L.type;
  const isStory = L.id === "story";

  // White everywhere except the square media window.
  const bands = [
    [0, 0, L.W, m.y],
    [0, m.y + m.h, L.W, L.H - (m.y + m.h)],
    [0, m.y, m.x, m.h],
    [m.x + m.w, m.y, L.W - (m.x + m.w), m.h],
  ]
    .filter(([, , w, h]) => w > 0 && h > 0)
    .map(([x, y, w, h]) => `<div class="band" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`)
    .join("");

  const chrome = isStory
    ? `<div class="chrome">
         <div class="eyebrow chrome-eyebrow" data-in="-0.5">${esc(ad.chrome.eyebrow)}</div>
         <img class="chrome-logo centred" src="${logoDataUri}" data-in="-0.5">
         <div class="chrome-rule" data-in="0.05"></div>
       </div>`
    : `<div class="chrome">
         <img class="chrome-logo" src="${logoDataUri}" data-in="-0.5">
         <div class="eyebrow chrome-eyebrow" data-in="-0.5">${esc(ad.chrome.eyebrow)}</div>
       </div>`;

  const scenes = ad.scenes
    .map(
      (s) =>
        `<div class="scene" data-start="${s.start}" data-end="${s.end}">${sceneBody(s, L).replaceAll(
          "LOGO_SRC",
          logoDataUri,
        )}</div>`,
    )
    .join("");

  const css = `
${fontFaces(fontDir)}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${L.W}px;height:${L.H}px;background:transparent;overflow:hidden}
#stage{position:relative;width:${L.W}px;height:${L.H}px;font-family:Archivo,sans-serif;
  color:${BRAND.ink};-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
.band{position:absolute;background:${BRAND.paper}}
.eyebrow{font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:${BRAND.forest}}
.display{font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.92}

/* ---- persistent brand chrome ---- */
.chrome{position:absolute;inset:0}
${
  isStory
    ? `.chrome-eyebrow{position:absolute;left:0;right:0;top:${L.chrome.eyebrowY}px;text-align:center;font-size:${t.eyebrow}px}
.chrome-logo{position:absolute;left:50%;transform:translateX(-50%);top:${L.chrome.logoY}px;height:${L.chrome.logoH}px;width:auto}
.chrome-rule{position:absolute;left:${m.x}px;top:${L.chrome.ruleY}px;width:${m.w}px;height:3px;background:${BRAND.forest};transform-origin:left center}`
    : `.chrome-logo{position:absolute;left:60px;top:${(L.chrome.barH - L.chrome.logoH) / 2}px;height:${L.chrome.logoH}px;width:auto}
.chrome-eyebrow{position:absolute;right:60px;top:${L.chrome.barH / 2 - t.eyebrow}px;font-size:${t.eyebrow}px;line-height:2}`
}

/* ---- scenes ---- */
.scene{position:absolute;inset:0;display:none}
.copy{position:absolute;left:${L.copy.x}px;width:${L.copy.w}px;bottom:${L.H - L.copy.baseline}px}
.copy>*+*{margin-top:${isStory ? 18 : 12}px}

.words{font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.94;font-size:${t.word}px}
${isStory ? ".words .word{display:block}" : ".words .word{display:inline-block;margin-right:.28em}"}
.words .word:last-child{color:${BRAND.forest}}

.kicker{font-weight:700;text-transform:uppercase;letter-spacing:.2em;font-size:${t.kicker}px;color:${BRAND.forest}}
.name{font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.94;font-size:${t.name}px}
.headline .hl{font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.94;font-size:${t.headline}px}
.price{font-weight:900;letter-spacing:-.02em;line-height:1;font-size:${t.price}px;color:${BRAND.forest}}
.body{font-weight:500;font-size:${t.body}px;line-height:1.35;color:${BRAND.slate};max-width:${L.copy.w - 20}px}
.sub{font-weight:600;font-size:${t.sub}px;line-height:1.3;color:${BRAND.slate}}

.rows{margin-top:${isStory ? 14 : 10}px}
.row{display:flex;align-items:baseline;gap:16px;padding:${isStory ? "9px 0" : "7px 0"};
  border-top:2px solid ${BRAND.ash};font-weight:800;line-height:1.08}
.row:last-child{border-bottom:2px solid ${BRAND.ash}}
.row-k{font-size:${isStory ? 34 : 27}px;text-transform:uppercase;letter-spacing:.02em}
.row-dot{flex:1;border-bottom:2px dotted ${BRAND.ash};transform:translateY(-6px)}
.row-v{font-size:${isStory ? 46 : 37}px;font-weight:900;color:${BRAND.forest};letter-spacing:-.02em}

/* ---- closing card ---- */
.card{position:absolute;inset:0;background:${BRAND.paper}}
.card-inner{position:absolute;left:${isStory ? 100 : 70}px;right:${isStory ? 100 : 70}px;
  top:50%;transform:translateY(-50%);text-align:center}
.card-logo{height:${isStory ? 132 : 88}px;width:auto;margin:0 auto ${isStory ? 40 : 26}px}
.card-rule{width:${isStory ? 160 : 120}px;height:4px;background:${BRAND.forest};margin:0 auto ${isStory ? 44 : 28}px}
.card-head .hl{font-weight:900;text-transform:uppercase;letter-spacing:-.025em;line-height:.92;
  font-size:${isStory ? 104 : 78}px}
.card-inner .sub{margin-top:${isStory ? 36 : 24}px;font-size:${t.sub}px;color:${BRAND.slate};font-weight:600}
.card-inner .url{margin-top:${isStory ? 34 : 22}px;font-weight:900;letter-spacing:.02em;
  font-size:${t.ctaUrl}px;color:${BRAND.paper};background:${BRAND.forest};
  display:inline-block;padding:${isStory ? "20px 34px" : "15px 26px"}}
.card-inner .fine{margin-top:${isStory ? 44 : 28}px;font-size:${t.fine}px;line-height:1.4;
  color:${BRAND.slate};font-weight:400;max-width:${isStory ? 780 : 720}px;margin-left:auto;margin-right:auto}
`;

  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><style>${css}</style></head>
<body><div id="stage">${bands}${chrome}${scenes}</div>
<script>
const DUR = ${ad.duration};
const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

const scenes = [...document.querySelectorAll('.scene')].map((el) => ({
  el,
  start: parseFloat(el.dataset.start),
  end: parseFloat(el.dataset.end),
  items: [...el.querySelectorAll('[data-in]')],
}));
const chromeItems = [...document.querySelectorAll('.chrome [data-in]')];

/** Fade-and-rise, plus a clean fade out over the last beat of each scene. */
function animate(items, local, span) {
  for (const el of items) {
    const inAt = parseFloat(el.dataset.in);
    const p = easeOut(clamp01((local - inAt) / 0.42));
    const outP = span === null ? 1 : 1 - clamp01((local - (span - 0.22)) / 0.22);
    const rise = el.classList.contains('chrome-rule') ? 0 : (1 - p) * 26;
    el.style.opacity = String(p * outP);
    el.style.transform =
      (el.classList.contains('centred') ? 'translateX(-50%) ' : '') +
      (el.classList.contains('chrome-rule')
        ? 'scaleX(' + p.toFixed(4) + ')'
        : 'translateY(' + rise.toFixed(2) + 'px)');
  }
}

/**
 * Measures where each scene's type has actually landed, so the build can fail
 * loudly if a line of copy rides up over the footage or strays into the bars
 * Instagram draws across a story.
 */
window.measureScenes = function () {
  const out = [];
  for (const s of scenes) {
    const mid = s.start + Math.min(0.7, (s.end - s.start) / 2);
    renderFrame(mid);
    const blocks = [...s.el.querySelectorAll('.copy, .card-inner')];
    for (const b of blocks) {
      const r = b.getBoundingClientRect();
      out.push({ start: s.start, kind: b.className, top: r.top, bottom: r.bottom });
    }
  }
  renderFrame(0);
  return out;
};

window.renderFrame = function (t) {
  animate(chromeItems, t, null);
  for (const s of scenes) {
    const on = t >= s.start && t < s.end;
    s.el.style.display = on ? 'block' : 'none';
    if (on) animate(s.items, t - s.start, s.end - s.start);
  }
  return true;
};
renderFrame(0);
</script></body></html>`;
}
