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

- **Never guess.** A field not stated in the voice note is left blank and
  flagged back to the owner. Blank means "not stated", never "none".
- **"None"** is written in Defects only when the owner actually says there are
  no defects.
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

## Workflow

One product per voice note. After each: append the row, commit, push, confirm
back to the owner with the row as recorded plus any missing fields. At the end
of the day, export the whole sheet to `.xlsx`.

## Pricing

**Do not suggest prices.** The owner sets every price. If a voice note arrives
without one, leave the cell blank and ask. See `pricing-notes.md` — pricing
data is being collected for later use, not modelled now.
