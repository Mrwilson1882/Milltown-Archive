# Milltown Archive — the shop

The storefront for **www.milltownarchive.co.uk**: one-of-one vintage, sold a
piece at a time.

Built to run on Vercel with Next.js 16 (App Router), TypeScript and Tailwind
CSS v4. Every page is prerendered at build time, so the shop is a pile of
static files with two API routes behind it.

The whole catalogue comes out of **one CSV** — the same Crosslist listing
export that is uploaded to the marketplaces. Nothing is typed twice.

---

## Running it

```bash
cd storefront
npm install
cp .env.example .env.local   # optional; the shop builds with none of it set
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run import:check` | **Read the CSV and report what is wrong with it** |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `node scripts/inventory-to-crosslist.mjs` | Rebuild `data/listings.csv` from the stock ledger |

---

## The catalogue

### One file

```
storefront/data/listings.csv
```

Drop the Crosslist export there and rebuild. That is the whole update process.
`products.csv` and `crosslist.csv` are accepted as file names too.

Every column of the Crosslist listing template is understood. The ones that
reach the shop:

| Crosslist column | Where it shows up |
|---|---|
| `Title` | Product name, page title, search |
| `Description` | The paragraphs on the product page |
| `Price` | The price. **Blank means "price on request"** — never a guess |
| `Original Price` | Struck-through compare-at price, and the Sale edit |
| `Brand` | Brand pages, filters, the labels row on the home page |
| `Condition` | Condition grade and filter (see `/condition-guide`) |
| `Color`, `Secondary color` | Colour filter and the details table |
| `Images` | The photographs (see below) |
| `Quantity` | `0` marks a piece sold |
| `Tags` | Search, and the Y2K and Summer edits |
| `SKU` | "Sorted under" on the product page |
| `When made` | Era filter, and the Y2K edit |
| `Size id` | Size — needs `data/sizes.csv`, see below |
| `Category id` | Helps categorise — needs `data/categories.csv`, see below |
| `Accept offers` | Read, not yet shown |

`Internal note`, `Cost of goods`, `Who made`, `Smart pricing` and the auction
columns are read and then deliberately dropped. They are in the same file as
the public listing and must never reach a product page.

Three extra columns are also understood, because the stock ledger in the
repository root carries them and Crosslist has nowhere to put them: **`Size`**,
**`Defects`** and **`Date Added`**. They are optional, and the shop reads a
plain `Size` column in preference to a Crosslist size id.

### Photographs

`Images` is a pipe-delimited list of file names matching the photo zip that
Crosslist uploads:

```
img1.jpg|img2.jpg|img3.jpg
```

Unzip that same folder into `public/images/products/` and the names line up.
A full `https://…` URL works too, though a photo CDN needs its hostname adding
to `next.config.ts` before Next will optimise it.

A listing with no photographs is **not** hidden. It renders a patterned plate
reading "photograph to follow", seeded from the listing so the same piece
always looks the same. Better an honest gap than a stock photo of a garment
that is not the one for sale.

### Sizes and categories

Crosslist stores both as opaque ids — `3ff7287f-9598-0e52-4919-ba3e0bbf751f`
is a size. To turn those into words, export the workbook's **Sizes** and
**Categories** sheets and save them as:

```
storefront/data/sizes.csv
storefront/data/categories.csv
```

Each needs an id column and a name column; the importer finds them by header.
Without these files, a size id is left off the listing rather than printed raw
or guessed at, and `npm run import:check` says exactly how many rows are
affected.

### Check before you push

```bash
npm run import:check
```

```
Catalogue
  Source          data/listings.csv
  Listings read   15
  Priced          15/15
  Photographed    0/15
  In a category   14/15
  With a size     15/15
```

It lists columns it did not recognise, columns it expected and did not find,
rows it had to skip, and every listing with no price, no photograph or no
category. It exits non-zero only when a row could not be used at all.

---

## From voice note to shop

The stock ledger in the repository root (`inventory.csv`) is still the source
of truth, written one row per voice note. To turn it into a Crosslist upload:

