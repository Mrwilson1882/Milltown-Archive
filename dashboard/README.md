# Sales Estimator

A dashboard that turns upload counts into estimated sales, revenue and profit, so
the link between photographing stock and making money is visible at a glance.

**It is an estimator, not a sales report.** Nothing here is a recorded sale. Every
money figure is the upload count run through three assumptions, and the dashboard
shows that arithmetic on screen rather than hiding it.

## Running it

```
python3 dashboard/build_dashboard.py
```

Standard library only — no installation, same as `crosslist/prepare.py`. It writes
`dashboard/dashboard.html` and opens it. One self-contained file: no server, no
internet, works by double-clicking.

Re-run it after every batch. The page is a snapshot of the CSVs at build time.

## Where the uploads come from

Uploads are **not typed in**. One upload = one item listed for sale = one row in a
processed batch:

| File | What it gives |
|---|---|
| `crosslist/items.csv` | the batch — one row per item listed. This is the upload count. |
| `crosslist/batches/*/items.csv` | the same, for batches kept in their own folders |
| `inventory.csv` | each item's **date**, from its `Date Added` cell |
| `crosslist/cost-rates.csv` | bundle cost prices — used only to check the markup assumption |
| `crosslist/listings.csv` | row count, as a cross-check that the export matches the batch |
| `crosslist/batch-log.csv` | *optional* — see below |
| `crosslist/store-export.csv` | *optional* — live/sold status, and uploads past the first batch |
| `dashboard/logo.*` | *optional* — the brand mark, inlined into the masthead |

The two are joined on item number, so `001` in the batch is item `1` in the ledger.

Nothing is guessed, per `conventions.md`. An item with no `Date Added` is still
counted, but it is reported as undated and flagged on the page rather than being
quietly assigned a date. Same for a missing price: flagged, and left out of the
average rather than filled in with a neighbour's figure.

### When the export date differs from the logging date

`Date Added` is the day an item was logged from its voice note, which is usually
also the day it went up. When a batch is exported on a different day, record it
in an optional `crosslist/batch-log.csv` and that date wins for the whole batch:

```csv
batch_id,date_uploaded,items_csv,notes
1,2026-08-14,crosslist/items.csv,first batch
2,2026-09-02,crosslist/batches/002/items.csv,exported the morning after
```

## The three assumptions

All three are variables, never hardcoded, and all three are shown on the page with
their current values in the working:

1. **Sell-through 20%** — one in five uploaded items is assumed to sell.
2. **Markup 100%** — you roughly double your money, so profit is **50% of the sale
   price**. The dashboard shows both numbers and the link between them.
3. **Average item value** — by default the mean of the prices in
   `crosslist/items.csv`, recalculated on every build. Override it with a number.

```
uploads × sell-through = items sold
items sold × average item value = revenue
revenue × markup / (1 + markup) = profit
```

Two of the three now have real evidence behind them, recomputed on every build:

- **Markup.** 12 of the 15 items have a bundle cost in `crosslist/cost-rates.csv`.
  An average sale price of £13.57 against an average cost of £6.64 is a
  **104.3% markup — a 51.1% profit share**. The brief assumed 50%.
- **Sell-through.** Of the 130 listings created since the live-from date, **24
  have sold — 18.5%**, against an assumed 20%. That is a count of sold dates, not
  a price, so it stays inside the no-pricing rule. Treat it as a **floor**: the
  newest listings have not had time to sell yet, so the true rate only rises.

### Changing them

- **For everyone, permanently** — edit `dashboard/settings.json` and re-run the build.
- **To try a what-if** — use the sliders under "Adjust the assumptions". Those are
  saved in your browser only and never touch the file. "Reset to settings.json"
  puts them back.

`settings.json` also holds `monthly_profit_target` (what the "upload X more items"
prompt is measured against) and `pace_window_days` (`0` = measure pace from the
live-from date below; set `30` for a rolling month once there is more history).
Either way the window never starts earlier than `live_from`.

## The store export, and "All stock live"

Commit the whole-store listings export and the dashboard picks up live stock,
sold counts, and every upload past the first batch:

```
crosslist/store-export.csv
```

**Any filename works.** The build finds it by its columns, not its name — any CSV
in the repo root or `crosslist/` carrying a last-listed column is taken as the
export. Spellings are matched loosely, so the Crosslist export's own
`Created` / `LastListedOn` / `Sold` headers resolve as they are, and the build
prints what it matched so a mismatch shows up rather than silently zeroing a
number.

**The file is gitignored.** This repo is public and the export carries
`CostOfGoods` and `InternalNote` for every listing, so the raw file stays on your
machine. The page it builds holds only aggregate counts — no titles, no listing
ids, no prices — so nothing per-listing is published. Say if you would rather
version it.

