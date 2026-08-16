# Crosslist Export — Plan (proposal, not yet built)

Turning raw item photos + voice notes into a Crosslist bulk upload:
`listings.csv` + `images.zip`.

**Status: blocked on inputs. No code written yet, by instruction.**
Read this alongside `conventions.md` — the "never guess, flag it back" rule
applies to every mapping decision below.

## Blocked on

None of these are in the repo. The workbook is the hard blocker.

1. **`CSV_listing_template.xlsx`** — the Crosslist template workbook
   (Info, Template, Categories, Sizes tabs). Without it there is no way to
   know the real column order, and Category id / Size id are UUIDs that exist
   only inside those sheets. They cannot be derived, inferred, or looked up
   anywhere else.
2. **The raw photos.** Nothing image-shaped is in the repo or on this box.
3. **The voice-note transcripts.**

Until (1) arrives the CSV writer cannot be written to spec. Everything else
below can be settled now.

## Decisions taken

| Question | Answer |
|---|---|
| Photo → item grouping | Number cards read visually by Claude, which generates `mapping.csv` for the owner to confirm |
| Transcripts | Pasted into chat; Claude extracts to structured fields, script only writes the CSV |
| Price | Dictated per item in the voice note |

Consequence of 1 and 2: **this is a two-part workflow, not one script.** Reading
handwriting and parsing free speech are reader tasks. The script's job starts
once there is a confirmed `mapping.csv` and a confirmed row of extracted
fields — it renames, zips, and writes CSV, and does nothing that involves
interpretation. That split is deliberate: the fragile steps stay visible and
checkable instead of failing silently inside a regex.

Price follows the existing rule: recorded exactly as dictated with the `£`
symbol, left blank and flagged if not stated. No price is ever suggested
(`pricing-notes.md`).

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

`inbox/` is copied from, never moved or renamed. A bad run is then always
recoverable by deleting `build/` and re-running.

## Proposed naming convention

`{item_no:03d}_{photo_index}.jpg` → `042_1.jpg`, `042_2.jpg`, `042_10.jpg`

- Item number zero-padded to 3 digits; photo index 1-based, unpadded.
- Order in the `Images` column is the listing's display order, so index 1 is
  the intended lead photo.
- Filenames in `images.zip` must match the `Images` column character for
  character. The script generates both from one list so they cannot drift.

## Open questions

Flagging rather than guessing, per `conventions.md`.

1. **Number-card photos.** The card is a working aid with handwriting on it.
   Should photo 1 be excluded from the listing, cropped, or is it fine to ship
   as-is? The proposed `is_card` column in `mapping.csv` exists to support
   exclusion, but the default is the owner's call.
2. **File format.** Phone photos are often `.HEIC`, and Crosslist wants JPEG.
   Proposal is to convert to `.jpg` on the way into `build/images/`. Needs
   confirming against what actually lands in `inbox/`.
3. **Condition mapping.** `inventory.csv` uses three grades that do not map
   one-to-one onto Crosslist's fixed list. `Good condition` → `Good` is safe.
   `Very good condition` → `VeryGood` is safe. **`Very good vintage condition`
   is not obvious** — it may be `VeryGood`, or vintage may warrant `Good`.
   Six of the fifteen existing rows use it. Owner to decide.
4. **Colour mapping.** Crosslist has a fixed colour list; the current column
   is free text and several values will not land on it — `Turquoise`,
   `Tartan check`, `Navy with pinstripes`, `Green with orange pony`,
   `Black and navy`, `Light green`. The two-tone ones probably split across
   Color + Secondary color. Cannot be settled until the Info tab is readable.
5. **Measurements.** The prompt asks for measurements folded into the
   Description, but **no measurement is recorded for any of the 15 existing
   items** and `inventory.csv` has no column for them. Going forward they need
   to be dictated in the voice note. Existing stock would need re-measuring.
6. **SKU.** `VWM - RL Lacoste Polos` and similar are core to the current
   system but there is no SKU field in the column list quoted in the brief.
   Needs a home in the Crosslist template, or it drops out of the export.
7. **Colour column doing double duty.** Item 3 records
   `Tartan check, labels cut` under Colour — "labels cut" is a condition
   detail sitting in a colour field. Worth separating before export.
8. **Existing 15 items.** Are these being back-filled into Crosslist, or does
   the export start fresh with new photographed stock? They have no photos,
   so `Images` would be empty for all of them.

## Next step

Send `CSV_listing_template.xlsx`. Claude reads the four tabs, confirms the
real column order and the Category/Size id lookup back to the owner, and only
then writes the script.
