/**
 * Read data/listings.csv the way the site does, and say what is wrong with it.
 *
 *   npm run import:check
 *
 * Run this after every Crosslist export and before pushing. It reports columns
 * the importer did not recognise, columns it expected and did not find, rows it
 * had to skip, and every listing missing a price, a photograph or a category —
 * the four things that make a listing look unfinished in the shop.
 *
 * Exit code is 1 when a row could not be used at all, so CI can fail on it;
 * everything else is a warning and the site still builds.
 */

import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./alias-hook.mjs", pathToFileURL(`${import.meta.dirname}/`));

const { importListings } = await import("../src/lib/import.ts");

const report = importListings();

const heading = (text) => `\n\x1b[1m${text}\x1b[0m`;
const dim = (text) => `\x1b[2m${text}\x1b[0m`;

console.log(heading("Catalogue"));
console.log(`  Source          ${report.source}`);
console.log(`  Listings read   ${report.listings.length}`);

if (report.empty) {
  console.log(dim("\n  Nothing to build a shop from yet."));
  for (const warning of report.warnings) console.log(`  • ${warning}`);
  process.exit(1);
}

const priced = report.listings.filter((listing) => listing.priceGBP !== null).length;
const photographed = report.listings.filter((listing) => listing.images.length > 0).length;
const categorised = report.listings.filter((listing) => listing.typeSlugs.length > 0).length;
const sized = report.listings.filter((listing) => listing.size !== null).length;

console.log(`  Priced          ${priced}/${report.listings.length}`);
console.log(`  Photographed    ${photographed}/${report.listings.length}`);
console.log(`  In a category   ${categorised}/${report.listings.length}`);
console.log(`  With a size     ${sized}/${report.listings.length}`);

if (report.unrecognisedColumns.length > 0) {
  console.log(heading("Columns the importer does not know"));
  for (const column of report.unrecognisedColumns) console.log(`  • ${column}`);
  console.log(dim("    These are ignored. Add an alias in src/lib/import.ts to use one."));
}

if (report.missingColumns.length > 0) {
  console.log(heading("Columns expected but not found"));
  for (const column of report.missingColumns) console.log(`  • ${column}`);
}

const skipped = report.warnings.filter((warning) => warning.includes("skipped"));

if (report.warnings.length > 0) {
  console.log(heading(`Warnings (${report.warnings.length})`));
  for (const warning of report.warnings) console.log(`  • ${warning}`);
}

console.log("");
process.exit(skipped.length > 0 ? 1 : 0);
