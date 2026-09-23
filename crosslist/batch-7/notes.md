# Batch 7 — 23 Sep 2026, 7 items, 106 photos

Photos: `Batch 23rd sept`. Contact sheets built at `--thumb-px 1100` so the
tape-measure shots could be read.

**86 photos reach the listings.** Excluded, and listed in full in `excluded.csv`:

- **7 number cards**
- **13 t-shirt photos** (`DSC00002`–`DSC00016`) — no ledger row, owner's
  instruction of 23 Sep. These are Carhartt and Dickies tees and long-sleeves.

## Seven of the fourteen HEICs are not cards

`IMG_2714`, `IMG_2717`, `IMG_2738`, `IMG_2739`, `IMG_2740`, `IMG_2752` and
`IMG_2776` are label and swing-tag close-ups. They stay in their listings — and
several carry the size, which is what this batch needed.

## Shot on two devices

Each item has `DSC` full front and back shots from a camera and `IMG` close-ups
and measurements from a phone, so its photos are in two separate runs of the
sequence. Grouping by the garment shown handles it; grouping by position
would not.

## What the labels say

| Item | Garment | Brand | Size from label | Composition |
|---|---|---|---|---|
| 1 | Black quilted jacket, stand collar | *(monogram tag, not resolved)* | — | 51% Nylon / 49% Polyester |
| 2 | Navy gilet | **Fay** | **M** | — |
| 3 | Quilted jacket, fur collar | **D&G Dolce & Gabbana** | **XL** | — |
| 4 | Waxed jacket, tartan lining | **Belstaff** | — | — |
| 5 | Hooded puffer | **Moncler** | — | down, Classe 1 |
| 6 | Long quilted coat | **Fay** | — | — |
| 7 | Waxed jacket, tartan lining | **Belstaff** | — | — |

Every item has both a pit-to-pit and a length shot, so the ones without a legible
size label can be sized from the tape.

## Item 7 is not in the ledger

`inventory-2026-09-23.csv` has six rows. Item 7, the black Belstaff, has none.
Condition and size come from the owner's message of 23 Sep — very good, XL —
and its price is Claude-set, since none was ever given.

## SKU

Every ledger SKU cell was empty. Owner, 23 Sep: the whole batch is
**`SF - Fripe Winter Jackets` at £14.61 per item**, now in `cost-rates.csv`.
That is the highest per-item cost recorded — the previous top was £9.60 — which
suits winter outerwear. Every row clears 2.5x cost; the thinnest is item 2 at
2.7x.

## Sizes

| Item | Ledger | Set | From |
|---|---|---|---|
| 1 | *(blank)* | Large | pit to pit ~23in — **a reading, not a label** |
| 2 | Medium Men's | M | neck label confirms |
| 3 | XL | XL | D&G size tab confirms |
| 4 | XL **or XXL** | **XL** | pit to pit ~22in |
| 5 | Large **or XL** | **Large** | pit to pit ~19.5in; no numeric Moncler tag in any of its 13 photos |
| 6 | XS Women's | XS | ledger |
| 7 | *(not in ledger)* | XL | owner's message |

## Brands confirmed

All three "brand to confirm" rows resolved from labels: item 1 is
**PER TE BY KRIZIA**, items 2 and 6 are **Fay**.

## The workbook now lives in the repo

`crosslist/reference/CSV_listing_template.xlsx`. It had only ever existed as a
chat upload, and when those were cleared no category id could be verified —
which is how an invented UUID nearly shipped in batch 6. Committed so that
cannot recur.
