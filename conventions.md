# Logging Conventions

How voice notes are turned into rows in `inventory.csv`. Read this at the start
of any new session — the chat is not persistent, these files are the memory.

## Columns

`Product Name, Colour Clarity/Description, Defects, Size, Condition, SKU, Price, Date Added`

- **Colour Clarity/Description** — colour first. Named separately from Defects
  because colour is hard to judge from photographs and buyers need it stated.
- **Defects** — anything wrong with the item. Kept apart from the description
  so faults are never buried in prose.

## Rules

- **Never guess.** A field not stated in the voice note is left blank and
  flagged back to the owner. Blank means "not stated", never "none".
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
- **Size discrepancies:** where a garment's label disagrees with the ledger,
  **the ledger wins.** Record the discrepancy and carry on with the ledger
  value; do not silently switch to the label. Owner's instruction, 16 Aug.

## Workflow

One product per voice note. After each: append the row, commit, push, confirm
back to the owner with the row as recorded plus any missing fields. At the end
of the day, export the whole sheet to `.xlsx`.

## Pricing

**Do not suggest prices.** The owner sets every price. If a voice note arrives
without one, leave the cell blank and ask. See `pricing-notes.md` — pricing
data is being collected for later use, not modelled now.
