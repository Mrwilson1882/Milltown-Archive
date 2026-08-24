# Crosslist UI field options

Values for the attributes Crosslist collects in its own interface rather than in
the CSV. Captured from screenshots as they arrive — incomplete, and grows. Every
field is "Select or enter your own", so free text is accepted, but matching a
listed value is safer for platform filters.

The lists are **per category** — the Style options for a jacket are a different
set from the Style options for a sweater. Recorded that way below.

## Department
Men *(inferred — list was cut off above "Women")* · Women · Teens · Unisex Adults

## Style — jackets
3-in-1 Jacket · Basic Jacket · Ski Jacket · Track Jacket · Varsity Jacket · Windbreaker

Item 8 → `Windbreaker`. Item 11 → `Track Jacket`.

## Style — sweaters & cardigans
Cape · Cardigan · Full Zip · Henley · Pullover · Shrug · Tunic · Vest · Wrap

`Tunic` lives here, which settles item 1. `Full Zip` is the right value for
item 9's zip hoodie — better than anything I had.

## Type — tops
Blouse · Button-Up · Polo · Tank · T-Shirt

The value is **`Polo`**, not `Polo Shirt`.

## Neckline
Boat Neck · Collared · Cowl Neck · Crew Neck · High Neck · Mock Neck · Roll Neck ·
Round Neck · Scoop Neck · Square Neck · V-Neck

**No `Hooded` option.** Nearest listed is `Crew Neck`; the field takes free text.
Affects item 9.

## Sleeve Length
Sleeveless · Short Sleeve · 3/4 Sleeve · Long Sleeve

Complete — no scroll on the dropdown.

## Outer Shell Material
Two families in one list. Percentage entries first — 100% Acrylic · Cashmere ·
Cotton · Linen · Lyocell · Merino Wool · Modal · Nylon · Polyamide · Polyester ·
Silk · Wool — then plain names: Acetate · Acrylic · Acrylic Blend · Alfa · …

**Use the plain name, not the percentage one, unless a composition tag has
actually been read** (`conventions.md`). So items 8 and 11 take `Nylon`, not
`100% Nylon`, until their tags are photographed.

## Brand — Crosslist remaps Ralph Lauren on import

**Confirmed 16 Aug. Not a CSV fault — do not "fix" it in the file.**

The CSV carries `Ralph Lauren`: 12 bytes, plain ASCII, no stray whitespace,
byte-identical to the first entry in Crosslist's own brand dropdown. Crosslist
received that exact match and resolved it to `Lauren Ralph Lauren` regardless.

Only Ralph Lauren is affected. Nike, Lacoste, Harley Davidson, Frederick's of
Hollywood and Avon Fashions all imported correctly — Ralph Lauren is the one
brand here with a family of sub-labels (`Polo`, `Rugby`, `Lauren`,
`Denim & Supply`, `RLX`), so the matcher appears to rank across them instead of
preferring the exact hit.

**Keep `Ralph Lauren` in `items.csv`.** It is the correct value, and working
around someone else's bug would leave the file wrong the day they fix it.

On a future batch, expect to correct the Brand field by hand on every Ralph
Lauren item, or check first whether the published listing reaches Vinted with
the right brand — the edit screen may simply be displaying a resolved name over
correct underlying data. That check has not been done.

Titles and tags both lead with the brand on all seven, so text search is
unaffected either way; only the brand facet is.

## Crosslist fills blank fields on import

**Second confirmed instance, 19 Aug.** Item 22, the bronze Birkenstocks, shows
`Secondary color: Red` in Crosslist. That field is **empty** in `listings.csv` —
no row in batch 3 has Red as a secondary except item 20, the black Ralph Lauren
polo with the red pony, which is correct.

So a blank imported field came back populated, as the Brand field did with
`Ralph Lauren` becoming `Lauren Ralph Lauren`. Cause unknown: it may be the
listing form retaining a previous value, or one of the AI generate buttons.

**Check after every import:** the fields left deliberately blank, not just the
ones filled. A wrong value in a field the CSV never set is invisible from this
side — it can only be caught in the Crosslist UI.

Colours are worth particular attention on footwear, where a wrong secondary is
both obvious to a buyer and a filter mismatch.

## Still needed
Style for lingerie (items 5, 6) · Vinted material (multi-select, up to 3) ·
the top of the Department list

## Also seen
- `Vinted material` — separate multi-select, **up to 3 values**.
- `Package dimensions (l x w x h)` in **cm** — the Shipping height/width/length
  trio, left empty in the CSV.
- Shipping weight reading correctly from the CSV: 290 g and 640 g both confirmed.
