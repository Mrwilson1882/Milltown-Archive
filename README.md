# Milltown Archive

Two things live in this repository.

## The stock ledger (repository root)

The record of what has been logged from voice notes.

- `inventory.csv` — one row per item, the source of truth
- `inventory-2026-08-14.xlsx` — end-of-day export of the sheet
- `conventions.md` — how a voice note becomes a row. **Read this first.**
- `pricing-notes.md` — the pricing data ledger. Prices are set by the owner;
  no price is ever suggested or inferred.

## The website (`site/`)

The Archive Wholesale storefront for **www.archivewholesale.co.uk** — a Next.js
site with categories, bundle pages, cart and a Stripe-ready checkout.

See [`site/README.md`](site/README.md) for how to run it, and for the five
things to do before launch (set prices, replace the sample catalogue, add
photography, add the WhatsApp number, connect Stripe).

The same rule from `pricing-notes.md` applies there: every bundle ships with no
price until the owner sets one.
