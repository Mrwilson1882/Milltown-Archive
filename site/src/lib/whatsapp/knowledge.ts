import { products, quantityLabel } from "@/data/catalogue";
import { brands, collections, productTypes } from "@/data/taxonomy";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

/**
 * The facts a draft is allowed to be built from.
 *
 * This is the whole anti-invention mechanism. Claude is given this sheet and
 * told that anything not in it is not known — so an unpriced lot produces
 * "I'll confirm that for you", never a plausible-looking number. It is built
 * from `catalogue.ts`, which means it cannot drift from the website: change a
 * price there and the next draft quotes the new one.
 *
 * The rule is the same one `pricing-notes.md` sets for the ledger and the site:
 * only prices the owner has actually given are ever stated.
 */

/** Deterministic — identical between calls, so the prompt cache keeps hitting. */
export function buildCatalogueFacts(): string {
  const lines: string[] = [];

  lines.push("## The business");
  lines.push(`${siteConfig.name} (${siteConfig.legalName}), part of ${siteConfig.parent}.`);
  lines.push(siteConfig.description);
  lines.push(`Based in ${siteConfig.location}. Website: ${siteConfig.url}. Email: ${siteConfig.email}.`);
  lines.push(
    siteConfig.vat.registered
      ? `Prices are quoted excluding VAT; ${siteConfig.vat.ratePercent}% VAT is added at checkout.`
      : "Not VAT registered, so the prices below are the prices paid — no VAT is added.",
  );
  lines.push("");

  lines.push("## How stock is sold");
  lines.push("- Reseller boxes — fixed-price made-up boxes.");
  lines.push("- Counted lots — a set number of pieces, e.g. 10, 25, 50.");
  lines.push("- By the kilo — 25kg to 1,000kg, quoted on enquiry. THERE IS NO PUBLISHED RATE PER KILO.");
  lines.push("");

  lines.push("## Grading");
  lines.push(`Lots are graded A/B unless stated otherwise. Full guide: ${siteConfig.url}/grading-guide`);
  lines.push("");

  lines.push("## Catalogue");
  lines.push(
    "Every lot is listed below with its quantity options. A price is shown ONLY where the owner has set one. " +
      "Where it says NO PRICE SET, no price exists — do not state, estimate or imply one.",
  );
  lines.push("");

  for (const product of products) {
    const parts: string[] = [`### ${product.name}`];
    parts.push(`Link: ${siteConfig.url}/products/${product.slug}`);
    parts.push(`Summary: ${product.summary}`);
    parts.push(`Grade: ${product.grade ?? "A/B"}`);
    if (product.sizeRun) parts.push(`Size run: ${product.sizeRun}`);
    parts.push(`In stock: ${product.inStock ? "yes" : "no — not currently available"}`);
    parts.push(`Quantity options: ${quantityLabel(product)}`);

    if (product.variants.length === 0) {
      parts.push("Pricing: NO QUANTITIES AND NO PRICE SET — this lot is enquiry-only.");
    } else {
      const priced = product.variants.map((variant) =>
        variant.priceGBP === null
          ? `${variant.pieces} ${product.unit}: NO PRICE SET`
          : `${variant.pieces} ${product.unit}: ${formatPrice(variant.priceGBP)}`,
      );
      parts.push(`Pricing: ${priced.join(" | ")}`);
    }

    if (product.notes.length > 0) parts.push(`Notes: ${product.notes.join(" ")}`);

    lines.push(parts.join("\n"));
    lines.push("");
  }

  lines.push("## Categories on the site");
  lines.push(`Product types: ${productTypes.map((t) => t.name).join(", ")}`);
  lines.push(`Brands: ${brands.map((b) => b.name).join(", ")}`);
  lines.push(`Collections: ${collections.map((c) => c.name).join(", ")}`);

  return lines.join("\n");
}

/**
 * What is deliberately NOT known. Listed explicitly because these are the
 * questions a wholesale customer asks most, and the ones where a confident
 * invention would do real damage — a quoted delivery date or a made-up
 * minimum order is a promise the owner then has to keep.
 */
export const UNKNOWNS = `
- Any price not set in the catalogue above.
- The rate per kilo. No rate is published. Every kilo enquiry is quoted by the owner.
- Current stock counts, what is in this week's intake, or when a sold-out lot returns.
- Delivery costs, couriers, lead times and delivery dates.
- Minimum order values, trade discounts, bulk discounts and payment terms.
- Returns, refunds and exchange policy.
- Whether a specific brand, size, colour or era can be picked out of a lot.
- Anything about a customer's existing order, invoice or payment.
`.trim();
