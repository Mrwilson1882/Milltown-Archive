# Pricing Notes

**Purpose: collect pricing data. Claude prices only where the owner does not.**

**19 Aug 2026 — the 14 Aug suspension is lifted.** Owner's instruction: price
the items where no price is dictated. A dictated price is still final and is
never overridden.

The 14 Aug reasoning has not been disproved, only overruled, and it is worth
keeping in view: the dataset was too small, the relationships were not linear,
and the suggestions were reading patterns into noise. What has changed is that
the owner would rather have a flagged estimate to correct than a blank cell.

### How Claude prices

1. **Anchor on the owner's own prices first.** The ledger is the only record of
   what this business actually charges. Nearest comparable by garment type, then
   brand tier, then condition.
2. **State the comparable out loud** in the `price_reasoning` column, so any
   figure can be argued with rather than taken on trust.
3. **Keep the `.99` ending** — true of every price recorded so far.
4. **Give a range, not false precision, where no comparable exists**, and say so.
5. **Mark every Claude-set price** with `price_source = claude`. Owner-dictated
   prices are `price_source = owner` and are never touched.

### The known weakness

Claude has no live market feed — no Vinted sold listings, no comparables outside
this ledger. Every estimate is anchored on 23 rows of one seller's history plus
general knowledge of the brands.

That matters because it is exactly where the ledger is thinnest that pricing is
hardest, and the Miss Me miss proves it: **£25 was knowable from Vinted, not
from anything in these columns.** Demand, era desirability and what is currently
selling remain invisible here, as the section below has said since 14 Aug.

So expect Claude's estimates to be weakest on the pieces that most deserve a
premium — collected brands, named players, sought-after eras — which is the
opposite of where they would be most useful. Corrections are the fix: every one
becomes a comparable, and the flagged-estimate loop tightens as the ledger grows.

**Read this file at the start of any new session.** The chat is not
persistent — this file and `inventory.csv` are the memory. When a voice note
arrives without a price, leave the Price cell blank and ask the owner for it.
Do not offer a figure.

## What the data cannot see

The single biggest reason suggestions failed: **demand varies by product and
none of it is recorded here.** Two garments identical in brand, size and
condition can be worth very different amounts because one is wanted and the
other is not. Era, silhouette, colourway, what is currently selling, and how
sought-after a particular piece is — none of that lives in the columns, and
the owner is carrying all of it by eye.

Any future model built from this table will be working with a partial view.
Treat that as a permanent caveat, not a gap that more rows alone will close.

## Observed prices

| # | Product | Brand | Size | Condition | Defects | SKU | Price |
|---|---------|-------|------|-----------|---------|-----|-------|
| 1 | Skinny Minnie | Skinny Minnie | Large Women's | Very good | *(not stated)* | VWM - Summer Women's Mix | £9.99 |
| 2 | Ralph Lauren Polo | Ralph Lauren | XXL | Very good vintage | *(not stated)* | *(none given)* | £14.99 |
| 3 | Ralph Lauren Polo | Ralph Lauren | Small Men's | Very good | *(labels cut — filed under description)* | VWM - RL Lacoste Polos | £14.99 |
| 4 | Ralph Lauren Women's Polo Shirt | Ralph Lauren | Large Women's | Very good | *(not stated)* | VWM - Women's Y2K Mix | £12.99 |
| 5 | Women's Bralette | *(none given)* | 36 | Very good | None | VWM - Women's Summer Mix | £12.99 |
| 6 | Women's Bralette | *(none given)* | Small | Very good | None | VWM - Women's Y2K Mix | £8.99 |
| 7 | Ralph Lauren Women's Polo | Ralph Lauren | Medium (10-12) | Very good | *(not stated)* | VWM - Women's Y2K Mix | £12.99 |
| 8 | Nike Track Jacket | Nike | Large (oversized fit) | Very good | *(not stated)* | VWM - Track Jacket | £24.99 |
| 9 | Harley Davidson Women's Cardigan | Harley Davidson | Medium | Very good | None | VWM - Women's Y2K Mix | £14.99 |
| 10 | Ralph Lauren Women's Polo | Ralph Lauren | XL Women's | Very good vintage | Small discrepancy on front | VWM - RL Lacoste Polos | £9.99 |
| 11 | Nike Track Jacket | Nike | XL | Very good vintage | White marks on right sleeve | VWM - Track Jacket | £14.99 |
| 12 | Ralph Lauren Polo | Ralph Lauren | XXL Men's | Good | Discrepancies on front | VWM - RL Lacoste Polos | £9.99 |
| 13 | Lacoste Polo | Lacoste | UK Small | Good | Discrepancies on front | VWM - RL Lacoste Polos | £9.99 |
| 14 | Lacoste Polo | Lacoste | UK Large | Very good vintage | None | VWM - RL Lacoste Polos | £12.99 |
| 15 | Ralph Lauren Polo | Ralph Lauren | Large | Very good | *(not stated)* | VWM - RL Lacoste Polos | £14.99 |

## Raw observations

Recorded as facts about the 11 priced items so far — **not rules, not
predictors.** Each has plausible counter-explanations and the sample is tiny.

