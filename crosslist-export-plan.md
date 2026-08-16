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
| Women's bras *(chosen)* | Womenswear > Women's intimates & sleepwear > Women's bras | `50c859ef-6643-4faf-1f4f-903ee3c155cc` | Women's bras |

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

**There is no "track jacket" category and no "bralette" category.** Resolved in
Decisions below: track jackets go to `Men's/Women's jackets` under activewear,
bralettes to `Women's bras`.

`jackets` and `tracksuits` are two separate categories with two separate ids,
both sitting under activewear. A track jacket sold on its own is `jackets`;
`tracksuits` is for a full two-piece set. There is also a whole outerwear
branch (`bomber`, `varsity`, `fleece`, `windbreaker`, `denim`, `leather`,
`quilted`, `utility`) if a future jacket fits one of those better.

## Decisions taken

| Question | Answer |
|---|---|
| Photo → item grouping | Number cards read visually by Claude, which generates `mapping.csv` for the owner to confirm |
| Transcripts | Pasted into chat; Claude extracts to structured fields, script only writes the CSV |
| Price | Dictated per item in the voice note |
| `Very good vintage condition` | Maps to `VeryGood` |
| Track jackets | `Men's/Women's jackets` under activewear — **not** `tracksuits`, which are a separate category for full two-piece sets |
| Bralettes | `Women's bras` |
| `Light green` | Maps to `Green` |
| Number-card photos | Excluded from the listing. The card is its own photo, sent alongside 10–15 usable ones |

Consequence: **this is a two-part workflow, not one script.** Reading
handwriting and parsing free speech are reader tasks. The script starts once
there is a confirmed `mapping.csv` and confirmed extracted fields — it renames,
zips and writes CSV, and does nothing interpretive. The fragile steps stay
visible and checkable instead of failing silently inside a regex.

Price follows the existing rule: recorded exactly as dictated, blank and flagged
if not stated, never suggested (`pricing-notes.md`).

### Bras: which of the two?

There are two `Women's bras` categories, both on the `Women's bras` size group:

- `Womenswear > Women's intimates & sleepwear > Women's bras` — `50c859ef-6643-4faf-1f4f-903ee3c155cc`
- `Womenswear > Women's activewear > Women's bras` — `591def8a-9332-8e25-0693-929c68a24a19`

Using **intimates & sleepwear**. The activewear one is for sports bras, which a
bralette is not. Say if you would rather it went the other way.

**This choice has a cost.** The `Women's bras` size group is band + cup only
(`36B`, `34C`, …) — there is no `S`/`M`/`L` in it. So both bralettes now need a
band-and-cup size measured off the garment:

- Item 5 is recorded as `36` — needs the cup letter.
- Item 6 is recorded as `Small` — does not translate at all.

The alternative was `Women's bandeaus`, which sits on the Women's clothing size
group and would have taken `Small` as-is. Worth knowing before you re-measure.

## Where this runs

**The photos live on the owner's Mac; Claude runs in an isolated cloud
container and cannot reach that filesystem.** The batch is also ~234 MB of
binaries, which must never be committed — see `.gitignore`.

So the pipeline is split in two, both halves run locally by the owner:

1. **`crosslist/prepare.py`** — reads the batch, writes one labelled contact
   sheet PDF plus a manifest. The owner sends the PDF to Claude, who reads the
   number cards and shot types and returns `mapping.csv`.

   **No installation required.** Thumbnails come from `sips`, built into macOS
   and HEIC-capable, and the PDF is assembled with the standard library alone.
   An earlier draft used Pillow; dropping it removed the only setup step, which
   was where the owner got stuck. Pillow is still used as a fallback when `sips`
   is absent, which is only true off macOS — that path exists so the script can
   be tested here.
2. **`crosslist/review.py`** — renders `mapping.csv` as a web page showing each
   item's photos in listing order, so the mapping is checked by eye rather than
   by reading 185 spreadsheet rows. Corrections come back as plain English.
3. **`crosslist/build.py`** — joins `items.csv` and `mapping.csv`, renames the
   photos, zips them and writes `listings.csv`. Written and tested end to end:
   15 rows, 33 columns, 170 photos, and the `Images` column verified to match
   the zip contents exactly in both directions.

Neither script modifies the source folder. `prepare.py` only ever reads it.

