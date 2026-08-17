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

## Brand — Crosslist remaps it on import

**Known issue, 16 Aug.** The CSV carries `Ralph Lauren` on all seven RL items,
yet the listing showed `Lauren Ralph Lauren`. The remap happens inside
Crosslist, not in the CSV, and appears to affect every item.

Most likely cause: Crosslist matches the Brand string against its own brand
catalogue and falls back to the nearest entry when there is no exact match. Its
catalogue probably holds `Polo Ralph Lauren` and `Lauren Ralph Lauren` but no
plain `Ralph Lauren`, so the fallback picks a sub-label.

Two of ours are likely mismatched on spelling alone:

| CSV value | Likely catalogue form |
|---|---|
| `Harley Davidson` | `Harley-Davidson` (hyphen) |
| `Frederick's of Hollywood` | apostrophe may break the match |

`Nike` and `Lacoste` should match exactly. If those were remapped too, the cause
is not spelling and the field needs a different approach.

**Fix once known:** put the exact catalogue string in the CSV. Until then the
title and tags both lead with the brand, so search still finds these listings —
it is the brand *facet* that is wrong, not the discoverability.

## Still needed
Style for lingerie (items 5, 6) · Vinted material (multi-select, up to 3) ·
the top of the Department list

## Also seen
- `Vinted material` — separate multi-select, **up to 3 values**.
- `Package dimensions (l x w x h)` in **cm** — the Shipping height/width/length
  trio, left empty in the CSV.
- Shipping weight reading correctly from the CSV: 290 g and 640 g both confirmed.
