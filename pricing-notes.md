# Pricing Notes

**Purpose: collect pricing data. Do not suggest prices.**

Instruction from the owner (14 Aug 2026): stop making price suggestions. The
dataset is far too small, the relationships are not linear or obvious, and the
suggestions made so far were reading patterns into noise. Keep recording what
the owner prices and why, and revisit in a few months once there is enough
data to be useful.

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

Item numbers restart at 1 each day (they are physical markers that get reused),
so an item is identified by **date + number**, never by number alone.

| Date | # | Product | Brand | Size | Condition | Defects | SKU | Price |
|------|---|---------|-------|------|-----------|---------|-----|-------|
| 14 Aug | 1 | Skinny Minnie | Skinny Minnie | Large Women's | Very good | *(not stated)* | VWM - Summer Women's Mix | £9.99 |
| 14 Aug | 2 | Ralph Lauren Polo | Ralph Lauren | XXL | Very good vintage | *(not stated)* | *(none given)* | £14.99 |
| 14 Aug | 3 | Ralph Lauren Polo | Ralph Lauren | Small Men's | Very good | *(labels cut — filed under description)* | VWM - RL Lacoste Polos | £14.99 |
| 14 Aug | 4 | Ralph Lauren Women's Polo Shirt | Ralph Lauren | Large Women's | Very good | *(not stated)* | VWM - Women's Y2K Mix | £12.99 |
| 14 Aug | 5 | Women's Bralette | *(none given)* | 36 | Very good | None | VWM - Women's Summer Mix | £12.99 |
| 14 Aug | 6 | Women's Bralette | *(none given)* | Small | Very good | None | VWM - Women's Y2K Mix | £8.99 |
| 14 Aug | 7 | Ralph Lauren Women's Polo | Ralph Lauren | Medium (10-12) | Very good | *(not stated)* | VWM - Women's Y2K Mix | £12.99 |
| 14 Aug | 8 | Nike Track Jacket | Nike | Large (oversized fit) | Very good | *(not stated)* | VWM - Track Jacket | £24.99 |
| 14 Aug | 9 | Harley Davidson Women's Cardigan | Harley Davidson | Medium | Very good | None | VWM - Women's Y2K Mix | £14.99 |
| 14 Aug | 10 | Ralph Lauren Women's Polo | Ralph Lauren | XL Women's | Very good vintage | Small discrepancy on front | VWM - RL Lacoste Polos | £9.99 |
| 14 Aug | 11 | Nike Track Jacket | Nike | XL | Very good vintage | White marks on right sleeve | VWM - Track Jacket | £14.99 |
| 14 Aug | 12 | Ralph Lauren Polo | Ralph Lauren | XXL Men's | Good | Discrepancies on front | VWM - RL Lacoste Polos | £9.99 |
| 14 Aug | 13 | Lacoste Polo | Lacoste | UK Small | Good | Discrepancies on front | VWM - RL Lacoste Polos | £9.99 |
| 14 Aug | 14 | Lacoste Polo | Lacoste | UK Large | Very good vintage | None | VWM - RL Lacoste Polos | £12.99 |
| 14 Aug | 15 | Ralph Lauren Polo | Ralph Lauren | Large | Very good | *(not stated)* | VWM - RL Lacoste Polos | £14.99 |
| 18 Aug | 1 | NFL Reebok T-Shirt | NFL / Reebok | XL Women's | Very good vintage | None | VWM - Women's Y2K Mix | £17.99 |
| 18 Aug | 2 | Nike Women's Track Jacket | Nike | Medium Women's (8-10) | Good vintage | Marks on left sleeve | VWM - Women's Y2K Mix | £17.99 |
| 18 Aug | 3 | Miss Me Denim Shorts | Miss Me | Waist 30 | Very good | None | VWM - Women's Y2K Mix | £18.99 **(Claude-set — see below)** |
| 18 Aug | 4 | NFL T-Shirt | NFL | Large Women's | Very good | *(not stated)* | VWM - Women's Y2K Mix | £18.99 |
| 18 Aug | 5 | NFL Reebok Top (Walter Payton #34) | NFL / Reebok | XL Women's | Very good vintage | *(not stated)* | VWM - Women's Y2K Mix | £19.99 **(Claude-set — see below)** |
| 18 Aug | 6 | The North Face Pullover | The North Face | Large | Very good | *(not stated)* | VWM - Women's Y2K Mix | £14.99 |

## Raw observations

Recorded as facts about the 11 priced items so far — **not rules, not
predictors.** Each has plausible counter-explanations and the sample is tiny.

- Every price ends in `.99`. Observed: £8.99, £9.99 (×3), £12.99 (×2),
  £14.99 (×3), £24.99. This is the only thing true of every item.
- The two track jackets sit well above everything else (£24.99 for the clean
  one). The two bralettes sit at or near the bottom.
- 14 Aug #12 and #13 both priced £9.99 while differing in brand, size and
  colour; both were "good" condition with front discrepancies.
- 14 Aug #10 priced £9.99 against a clean comparable at £12.99.
- 14 Aug #3's cut labels took no visible reduction.
- Two bralettes in identical stated condition priced £12.99 and £8.99, which
  no recorded column explains — an early sign that unrecorded factors
  (desirability, era, cut) are doing real work.

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
| 14 Aug #6 | £12.99 | £8.99 | −£4.00 too high |
| 14 Aug #10 | £12.99 | £9.99 | −£3.00 too high |
| 14 Aug #7 | £12.99 | £12.99 | correct |
| 14 Aug #11 | £21.99 | £14.99 | **−£7.00 too high** |

One of four landed. The 14 Aug #11 miss is the instructive one: the suggestion
assumed a flat £3.00 defect deduction carried over from a £12.99 polo, and
the owner actually took £10.00 off a £24.99 jacket. Deductions are clearly
not flat, and extrapolating one item's arithmetic onto a different garment
type was exactly the over-fitting the owner called out.

## Claude-set prices — EXCLUDE from any future model (18 Aug #3 and #5)

The owner asked for a price on these two specifically. **These figures are not
owner decisions and must not be treated as training data** — feeding them back
in would be the model learning from its own output.

**18 Aug #3 — Miss Me denim shorts, waist 30, very good, no defects → £18.99**

Basis: US Poshmark asking prices for Miss Me size-30 denim shorts, seen at $39,
$41 and $54, with the brand's listings spanning roughly $24–$54. Adjusted down
for three reasons: those are *asking* prices, not sold prices; the US market
for Miss Me (a US western/boutique denim label) is deeper than the UK one; and
£18.99 sits inside the owner's own observed range rather than above it.

**18 Aug #5 — NFL Reebok top, Walter Payton #34, XL women's → £19.99**

Basis: the owner's own two NFL tops priced the same day — 18 Aug #1 at £17.99
(also XL women's, also very good vintage) and 18 Aug #4 at £18.99. A marquee
player name should carry a premium over a plain team top, so £19.99 is one
step up. US listings for Walter Payton Reebok *jerseys* ran $38–45, but a
jersey is a different and more valuable garment than a top, so that figure
sets a ceiling rather than a comparable.

**What could not be checked**: the network in this environment blocks eBay,
Vinted, Depop, Mercari and UK vintage retailers such as Rokit, so no *sold*
comparables could be pulled — only asking prices surfaced through search
snippets. Neither figure rests on completed-sale data, and neither item has
been seen in person. Both should be overridden freely.

## Revisit

Reassess in a few months, once the dataset is substantially larger and spans
more garment types, condition grades and defect severities. Until the owner
says otherwise, this file is a ledger, not a model.
