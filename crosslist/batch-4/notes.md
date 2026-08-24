# Batch 4 — 20 Aug 2026, 45 items, 522 photos

Ledger: `inventory-2026-08-20.csv` (45 rows).
Photos: `Batch 4` + `Batch 4 Cards` → 522 files, of which 45 are number cards.
477 photos reach the listings, which is the owner's own arithmetic.

## How the mapping was worked out

The first attempt assumed a card opens its item's run. That produced 41 items,
not 45, with one item holding 72 photos. Cards do not sit consistently — some
open a run, some close it, and card 22 sits in the middle of one.

**The card is photographed lying on its own garment.** That is the signal, and
it is the only one that holds across all 45. Every contact-sheet page was read
and each photo assigned by the garment it shows.

Two consequences worth keeping:

- **Cards 18 and 19 are reversed in file order.** `IMG_1470` is card 19 (grey
  cashmere hoodie), `IMG_1471` is card 18 (black velour). Sorting by filename
  puts 19 before 18.
- **Four back-to-back card pairs** — 18/19, 23/24, 38/39, 42/43. Each splits the
  same way: the first card closes the run before it, the second opens the run
  after it. Verified on the sheets for all four, not inferred from one.

## The second photo pass

`IMG_1760` to `IMG_1830` is a **second run over items already shot** — clean
full front and back shots on a plain ground, in item order, covering items 1–20
and 35–43. These lead each listing, because they are exactly the full front and
full back the ordering rule asks for.

Items 21–34, 44 and 45 have no second pass. Their cover shot is the Photoroom
twin of the card photo where one exists — background removal takes the card
away with the floor, leaving a clean full front flat-lay — otherwise the best
full front in the main run.

## Blanks filled from the photographs

Colour was read for every row that had none, and these came off legible labels:

| Item | Filled | From |
|---|---|---|
| 18 | Material `88% Cotton / 12% Polyester` | `IMG_1467` |
| 24 | Material `85% Polyester / 15% Cotton` | `IMG_1543` (Corset Story) |
| 41 | Brand `Y Jeans` (ledger said "brand unclear") | `IMG_1698` |
| 45 | Brand `Dominique` | `IMG_1847` |
| 45 | Condition `VeryGood`, SKU `VWM - Women's Y2K Mix` | photographs / batch default |

Item 12's `40D` was confirmed against its own tag (`IMG_1404`), as was item 29's
Maidenform label and item 31's Urban Outfitters label.

## Open — needs the owner

**Four items are described in the ledger as skirts or a dress; the photographs
show steel-boned waist trainers.** The ledger was followed, because a stated
value is never overridden — but the evidence is brand-level, not a judgement
call:

| Item | Ledger says | Photographs show |
|---|---|---|
| 24 | Yana K Women's Skirt | Corset Story, tag reads "spiral steel bones" |
| 26 | Women's Dress, size 28/29 | Waist Gang Society, tagged XS / EUR 34 |
| 27 | Women's Miniskirt | Latex-look waist trainer, hook-and-eye busk |
| 28 | Yana K Women's Miniskirt | YIANNA waist trainer |

"Yana K" may be how YIANNA came through the voice note. If these are waist
trainers, the four rows need a different category and title; it is a small edit
either way, but it changes which buyers ever see them.

**Seven rows carry no Size id.** Crosslist may reject them:

- 11, 17, 20, 25, 38, 43 — ledger size blank and no size label in the photos.
- 12 — ledger gives `40D`, a bra size. `Women's chemises` sits on the Women's
  clothing size group, which has no `40D`. Moving it to `Women's bras` resolves
  it (`40D` = `cdb00583-a2d4-1350-30da-4004ca9f53ac`), but it is a chemise.

Item 33, the tie, is correctly blank — `Men's ties` has no size group at all.

**Item 34, the Birkenstocks.** The ledger gives EU 34, which is UK 1.5 on
Birkenstock's own chart. Crosslist's Women's shoes group starts at UK 2, so UK 2
was used and both sizes are printed in the title and description. Still no
`SF - Birkenstock` cost rate, so `Cost of Goods` is empty on this row alone.

**Item 37.** The ledger says "Size 8 (waist approx. 30in)". A 30in waist is US 8,
which is UK 12 — the same Crosslist row — so that id was used rather than the
UK 8 one. Reading the ledger fully rather than overriding it.

**Item 35** is the batch's only `Satisfactory condition`, mapped to `Fair`. New
mapping, worth confirming.

## Prices

All 45 came from the owner. Nothing was priced by Claude in this batch.
