# Batch 2 — 18 Aug 2026

8 items. Main images received and matched to the ledger by number card; the full
photo sets are still to come, so no `mapping.csv` or `listings.csv` yet.

## Card → ledger

Every card was legible. No ambiguity.

| # | File | Ledger |
|---|---|---|
| 1 | `IMG_0428.HEIC` | NFL Reebok T-Shirt — light blue Chargers jersey, #17 |
| 2 | `IMG_0427.HEIC` | Nike Women's Track Jacket — navy / cream / orange |
| 3 | `IMG_0425.HEIC` | Miss Me Denim Shorts — mid-blue, embellished pockets |
| 4 | `IMG_0426.HEIC` | NFL T-Shirt — royal blue Colts jersey, #12 |
| 5 | `IMG_0423.HEIC` | NFL Reebok Top — navy Bears jersey, #34 Walter Payton |
| 6 | `IMG_0422.HEIC` | The North Face Pullover — turquoise quarter-zip fleece |
| 7 | `IMG_0421.HEIC` | Carhartt T-Shirt — charcoal, white script logo |
| 8 | `IMG_1680.HEIC` | Birkenstock Thong Sandals — natural leather |

The filename order does not follow the card order, so the cards are doing real
work here — 0421 is item 7 and 0428 is item 1.

## Blocked

1. **Item 8, Birkenstock EU 40.** This is exactly the overlap the size rule
   warns about: EU 40 is **UK 7 women's** or **UK 6 men's**, a full size apart,
   and the ledger does not say which. The sandals photograph as a Gizeh-style
   thong, which is sold in both. Needs the owner.
   Also worth capturing: **Regular or Narrow**, stamped on the footbed.
2. **`SF - Birkenstock` has no cost rate.** New SKU, not in `cost-rates.csv`.
   The SF prefix prices differently from VWM, so no VWM rate can stand in.

## Flags

3. **Items 1, 4 and 5 are jerseys, not T-shirts.** All three are mesh NFL
   jerseys with numbers and sleeve stripes. `jersey` is both the stronger search
   term and its own Crosslist category (`Women's jerseys`,
   `id=f4a67f28-053d-8610-20a4-9573961c33e4`), against the generic tee category
   the ledger names imply. Worth renaming in the ledger.
4. **Colour blank on items 3 and 7.** From the photographs: item 3 is mid-blue
   distressed denim, item 7 charcoal or dark heather grey. Flagged rather than
   filled — `conventions.md` keeps colour out of photograph-only judgement.
5. **No gender on item 6** (`Large`) and none on item 3 (`Waist 30`), which
   blocks Category id and Size id together.
6. **Brand is not a ledger column** — it is embedded in the product name. Clear
   for all but item 4, whose "NFL T-Shirt" names a league rather than a maker;
   the hem tag needs reading.

## Player and team detail worth using

Items 1, 4 and 5 are all identifiable, and player names are high-intent search
terms: #34 Walter Payton (Chicago Bears), #12 (Indianapolis Colts), #17 (San
Diego / LA Chargers). Confirm the two unnamed ones before they go in a title —
a wrong player name is worse than none.
