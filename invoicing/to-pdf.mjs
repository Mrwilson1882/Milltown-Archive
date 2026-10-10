#!/usr/bin/env node
/**
 * Turn a generated document into a PDF, ready to send.
 *
 *   node invoicing/to-pdf.mjs invoicing/out/PF-0001.html
 *   node invoicing/to-pdf.mjs --all
 *
 * Writes alongside the source: invoicing/out/PF-0001.pdf
 *
 * Archivo is inlined from invoicing/fonts/ rather than pulled from Google, so
 * the PDF is typeset in the brand face on any machine, online or not. Without
 * it Chrome silently falls back to Helvetica and the document goes out looking
 * like someone else's.
 *
 * Chrome is found automatically; set CHROME to override.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "out");
const FONT = join(HERE, "fonts", "archivo-variable.woff2");

const CHROME_CANDIDATES = [
  process.env.CHROME,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (found) return found;
  throw new Error(
    "Could not find Chrome. Set CHROME to its path, or open the .html and print to PDF from the browser.",
  );
}

/** Swap the Google Fonts <link> for the font itself, embedded. */
function inlineFont(html) {
  if (!existsSync(FONT)) {
    console.warn("! invoicing/fonts/archivo-variable.woff2 is missing — the PDF will fall back to Helvetica.");
    return html;
  }
  const face = `<style>
@font-face {
  font-family: "Archivo";
  font-style: normal;
  font-weight: 100 900;
  font-display: block;
  src: url(data:font/woff2;base64,${readFileSync(FONT).toString("base64")}) format("woff2");
}
</style>`;
  return html
    .replace(/<link rel="preconnect"[^>]*>\s*/g, "")
    .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, face);
}

function toPdf(htmlPath) {
  const src = resolve(htmlPath);
  const pdfPath = src.replace(/\.html$/, ".pdf");
  const staging = mkdtempSync(join(tmpdir(), "aw-pdf-"));
  const staged = join(staging, basename(src));

  writeFileSync(staged, inlineFont(readFileSync(src, "utf8")));

  execFileSync(findChrome(), [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    `--print-to-pdf=${pdfPath}`,
    "--virtual-time-budget=10000",
    `file://${staged}`,
  ], { stdio: ["ignore", "ignore", "pipe"] });

  unlinkSync(staged);
  return pdfPath;
}

const args = process.argv.slice(2);
const targets = args.includes("--all")
  ? readdirSync(OUT_DIR).filter((f) => f.endsWith(".html")).map((f) => join(OUT_DIR, f))
  : args.filter((a) => !a.startsWith("--"));

if (!targets.length) {
  console.error("Usage:\n  node invoicing/to-pdf.mjs invoicing/out/<file>.html\n  node invoicing/to-pdf.mjs --all\n");
  process.exit(1);
}

for (const t of targets) {
  const pdf = toPdf(t);
  console.log(`${basename(t)}  ->  ${pdf}`);
}