```bash
node scripts/inventory-to-crosslist.mjs
```

It writes `data/listings.csv` in the Crosslist template's column order, so the
same file uploads to Crosslist *and* builds this shop.

It recognises rather than invents. A brand is filled in only where the brand
name is written in the product name; a colour only where the colour word is one
Crosslist accepts. Anything else is left blank and reported, which is the rule
from `conventions.md`: blank means "not stated", never "none".

---

## How the shop is organised

Three ways in, all rendering the same filterable grid:

| Route | What it is |
|---|---|
| `/shop`, `/shop/<type>` | Garment type — Polos, Jackets & Coats, Knitwear … |
| `/women`, `/men` | Department |
| `/edit/<slug>` | Curated edits — New In, Y2K, Summer, Sale, Under £15 |
| `/brands`, `/brands/<slug>` | Brand, built from whatever the CSV contains |

Sections are declared in `src/data/taxonomy.ts` (name, blurb, SEO copy).
Which listings land in each is decided by the keyword tables in
`src/lib/classify.ts`, which run once at build time against the title, tags,
size and resolved Crosslist category.

Matching is whole-word, so "men" never matches inside "women's". A piece that
matches nothing is still in `/shop` and in search, just on no category page —
and `import:check` names it so the wording can be fixed at source.

To add a category: add a `Section` to `taxonomy.ts` and a rule to
`classify.ts`. It gets a page, a place in the navigation, a home-page tile and
a sitemap entry from those two edits.

---

## Before launch

### 1. Photographs

The single biggest thing. Every listing currently renders a placeholder plate.
Shoot the stock, name the files to match the `Images` column, and unzip into
`public/images/products/`.

### 2. Card payments

Set `STRIPE_SECRET_KEY` in Vercel's environment variables. Until it is set the
shop runs in **enquiry mode**: the bag works and the checkout button sends the
bag by WhatsApp or email instead of taking a card. Nothing breaks, and nothing
pretends to take a payment it cannot.

Prices are never trusted from the browser. `/api/checkout` looks every line up
in the catalogue and prices it server-side, so an edited bag buys nothing at
the wrong price.

### 3. Postage

`UK_SHIPPING_GBP` adds a flat UK postage rate at checkout, and the same figure
can be shown on the delivery page via `src/config/policies.ts`. Left unset,
checkout still collects the delivery address and the page says postage is
confirmed before dispatch. No postage figure is invented, for the same reason
no garment price is.

### 4. WhatsApp and the other channels

`NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only, `447897740194`). Blank hides every
WhatsApp button site-wide. `NEXT_PUBLIC_INSTAGRAM_URL`, `…_VINTED_URL`,
`…_DEPOP_URL` and `…_EBAY_URL` add footer links when set.

### 5. The contact form

`CONTACT_FORWARD_WEBHOOK` — any endpoint that takes a JSON POST. Unset, the
form says so and points at the email address rather than swallowing a message.

### 6. The domain

Point `www.milltownarchive.co.uk` at the Vercel project and set
`NEXT_PUBLIC_SITE_URL` to `https://www.milltownarchive.co.uk`. That one
variable drives canonical URLs, the sitemap, structured data and the Stripe
redirect URLs.

---

## Deploying

Vercel, with the **root directory set to `storefront`**. Framework preset
Next.js; build and output settings are the defaults. Every push rebuilds, which
means **updating the shop is committing a new CSV**.

---

## Design

Warm paper, near-black ink, one brick-red accent, Instrument Serif for the
headlines and Inter for everything a shopper reads quickly — price, size,
condition, buttons. Dark mode follows the reader's system setting.

Tokens live at the top of `src/app/globals.css`; changing them changes the
whole shop.

---

## Reference

`data/crosslist-template-info.csv` is the Crosslist template's own "Info"
sheet — every field, its allowed values and an example — kept here so the
column mapping in `src/lib/import.ts` can be checked against the source rather
than against memory.
