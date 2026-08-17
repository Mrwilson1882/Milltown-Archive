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

## Still needed
Style for lingerie (items 5, 6) · Vinted material (multi-select, up to 3) ·
the top of the Department list

## Also seen
- `Vinted material` — separate multi-select, **up to 3 values**.
- `Package dimensions (l x w x h)` in **cm** — the Shipping height/width/length
  trio, left empty in the CSV.
- Shipping weight reading correctly from the CSV: 290 g and 640 g both confirmed.
