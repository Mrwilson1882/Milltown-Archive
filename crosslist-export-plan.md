# Crosslist Export — Plan & Field Map

Turning raw item photos + voice notes into a Crosslist bulk upload:
`listings.csv` + `images.zip`.

**Status: template workbook read and confirmed. Photos and transcripts still
outstanding. No pipeline code written yet, by instruction.**

Read alongside `conventions.md` — the "never guess, flag it back" rule applies
to every mapping below.

## Confirmed CSV structure

Source: `CSV_listing_template.xlsx`, tabs Info / Template / Categories / Sizes.

33 columns, in this exact order. Header spelling is taken from the **Template**
tab, which is what the upload must match:

```
Id, Title, Description, Price, Original Price, Brand, Category id, Size id,
Condition, Color, Secondary color, Images, Quantity, Shipping weight,
Shipping weight unit, Shipping height, Shipping width, Shipping length,
Domestic shipping price, Worldwide shipping price, Free domestic shipping,
Free worldwide shipping, Tags, SKU, Who made, When made, Smart pricing,
Smart pricing price, Accept offers, Is auction, Auction starting price,
Cost of Goods, Internal note
```

Note: the Info tab writes column 32 as "Cost of goods", the Template tab as
"Cost of Goods". The Template spelling wins.

Key rules from the Info tab:

- **Id** — only needed when *updating* existing listings. Blank for new stock.
- **Title** — 5–255 characters.
- **Description** — up to 12 000 characters, line breaks allowed. This is where
  measurements go.
- **Price / Original Price** — plain numbers, e.g. `49.99`. **No currency
  symbol.** Original Price must be blank or >= Price.
- **Condition** — `NewWithTags`, `NewWithoutTags`, `VeryGood`, `Good`, `Fair`, `Poor`.
- **Color / Secondary color** — fixed list of 30: Red, Pink, Orange, Yellow,
  Green, Blue, Purple, Gold, Silver, Black, Gray, White, Cream, Beige, Brown,
  Tan, Khaki, Turquoise, Apricot, Coral, Burgundy, Rose, Lilac, LightBlue,
  Navy, DarkGreen, Mustard, Mint, Multi, Clear.
- **Images** — pipe-delimited filenames, must match the zip contents exactly,
  including extension.
- **SKU** — exists as a real column. The `VWM - ...` SKUs carry straight over.
- **Category id / Size id** — UUIDs from the Categories and Sizes tabs.

### Price and the £ symbol

`conventions.md` requires `£12.99` in `inventory.csv`. Crosslist requires a bare
`12.99`. Both are correct in their own place: the ledger keeps the £, the export
strips it. No change to `conventions.md` is needed.

### How the Category → Size lookup actually works

Not two independent lookups. The Categories tab carries a **Size group** column;
that group then selects which rows of the Sizes tab are legal. Pick category
first, read its size group, then resolve the size within that group. Categories
with no size group take a blank Size id.

The Sizes tab lists US / UK / CA / AU labels as alternative names for the *same*
id — UK 12 and US 8 are one row, one id. So dictating UK sizes creates no
ambiguity between regions.

## Resolved ids for current stock

Verified against the workbook, not transcribed by hand.

| Garment | Crosslist category | Category id | Size group |
|---|---|---|---|
| Men's polos | Menswear > Men's tops & shirts > Men's polos | `53a08abc-4447-97e2-211b-4e5b23c79b26` | Men's clothing |
| Women's polos | Womenswear > Women's tops & blouses > Women's polos | `94954653-2623-55ef-459f-259d8f557249` | Women's clothing |
| Women's cardigans | Womenswear > Women's sweaters > Women's cardigans | `bd8faf62-88ba-8f4c-28e7-6d76f491596f` | Women's clothing |
| Men's jackets | Menswear > Men's activewear > Men's jackets | `1188aafb-450c-6f08-68e8-6dbd6e662784` | Men's clothing |
| Women's jackets | Womenswear > Women's activewear > Women's jackets | `266eae6a-6f6b-9e8f-6486-14bc0cdf3ed7` | Women's clothing |
| Women's bras | Womenswear > Women's activewear > Women's bras | `591def8a-9332-8e25-0693-929c68a24a19` | Women's bras |
| Women's bandeaus | Womenswear > Women's intimates & sleepwear > Women's bandeaus | `2c80ed22-1eb3-1a89-4cb0-16eb577636b2` | Women's clothing |

| Size group | Label | Size id |
|---|---|---|
| Men's clothing | S | `78c1966f-1623-2e16-092e-b126ed286978` |
| Men's clothing | M | `51fb40ab-9573-468e-1d52-be5be9d44e75` |
| Men's clothing | L | `f9ea6dc9-36f2-458a-3070-f8947835429a` |
| Men's clothing | XL | `471245b9-1139-0a68-77c5-a26a9e635e2f` |
| Men's clothing | XXL | `e307171d-7e37-919c-42e5-6634573985a2` |
| Women's clothing | S | `0a197135-09d9-7a16-9bc8-9fe09264a06a` |
| Women's clothing | M | `fb288854-9af5-1e28-20b7-2837ee7b6aed` |
| Women's clothing | L | `903b02f6-1f5a-36ed-6620-bfae7fb51f8f` |
| Women's clothing | XL | `3d0d4408-03e4-6ea2-7468-c9d4a5540d55` |
| Women's clothing | UK 10 (US 6) | `817dd165-3eaf-7207-04a6-cb04886d7fc7` |
| Women's clothing | UK 12 (US 8) | `b896e70a-0bd6-018f-731f-07ba20f01b6e` |
| Women's clothing | UK 14 (US 10) | `270425ce-442f-4c0c-7ab7-7dcd71fd4d84` |

