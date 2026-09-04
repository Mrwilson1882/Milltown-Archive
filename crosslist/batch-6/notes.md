# Batch 6 — 4 Sep 2026, 11 items, 120 photos

Ledger: `inventory-2026-09-04.csv`. 111 photos reach the listings; 9 are number cards.

Photos and cards arrived in separate folders, so `prepare.py` now takes several
paths at once rather than needing them copied together.

## The card count checks out

The owner's first run over `Batch 6` alone found **111** photos; the combined run
over both folders found **120**. The difference is exactly the 9 cards, so no
listing photo was sitting in the cards folder and no card in the photos folder.

**Items 7 and 8 have no card** (owner confirmed). They are the pink pair and the
shearling pair, which nothing else in the batch resembles.

## New in the ledger

**`Accept Offers`**, Yes/No per item. Until now every row shipped `TRUE`.
Items 2, 4, 5 and 6 are `FALSE`; the other seven `TRUE`.

## Sizes

Five Birkenstocks, converted from `birkenstock-sizes.csv`:

| Item | Ledger | UK | Note |
|---|---|---|---|
| 7 | EU 35 | UK 2 | women's chart |
| 8 | EU 37 (240mm) | UK 4 | women's chart; footbed stamped 37 in `IMG_2519` |
| 9 | EU 42 | UK 8 | **men's** chart — EU 40–44 differs by gender, and the ledger's Category column says Men's, which settles it |
| 10 | *(blank)* | — | no size id |
| 11 | EU 35 | UK 2 | women's chart |

Item 9 is the first time the new `Category` column has resolved the 40–44
overlap that used to block these rows outright.

## A mistake worth recording

The men's sandals category id was **invented rather than looked up** — a
plausible-looking UUID that does not exist in the workbook. Caught by checking it
against the Categories tab before shipping.

Every category id and size id across batches 4, 5 and 6, and every id in
`birkenstock-sizes.csv`, has now been verified against the workbook. All valid.
**Look the id up; never write one from memory.**

## Open — needs the owner

**Five rows have no Cost of Goods** — all the Birkenstocks. `SF - Birkenstock`
still has no rate. This is now most of a batch rather than a single row.

**Item 10 has no size.** Ledger blank, Category `Unisex`, and no size marking
legible in its eleven photographs. If it falls in EU 40–44 the men's and women's
charts disagree, so the gender is needed as well as the number.

## Prices

All eleven came from the owner.