## Proposed folder structure

On the owner's Mac, alongside the checked-out repo:

```
crosslist/
  prepare.py             stage 1 — contact sheets                (in repo)
  review.py              stage 2 — visual check of the mapping   (in repo)
  build.py               stage 3 — rename, zip, CSV              (in repo)
  inbox/                 raw photos, never renamed in place      (gitignored)
  prepared/              contact-sheets.pdf + manifest.csv       (gitignored)
  mapping.csv            item_no,source_filename,shot_type,photo_index  (in repo — small, and worth versioning)
  transcripts/           archived pasted transcripts
  build/                 disposable — images/, images.zip, listings.csv  (gitignored)
```

`inbox/` is read from, never written to, so a bad run is always recoverable by
deleting `build/` and re-running.

## Proposed naming convention

`{item_no:03d}_{photo_index}.jpg` → `042_1.jpg`, `042_2.jpg`, `042_10.jpg`

- Item number zero-padded to 3 digits; photo index 1-based, unpadded.
- Index order **is** the listing's display order — see Photo ordering below.
- The number-card photo is not numbered. Indices run 1..N across the usable
  photos only, so `Images` never has a gap and the card never reaches a buyer.
  The card stays in `inbox/` as the grouping record; it is simply not copied
  into `build/images/`.
- The zip contents and the `Images` column are generated from one list, so they
  cannot drift apart.

## Photo ordering

Owner's rule, applied when assigning `photo_index`:

| Order | `shot_type` | What it is |
|---|---|---|
| 1 | `front` | Full shot, front |
| 2 | `back` | Full shot, back |
| 3… | `detail` | Key product details — chest logo on a polo, neck label on designer pieces. Combine both in one shot where the garment allows. |
| then | `measure` | Shots with the tape measure |
| last | `defect` | Anything wrong with the item |
| — | `card` | The handwritten number card. Excluded from the listing entirely. |

Within a band, photos keep the order they were shot in.

**This ordering is a reading task, not a scripted one.** Nothing in a filename
says whether a photo is a back shot or a defect shot, so `shot_type` is assigned
when the batch is read, at the same time as the number cards. That is exactly
why it belongs in `mapping.csv` as its own column: the owner can scan a short
table of `front / back / detail / measure / defect` and catch a misread before
any renaming happens, rather than trying to spot a wrong order in a row of
`042_1.jpg|042_2.jpg|…`.

The script sorts by the band order above, then writes `photo_index`. If a batch
has no `front` shot, or more than one, that is worth surfacing rather than
silently ordering around it.

## Listing copy

Owner's house format, taken from three of his own live listings:

```
{Condition}
Size: {size} (Measurements provided on the images and below)
Era: {era}

🧵Material: {material}
🚚 Quick Delivery
📦 Guaranteed Authenticity With Milltown Archive

Pit to Pit: {x}"
Length: {y}"

Item Description: {era} {style} {brand} {colour} {garment} with {details}. {Second sentence on construction or styling}.
```

Measurements are deferred by the owner (14 Aug) and will be dictated in future
voice notes. Until they exist, the Pit to Pit and Length lines are **omitted
entirely** rather than printed empty, and the size line drops "and below" so it
does not promise figures that are not there. Both come back automatically once
measurements are recorded.

**Material** is read off the garment's own composition tag wherever one was
photographed, and written exactly as the tag states it — `100% Cotton`,
`60% Cotton 40% Polyester`. Where no tag was photographed for that item, the
material is estimated from the fabric in the photographs and **carries no
percentage at all**, since a percentage that was never read is a fabrication.
Owner's instruction, 16 Aug. The `material_source` column in `items.csv` records
which of the two applies to every row.

**Titles** are written for Vinted's search, not for elegance: brand first, then
stacked garment synonyms (`Jumper Cardigan Zip Up`), then fit, colour and size.
Crosslist permits 255 characters but Vinted truncates around 100, so titles are
kept under 80.

**Era** is estimated by Claude from the whole photo set — cut, hem shape, logo
treatment, hardware, graphics and trim, not the neck label alone. Each estimate
carries its reasoning in the `era_evidence` column of `items.csv`, so a dated
garment can be argued with rather than taken on trust.

