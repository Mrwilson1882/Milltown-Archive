# Batch 2 — 18 Aug 2026

8 items, 167 photo files received. `mapping.csv` is built; `listings.csv` waits
on the two open items below.

## Half the batch is duplicates — measured, not eyeballed

Photoroom exported every shot twice: `IMG_0351-Photoroom.JPG` and
`IMG_0351-Photoroom 2.JPG` are the same image. Confirmed by comparing the
thumbnails after normalising for scale and offset:

| | Mean pixel difference |
|---|---|
| Suspected pairs, same IMG number | **0.65 – 2.24** |
| Control: genuinely different shots | **29 – 90** |

A 30–100× gap; the residual on the pairs is JPEG noise from the thumbnail
pipeline, not content. Owner confirmed independently that every image is
duplicated once.

**167 files hold 84 unique photos.** The mapping keeps one of each pair, which
also brings every item back under the 20-photo marketplace cap — including it
all had pushed item 3 to 27.

Nothing is deleted either way: `build.py` only reads the source folder.

Two irregulars: `IMG_0377` exported once, and `IMG_0401` came out as
`Photoroom 3` and `Photoroom 4` rather than a plain pair.

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

## Built

`items.csv` and `listings.csv` are complete: 8 rows, 33 columns, 84 photos, no
row missing a Category id or Size id. Only `Cost of Goods` on item 8 is empty,
pending the `SF - Birkenstock` rate.

Item 8 carries **Regular** width (owner, 19 Aug) in both the description and the
Internal note, and the footbed stamp and both size systems are written into the
copy so a buyer can check the fit themselves.

### Era brackets worth noting

Three items date themselves precisely through licensing rather than styling:

- **Reebok held the NFL licence 2002–2011.** Items 1 and 5 sit inside it.
- **Nike took it in 2012**, and Andrew Luck played 1012–2018, so item 4 cannot
  predate 2012.
- Item 1 narrows further: Rivers started for the Chargers from 2006.

That is far firmer evidence than the cut-and-hem reasoning batch 1 relied on.

## Blocked

1. ~~Item 8, Birkenstock EU 40~~ — **resolved from the footbed stamp.**
   `260` is the foot length in millimetres. At EU 40 the women's chart is 26 cm
   and the men's 25 cm, so the stamp identifies the women's chart: **UK 7**,
   size id `d35611e7-9228-4b31-7fe3-ea43743f10d7` (Women's shoes).

   **Owner confirmed women's, 19 Aug** — which agrees with the footbed. Two
   independent routes to the same answer, so this one is settled.

   Width confirmed **Regular** by the owner, 19 Aug.
2. **`SF - Birkenstock` has no cost rate** — owner will supply later. The field
   is left empty rather than filled from an SF or VWM figure that does not
   apply; everything else about item 8 is complete.

## Gaps in the Crosslist option lists

Three of this batch's garment types have no vocabulary captured yet, so their
Internal notes say so rather than inventing a value:

- **Jerseys** (items 1, 4, 5) — the tops `Type` list holds only Blouse,
  Button-Up, Polo, Tank, T-Shirt.
- **Shorts** (item 3) — no Style list seen.
- **Sandals** (item 8) — no Style list seen.

Screenshots of those three dropdowns would finish the set.

## Flags

3. **Items 1, 4 and 5 are jerseys, not T-shirts.** All three are mesh NFL
   jerseys with numbers and sleeve stripes. `jersey` is both the stronger search
   term and its own Crosslist category (`Women's jerseys`,
   `id=f4a67f28-053d-8610-20a4-9573961c33e4`), against the generic tee category
   the ledger names imply. Worth renaming in the ledger.
4. ~~Colour blank on items 3 and 7~~ — **read and filled** (owner, 19 Aug):
   item 3 mid-blue washed denim, item 7 charcoal grey.
5. ~~No gender on items 3 and 6~~ — **decided as womenswear.** Every garment in
   this batch carries the `VWM - Women's Y2K Mix` SKU, which names the bundle as
   womenswear, and both garments agree: item 3 is a Miss Me cut-off, a womenswear
   brand, and item 6's fleece is a women's cut. Item 8 was confirmed womenswear
   by the owner.

## Colours as they will map to Crosslist

Read from the photographs. The fixed list has no denim or charcoal, so those
resolve to the nearest permitted value.

| # | Garment | Colour | Secondary |
|---|---|---|---|
| 1 | Chargers jersey | `Blue` | `Yellow` |
| 2 | Nike jacket | `Navy` | `Cream` |
| 3 | Miss Me shorts | `Blue` | — |
| 4 | Colts jersey | `Blue` | `White` |
| 5 | Bears jersey | `Navy` | `Orange` |
| 6 | North Face fleece | `Turquoise` | — |
| 7 | Carhartt tee | `Gray` | `White` |
| 8 | Birkenstocks | `Tan` | — |

Item 2 is the one judgement call: navy, cream and orange are all present, and
only two slots exist. Cream takes the secondary as the larger area, leaving
orange to the title and tags.
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
