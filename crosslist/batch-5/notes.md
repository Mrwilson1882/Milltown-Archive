# Batch 5 — 2 Sep 2026, 7 items, 83 photos

Ledger: `inventory-2026-09-02.csv`. 77 photos reach the listings; 6 are number cards.

## Two things batch 4's rules did not cover

- **Not every HEIC is a number card.** `IMG_2332.heic` is a composition-tag
  close-up with no card in it — it belongs in the listing, and reads
  `51% viscose / 49% cotton`, which fills item 2's blank material.
- **Item 5 has no number card at all** (owner confirmed). Six cards against
  seven ledger rows, so the odd one out is identifiable — but only because the
  batch is small.

Item 1's tape-measure shots sit *after* item 2's photos in the sequence. Grouping
by the garment shown handles it; grouping by position would not have.

## Blanks filled from the photographs

| Item | Filled | From |
|---|---|---|
| 2 | Material `51% Viscose / 49% Cotton` | `IMG_2332` |
| 3 | Colour `Blue` / `Green` | photographs (cell was empty) |
| 4 | Colour `Blue` / `White` | cell held "Mesh mini", a description |
| 6 | Material `Pure New Wool` | Woolmark care tag, `IMG_2378` |
| 7 | Colour `Gray` / `White` | cell held "100% cotton", a material |

## Open — needs the owner

**Three of seven rows have no Cost of Goods.** `cost-rates.csv` has no entry for:

- `VWM - Windbreakers` (items 3 and 5)
- `VWM - Lacoste Jumpers/Cardigans` (item 6)

**Resolved 2 Sep:** the ledger's `SF - Men's Summer Designer Mix` is not a
separate bundle. Owner confirmed it is just **Summer Designer Mix at £6.45**, so
item 2's SKU is corrected to `SF - Summer Designer Mix` on the upload and the
rate applies. This closes a question open since batch 1. The ledger row is left
as dictated, as the record of what was said.

`SF - Birkenstock` is also still outstanding from batch 4.

**Item 6, size.** The Lacoste neck label reads **FR 5 / US L**; the ledger says
**Small**. The ledger was followed, but FR 5 is nearer a UK 14 than a small, so
this is worth checking against the garment.

**Item 5, size.** Ledger blank and no size label in any of the ten photographs,
so `Size id` is empty and Crosslist may reject the row.

## Prices

All seven came from the owner. Nothing was priced by Claude in this batch — the
new pricing method has not been exercised yet.
