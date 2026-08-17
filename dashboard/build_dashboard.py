#!/usr/bin/env python3
"""Build the sales estimator dashboard from the photo-processing CSVs.

Usage:  python3 dashboard/build_dashboard.py            (from the repo root)
        python3 build_dashboard.py                      (from inside dashboard/)

Reads, never writes, the pipeline files:

  crosslist/items.csv           the processed batch — one row per item listed.
                                This is what an "upload" means here.
  crosslist/batches/*/items.csv the same, for batches kept in their own folders.
  inventory.csv                 the dated ledger — supplies each item's date
                                from its `Date Added` cell.
  crosslist/cost-rates.csv      per-bundle cost prices, used only to check the
                                markup assumption against real stock.
  crosslist/listings.csv        row count, as a cross-check on the batch.
  crosslist/batch-log.csv       optional. Overrides the upload date for a batch
                                when the export went out on a different day
                                from the day the items were logged.

Writes  dashboard/dashboard.html  — one self-contained file, data baked in, so
it opens by double-clicking with no server and no internet.

Nothing is guessed. An item the ledger has no date for is counted, reported as
undated, and flagged on the page rather than being quietly assigned a date.
"""

import csv, json, re, subprocess, sys
from datetime import date, datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
TEMPLATE = HERE / "template.html"
OUT = HERE / "dashboard.html"
SETTINGS = HERE / "settings.json"

SETTING_KEYS = ("sell_through_rate", "markup", "average_item_value",
                "monthly_profit_target", "pace_window_days", "currency")

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def read_csv(path):
    """Return (rows, found). Rows are dicts with stripped keys."""
    if not path.exists():
        return [], False
    with path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        rows = []
        for row in reader:
            clean = {(k or "").strip(): (v or "").strip() for k, v in row.items()}
            if any(clean.values()):
                rows.append(clean)
    return rows, True


def item_no(value):
    """'001', '1', ' 1 ' all mean item 1. Returns None if it is not a number."""
    digits = re.sub(r"[^0-9]", "", value or "")
    return int(digits) if digits else None


def price_of(value):
    """Prices arrive as '£12.99' in the ledger and '12.99' in the batch."""
    cleaned = re.sub(r"[^0-9.]", "", value or "")
    try:
        return round(float(cleaned), 2) if cleaned else None
    except ValueError:
        return None


def load_settings():
    settings = {}
    if SETTINGS.exists():
        raw = json.loads(SETTINGS.read_text(encoding="utf-8"))
        settings = {k: v for k, v in raw.items() if k in SETTING_KEYS}
    defaults = {"sell_through_rate": 0.20, "markup": 1.00, "average_item_value": None,
                "monthly_profit_target": 500, "pace_window_days": 0, "currency": "£"}
    defaults.update(settings)
    return defaults


def batch_files():
    """crosslist/items.csv first, then any per-batch folders, in path order."""
    found = []
    main = ROOT / "crosslist" / "items.csv"
    if main.exists():
        found.append(main)
    found.extend(sorted((ROOT / "crosslist" / "batches").glob("*/items.csv")))
    return found