Ranges are deliberately wide where the garment gives nothing away: Lacoste and
Ralph Lauren have run some shapes unchanged for decades, and a decade-wide range
is the honest answer there. Where construction does date a piece — a dipped
handkerchief hem, a curved chest colour-block, a Big Pony launch date — the
range narrows accordingly. Reading the neck labels would tighten the
undateable ones further.

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
| 5 | Bralette 36 | Category settled. The bras size group needs **band + cup** (36A, 36B, …); only `36` was recorded, so no size id exists. Needs re-measuring. |
| 6 | Bralette Small | Category settled as `Women's bras`, whose size group is band+cup only — `Small` has no equivalent. Needs re-measuring. |
| 7 | RL Women's Polo | `Medium (10-12)` is three possible ids — letter `M`, UK 10, or UK 12. Genuinely ambiguous. |
| 8, 11 | Nike Track Jackets | Category settled (`jackets`, activewear). Still blocked on gender, which also blocks the size. |
| 12 | RL Polo XXL Men's | Resolves, but "Green with orange pony" — the orange is the logo, not the garment. Secondary color `Orange` or leave blank? |
| 13 | Lacoste Polo | Colour settled as `Green`. Still blocked on gender. |
| 14, 15 | Lacoste / RL Polo | Gender unstated. Colours `DarkGreen` and `Turquoise` both resolve. |

**Applies to all 15:**

- **No measurements recorded anywhere,** and `inventory.csv` has no column for
  them. Going forward they need dictating; existing stock needs re-measuring.
- **No photos**, so `Images` would be empty on every row. Crosslist is unlikely
  to accept listings with no images.
- **Condition** — settled. `Good condition` → `Good`, `Very good condition` and
  `Very good vintage condition` → `VeryGood`.

## Open questions

Answered so far: condition mapping, track jackets, bralettes, light green, and
number-card photos — all recorded in Decisions above. Still outstanding:

1. ~~Gender on 7 items~~ — **answered 16 Aug: items 2, 8, 11, 13, 14 and 15 are
   all menswear.** Item 1 was resolved from the photographs as a women's tunic.
   Still worth adding to the voice-note script for new stock, since it blocks
   Category id and Size id together.
2. ~~Item 1, "Skinny Minnie"~~ — **resolved from the photographs**: a longline
   women's tunic, black with a cream baroque print. Category `Women's tunics`.
3. ~~Items 5 and 6~~ — **resolved 16 Aug.** Owner reports both as very small.
   That has no equivalent in the band-and-cup size group, so both moved from
   `Women's bras` to `Women's bandeaus`, which sits on Women's clothing sizing
   and takes `S` directly. This reverses the earlier bras decision for these two
   items; reverting means accepting a blank Size id and losing the Vinted size
   filter. Brands came from the photos: Frederick's of Hollywood and Avon
   Fashions, both blank in the ledger.
4. ~~Item 7, `Medium (10-12)`~~ — **resolved 16 Aug: UK M**, the letter size.
5. **Item 3, "Tartan check"** → `Multi`?
6. **Item 12, logo colours** — orange pony on a green polo. Secondary color
   `Orange`, or blank?
7. **Item 2, "Navy with pinstripes"** — `Navy` primary, but the pinstripe
   colour was never recorded.
8. **Neck label photos** would narrow the eras that styling alone cannot date —
   items 2, 7, 13 especially — and would settle the gender question in one pass.
   Not a blocker, but the cheapest remaining win at 15 photos.
9. **Materials in `items.csv` are inferred** from the photographs, not read off
   a care label. Cotton piqué for the polos is near-certain; the corsets and
   jackets are less so. Owner to confirm.
10. ~~Item 4's label reads XL~~ — **resolved by standing rule.** Where a label
    and the ledger disagree on size, the ledger wins (`conventions.md`,
    16 Aug). Large Women's it is.
11. **File format** — phone photos are often `.HEIC` and Crosslist wants JPEG.
   Proposal is to convert on the way into `build/images/`.
12. **Shipping and remaining optional columns** — weight, dimensions, Who made,
    When made, Tags, Accept offers. Blank is safe; per-garment defaults would
    save editing later.

## Next step

Photos and transcripts. Once a first batch arrives: read the number cards,
produce `mapping.csv` for confirmation, then write the pipeline.