**There is no "track jacket" category and no "bralette" category.** Closest fits
are `Men's/Women's jackets` (under activewear) and `Women's bras` or
`Women's bandeaus`. Owner's call — see open questions.

## Decisions taken

| Question | Answer |
|---|---|
| Photo → item grouping | Number cards read visually by Claude, which generates `mapping.csv` for the owner to confirm |
| Transcripts | Pasted into chat; Claude extracts to structured fields, script only writes the CSV |
| Price | Dictated per item in the voice note |

Consequence: **this is a two-part workflow, not one script.** Reading
handwriting and parsing free speech are reader tasks. The script starts once
there is a confirmed `mapping.csv` and confirmed extracted fields — it renames,
zips and writes CSV, and does nothing interpretive. The fragile steps stay
visible and checkable instead of failing silently inside a regex.

Price follows the existing rule: recorded exactly as dictated, blank and flagged
if not stated, never suggested (`pricing-notes.md`).

## Proposed folder structure

```
crosslist/
  inbox/                 raw photos, exactly as they come off the phone — never renamed in place
  mapping.csv            item_no,source_filename,photo_index,is_card  (generated, owner-confirmed)
  transcripts/           archived pasted transcripts, one file per batch
  build/                 disposable, regenerated on every run
    images/              renamed copies
    images.zip           upload alongside the CSV
    listings.csv
```

`inbox/` is copied from, never moved or renamed, so a bad run is always
recoverable by deleting `build/` and re-running.

## Proposed naming convention

`{item_no:03d}_{photo_index}.jpg` → `042_1.jpg`, `042_2.jpg`, `042_10.jpg`

- Item number zero-padded to 3 digits; photo index 1-based, unpadded.
- Index 1 is the lead photo — `Images` order is the listing's display order.
- The zip contents and the `Images` column are generated from one list, so they
  cannot drift apart.

## Audit of the existing 15 items

What would actually export cleanly today, if photos existed.

**Ready now (3 of 15):** items 4, 9, 10 — category, size and colour all resolve.

**Gender not stated (7 items: 2, 8, 11, 13, 14, 15, and 1 by implication).**
This is the single biggest gap. Every clothing category id is gendered, and the
size group follows from it, so an unstated gender blocks *both* Category id and
Size id. `inventory.csv` records `XXL` or `Large` with no menswear/womenswear
marker on these rows. Worth adding to the voice-note script going forward.

**Per-item blockers:**

| # | Item | Blocker |
|---|---|---|
| 1 | Skinny Minnie | Product name is a brand only — garment type unknown, so no category. Colour also blank. |
| 2 | RL Polo XXL | Gender unstated. Colour "Navy with pinstripes" → Navy, but the pinstripe colour is not recorded. |
| 3 | RL Polo Small Men's | Category and size resolve. Colour "Tartan check" is not on the fixed list — `Multi`? |
| 5 | Bralette 36 | The bras size group needs **band + cup** (36A, 36B, …). Only `36` was recorded, so no size id exists. Needs re-checking against the garment. |
| 6 | Bralette Small | Category choice decides whether the size is even legal: under `Women's bras` the group is band+cup and `Small` is invalid; under `Women's bandeaus` the group is Women's clothing and `S` resolves fine. |
| 7 | RL Women's Polo | `Medium (10-12)` is three possible ids — letter `M`, UK 10, or UK 12. Genuinely ambiguous. |
| 8, 11 | Nike Track Jackets | Gender unstated, and no "track jacket" category exists. |
| 12 | RL Polo XXL Men's | Resolves, but "Green with orange pony" — the orange is the logo, not the garment. Secondary color `Orange` or leave blank? |
| 13 | Lacoste Polo | Gender unstated. "Light green" is not on the list — nearest are `Green` or `Mint`, which are materially different. |
| 14, 15 | Lacoste / RL Polo | Gender unstated. Colours `DarkGreen` and `Turquoise` both resolve. |

**Applies to all 15:**

- **No measurements recorded anywhere,** and `inventory.csv` has no column for
  them. Going forward they need dictating; existing stock needs re-measuring.
- **No photos**, so `Images` would be empty on every row. Crosslist is unlikely
  to accept listings with no images.
- **Condition** — `Good condition` → `Good` and `Very good condition` →
  `VeryGood` are safe. **`Very good vintage condition` is not obvious** and
  covers six rows. Owner to decide whether vintage wear pulls it to `Good`.

## Open questions

1. **`Very good vintage condition`** → `VeryGood` or `Good`?
2. **Track jackets** → `Men's/Women's jackets` (activewear), or `tracksuits`,
   or an outerwear category such as `bomber jackets`/`windbreakers`?
3. **Bralettes** → `Women's bras` (needs band+cup sizes) or `Women's bandeaus`
   (takes S/M/L)?
4. **Light green** → `Green` or `Mint`?
5. **Tartan check** → `Multi`?
6. **Logo colours** — does an orange pony on a green polo make Secondary color
   `Orange`, or stay blank?
7. **Number-card photos** — exclude from the listing, crop the card out, or ship
   as-is? The `is_card` column exists to support exclusion; the default is the
   owner's call.
8. **File format** — phone photos are often `.HEIC` and Crosslist wants JPEG.
   Proposal is to convert on the way into `build/images/`.
9. **Existing 15 items** — back-fill into Crosslist, or start fresh with newly
   photographed stock?
10. **Shipping and the remaining optional columns** — weight, dimensions,
    Who made, When made, Tags, Accept offers. Leaving them blank is safe;
    setting sensible defaults per garment type would save editing later.

## Next step

Photos and transcripts. Once a first batch arrives: read the number cards,
produce `mapping.csv` for confirmation, then write the pipeline.
