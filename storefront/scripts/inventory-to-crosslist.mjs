/**
 * Turn the stock ledger into a Crosslist listing CSV.
 *
 *   node scripts/inventory-to-crosslist.mjs
 *
 * Reads ../inventory.csv (the source of truth, one row per garment) and writes
 * data/listings.csv in the Crosslist template's column order, so the one file
 * uploads to Crosslist and builds this site.
 *
 * WHAT IT WILL AND WILL NOT DO
 * ----------------------------
 * It recognises, it does not invent. A brand is filled in only where the brand
 * name is written in the product name; a colour only where the colour word is
 * one Crosslist accepts. Anything else is left blank for the owner to fill in,
 * which is the same rule as conventions.md: blank means "not stated", never
 * "none".
 *
 * Three columns are appended after the Crosslist thirty-three — Size, Defects
 * and Date Added — because the ledger carries them and Crosslist has nowhere
 * to put them. The site reads them. If a Crosslist upload ever objects to the
 * extra columns, delete them there and export the workbook's Sizes sheet to
 * data/sizes.csv instead; the site reads sizes from either.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER = join(ROOT, "..", "inventory.csv");
const OUT = join(ROOT, "data", "listings.csv");

/** Brands the ledger writes into product names. Recognised, never guessed. */
const KNOWN_BRANDS = [
  "Ralph Lauren", "Lacoste", "Nike", "Adidas", "Champion", "Carhartt",
  "Tommy Hilfiger", "Harley Davidson", "The North Face", "Stone Island",
  "Berghaus", "Reebok", "Puma", "Umbro", "Kappa", "Fila", "Dickies",
  "Burberry", "Fred Perry", "Ellesse", "Levi's", "Levis", "Skinny Minnie",
];

/** The colour words Crosslist accepts, longest first so "Dark green" wins. */
const CROSSLIST_COLOURS = [
  "LightBlue", "DarkGreen", "Turquoise", "Burgundy", "Mustard", "Apricot",
  "Silver", "Purple", "Orange", "Yellow", "Khaki", "Green", "Black", "White",
  "Cream", "Beige", "Brown", "Coral", "Lilac", "Clear", "Multi", "Navy",
  "Gray", "Grey", "Gold", "Mint", "Rose", "Pink", "Blue", "Red", "Tan",
];

function parseCsv(text) {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (ch !== "\r") field += ch;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const escape = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const word = (haystack, needle) =>
  new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "i")
    .test(haystack);

function brandOf(title) {
  const match = KNOWN_BRANDS.find((brand) => word(title, brand));
  if (!match) return "";
  return match === "Levis" ? "Levi's" : match;
}

/**
 * The Crosslist colour words present in the ledger's colour field, in the
 * order they are written. "Green with orange pony" is a green polo, so the
 * first colour named wins and the second becomes the secondary colour.
 */
function coloursOf(description) {
  const hits = [];

  for (const colour of CROSSLIST_COLOURS) {
    const spaced = colour.replace(/([a-z])([A-Z])/g, "$1 $2");
    const position = [spaced, colour]
      .map((spelling) => (word(description, spelling) ? description.toLowerCase().indexOf(spelling.toLowerCase()) : -1))
      .filter((index) => index >= 0)
      .sort((a, b) => a - b)[0];

    if (position === undefined) continue;
    const canonical = colour === "Grey" ? "Gray" : colour;
    if (!hits.some((hit) => hit.colour === canonical)) hits.push({ colour: canonical, position });
  }

  // "Dark green" contains "green": keep the more specific match and drop the
  // one that starts inside it.
  const specific = hits.filter(
    (hit) => !hits.some((other) => other !== hit && other.colour.length > hit.colour.length && Math.abs(other.position - hit.position) < other.colour.length + 1),
  );

  return specific.sort((a, b) => a.position - b.position).slice(0, 2).map((hit) => hit.colour);
}

function conditionOf(raw) {
  const key = raw.toLowerCase();
  if (key.includes("new with tags")) return "NewWithTags";
  if (key.includes("new without tags")) return "NewWithoutTags";
  if (key.includes("very good")) return "VeryGood";
  if (key.includes("good")) return "Good";
  if (key.includes("fair")) return "Fair";
  if (key.includes("poor")) return "Poor";
  return "";
}

