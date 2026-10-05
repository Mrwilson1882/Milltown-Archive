/**
 * A customer notice as a picture — something to send on WhatsApp or post to
 * a story, in the storefront's own hand: white ground, Archivo, forest green
 * for the one thing that matters.
 *
 *   node notice.mjs --handle @archivewholesale [--out ../]
 *
 * Writes card-payments-square.png (1080 × 1080, for sending) and
 * card-payments-story.png (1080 × 1920, for a story). The copy mirrors the
 * cart's own line — "Card payments are not switched on yet" — now that they
 * are. Change the words below; the layout holds.
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { fontFaces } from "./overlay.mjs";
import { BRAND } from "./layouts.mjs";

const HERE = import.meta.dirname;
const PUBLIC = path.resolve(HERE, "../../../site/public");
const FONTS = path.join(HERE, "node_modules/@fontsource/archivo/files");
const CHROME = process.env.CHROME || undefined;

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const handle = flag("handle", "@YOURHANDLE");
const outDir = path.resolve(flag("out", path.resolve(HERE, "..")));

/* ---------------------------------------------------------------- copy */

const COPY = {
  // The headline is the site's own line (PaymentsLiveNotice.tsx), so a
  // customer who taps through reads the same words. "No payment link to wait
  // for" is the specific thing that changed: before 3 October, checkout sent
  // people to WhatsApp for one.
  eyebrow: "An update from Archive Wholesale",
  head1: "Card payments",
  head2: "are now live.",
  body: "Order and pay on the site in one go — debit or credit card at a secure checkout, no payment link to wait for.",
  follow: "Follow us on Instagram",
  handle,
  // The line the order emails already use.
  followSub: "New lines go up there first.",
  foot: "archivewholesale.co.uk · WhatsApp 07897 740194",
};

/* -------------------------------------------------------------- render */

const logo = `data:image/png;base64,${fs.readFileSync(path.join(PUBLIC, "logo.png")).toString("base64")}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// A plain camera mark, drawn rather than borrowed, so nothing of Instagram's is embedded.
const glyph = `<svg viewBox="0 0 64 64" fill="none" stroke="${BRAND.paper}" stroke-width="5">
  <rect x="6" y="6" width="52" height="52" rx="15"/><circle cx="32" cy="32" r="12.5"/><circle cx="47" cy="17" r="3" fill="${BRAND.paper}" stroke="none"/></svg>`;

const html = (W, H, story) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces(FONTS)}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;background:${BRAND.paper};overflow:hidden;
  font-family:Archivo,sans-serif;-webkit-font-smoothing:antialiased;color:${BRAND.ink}}
.page{position:absolute;left:0;right:0;top:${story ? 250 : 0}px;bottom:${story ? 250 : 0}px;
  padding:${story ? 40 : 84}px 84px;display:flex;flex-direction:column;justify-content:center;gap:${story ? 46 : 36}px}
.logo{height:${story ? 92 : 84}px;width:auto;align-self:center;margin-bottom:${story ? 26 : 10}px}
.eyebrow{font-weight:700;text-transform:uppercase;letter-spacing:.2em;font-size:${story ? 26 : 25}px;color:${BRAND.forest}}
.head{font-weight:900;text-transform:uppercase;letter-spacing:-.025em;line-height:.92;font-size:${story ? 128 : 112}px}
.head span{color:${BRAND.forest};display:block}
.body{font-weight:500;font-size:${story ? 38 : 35}px;line-height:1.38;color:${BRAND.slate};max-width:${story ? 880 : 860}px}
.follow{display:flex;align-items:center;gap:30px;background:${BRAND.forest};color:${BRAND.paper};padding:${story ? 38 : 32}px 40px;margin-top:${story ? 14 : 8}px}
.follow svg{width:${story ? 84 : 76}px;height:${story ? 84 : 76}px;flex:0 0 auto}
.follow small{display:block;font-weight:700;text-transform:uppercase;letter-spacing:.18em;font-size:${story ? 24 : 22}px;opacity:.85}
.follow b{display:block;font-weight:900;letter-spacing:-.01em;font-size:${story ? 58 : 52}px;line-height:1.05;margin-top:8px;word-break:break-all}
.follow em{display:block;font-style:normal;font-weight:500;font-size:${story ? 27 : 25}px;margin-top:10px;opacity:.9}
.foot{font-weight:700;text-transform:uppercase;letter-spacing:.14em;font-size:${story ? 22 : 21}px;color:${BRAND.slate}}
</style></head><body><div class="page">
  <img class="logo" src="${logo}">
  <div class="eyebrow">${esc(COPY.eyebrow)}</div>
  <div class="head">${esc(COPY.head1)}<span>${esc(COPY.head2)}</span></div>
  <div class="body">${esc(COPY.body)}</div>
  <div class="follow">${glyph}<div><small>${esc(COPY.follow)}</small><b>${esc(COPY.handle)}</b><em>${esc(COPY.followSub)}</em></div></div>
  <div class="foot">${esc(COPY.foot)}</div>
</div></body></html>`;

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
for (const [name, W, H, story] of [["card-payments-square", 1080, 1080, false], ["card-payments-story", 1080, 1920, true]]) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(html(W, H, story), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file });
  await page.close();
  console.log(`${file}  ${W}x${H}  ${(fs.statSync(file).size / 1e3).toFixed(0)} KB`);
}
await browser.close();
