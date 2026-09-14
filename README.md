# Milltown Archive

Three things live in this repository.

## The stock ledger (repository root)

The record of what has been logged from voice notes.

- `inventory.csv` — one row per item, the source of truth
- `inventory-2026-08-14.xlsx` — end-of-day export of the sheet
- `conventions.md` — how a voice note becomes a row. **Read this first.**
- `pricing-notes.md` — the pricing data ledger. Prices are set by the owner;
  no price is ever suggested or inferred.

## The website (`site/`)

The Archive Wholesale storefront for **www.archivewholesale.co.uk** — a Next.js
site with three ways to buy: fixed-price reseller boxes, counted lots from five
pieces, and by the kilo.

See [`site/README.md`](site/README.md) for how to run it, and for the five
things to do before launch (set prices, fill the catalogue gaps, add
photography, add the WhatsApp number, connect Stripe).

The same rule from `pricing-notes.md` applies there: only prices the owner has
actually given are on the site. Anything still unpriced shows "Price on
request" and takes an enquiry rather than an order.

## Invoicing (`invoicing/`)

Invoices for MANCH LTD, trading as Archive Wholesale. Prices are read from the
website catalogue, so an invoice cannot quote a figure the site does not — and
the same rule applies again: no price is ever inferred, and a lot with no price
comes back as an error rather than a guess.

See [`invoicing/README.md`](invoicing/README.md). Two fields are deliberately
blank and need filling in before an invoice can be sent: the registered office
address and the bank details.
