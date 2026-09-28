# Logging Conventions

How voice notes are turned into rows in `inventory.csv`. Read this at the start
of any new session — the chat is not persistent, these files are the memory.

## Columns

`Item No., Product Name, Colour Clarity/Description, Defects, Size, Condition, SKU, Price, Date Added`

- **Item No.** — **restarts at 1 every day.** These are physical number markers
  used on the stock and there is a finite set of them, so they are reused each
  day rather than running on forever. The first voice note of a new day is
  item 1, whatever came before it.

  This means **an item is identified by date + number, never by number alone**.
  "Item 3" is ambiguous; "18 Aug #3" is not. Pair the two whenever confirming a
  row back to the owner or referring to one in `pricing-notes.md`.

  When a new day's first product arrives, do not continue the previous day's
  count — start again at 1 and set Date Added to the new date.
- **Colour Clarity/Description** — colour first. Named separately from Defects
  because colour is hard to judge from photographs and buyers need it stated.
- **Defects** — anything wrong with the item. Kept apart from the description
  so faults are never buried in prose.

## Rules

- **Defects go at the BOTTOM of the description, not only in their own column.**
  When the owner says "add defects", they mean the defect text belongs at the
  very end of **Colour Clarity/Description** — after the product has been
  described — so a buyer reads about the item first and the faults last. The
  Defects column is kept as well, as the structured copy for filtering and for
  the pricing record, but the description is the one that matters for listings.
  *(Rule restated by the owner, 20 Aug 2026, after Claude had filed defects
  only in the column three times.)*
- **Defects: silence means there are none.** The owner mentions defects only
  when a defect exists, so a voice note that says nothing about them means the
  item is clean. Write **`None`** in the Defects column and add nothing to the
  description — do not leave it blank and do not query it.
  *(Rule set by the owner, 19 Aug 2026.)*
