# Logging Conventions

How voice notes are turned into rows in `inventory.csv`. Read this at the start
of any new session — the chat is not persistent, these files are the memory.

## Columns

`Product Name, Colour Clarity/Description, Defects, Size, Condition, SKU, Price, Date Added`

- **Colour Clarity/Description** — colour first. Named separately from Defects
  so faults are never buried in prose.
  **Read the colour from the photographs** rather than flagging a blank cell
  back (owner, 19 Aug). Where a shade is genuinely ambiguous under the lighting,
  record the best reading and say so, rather than leaving the field empty.
- **Defects** — anything wrong with the item. Kept apart from the description
  so faults are never buried in prose.

## Rules

- **Never guess.** A field not stated in the voice note is left blank and
  flagged back to the owner. Blank means "not stated", never "none".
  **Two standing exceptions (owner, 19 Aug): colour and gender.** Both are
  determined from the photographs and the SKU rather than blocking on a blank.
  Gender follows the bundle the item came from — a `Women's Y2K Mix` SKU is
  womenswear — with the garment's own cut and labelling as the check. Say what
  the call rested on; only escalate when the two disagree.
  **One exception, Defects only (owner's instruction, 16 Aug):** a blank
  Defects cell is read as *no defects*. This reverses the original rule for
  that column alone — every other field keeps "blank means not stated".
  The consequence is that saying nothing about flaws in a voice note is now a
  positive claim on the live listing, so the accuracy burden sits with the
  recording rather than with a later check.
- **"None"** in Defects means no defects, whether the owner said so outright or
  left it unmentioned — see the Defects exception above.
- **Price** is always written with the £ symbol, e.g. `£12.99`. Never a bare
  number, never another currency.
- **"as you can see in the pictures"** (or any similar phrase) is recorded as
  **`(see images)`** in brackets at the end of the entry.
  Example: `One small discrepancy on the front (see images)`
- **Sizes** are recorded as dictated, keeping any bracketed detail:
  `Large (oversized fit)`, `Medium (10-12)`.
- **SKUs** follow the dash format: `VWM - Women's Y2K Mix`.
- **Unclear transcriptions** are recorded as the best reading and flagged back
  to the owner for confirmation, never silently guessed.
- **Defects** are appended as the **final sentence of the Item Description**,
  after the product detail, phrased exactly as recorded in the ledger and
  keeping any `(see images)`. Where the ledger says `None`, nothing is written.
  Where the ledger is blank the defect is *not stated*, so nothing is written
  and the gap is flagged back to the owner — silence must never be presented to
  a buyer as "no flaws". Owner's instruction, 16 Aug.
- **Material** is taken from the garment's composition tag when one has been
  photographed, quoted exactly as printed (`100% Cotton`). With no tag, the
  material is estimated and **stated without any percentage** — never invent a
  figure that was not read. Owner's instruction, 16 Aug.
  **Read the tag before writing the material, not after.** Composition tags are
  usually already in the batch but illegible on a contact sheet; pull them at
  full resolution with `gather.py` first. Item 8 was described as "synthetic
  shell with mesh lining" when its own photo 4 read `100% POLYESTER`.
  A composition is a search facet buyers filter on — descriptive prose is not.
  Fabric character belongs in the Item Description, the composition on the
  Material line.
- **Birkenstock sizes** are dictated in EU and recorded in UK, converted from
  `crosslist/birkenstock-sizes.csv` (Birkenstock's own chart). **EU 40 to 44
  exist in both the men's and women's charts and mean different UK sizes** —
  EU 42 is UK 9 women's but UK 8 men's. So a Birkenstock voice note must say
  men's or women's, or the size cannot be converted at all; in that range,
  guessing is a full size out. Below EU 40 the chart is women's only, above
  EU 44 men's only, and those convert unambiguously.
  **The footbed millimetre reading is recorded, not used for conversion**
  (owner, 19 Aug). The owner's readings are factual and go into the description
  as stated. They do not reliably track Birkenstock's own cm column — batch 3's
  four pairs each read about 10 mm above it while batch 2's matched exactly — so
  the mm is no longer used to cross-check or to resolve the men's/women's
  overlap. EU size in, UK size out.

  Where an EU size falls in the 40–44 overlap and no gender is stated, decide it
  from the SKU and the style as with any other garment.
  Worth dictating too: **Regular or Narrow**. That is *not* the number — it
  shows as a foot-outline symbol on the footbed, a slimmer outline for narrow.
  A filterable attribute only the seller can check.
- **If the attribute list does not fit the garment, the category is wrong.**
  Crosslist drives Style, Neckline and the rest from the chosen category, so a
  Style list with no plausible value is a signal, not an inconvenience. Item 6
  sat in `Women's fleece jackets`, whose Style options are all jacket types,
  because none of them fitted a quarter-zip pullover — it belonged in sweaters
  all along. Owner spotted it, 19 Aug.
- **Ralph Lauren "Big Pony"** is claimed only where the pony is genuinely
  oversized — the Big Pony line, usually with a numbered sleeve patch. A
  standard chest pony is not a Big Pony, whatever its colour. Owner's
  instruction, 16 Aug. The same care applies to any line name that carries a
  price premium: it is a claim about the garment, not a keyword to spend.
- **Size discrepancies:** where a garment's label disagrees with the ledger,
  **the ledger wins.** Record the discrepancy and carry on with the ledger
  value; do not silently switch to the label. Owner's instruction, 16 Aug.

## Workflow

One product per voice note. After each: append the row, commit, push, confirm
back to the owner with the row as recorded plus any missing fields. At the end
of the day, export the whole sheet to `.xlsx`.

## Pricing

**Prices ending other than `.99` are deliberate** (owner, 19 Aug). Batch 3's
£18.00 and £14.00 are intentional, not slips. Record them as given.

**The owner's price always wins.** Where a price is dictated, record it exactly
and never override it.

**Where no price is dictated, Claude sets one** (owner's instruction, 19 Aug,
reversing the 14 Aug suspension). Every Claude-set price is marked
`price_source = claude`, carries its reasoning, and is offered as a figure to
correct rather than a decision made. Method and its known weaknesses are in
`pricing-notes.md`.