def main():
    settings = load_settings()
    sources, flags = [], []

    def note_source(path, rows, found, note):
        sources.append({"path": str(path.relative_to(ROOT)), "rows": len(rows),
                        "found": found, "note": note})

    # ── the dated ledger: item number → date, plus a fallback price ───────────
    ledger_rows, ledger_found = read_csv(ROOT / "inventory.csv")
    note_source(ROOT / "inventory.csv", ledger_rows, ledger_found,
                "the dated ledger — supplies each item's upload date")
    if not ledger_found:
        flags.append("inventory.csv is missing, so no upload can be dated.")

    ledger = {}
    for row in ledger_rows:
        num = item_no(row.get("Item No.", ""))
        if num is None:
            continue
        added = row.get("Date Added", "")
        ledger[num] = {
            "date": added if DATE_RE.match(added) else None,
            "price": price_of(row.get("Price", "")),
            "name": row.get("Product Name", ""),
        }

    undated_in_ledger = sorted(n for n, v in ledger.items() if v["date"] is None)
    if undated_in_ledger:
        flags.append("No Date Added in inventory.csv for item(s) " +
                     ", ".join(str(n) for n in undated_in_ledger) +
                     " — counted, but shown as undated rather than guessed.")

    # ── optional per-batch date overrides ────────────────────────────────────
    log_rows, log_found = read_csv(ROOT / "crosslist" / "batch-log.csv")
    if log_found:
        note_source(ROOT / "crosslist" / "batch-log.csv", log_rows, True,
                    "optional — overrides the upload date for a whole batch")
    overrides = {}
    for row in log_rows:
        key = row.get("items_csv") or row.get("csv_file") or ""
        when = row.get("date_uploaded") or row.get("date") or ""
        if key and DATE_RE.match(when):
            overrides[key.strip()] = when

    # ── the batches: one row per item listed = one upload ────────────────────
    uploads = {}          # item number → {date, price, batch}
    batch_paths = batch_files()
    if not batch_paths:
        flags.append("No batch CSV found. Expected crosslist/items.csv or "
                     "crosslist/batches/*/items.csv.")

    for path in batch_paths:
        rows, found = read_csv(path)
        rel = str(path.relative_to(ROOT))
        note_source(path, rows, found, "processed batch — one row is one upload")
        override = overrides.get(rel)
        for row in rows:
            num = item_no(row.get("item_no", ""))
            if num is None:
                continue
            entry = ledger.get(num, {})
            when = override or entry.get("date")
            price = price_of(row.get("price", "")) or entry.get("price")
            uploads[num] = {"date": when, "price": price, "batch": rel,
                            "sku": row.get("sku", ""),
                            "cost": price_of(row.get("Cost of Goods", ""))}

    missing_dates = sorted(n for n, v in uploads.items() if not v["date"])
    if missing_dates:
        flags.append("Uploaded item(s) " + ", ".join(str(n) for n in missing_dates) +
                     " have no date in inventory.csv, so they sit outside the calendar. "
                     "Add a Date Added, or a row to crosslist/batch-log.csv.")

    missing_prices = sorted(n for n, v in uploads.items() if v["price"] is None)
    if missing_prices:
        flags.append("Uploaded item(s) " + ", ".join(str(n) for n in missing_prices) +
                     " have no price, so they are excluded from the average item value.")

    not_yet_exported = sorted(set(ledger) - set(uploads))
    if not_yet_exported:
        flags.append(str(len(not_yet_exported)) + " ledger item(s) are not in any batch CSV "
                     "yet, so they are not counted as uploads: " +
                     ", ".join(str(n) for n in not_yet_exported) + ".")

    # ── cross-check against the export itself ────────────────────────────────
    listing_rows, listing_found = read_csv(ROOT / "crosslist" / "listings.csv")
    if listing_found:
        note_source(ROOT / "crosslist" / "listings.csv", listing_rows, True,
                    "the finished export — row count cross-check")
        main_batch = sum(1 for v in uploads.values() if v["batch"] == "crosslist/items.csv")
        if main_batch and len(listing_rows) != main_batch:
            flags.append("listings.csv has " + str(len(listing_rows)) + " rows but "
                         "crosslist/items.csv has " + str(main_batch) +
                         ". One of them is out of date.")

    # ── cost rates, used only to check the markup assumption ─────────────────
    rate_rows, rate_found = read_csv(ROOT / "crosslist" / "cost-rates.csv")
    if rate_found:
        note_source(ROOT / "crosslist" / "cost-rates.csv", rate_rows, True,
                    "per-bundle cost prices — checks the markup against real stock")
    rates = {}
    for row in rate_rows:
        cost = price_of(row.get("cost", ""))
        sku = row.get("sku_pattern", "")
        if sku and cost is not None:
            rates[sku] = cost

    # ── days ─────────────────────────────────────────────────────────────────
    days = {}
    undated = {"uploads": 0, "value": 0.0}
    for num, item in sorted(uploads.items()):
        if item["date"]:
            bucket = days.setdefault(item["date"], {"uploads": 0, "value": 0.0})
        else:
            bucket = undated
        bucket["uploads"] += 1
        bucket["value"] += item["price"] or 0.0
    for bucket in list(days.values()) + [undated]:
        bucket["value"] = round(bucket["value"], 2)

    # ── derived figures ──────────────────────────────────────────────────────
    prices = [v["price"] for v in uploads.values() if v["price"] is not None]
    avg_price = round(sum(prices) / len(prices), 2) if prices else 0.0

    costed = [(v["price"], v["cost"] if v["cost"] is not None else rates.get(v["sku"]))
              for v in uploads.values() if v["price"] is not None]
    costed = [(p, c) for p, c in costed if c is not None and c > 0]

    if costed:
        avg_costed_price = sum(p for p, _ in costed) / len(costed)
        avg_cost = sum(c for _, c in costed) / len(costed)
        implied_markup = (avg_costed_price - avg_cost) / avg_cost
        implied_share = (avg_costed_price - avg_cost) / avg_costed_price
    else:
        avg_costed_price = avg_cost = implied_markup = implied_share = 0.0

    now = datetime.now(timezone.utc)
    payload = {
        "generated_at": now.isoformat(timespec="seconds"),
        "generated_at_human": now.strftime("%d %b %Y, %H:%M UTC"),
        "today": date.today().isoformat(),
        "settings": settings,
        "days": days,
        "undated": undated,
        "derived": {
            "total_items": len(ledger),
            "uploaded_items": len(uploads),
            "priced_items": len(prices),
            "csv_average_item_value": avg_price,
            "cost_known_count": len(costed),
            "avg_price_costed": round(avg_costed_price, 2),
            "avg_known_cost": round(avg_cost, 2),
            "implied_markup": round(implied_markup, 4),
            "implied_profit_share": round(implied_share, 4),
        },
        "sources": sources,
        "flags": flags,
    }

    if not TEMPLATE.exists():
        sys.exit("template.html is missing from " + str(HERE))

    blob = json.dumps(payload, ensure_ascii=False, indent=1).replace("</", "<\\/")
    html = TEMPLATE.read_text(encoding="utf-8")
    if "/*__MILLTOWN_DATA__*/null" not in html:
        sys.exit("template.html has no /*__MILLTOWN_DATA__*/null placeholder to fill.")
    OUT.write_text(html.replace("/*__MILLTOWN_DATA__*/null", blob), encoding="utf-8")

    total = sum(d["uploads"] for d in days.values())
    print("Built " + str(OUT.relative_to(ROOT)))
    print("  " + str(total) + " dated uploads across " + str(len(days)) + " day(s)"
          + (", " + str(undated["uploads"]) + " undated" if undated["uploads"] else ""))
    print("  average item value " + settings["currency"] + format(avg_price, ".2f")
          + " from " + str(len(prices)) + " priced items")
    if costed:
        print("  markup implied by your cost data: "
              + format(implied_markup * 100, ".1f") + "% "
              + "(a " + format(implied_share * 100, ".1f") + "% profit share)")
    for flag in flags:
        print("  ! " + flag)

    try:
        subprocess.run(["open", str(OUT)], capture_output=True)
    except FileNotFoundError:
        pass


if __name__ == "__main__":
    main()
