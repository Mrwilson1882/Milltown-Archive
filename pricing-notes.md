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

## Patterns so far (5 items — provisional, not yet a rule)

- **Price points**: every price ends in `.99`, and all five sit in a narrow
  £9.99–£14.99 range. Observed values: £9.99, £12.99 (×2), £14.99 (×2). This
  is the only pattern that has held across every item.
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
