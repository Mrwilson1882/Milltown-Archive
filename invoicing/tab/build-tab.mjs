#!/usr/bin/env node
/**
 * Builds the blank invoice tab from its template.
 *
 *   node invoicing/tab/build-tab.mjs
 *
 * Two things are injected: the logo, embedded as a data URI so the page owns
 * its own artwork, and the catalogue, read straight out of
 * site/src/data/catalogue.ts so the lot sizes and prices in the tab's picker
 * are the site's, never a copy that can drift.
 *
 * Re-run this after any catalogue change and republish the Artifact.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

process.removeAllListeners("warning");
process.on("warning", (w) => {
  if (w.code !== "MODULE_TYPELESS_PACKAGE_JSON") console.warn(w.stack ?? w.message);
});

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..");

const { products } = await import(join(REPO, "site", "src", "data", "catalogue.ts"));

const catalogue = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  unit: p.unit,
  grade: p.grade ?? "A/B",
  variants: p.variants.map((v) => [v.pieces, v.priceGBP]),
}));

const logo = `data:image/png;base64,${readFileSync(join(REPO, "site", "public", "logo.png")).toString("base64")}`;

const html = readFileSync(join(HERE, "invoice-tab.template.html"), "utf8")
  .replace("__CATALOGUE__", JSON.stringify(catalogue))
  .replace("__LOGO__", logo);

const out = join(HERE, "invoice-tab.html");
writeFileSync(out, html);

const priced = catalogue.reduce((n, p) => n + p.variants.filter(([, v]) => v != null).length, 0);
const total = catalogue.reduce((n, p) => n + p.variants.length, 0);
console.log(`Built ${out}`);
console.log(`  ${catalogue.length} products, ${priced} of ${total} lot sizes priced`);