/** Tags come out of the SKU group the owner already files the piece under. */
function tagsOf(sku, title) {
  const source = `${sku} ${title}`;
  const tags = new Set(["vintage"]);

  if (word(source, "y2k")) tags.add("y2k");
  if (word(source, "summer")) tags.add("summer");
  if (word(source, "polo") || word(source, "polos")) tags.add("polo");
  if (word(source, "track jacket")) tags.add("track jacket");

  // Whole-word only, or every "Women's" also files itself under men's.
  if (word(source, "women") || word(source, "womens") || word(source, "ladies")) {
    tags.add("womens");
  } else if (word(source, "men") || word(source, "mens")) {
    tags.add("mens");
  }

  return [...tags].join("|");
}

if (!existsSync(LEDGER)) {
  console.error(`No ledger at ${LEDGER}. Nothing to convert.`);
  process.exit(1);
}

const table = parseCsv(readFileSync(LEDGER, "utf8"));
const headers = table[0].map((h) => h.trim());
const index = (name) => headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());

const col = {
  itemNo: index("Item No."),
  name: index("Product Name"),
  description: index("Colour Clarity/Description"),
  defects: index("Defects"),
  size: index("Size"),
  condition: index("Condition"),
  sku: index("SKU"),
  price: index("Price"),
  dateAdded: index("Date Added"),
};

const OUT_HEADERS = [
  "Id", "Title", "Description", "Price", "Original Price", "Brand", "Category id",
  "Size id", "Condition", "Color", "Secondary color", "Images", "Quantity",
  "Shipping weight", "Shipping weight unit", "Shipping height", "Shipping width",
  "Shipping length", "Domestic shipping price", "Worldwide shipping price",
  "Free domestic shipping", "Free worldwide shipping", "Tags", "SKU", "Who made",
  "When made", "Smart pricing", "Smart pricing price", "Accept offers", "Is auction",
  "Auction starting price", "Internal note", "Cost of goods",
  // Appended for this site, because the ledger carries them and Crosslist does not.
  "Size", "Defects", "Date Added",
];

const lines = [OUT_HEADERS.join(",")];
let blankBrands = 0, blankColours = 0;

for (const cells of table.slice(1)) {
  const get = (i) => (i >= 0 ? (cells[i] ?? "").trim() : "");
  const title = get(col.name);
  if (!title) continue;

  const itemNo = get(col.itemNo);
  const description = get(col.description);
  const defects = get(col.defects);
  const [colour = "", secondary = ""] = coloursOf(description);
  const brand = brandOf(title);
  if (!brand) blankBrands++;
  if (!colour) blankColours++;

  // The description a buyer reads: what was stated about the piece, then the
  // faults. Faults keep their own column too, so the page can show them apart
  // from the prose rather than buried in it.
  // "None" in the ledger means the owner said there are no faults — that
  // belongs on the page as a statement, not as a line of description.
  const statedFaults = defects && defects.toLowerCase() !== "none" ? defects : "";
  const buyerDescription = [description, statedFaults && `Faults: ${statedFaults}`]
    .filter(Boolean)
    .join("\n\n");

  const row = {
    Id: itemNo ? `MA-${itemNo.padStart(4, "0")}` : "",
    Title: title,
    Description: buyerDescription,
    Price: get(col.price).replace(/[£\s]/g, ""),
    "Original Price": "",
    Brand: brand,
    "Category id": "",
    "Size id": "",
    Condition: conditionOf(get(col.condition)),
    Color: colour,
    "Secondary color": secondary,
    Images: "",
    Quantity: "1",
    "Shipping weight": "",
    "Shipping weight unit": "",
    "Shipping height": "",
    "Shipping width": "",
    "Shipping length": "",
    "Domestic shipping price": "",
    "Worldwide shipping price": "",
    "Free domestic shipping": "FALSE",
    "Free worldwide shipping": "FALSE",
    Tags: tagsOf(get(col.sku), title),
    SKU: get(col.sku),
    "Who made": "SomeoneElse",
    "When made": "",
    "Smart pricing": "FALSE",
    "Smart pricing price": "",
    "Accept offers": "TRUE",
    "Is auction": "FALSE",
    "Auction starting price": "",
    "Internal note": "",
    "Cost of goods": "",
    Size: get(col.size),
    Defects: defects,
    "Date Added": get(col.dateAdded),
  };

  lines.push(OUT_HEADERS.map((header) => escape(row[header])).join(","));
}

writeFileSync(OUT, `${lines.join("\n")}\n`, "utf8");

console.log(`Wrote ${lines.length - 1} listings to data/listings.csv`);
if (blankBrands) console.log(`  ${blankBrands} with no brand recognised in the title — fill in the Brand column.`);
if (blankColours) console.log(`  ${blankColours} with no Crosslist colour word found — fill in the Color column.`);
console.log("  No photographs: the Images column is blank on every row.");
