# Pricing Notes

Running record of observed pricing, kept so that price suggestions can be made
from past decisions rather than guesswork. The owner sets the price on each
voice note; any suggestion made here is a proposal that the owner can override.

**Read this file at the start of any new session before suggesting a price.**
The chat itself is not persistent — this file and `inventory.csv` are the memory.

## Observed prices

| # | Product | Brand | Size | Condition | SKU | Price |
|---|---------|-------|------|-----------|-----|-------|
| 1 | Skinny Minnie | Skinny Minnie | Large Women's | Very good condition | VWM - Summer Women's Mix | £9.99 |
| 2 | Ralph Lauren Polo | Ralph Lauren | XXL | Very good vintage condition | *(none given)* | £14.99 |
| 3 | Ralph Lauren Polo | Ralph Lauren | Small Men's | Very good condition | VWM - RL Lacoste Polos | £14.99 |
| 4 | Ralph Lauren Women's Polo Shirt | Ralph Lauren | Large Women's | Very good condition | VWM - Women's Y2K Mix | £12.99 |
| 5 | Women's Bralette | *(none given)* | 36 | Very good condition | VWM - Women's Summer Mix | £12.99 |
| 6 | Women's Bralette | *(none given)* | Small | Very good condition | VWM - Women's Y2K Mix | £8.99 |
| 7 | Ralph Lauren Women's Polo | Ralph Lauren | Medium (10-12) | Very good condition | VWM - Women's Y2K Mix | *(awaiting owner — £12.99 suggested)* |
| 8 | Nike Track Jacket | Nike | Large (oversized fit) | Very good condition | VWM - Track Jacket | £24.99 |
| 9 | Harley Davidson Women's Cardigan | Harley Davidson | *(none given)* | Very good condition | VWM - Women's Y2K Mix | £14.99 |
| 10 | Ralph Lauren Women's Polo | Ralph Lauren | Medium | Very good vintage condition | VWM - RL Lacoste Polos | *(awaiting owner — £12.99 suggested)* |

## Suggestion log

Track every suggestion against the owner's actual price. This is the only
honest measure of whether suggestions are worth making.

| Item | Suggested | Actual | Error | Basis of suggestion |
|------|-----------|--------|-------|---------------------|
| 6 | £12.99 | £8.99 | **−£4.00 (suggestion too high)** | Like-for-like match to item 5: same product type, condition and defect status, differing only in colour and size |
| 7 | £12.99 | *(pending)* | — | Match to item 4 on brand, product type, SKU category and condition — a tighter match than item 6's, which shared only product type |
| 10 | £12.99 | *(pending)* | — | Match to item 4 on brand, product type and condition. **Suggestion carries no defect deduction** — this is the first item with a visible flaw and there is no data on what a flaw is worth |

## The defect question (open, and it matters)

Item 10 is the first item with a visible defect: "one small discrepancy on the
front". There is no basis yet for pricing that in.

The only related data point is item 3 (labels cut), which took the full men's
polo price of £14.99 — but cut labels are a common trade practice, not damage
a buyer sees when wearing the garment. A visible front flaw is a different
thing and probably should not be treated the same way.

What is needed: whether defects take a fixed deduction (e.g. −£3), a
percentage, a drop to the next price point down, or a judgement call by
severity. Until the owner prices two or three defect items, suggestions on
flawed stock will be unreliable and should be flagged as such.

**Lesson from item 6**: matching on product type alone is not enough. Two
women's bralettes, both very good with no defects, priced £12.99 and £8.99 —
a 31% spread. Something separates them that is not captured in the current
columns. Candidates: size (36 vs Small), colour, brand not stated on either,
or a quality/desirability judgement made by eye that no field records.
£8.99 is also a new low, below item 1's £9.99.

## Patterns so far (5 items — provisional, not yet a rule)

- **Price points**: every price ends in `.99`, now spanning £8.99–£24.99.
  Observed values: £8.99, £9.99, £12.99 (×2), £14.99 (×2), £24.99. The `.99`
  ending is the only pattern that has held across every single item.
- **Garment type is the strongest driver seen so far.** Item 8, a track
  jacket, took £24.99 — £10 clear of the highest polo and nearly 3× the
  cheapest bralette. Grouping by garment type gives tidier bands than any
  other field: outerwear ~£24.99, knitwear ~£14.99, polos £12.99–£14.99,
  bralettes £8.99–£12.99. This should be the first thing checked when
  suggesting a price.
- **A women's item can reach £14.99** (item 9, cardigan), which weakens the
  earlier "women's priced below men's" hypothesis. Garment type explains it
  better: a cardigan is simply worth more than a polo, regardless of gender.
- **Brand does not explain price.** Ralph Lauren spans £12.99–£14.99, and item
  5 — no brand given — took £12.99, matching the Ralph Lauren women's polo.
  The earlier "designer costs more" reading is now weak: the only thing
  separating £9.99 from the rest is item 1, and one item is not a pattern.
- **Men's vs women's — hypothesis survives, weakly.** Both £14.99 items are
  men's; all three women's items are £12.99 or below. But item 5 shows an
  unbranded women's piece matching a designer women's piece, so if the split
  is real it is doing more work than brand.
- **Category may matter more than brand.** Items 2, 3, 4 are all polo shirts;
  item 5 is lingerie and priced level with the designer polo despite no brand.
  Not enough data to separate category from brand yet.
- **Condition still carries no signal**: all five items are "very good"
  (one "very good vintage"). No other grade has been priced.
- **SKU carries no signal**: four items share the `VWM` prefix and were priced
  £9.99, £14.99, £12.99 and £12.99. The item with no SKU matched a priced one.
- **Size carries no signal** beyond its overlap with the men's/women's split.

## Defects field

Item 5 is the first with defects **explicitly** stated as none. For items 1–4
the field is blank because nothing was said — blank means "not stated", not
"confirmed none". Do not read the two as equivalent.

## Open questions to resolve as more data arrives

- Does condition below "very good" reduce the price, and by how much?
- Do defects (now a tracked column) carry a fixed deduction? Item 3 has
  "labels cut" recorded and still took the full £14.99 men's price.
- Is the men's/women's gap real, and is it a consistent £2?
- Is there a designer tier above Ralph Lauren at a higher price point?
- Does the SKU category set a floor or ceiling independent of brand?

## Confidence

Too few items to predict a price. At least 10–15 items — including some that
differ in condition and some carrying defects — are needed before a suggestion
is worth more than a coin flip. Until then, prices should keep coming from the
owner.
