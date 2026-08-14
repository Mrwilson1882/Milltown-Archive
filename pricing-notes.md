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

## Patterns so far (3 items — provisional, not yet a rule)

- **Price points**: both observed prices end in `.99` and sit on a £5 ladder
  (£9.99, £14.99). No price has been set off that ladder yet.
- **Brand looks like the main driver**: the two Ralph Lauren items are both
  £14.99; the non-designer item is £9.99. Brand is currently the only field
  that separates the two price points.
- **Condition carries no signal yet**: all three items are "very good"
  (one "very good vintage"). Nothing has been priced at another condition
  grade, so its effect on price is unknown.
- **SKU carries no signal yet**: the two items sharing the `VWM` prefix were
  priced differently (£9.99 and £14.99), and the £14.99 item without a SKU
  matched the priced one. SKU has not yet predicted anything.
- **Size carries no signal yet**: Large Women's, XXL and Small Men's span both
  price points with no visible ordering.

## Open questions to resolve as more data arrives

- Does condition below "very good" reduce the price, and by how much?
- Do defects (now a tracked column) carry a fixed deduction?
- Is there a designer tier above Ralph Lauren at a higher price point?
- Does the SKU category set a floor or ceiling independent of brand?

## Confidence

Too few items to predict a price. At least 10–15 items — including some that
differ in condition and some carrying defects — are needed before a suggestion
is worth more than a coin flip. Until then, prices should keep coming from the
owner.
