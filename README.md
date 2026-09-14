# Milltown Archive

Three things live in this repository.

## The stock ledger (repository root)

The record of what has been logged from voice notes.

- `inventory.csv` — one row per item, the source of truth
- `inventory-2026-08-14.xlsx` — end-of-day export of the sheet
- `conventions.md` — how a voice note becomes a row. **Read this first.**
- `pricing-notes.md` — the pricing data ledger. Prices are set by the owner;
  no price is ever suggested or inferred.

## The shop (`storefront/`)

The retail storefront for **www.milltownarchive.co.uk** — one-of-one vintage,
sold a piece at a time. A Next.js site whose whole catalogue is built from one
file: `storefront/data/listings.csv`, the same Crosslist listing export that is
uploaded to the marketplaces.

`node storefront/scripts/inventory-to-crosslist.mjs` turns the ledger above
into that CSV, so one voice note feeds the ledger, Crosslist and the shop.

See [`storefront/README.md`](storefront/README.md) for the column mapping, how
photographs are matched, and the six things to do before launch.

## The trade site (`site/`)

The Archive Wholesale storefront for **www.archivewholesale.co.uk** — a Next.js
site with three ways to buy: fixed-price reseller boxes, counted lots from five
pieces, and by the kilo.

See [`site/README.md`](site/README.md) for how to run it, and for the five
things to do before launch (set prices, fill the catalogue gaps, add
photography, add the WhatsApp number, connect Stripe).

The same rule from `pricing-notes.md` applies there: only prices the owner has
actually given are on the site. The two £200 reseller boxes are priced;
everything else shows "Price on request" until a price is set.
