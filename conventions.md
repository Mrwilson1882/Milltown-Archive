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
  **Standing exception (owner, 19–20 Aug): fill any blank field that the
  photographs can answer.** Colour, gender, brand, size where a label is
  legible, material where a composition tag was shot — read it rather than
  flagging it back.

  **Only ever fill a blank.** A value the owner has stated is never overridden,
  however the photographs look; a disagreement is reported, not corrected. This
  is the ledger-wins rule applied to every field, not just size.

  Gender follows the bundle the SKU names — a `Women's Y2K Mix` SKU is
  womenswear — with the garment's own cut and labelling as the check.

  Some blanks still cannot be answered from a photograph: price, and any
  measurement not shown against a tape. Those are still flagged back. Say what
  each filled value rested on, so a reading can be argued with.
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
- **A number card is photographed lying on the garment it belongs to.** That,
  not where the card falls in the file sequence, is what assigns photos to
  items. Cards open some runs, close others and sit mid-run in a few, so any
  rule based on position breaks — batch 4 lost four items to it. Where two
  cards sit back to back, the first closes the run before it and the second
  opens the run after it. Cards are not always in numeric order either: batch
  4's `IMG_1470` is card 19 and `IMG_1471` is card 18.
- **A card photo's Photoroom twin is a clean full front.** Background removal
  takes the card away with the floor, so `IMG_1499-Photoroom.JPG` is a usable
  cover shot even though `IMG_1499.HEIC` is the card. Include the twin; exclude
  only the HEIC.
- **Watch for a second photo pass.** Batch 4's `IMG_1760`–`IMG_1830` was a
  second run over items already shot, giving clean full front and back shots in
  item order. Those are the right cover images. A jump back to item 1 partway
  through a batch is this, not a mis-sort.
- **`Satisfactory condition` maps to `Fair`** (batch 4, item 35), below
  `Good condition` → `Good`.
- **Undergarments are named by what they are, not by the voice note**
  (owner's instruction, 24 Aug). He said plainly that he is unsure what some
  women's underwear is called and asked for the certain name. This is a
  standing exception to the never-override rule, for this class of garment
  only: where a label, a construction detail or a measurement settles it, the
  correct name is used and the ledger reading is recorded alongside.
  The distinctions that actually came up:
  - **Waist trainer / waist cincher** — waist-height band, hook-and-eye rows
    down the front, boned, often a latex core. Not a skirt, whatever its shape
    laid flat. Batch 4 had four logged as skirts and a dress.
  - **Corset / basque** — boned with bust cups and a busk or lacing eyelets.
  - **Bustier** — strapless, cupped, ends at or near the waist. `Bra` under-
    sells it; bustier is both more accurate and the term buyers search.
  - **Chemise** — short nightdress, roughly 28–34in. `Nightgown` reads as full
    length to a buyer.
  - **Bodysuit / body shaper** — one piece, built-in bra, hook-and-eye gusset.
    A chemise is loose nightwear; these are fitted shapewear and bra-sized.
  - **Half slip** — unboned skirt slip, 20in or more. If it is boned and about
    a foot deep it is a waist cincher.
  **`YIANNA` is what "Yana K" is** in a voice note — a waist trainer brand.
- **Crosslist has no shapewear, corset or bustier category.** All 9,234 were
  searched. Waist trainers and corsets go in
  `All women's intimates & sleepwear` (`160b6822-2a37-36b5-95f9-21900af04859`);
  bra-sized pieces go in `Women's bras` (`50c859ef-6643-4faf-1f4f-903ee3c155cc`),
  which is also the only size group carrying band-and-cup sizes like `40D`.
- **A label in frame is not necessarily this garment's label.** Batch 4 item 24
  had a Corset Story care label photographed on separate grey twill beside a
  YIANNA waist trainer, and its composition was written from the wrong one.
  Check the label is sitting on the same fabric as the garment before quoting it.
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
