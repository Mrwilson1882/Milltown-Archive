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

## Patterns so far (4 items — provisional, not yet a rule)

- **Price points**: every price ends in `.99` — £9.99, £12.99, £14.99. The
  earlier reading of a £5 ladder did not hold; £12.99 sits between the two.
  Steps so far are £2–3, not a fixed increment.
- **Brand sets a band, not a single price**: Ralph Lauren has now been priced
  at both £14.99 (items 2, 3) and £12.99 (item 4), so brand alone does not fix
  the price. The non-designer item remains the cheapest at £9.99.
- **Men's vs women's is the current best explanation** for movement inside the
  Ralph Lauren band: the two £14.99 items are XXL and Small Men's, while the
  £12.99 item is Large Women's. The one non-designer item is also women's and
  also the cheapest. Only one women's designer item so far — treat as a
  hypothesis, not a rule.
- **Condition carries no signal yet**: all four items are "very good"
  (one "very good vintage"). Nothing has been priced at another condition
  grade, so its effect on price is unknown.
- **SKU carries no signal yet**: three items share the `VWM` prefix and were
  priced £9.99, £14.99 and £12.99. The item with no SKU matched a priced one.
  SKU has not yet predicted anything.
- **Size carries no signal yet** beyond its overlap with the men's/women's
  split above.

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
