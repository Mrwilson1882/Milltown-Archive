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
| 18 Aug | 7 | Carhartt T-Shirt | Carhartt | Small Women's (4-6) | Very good | *(not stated)* | VWM - Women's Y2K Mix | £14.99 |
| 18 Aug | 8 | Birkenstock Thong Sandals | Birkenstock | 40 | Very good vintage | None | SF - Birkenstock | £27.99 |
| 19 Aug | 1 | Athletics Women's T-Shirt | *(none given)* | Small | Very good vintage | Slight discrepancy on back of neck, barely noticeable | VWM - Women's Y2K Mix | £12.99 |
| 19 Aug | 2 | Ralph Lauren Women's Shirt | Ralph Lauren | 16 | Very good | None | VWM - Women's Y2K Mix | £18.00 **(first non-.99 price)** |
| 19 Aug | 3 | Chicago Bulls Vest | *(none given)* | 16, unconfirmed | Very good | *(not stated)* | VWM - Women's Y2K Mix | £17.99 **(Claude-set — see below)** |
| 19 Aug | 4 | Ralph Lauren Women's Long Sleeve T-Shirt | Ralph Lauren | Small (8) | Very good | *(not stated)* | VWM - Women's Y2K Mix | £14.99 |
| 19 Aug | 5 | NFL Broncos Top | NFL | Youth 18 (XXL) ≈ women's L | **Good** | *(not stated)* | VWM - Women's Y2K Mix | £14.99 **(Claude-set — see below)** |
| 19 Aug | 6 | Ralph Lauren Polo | Ralph Lauren | Small Men's | Very good | *(not stated)* | VWM - RL Lacoste Polos | £30.99 **(outlier — queried with owner)** |
| 19 Aug | 7 | Ralph Lauren Polo | Ralph Lauren | Large Men's | Very good | None | VWM - RL Lacoste Polos | £14.99 |
| 19 Aug | 8 | Ralph Lauren Polo | Ralph Lauren | Medium Men's | Very good vintage | Very small discrepancy on back | VWM - RL Lacoste Polos | £13.99 |
| 19 Aug | 9 | Ralph Lauren Polo | Ralph Lauren | Medium | Very good vintage | Slight discrepancy on front | VWM - RL Lacoste Polos | £12.99 |
| 19 Aug | 10 | Ralph Lauren Polo | Ralph Lauren | Small Men's | Very good | *(not stated)* | VWM - RL Lacoste Polos | £14.99 |

## Raw observations

Recorded as facts about the 11 priced items so far — **not rules, not
predictors.** Each has plausible counter-explanations and the sample is tiny.

- Nearly every price ends in `.99`. Observed: £8.99, £9.99, £12.99, £14.99,
  £17.99, £18.99, £19.99, £24.99, £27.99 — **plus one exception**, 19 Aug #2
  at a flat £18.00. Recorded exactly as the owner said it ("£18"), and flagged
  back to them at the time in case it was meant as £17.99 or £18.99. Until
  confirmed, do not treat `.99` as universal.
- **Footwear is a new and higher category.** 18 Aug #8, Birkenstock sandals at
  £27.99, is the highest price recorded and the first non-garment. One item —
  nothing to generalise from yet beyond "shoes are not priced like tops".
- **A second SKU prefix appeared**: `SF - Birkenstock`, alongside the usual
  `VWM` (Vintage Wholesale Manchester). `SF` also appeared in the owner's
  original worked example (`SF Fripe - Summer Mix`). What `SF` denotes has not
  been stated, and whether it tracks a different source or price tier is
  unknown — worth watching as more `SF` items arrive.
- The two track jackets sit well above the tops (£24.99 for the clean one).
  The two bralettes sit at or near the bottom.
- 14 Aug #12 and #13 both priced £9.99 while differing in brand, size and
  colour; both were "good" condition with front discrepancies.
- 14 Aug #10 priced £9.99 against a clean comparable at £12.99.
- 14 Aug #3's cut labels took no visible reduction.
- Two bralettes in identical stated condition priced £12.99 and £8.99, which
  no recorded column explains — an early sign that unrecorded factors
  (desirability, era, cut) are doing real work.

