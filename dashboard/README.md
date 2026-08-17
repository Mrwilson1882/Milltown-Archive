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

Your own cost data already backs assumption 2 up: 12 of the 15 items have a bundle
cost in `crosslist/cost-rates.csv`, and an average sale price of £13.57 against an
average cost of £6.64 is a **104.3% markup — a 51.1% profit share**. The brief
assumed 50%. The dashboard recomputes that check on every build and prints it.

### Changing them

- **For everyone, permanently** — edit `dashboard/settings.json` and re-run the build.
- **To try a what-if** — use the sliders under "Adjust the assumptions". Those are
  saved in your browser only and never touch the file. "Reset to settings.json"
  puts them back.

`settings.json` also holds `monthly_profit_target` (what the "upload X more items"
prompt is measured against) and `pace_window_days` (`0` = measure pace since your
first logged upload; set `30` for a rolling month once there is more history).

## Branding

Two things are reserved for the Milltown Archive identity:

- **The logo.** `template.html` has a `.logo-slot` element in the masthead with
  clear space around it. Replace that whole element with an `<img>` — or, to keep
  the page self-contained, an inline `<svg>` or a `data:` URI.
- **The colours.** The top of the stylesheet is a `BRAND TOKENS` block of six
  values (two brand, two accent, two grounds). Changing those six changes the whole
  page; nothing else needs editing.

The data colours below them are a different matter. That indigo ramp was checked
with a palette validator for monotone lightness, visible steps, and contrast
against the surface in **both** light and dark themes. If you replace a step by
eye, re-check it — a ramp that looks fine on a bright screen can collapse into one
flat block on a dim one.

## Out of scope, deliberately

No eBay, Vinted or Depop integration, and no real sales data. This is v1: a
projection from upload counts, built so the assumptions are easy to retune once
actual sell-through figures come in.
