/**
 * Guard for the parts of the site that search engines and AI assistants read.
 *
 * ChatGPT enquiries come in because OAI-SearchBot can crawl the site, the
 * product pages carry structured data, and llms.txt tells an assistant what
 * we sell in plain English. None of that is visible on the page, so it is
 * easy to break without noticing. This runs after every build (npm's
 * `postbuild`) and fails the deploy if any of it has gone.
 *
 * Run by hand: node scripts/check-ai-surfaces.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");
const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

// 1. Every AI crawler we rely on is still named and allowed in robots.
const robots = read("src/app/robots.ts");
for (const bot of ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended", "Googlebot", "Bingbot"]) {
  check(robots.includes(`"${bot}"`), `robots.ts no longer names ${bot}`);
}
check(!/disallow:\s*\[?\s*"\/"\s*\]?/.test(robots), "robots.ts disallows the whole site");
check(robots.includes("sitemap.xml"), "robots.ts no longer points at the sitemap");

// 2. llms.txt exists and still states the facts assistants quote.
check(existsSync(resolve(root, "public/llms.txt")), "public/llms.txt is missing");
if (existsSync(resolve(root, "public/llms.txt"))) {
  const llms = read("public/llms.txt");
  for (const fact of ["Archive Wholesale", "Grade A/B", "10, 25 or 50", "+44 7897 740194", "Wholesale only", "/sitemap.xml", "Brands by lot"]) {
    check(llms.includes(fact), `llms.txt no longer mentions "${fact}"`);
  }
}

// 3. Structured data is still emitted.
const productPage = read("src/app/products/[slug]/page.tsx");
check(productPage.includes('"@type": "Product"'), "product page lost its Product JSON-LD");
check(productPage.includes('"@type": "AggregateOffer"'), "product page lost its AggregateOffer");
check(productPage.includes("keywords:"), "product page lost its brand keywords");
check(productPage.includes("Brands you may see in this lot"), "product page lost the brands-you-may-see section");
check(read("src/app/layout.tsx").includes('"@type": "Organization"'), "layout lost its Organization JSON-LD");
check(read("src/app/grading-guide/page.tsx").includes("FAQPage"), "grading guide lost its FAQPage JSON-LD");

// 4. Retired addresses keep redirecting. Anything an assistant has already
//    quoted must land somewhere, and no new product may reuse an old slug.
const retired = [
  "mixed-mens-lacoste-25",
  "mixed-mens-lacoste",
  "lacoste-knitwear",
  "y2k-designer-female-mix-box-20",
  "y2k-designer-male-mix-box-20",
  "y2k-designer-male-mix-box",
  "luxury-outerwear-mix",
];
const config = read("next.config.ts");
const catalogue = read("src/data/catalogue.ts");
for (const slug of retired) {
  check(config.includes(`source: "/products/${slug}"`), `next.config.ts lost the redirect for /products/${slug}`);
  check(!catalogue.includes(`slug: "${slug}"`), `catalogue reuses retired slug ${slug}, which would shadow its redirect`);
}

// 5. Every redirect destination is a real product.
for (const [, dest] of config.matchAll(/destination: "\/products\/([a-z0-9-]+)"/g)) {
  check(catalogue.includes(`slug: "${dest}"`), `redirect points at /products/${dest}, which is not in the catalogue`);
}

if (failures.length > 0) {
  console.error("\nAI / search surface check FAILED:\n");
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error("\nThese are the parts of the site ChatGPT and Google read. Fix before deploying.\n");
  process.exit(1);
}
console.log("AI / search surfaces intact: robots, llms.txt, structured data, redirects.");