## Unresolved outlier: 19 Aug #6 at £30.99

Recorded exactly as dictated ("thirty ninety nine") and **queried with the
owner at the time**, because it does not sit with anything else in the data:

- every other Ralph Lauren polo is £12.99–£14.99 — including 19 Aug #7, logged
  minutes later at £14.99, also very good condition — so this is more than
  double the top of that range;
- it would be the highest price in the whole ledger, above the £27.99
  Birkenstocks, for a garment type that has never exceeded £14.99;
- 19 Aug #10 is its near-twin — Ralph Lauren polo, small men's, very good, same
  SKU, differing only in colour (navy vs black) — and was priced £14.99;
- "thirty" and "thirteen" are the classic pair to mishear in dictation, and
  **£13.99 would sit exactly in the established polo band** — confirmed as a
  price point the owner actually uses, since 19 Aug #8 was dictated at
  £13.99 shortly afterwards.

If the owner confirms £30.99, it is a genuinely important data point — it would
mean something about specific polos (era, rarity, a particular colourway)
carries far more value than brand and condition alone, which is precisely the
demand factor the owner said the columns cannot see. Do not average it away.

## A clean gradient in the 19 Aug polos (#7, #8, #9)

Three Ralph Lauren polos priced in a row, all very good, differing only in
defect — the tidiest sequence in the data so far:

| Item | Defect | Price |
|------|--------|-------|
| #7 | None | £14.99 |
| #8 | Very small discrepancy on the **back** | £13.99 |
| #9 | Slight discrepancy on the **front** | £12.99 |

Two things this hints at, both worth watching rather than trusting yet:
**severity is graded rather than flat** (£1 steps here, against £3–£10 drops
elsewhere), and **placement may matter** — a flaw on the back cost £1, the
same kind of flaw on the front cost £2. That would make sense commercially,
since a front flaw is the one a buyer sees worn.

Three items is a sequence, not a rule, and it says nothing about how the same
flaws would price on a jacket or a pair of shoes.

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

**19 Aug #3 — Chicago Bulls red vest, size unresolved → £17.99, provisional**

This price is **conditional on the size question below**, and should be revised
once the garment is measured:

- if it is an adult or UK women's 16 → £17.99 stands, sitting with the owner's
  other Y2K women's tops (£12.99–£18.99) with a small uplift for Bulls being a
  strong, Jordan-era team name;
- if it turns out to be **US youth 14–16** → drop to roughly £12.99–£14.99,
  since a youth-cut vest has a much smaller buyer pool.

The only external comp found was a vintage women's XL Chicago Bulls red Y2K
V-neck **t-shirt** asking US $16.59 (≈£12.50) — a different garment, an asking
price, and the US market.

**19 Aug #5 — NFL Broncos top, youth 18 (XXL), good condition → £14.99**

Basis: the owner's own NFL tops sit at £17.99–£18.99, all graded "very good".
This one is **"only in good condition"** — one grade down — so it drops a step.
The size is not a discount factor here because the owner states youth XXL
translates to roughly a women's Large, which is a normal saleable size.

The one external comp found was a vintage Broncos **youth jersey** in good
pre-loved condition asking $65 at a curated vintage boutique. That is a
different garment sold through a much higher-margin channel — a ceiling, not
a comparable, in the same way the Walter Payton jerseys were.

**Useful side note on sizing** (relevant to 19 Aug #3): the owner confirms US
youth 18 / XXL ≈ women's Large. That scales down consistently — youth 14–16
would land near a women's S/M. Since the owner described #3 as looking *too
big* for women's, its "16" is more likely a UK women's 16 than a US youth 16.

**What could not be checked**: the network in this environment blocks eBay,
Vinted, Depop, Mercari and UK vintage retailers such as Rokit, so no *sold*
comparables could be pulled — only asking prices surfaced through search
snippets. Neither figure rests on completed-sale data, and neither item has
been seen in person. Both should be overridden freely.

## Revisit

Reassess in a few months, once the dataset is substantially larger and spans
more garment types, condition grades and defect severities. Until the owner
says otherwise, this file is a ledger, not a model.
