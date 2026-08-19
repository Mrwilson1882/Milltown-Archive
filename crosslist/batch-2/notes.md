# Batch 2 — 18 Aug 2026

8 items, 167 photo files received. `mapping.csv` is built; `listings.csv` waits
on the two open items below.

## Half the batch is duplicates

Photoroom exported nearly every shot twice — `IMG_0351-Photoroom.JPG` and
`IMG_0351-Photoroom 2.JPG` are the same image. 167 files hold **84 unique
photos**; 83 are redundant and are dropped from the mapping. Left in, every
listing would have shown each photo twice.

Two irregulars: `IMG_0377` exported only once, and `IMG_0401` came out as
`Photoroom 3` and `Photoroom 4` rather than a plain pair.

The 24 `FullSizeRender` files are 12 unique images — a front and a back for six
items, each also duplicated. Items 3 and 8 have none, so their front and back
come from the `IMG_` series.

## No number cards in this set

The card shots (`IMG_0421`–`0428`, `IMG_1680`) were sent separately and are not
in this folder, so grouping was done by recognising each garment and matching it
to the main images already identified. Boundaries were checked against the
garment either side of every break.

Worth folding the card shots into the batch folder next time — they are the
check that makes the grouping self-evident rather than inferred.

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

1. ~~Item 8, Birkenstock EU 40~~ — **resolved from the footbed stamp.**
   `260` is the foot length in millimetres. At EU 40 the women's chart is 26 cm
   and the men's 25 cm, so the stamp identifies the women's chart: **UK 7**,
   size id `d35611e7-9228-4b31-7fe3-ea43743f10d7` (Women's shoes).

   **Owner confirmed women's, 19 Aug** — which agrees with the footbed. Two
   independent routes to the same answer, so this one is settled.

   Still open: **Regular or Narrow**. That is not the number — it shows as a
   foot-outline symbol on the footbed, slimmer for narrow.
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

## Player names — now confirmed off the garments

No guessing needed: the names are printed on the backs.

- Item 1 — **RIVERS 17**, San Diego / LA Chargers. Size XL on the hem tag.
- Item 4 — **LUCK 12**, Indianapolis Colts. Nike hem tag reads **L**.
- Item 5 — **PAYTON 34**, Chicago Bears. Hem tag reads **XL, Walter Payton**.

All three are high-intent search terms and belong in the titles and tags.

Note item 4's hem tag says **L** while the ledger says Large Women's — consistent.
Item 1's tag says **XL** against a ledger XL Women's — also consistent. Item 5's
tag says XL against ledger XL Women's — consistent. No size discrepancies.

Item 4's brand is **Nike** (hem tag), which the ledger's "NFL T-Shirt" did not
say.