| Status | Rule |
|---|---|
| **Live** | `Last Listed` is on or after `live_from`, and there is **no** sold date |
| **Sold** | has a sold date |
| **Not currently live** | never listed, or last listed *before* `live_from` |

**All stock live** is `live listings × average item value` — what the shop window
is listed at.

### The live-from cutoff

`live_from` (default **`2026-06-22 19:38:03`**) is the line before which nothing
counts. It does two jobs:

1. A listing last listed before it is stale, not on the shop floor, however
   recently it was created.
2. **No average reaches back past it.** The upload pace measures from that date
   rather than from your first-ever upload, and any priced item dated before it
   is left out of the average item value and flagged.

Set it to a bare date (`"2026-06-22"`) to take the whole day rather than from
19:38:03 onwards.

The cutoff is tested against **`Last Listed`**, not the created date — an item
created in April but relisted in July is live. The build prints what the count
would be measured on the created date instead whenever the two differ, so if
that is the reading you wanted, it is one line to change.

### No pricing comes out of this file

Owner's instruction, and the build enforces it: a listing price is not a sold
price, so **no price column in the export is read at all**. The average item
value stays the mean of the 15 priced rows in `crosslist/items.csv`, and sold
items are counted but never valued. Adding 500 export rows will not move the
average by a penny.

### Not counting the first batch twice

Rows already counted from `crosslist/items.csv` are matched **by title**, not by
position. The export is sorted newest-first, so a positional skip would quietly
start eating new listings the moment a fresh batch landed above the old one.

All 15 first-batch titles matched exactly on the August 2026 export. Their
live/sold status *is* still read — the export is the only place status is
recorded — they are just not re-counted as uploads. `export_skip_rows` (15)
survives only as a fallback for when no title matches, and the build flags it if
it ever has to fall back.

The build also compares the ledger's `Date Added` against the export's `Created`
for those matched rows and flags any disagreement. On the current data it reports
that the first 15 sit on 2026-08-14 from `inventory.csv` but were created
2026-08-16 in Crosslist. The calendar keeps the ledger date; adding a
`batch-log.csv` row moves them. It is flagged, never silently corrected.

## Break-even

`break_even_target` (default **£3,300**) is the total estimated profit needed to
get back to zero on what you have spent on stock. It is a **running total, not a
monthly figure** — every upload chips away at it, and the panel shows what is
left, how many uploads that is at the current profit-per-upload, and the date you
cross it at your current pace.

`break_even_days` (default 90) is the deadline the planner works backwards from
to give you a uploads-per-day figure.

## The planner, and the per day / per month toggle

"Show rates" switches every rate on the page between **per day** and **per month**
— the planner, and the projection headline in Pace & projection.

Rates are held internally as a per-day figure and only converted for display, so
flipping the toggle can never drift the underlying number. A month is 30.44 days.

The planner works both directions:

- **Forwards** — drag the slider to a shooting rate and read off the estimated
  items sold, revenue and profit at that rate, plus the equivalent in the other
  unit.
- **Backwards** — three target rows, each giving the uploads you need *per the
  selected unit*: to hit the monthly profit target, to break even by the deadline,
  and how long break-even takes if you hold the rate on the slider.

Every row shows its arithmetic underneath, so no figure has to be taken on trust.

## Branding

**The logo — one step, and it is not done yet.** Save the mark as:

```
dashboard/logo.png        (or logo.svg, logo.jpg, logo.webp)
```

and re-run the build. The script base64-inlines it into the page, so the file
stays self-contained, and the masthead placeholder disappears on its own. `.svg`
is the best choice if you have it; otherwise a PNG around 400px tall is plenty.

The mark sits on a plate of its own cream (`--logo-plate`) in **both** themes.
That is deliberate: a logo drawn for a cream ground would otherwise float as a
bright rectangle on the dark theme.

**The colours** are taken from the logo — the burnt orange, the near-black, and
the cream ground. They live in the `BRAND TOKENS` block at the top of the
stylesheet in `template.html`; changing those changes the whole page.

The data ramp below them is a different matter. Those four orange steps were
checked with a palette validator for monotone lightness, visible separation
between steps, and contrast against the surface in **both** themes. If you
replace a step by eye, re-check it — a ramp that looks fine on a bright screen
can collapse into one flat block on a dim one.

Note also that amber is deliberately absent from the status colours. Beside an
orange data ramp an amber "warning" reads as just another step of the scale, so
the page uses green, red, or plain ink and says the state in words.

## Out of scope, deliberately

No eBay, Vinted or Depop integration, and no real sales data. This is v1: a
projection from upload counts, built so the assumptions are easy to retune once
actual sell-through figures come in.