- Every price ends in `.99`. Observed: £8.99, £9.99 (×3), £12.99 (×2),
  £14.99 (×3), £24.99. This is the only thing true of every item.
- The two track jackets sit well above everything else (£24.99 for the clean
  one). The two bralettes sit at or near the bottom.
- Items 12 and 13 both priced £9.99 while differing in brand, size and colour;
  both were "good" condition with front discrepancies.
- Item 10 priced £9.99 against a clean comparable at £12.99.
- Item 3's cut labels took no visible reduction.
- Two bralettes in identical stated condition priced £12.99 and £8.99, which
  no recorded column explains — an early sign that unrecorded factors
  (desirability, era, cut) are doing real work.

## Batch 2 — 18 Aug 2026

Prices as set by the owner. Recorded, not suggested.

| # | Product | Brand | Size | Condition | SKU | Price |
|---|---------|-------|------|-----------|-----|-------|
| 1 | NFL Reebok Jersey (Rivers 17) | Reebok | XL Women's | Very good vintage | VWM - Women's Y2K Mix | £17.99 |
| 2 | Nike Track Jacket | Nike | Medium (8-10) | Good vintage | VWM - Women's Y2K Mix | £17.99 |
| 3 | Miss Me Denim Shorts | Miss Me | Waist 30 | Very good | VWM - Women's Y2K Mix | £18.99 |
| 4 | NFL Nike Jersey (Luck 12) | Nike | Large Women's | Very good | VWM - Women's Y2K Mix | £18.99 |
| 5 | NFL Reebok Jersey (Payton 34) | Reebok | XL Women's | Very good vintage | VWM - Women's Y2K Mix | £19.99 |
| 6 | The North Face Quarter Zip | The North Face | Large | Very good | VWM - Women's Y2K Mix | £14.99 |
| 7 | Carhartt T-Shirt | Carhartt | Small (4-6) | Very good | VWM - Women's Y2K Mix | £14.99 |
| 8 | Birkenstock Gizeh Sandals | Birkenstock | UK 7 (EU 40) | Very good vintage | SF - Birkenstock | £27.99 |

Note batch 2 breaks the `.99` pattern in one place — the Birkenstocks at £27.99
are the highest single price recorded so far, above the £24.99 track jacket.

## Underpricing observed

**19 Aug — item 3, Miss Me denim shorts.** Listed at £18.99; the owner reports
the market on Vinted was nearer **£25**. Roughly £6 left on the table, about a
third above the listed price.

This is the first recorded instance of a *known* underprice rather than a
suggestion error, and it is a more useful data point than anything in the
suggestion log, because the counterfactual is observed rather than guessed.

What it suggests, without yet being a rule: **branded Y2K womenswear with
recognisable embellishment may sit well above the £14.99–£18.99 band the rest of
the mix occupies.** Miss Me is a collected name and the rhinestone cut-offs are
its signature piece. The same logic would apply to the NFL jerseys with named
players — Payton at £19.99 is the closest comparable in this batch, and worth
watching.

One instance is not a pattern. Recorded so the next few Miss Me or
named-player items can be compared against it.

## Batch 3 — 19 Aug 2026

25 items, all priced by the owner. Nothing for Claude to price this time.

Notable against the pattern recorded on 14 Aug:

- **Three prices do not end `.99`** — items 2 and 21 at £18.00 and item 20 at
  £14.00. **Confirmed deliberate by the owner, 19 Aug.** The `.99` ending is
  therefore a strong habit rather than a rule, and any future model should not
  treat a round price as an error to correct.
- **£34.99 for the Juicy Couture velour top** is the highest garment price
  recorded, well above the £14.99-£19.99 band the mix usually occupies. Juicy
  velour is a collected Y2K name, which is consistent with the Miss Me lesson:
  recognisable branded Y2K sits above the band.
- **£19.99 Burberry Brit** in `Good` condition with marks on the front, and
  **£22.99 Adidas jacket**, are the next highest.

Three of the four Birkenstock pairs are the same £24.99, with the bronze pair at
£27.99 matching batch 2's.

## Owner-stated factors

Things the owner has said out loud, which outrank anything inferred above:

1. **Defects are one of the big factors** in pricing.
2. **Demand differs by product** — different items carry different values
   regardless of brand and condition.

## Suggestion log (closed)

Kept as a record of accuracy while suggestions were being made. No further
entries — suggestions are suspended.

| Item | Suggested | Actual | Error |
|------|-----------|--------|-------|
| 6 | £12.99 | £8.99 | −£4.00 too high |
| 10 | £12.99 | £9.99 | −£3.00 too high |
| 7 | £12.99 | £12.99 | correct |
| 11 | £21.99 | £14.99 | **−£7.00 too high** |

One of four landed. The item 11 miss is the instructive one: the suggestion
assumed a flat £3.00 defect deduction carried over from a £12.99 polo, and
the owner actually took £10.00 off a £24.99 jacket. Deductions are clearly
not flat, and extrapolating one item's arithmetic onto a different garment
type was exactly the over-fitting the owner called out.

## Revisit

Reassess in a few months, once the dataset is substantially larger and spans
more garment types, condition grades and defect severities. Until the owner
says otherwise, this file is a ledger, not a model.