- **Never guess anything else.** Any field not stated is left blank.
- **Leave blanks blank and say nothing.** Anything that cannot be determined
  from the voice note alone — colour, size, SKU, a brand spelling, an
  authentication mark — is left empty and **passed on without comment**. The
  Photo Processing chat can see the item and fills these in. Do not chase them,
  do not list them back at the end of each confirmation, and do not hold a row
  open waiting for them.
  *(Rule set by the owner, 23 Sep 2026: "ignore anything you can't identify as
  the photo processor will.")*

  This chat's job is to **capture what was said, accurately and fast**. Judging
  what the item looks like is a different job, done downstream by something with
  eyes on it. Flagging a blank here costs the owner a reply and gains nothing.
- **Colour: the owner states it only when it is hard to read from the photos.**
  When colour is missing it is because the photos make it obvious. Claude cannot
  see the photos, so a missing colour is simply left blank — see the rule above.
  Never invent one; a wrong colour on a listing causes returns.
- **Price** is always written with the £ symbol, e.g. `£12.99`. Never a bare
  number, never another currency.
- **"as you can see in the pictures"** (or any similar phrase) is recorded as
  **`(see images)`** in brackets at the end of the entry.
  Example: `One small discrepancy on the front (see images)`
- **Sizes** are recorded as dictated, keeping any bracketed detail:
  `Large (oversized fit)`, `Medium (10-12)`.
- **SKUs** follow the dash format: `VWM - Women's Y2K Mix`.
- **Birkenstock sandals always take `SF - Birkenstock`**, whether or not the
  owner states it in the note. This is a standing rule — do not leave the SKU
  blank on a Birkenstock and do not ask for it.
  *(Rule set by the owner, 20 Aug 2026.)*
- **Unclear transcriptions** are recorded as the best reading and flagged back
  to the owner for confirmation, never silently guessed.

## Workflow

One product per voice note. After each: append the row, commit, push, confirm
back to the owner with the row as recorded plus any missing fields. At the end
of the day, export the whole sheet to `.xlsx`.

## Telling velour from terry and cotton

This distinction is worth £10 or more on Juicy Couture pieces, and comes up
repeatedly. The test takes seconds:

- **Velour** — has a nap. Run a hand across it and the colour shifts lighter or
  darker depending on the direction, like velvet or a stroked carpet. Slight
  sheen.
- **Terry (towelling)** — looped, textured like a towel, matte, no direction
  change. Juicy made these too; collectable but below velour.
- **Cotton jersey** — completely flat, no pile, no sheen, no direction change.

The nap test — stroke it one way, then the other — separates velour from the
other two on its own.

## Accept Offers — set automatically from the price

Every row carries an **Accept Offers** column, filled from the Price with no
input needed from the owner:

| Price | Accept Offers |
|---|---|
| Under £20 | **No** |
| £20 and over | **Yes** |

*(Rule set by the owner, 2 Sep 2026, and applied to every row going forward.)*

The owner's wording was "under £20 no, over £20 yes", which leaves **exactly
£20.00** unspecified. It is treated as **Yes** — £20.00 is not under £20. No
item has been priced at exactly £20.00 so far; if the owner wants it the other
way, this is the line to change.

Whenever a price changes, this column is recreated from the new price — the two
must never disagree. A row with no price leaves Accept Offers blank rather than
defaulting to No.

## Pricing

**Do not suggest prices.** The owner sets every price. If a voice note arrives
without one, leave the cell blank and ask. See `pricing-notes.md` — pricing
data is being collected for later use, not modelled now.

## Italian size labels — a bare number is a size, and it tells you the gender

Italian designer stock arrives with a single number on the inner label and no
S/M/L anywhere. The number alone answers both the size and, usually, whether the
piece is men's or women's, because the two ranges barely overlap.

**Menswear — IT number, jackets and coats:**

| IT | UK chest | UK size |
|---|---|---|
| 46 | 36" | S |
| 48 | 38" | M |
| **50** | **40"** | **L** |
| 52 | 42" | L–XL |
| 54 | 44" | XL |
| 56 | 46" | XXL |

**Womenswear — IT number:**

| IT | UK |
|---|---|
| 38 | 6 |
| 40 | 8 |
| 42 | 10 |
| 44 | 12 |
| 46 | 14 |
| 48 | 16 |

**The overlap is the only trap.** Menswear runs 46–56 and womenswear 38–48, so
**46 and 48 are ambiguous** and need another signal. Anything **50 or above is
menswear**; anything **44 or below is womenswear**.

Other tells when the number is ambiguous:
- **Button or zip placket** — right over left is men's, left over right is
  women's.
- **Darts** — bust darts mean womenswear.

*(Written up 26 Sep 2026, after Trussardi, Krizia, Fay, Les Copains and Ungaro
all arrived inside two days with numeric labels only.)*

## "Real leather" on the label means suede counts

**Suede is leather.** It is the napped underside of the hide, so a coat that
looks and feels like suede and carries a "real leather" label is not a
contradiction — it is a suede coat.

| | What it is | How it looks |
|---|---|---|
| **Smooth leather** | outer grain, finished | sheen, no nap |
| **Nubuck** | outer grain, lightly sanded | fine short nap, dense, slightly stiff |
| **Suede** | inner split of the hide | longer softer nap, floppier, matte |
| **Brushed cotton / moleskin** | **not leather** | woven, and the label would not say leather |

**The test that settles it** — find an unfinished inner edge or seam allowance.
Leather and suede have **no weave on the reverse and do not fray**; brushed
cotton shows a visible weave and frays at a cut edge.

This matters for pricing: a suede or leather coat is a different tier from the
polyamide and cotton shells most 1990s diffusion-line outerwear is made from.
Always check whether the leather is the **whole garment or only a trim** — a
leather collar or elbow patches on a fabric coat still gets a "real leather"
label.

### A "USA" number on the label means womenswear — and it runs small

A dual marking such as **`46` / `USA 12`** settles the gender question on its own.
Men's jackets are never sized "USA 12" — menswear uses chest inches (38, 40, 42)
or S/M/L. **A "USA" dress number is always womenswear.**

The catch is that **vintage US sizing runs roughly two sizes smaller than
modern.** Decades of vanity sizing have shifted the numbers down, so the pairing
on an old Italian designer label will not match a modern conversion chart:

| | Modern chart | On a 1980s–90s label |
|---|---|---|
| IT 46 pairs with | USA 10 | **USA 12** |
| IT 48 pairs with | USA 12 | USA 14 |

So a vintage **USA 12 is closer to a modern USA 8**, and IT 46 / USA 12 together
land at about **UK 12–14**. Quote the range, not a single size, and say the piece
is vintage-sized — it is a common source of returns.

*(Rule set 26 Sep 2026, from the GFF Gianfranco Ferré jacket.)*

## "SF Freep" / "SF Freak" is always **SF Fripe**

The bale prefix is spelled **F-R-I-P-E**. It transcribes badly from speech and has
come through as "Freep", "Freak" and "Frip". **Every one of those is `SF Fripe`** —
correct it silently and do not open a new bucket for a spelling variant.

*(Spelling confirmed by the owner, 28 Sep 2026, as a standing rule for all future
notes.)*

Current SF Fripe buckets:

| SKU |
|---|
| `SF Fripe - Jackets` |
| `SF Fripe - Summer Mix` |

### Careful — French/EU 38 and Italian 38 are two sizes apart

The Italian womenswear table above applies to **Italian** labels only. French,
German and general EU sizing runs on a different scale, and the same number means
a different size:

| Label number | **French / EU / German** | **Italian** |
|---|---|---|
| 36 | UK 8 | UK 4 |
| **38** | **UK 10** | UK 6 |
| 40 | UK 12 | UK 8 |
| 42 | UK 14 | UK 10 |
| 44 | UK 16 | UK 12 |

**Italian is UK + 4 below the number; French/EU is UK + 6.** Getting this wrong
mis-sizes a garment by two full sizes, which is a guaranteed return.

**Go by where the brand is from**, not by the look of the number:

| Brand seen so far | Scale |
|---|---|
| Lacoste, Cacharel, Emanuel Ungaro, Pierre Cardin | **French / EU** |
| Krizia, Fay, Trussardi, Les Copains, Pal Zileri, Gianfranco Ferré, Prada | **Italian** |

*(Correction added 28 Sep 2026 — the Italian table alone would have sized a
French Lacoste 38 as a UK 6 instead of a UK 10.)*

## Roman numeral size labels (I, II, III, IV, V, VI)

Some Italian makers size by Roman numeral instead of a number or a letter. The
numeral is a **position in a size run**, not a measurement — so it only means
something once you know where the run starts, and makers differ:

| Numeral | Run starting at XS | Run starting at S |
|---|---|---|
| I | XS | S |
| II | S | M |
| III | M | L |
| **IV** | **L** | **XL** |
| V | XL | XXL |
| VI | XXL | — |

**So a IV is either a Large or an XL and the label alone cannot tell you which.**
Settle it by measuring, and quote the measurement in the listing as well as the
size.

Pit-to-pit, laid flat, for a men's polo:

| Size | Pit to pit |
|---|---|
| M | 20 – 21" |
| L | 21 – 22" |
| XL | 23 – 24" |

*(First seen 28 Sep 2026 on a Jeans Les Copains polo.)*

### The French/Italian split is a **womenswear** problem only

Menswear does not have this issue. Continental **menswear** numbering is
chest-based and consistent across Italy, France and Germany:

| EU / IT / FR | UK chest | UK size |
|---|---|---|
| **46** | **36"** | **S** |
| 48 | 38" | M |
| 50 | 40" | L |
| 52 | 42" | L–XL |
| 54 | 44" | XL |
| 56 | 46" | XXL |

So on a **men's** garment the country of origin does not matter — 46 is a Small
whether the label is French or Italian. Only on **womenswear** do the two scales
diverge, and there the brand's country decides which table to use.

*(Clarified 28 Sep 2026, so the womenswear correction above is not misapplied to
men's stock.)*

## When the label size and the actual size disagree

Vintage stock often does not match its own label — 1990s sportswear in particular
was cut far more generously than modern sizing, so a 90s Small can wear like a
current Large.

**Record both, and lead with the real one:**

`Large (labelled Small but fits large - confirm by measurement)`

**In the listing, say it outright and give the measurement.** Never quietly list
it as the size it wears — the label is visible in the photographs, and a buyer
who sees "S" on a garment sold as "L" opens a case. The wording that works:

> *Labelled S, but cut generously and fits like a modern L. Pit to pit 23", length 28".*

Buyers accept a mismatch that is declared. They do not accept finding one.

**The mismatch is also a dating clue.** A garment that runs one to two sizes
larger than its label is very likely 1990s — which on brands like Tommy Hilfiger,
Nike and Ralph Lauren is a point in its favour, not against, and belongs in the
listing as vintage.
