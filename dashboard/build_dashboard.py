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
  crosslist/cost-rates.csv      per-bundle cost prices. Profit is worked out from
                                these: an item's cost is its own Cost of Goods,
                                or failing that the rate for its SKU here.
  crosslist/listings.csv        row count, as a cross-check on the batch.
  crosslist/batch-log.csv       optional. Overrides the upload date for a batch
                                when the export went out on a different day
                                from the day the items were logged.
  crosslist/store-export.csv    optional. The whole-store listings export: every
                                listing, its created date, its Last Listed, and a
                                sold date where there is one. Found by its columns
                                rather than its name, so any filename works.
                                Live = has a Last Listed and no sold date.
                                Its SALE PRICES ARE NEVER READ — a listing price
                                is not a sold price. Value always uses the
                                items.csv average. Its Cost of Goods column IS
                                read, being what was paid rather than hoped for.

Writes  dashboard/dashboard.html  — one self-contained file, data baked in, so
it opens by double-clicking with no server and no internet.

Nothing is guessed. An item the ledger has no date for is counted, reported as
undated, and flagged on the page rather than being quietly assigned a date.
"""

import base64, csv, json, re, subprocess, sys
from datetime import date, datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
TEMPLATE = HERE / "template.html"
OUT = HERE / "dashboard.html"
SETTINGS = HERE / "settings.json"

SETTING_KEYS = ("sell_through_rate", "average_cost_of_goods", "average_item_value",
                "monthly_profit_target", "break_even_target", "break_even_days",
                "rate_unit", "pace_window_days", "currency")

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

# The logo is inlined so the page stays one self-contained file. First match wins.
LOGO_NAMES = ("logo.svg", "logo.png", "logo.jpg", "logo.jpeg", "logo.webp")
LOGO_TYPES = {".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
              ".jpeg": "image/jpeg", ".webp": "image/webp"}


def find_logo():
    """Return (data_uri, note) for dashboard/logo.*, or (None, note) if absent."""
    for name in LOGO_NAMES:
        path = HERE / name
        if not path.exists():
            continue
        raw = path.read_bytes()
        mime = LOGO_TYPES[path.suffix.lower()]
        uri = "data:" + mime + ";base64," + base64.b64encode(raw).decode("ascii")
        size_kb = len(raw) / 1024
        note = "logo: " + name + " inlined (" + format(size_kb, ".0f") + " KB)"
        if size_kb > 1500:
            note += " — that is large for a masthead; a smaller export would help"
        return uri, note
    return None, ("logo: none found. Save the mark as dashboard/logo.png "
                  "(or .svg/.jpg/.webp) and re-run to drop it into the masthead.")


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
    defaults = {"sell_through_rate": 0.20, "average_cost_of_goods": None,
                "average_item_value": None,
                "monthly_profit_target": 500, "break_even_target": 3300,
                "break_even_days": 90, "rate_unit": "day",
                "pace_window_days": 0, "currency": "£"}
    defaults.update(settings)
    return defaults


def build_setting(name, default):
    """Build-time only settings — not passed to the page, so no slider for them."""
    if SETTINGS.exists():
        raw = json.loads(SETTINGS.read_text(encoding="utf-8"))
        if name in raw:
            return raw[name]
    return default


def batch_files():
    """crosslist/items.csv first, then any per-batch folders, in path order."""
    found = []
    main = ROOT / "crosslist" / "items.csv"
    if main.exists():
        found.append(main)
    found.extend(sorted((ROOT / "crosslist" / "batches").glob("*/items.csv")))
    return found


# ── the store export ─────────────────────────────────────────────────────────
# A whole-store listings export: every listing, when it was created, when it was
# last listed, and a sold date where one exists. It is found by its columns
# rather than by its filename, so it can be dropped in under any name.
#
# Its prices are deliberately never read. Owner's instruction: the listing price
# is not the sold price, so no pricing statistic on the dashboard comes from
# this file. Value is always the average item value from crosslist/items.csv.

PIPELINE_CSVS = {"items.csv", "listings.csv", "mapping.csv", "cost-rates.csv",
                 "batch-log.csv", "inventory.csv"}

COLUMN_ALIASES = {
    "created":     ("date created", "created", "created at", "created date",
                    "date listed", "first listed", "listed date", "date added"),
    "last_listed": ("last listed", "last listed at", "last listed date",
                    "relisted", "date last listed"),
    "sold":        ("sold date", "date sold", "sold at", "sold on", "sold"),
    "title":       ("title", "name", "product name", "item"),
    "cost":        ("cost of goods", "costofgoods", "cost", "cogs", "cost price"),
    "sku":         ("sku", "sku code", "stock code"),
}


def norm(text):
    return re.sub(r"[^a-z0-9]", "", (text or "").lower())


def norm_title(text):
    """Titles are compared on their words, so spacing and case cannot split them."""
    return re.sub(r"\s+", " ", (text or "").strip().lower())


def pick_column(fieldnames, key):
    """Match a column by any of its known spellings, ignoring case and spacing."""
    wanted = [norm(a) for a in COLUMN_ALIASES[key]]
    available = {norm(f): f for f in fieldnames if f}
    for want in wanted:                       # exact match on the normalised name
        if want in available:
            return available[want]
    for want in wanted:                       # then a contained match
        for got_norm, got in available.items():
            if want and want in got_norm:
                return got
    return None


def find_store_export():
    """crosslist/store-export.csv by name, else any CSV carrying a Last Listed."""
    named = [ROOT / "crosslist" / "store-export.csv", ROOT / "store-export.csv"]
    for path in named:
        if path.exists():
            return path
    candidates = sorted((ROOT / "crosslist").glob("*.csv")) + sorted(ROOT.glob("*.csv"))
    for path in candidates:
        if path.name in PIPELINE_CSVS:
            continue
        try:
            with path.open(newline="", encoding="utf-8-sig") as fh:
                header = next(csv.reader(fh), [])
        except (OSError, UnicodeDecodeError):
            continue
        if pick_column(header, "last_listed"):
            return path
    return None


def stamp(value):
    """A sortable 'YYYY-MM-DDTHH:MM:SS'. Missing time counts as the start of day.

    Used to compare a listing against the live-from cutoff, which carries a time
    of day, so two listings on the cutoff date itself still land either side of it.
    """
    day = date_only(value)
    if day is None:
        return None
    time = re.search(r"(\d{1,2}):(\d{2})(?::(\d{2}))?", (value or "")[len(day):] or "")
    if not time:
        return day + "T00:00:00"
    hour, minute, second = time.groups()
    return day + "T" + hour.zfill(2) + ":" + minute + ":" + (second or "00")


def date_only(value):
    """'2026-06-22 19:38:03' → '2026-06-22'. Returns None rather than guessing."""
    text = (value or "").strip()
    if not text:
        return None
    iso = re.match(r"^(\d{4})-(\d{2})-(\d{2})", text)
    if iso:
        return "-".join(iso.groups())
    uk = re.match(r"^(\d{1,2})[/.](\d{1,2})[/.](\d{4})", text)     # 22/06/2026
    if uk:
        day, month, year = uk.groups()
        return year + "-" + month.zfill(2) + "-" + day.zfill(2)
    return None


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
                            "title": row.get("title", ""), "sku": row.get("sku", ""),
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
    # Keyed on the normalised SKU: the export writes the same bundle a dozen ways
    # ("VWM - Women's Y2K Mix", "VWM Women’s Y2K Mix", "VWM Women's Y2K mix"), and
    # a raw-string key would miss a rate that is genuinely there.
    rates = {}
    for row in rate_rows:
        cost = price_of(row.get("cost", ""))
        sku = row.get("sku_pattern", "")
        if sku and cost is not None:
            rates[norm(sku)] = cost

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

    # ── the whole-store export: uploads for everything past the first batch,
    #    and the live / sold status that exists nowhere else ───────────────────
    skip_rows = build_setting("export_skip_rows", 15)
    live_from_raw = build_setting("live_from", "2026-06-22 19:38:03")
    live_from = stamp(live_from_raw) or "0000-01-01T00:00:00"
    live_from_day = date_only(live_from_raw)
    stock = {"live": 0, "sold": 0, "not_live": 0, "stale": 0, "live_by_created": 0,
             "rows": 0, "counted_uploads": 0, "skipped": 0,
             "matched_batch": 0, "matched_by": "position",
             "window_listings": 0, "window_sold": 0,
             "has_export": False, "path": None,
             "live_from": live_from_raw, "live_from_day": live_from_day}

    export_cost_rows = []
    export_path = find_store_export()
    if export_path is not None:
        export_rows, _ = read_csv(export_path)
        rel = str(export_path.relative_to(ROOT))
        stock.update({"has_export": True, "path": rel, "rows": len(export_rows),
                      "skipped": min(skip_rows, len(export_rows))})
        note_source(export_path, export_rows, True,
                    "whole-store export — live/sold status, and uploads past the first batch")

        fields = list(export_rows[0].keys()) if export_rows else []
        col_created = pick_column(fields, "created")
        col_listed = pick_column(fields, "last_listed")
        col_sold = pick_column(fields, "sold")
        col_title = pick_column(fields, "title")
        col_cost = pick_column(fields, "cost")
        col_sku = pick_column(fields, "sku")

        # Which export rows are the batch we have already counted from items.csv?
        # Matched on title, not on position: the export is sorted newest-first, so
        # a positional skip would silently start eating new listings the moment a
        # fresh batch lands above the old one.
        batch_titles = {norm_title(v["title"]) for v in uploads.values() if v.get("title")}
        already = set()
        if col_title and batch_titles:
            already = {i for i, r in enumerate(export_rows)
                       if norm_title(r.get(col_title, "")) in batch_titles}
        by_title = bool(already)
        stock["matched_batch"] = len(already)
        stock["matched_by"] = "title" if by_title else "position"

        # The export knows when each listing actually went up. Where that disagrees
        # with the ledger's Date Added, say so — the ledger records the day an item
        # was dictated, which is not always the day it was listed. Flagged, never
        # silently corrected: crosslist/batch-log.csv is where that decision belongs.
        if by_title and col_created and col_title:
            ledger_by_title = {norm_title(v["title"]): v["date"]
                               for v in uploads.values() if v.get("title")}
            disagreed = {}
            for i in already:
                row = export_rows[i]
                listed_day = date_only(row.get(col_created, ""))
                ledger_day = ledger_by_title.get(norm_title(row.get(col_title, "")))
                if listed_day and ledger_day and listed_day != ledger_day:
                    disagreed[(ledger_day, listed_day)] = disagreed.get(
                        (ledger_day, listed_day), 0) + 1
            for (ledger_day, listed_day), count in sorted(disagreed.items()):
                flags.append(str(count) + " first-batch item(s) sit on " + ledger_day +
                             " in the calendar, from inventory.csv, but " + rel +
                             " has them created on " + listed_day + ". The calendar "
                             "keeps the ledger date. To move them, add a row to "
                             "crosslist/batch-log.csv with date_uploaded " + listed_day + ".")
        if not by_title:
            flags.append("No row in " + rel + " matches a title from the batch CSVs, so "
                         "the first " + str(skip_rows) + " rows are skipped by position "
                         "instead. Check that is still the right number of rows.")

        for key, col in (("date created", col_created), ("last listed", col_listed),
                         ("sold date", col_sold)):
            if col is None:
                flags.append("No '" + key + "' column found in " + rel +
                             ". Columns read: " + ", ".join(f for f in fields if f) + ".")

        undated_export = 0
        for index, row in enumerate(export_rows):
            # Status is read from every row, including the first 15 — this file is
            # the only place live/sold is recorded. Only the *uploads* are skipped,
            # so the first batch is not counted twice.
            sold_on = date_only(row.get(col_sold, "")) if col_sold else None
            listed_at = stamp(row.get(col_listed, "")) if col_listed else None
            created_at = stamp(row.get(col_created, "")) if col_created else None

            # Live means three things at once: it was listed, it has not sold, and
            # that listing is from the cutoff onwards. Anything last listed before
            # the cutoff is stale, not on the shop floor.
            if sold_on:
                stock["sold"] += 1
            elif listed_at and listed_at >= live_from:
                stock["live"] += 1
            else:
                stock["not_live"] += 1
                if listed_at and listed_at < live_from:
                    stock["stale"] += 1

            # The same count measured against the created date instead, purely so
            # the build can say whether the choice of column changes the answer.
            if not sold_on and listed_at and created_at and created_at >= live_from:
                stock["live_by_created"] += 1

            # Observed sell-through: of the listings created since the cutoff, how
            # many have sold. A count ratio, never a price — so it stays inside the
            # "no pricing statistics from this file" rule. Windowed to the cutoff,
            # because no average may reach back past it.
            if created_at and created_at >= live_from:
                stock["window_listings"] += 1
                if sold_on:
                    stock["window_sold"] += 1

            if (index in already) if by_title else (index < skip_rows):
                continue

            # Cost material for the profit calculation. Gathered here so the first
            # batch is not counted twice — it contributes its own costed rows from
            # items.csv. Windowed to the cutoff like every other average.
            if created_at and created_at >= live_from:
                export_cost_rows.append((row.get(col_cost, "") if col_cost else "",
                                         row.get(col_sku, "") if col_sku else ""))

            when = date_only(row.get(col_created, "")) if col_created else None
            if when is None:
                undated_export += 1
                continue
            bucket = days.setdefault(when, {"uploads": 0, "value": 0.0})
            bucket["uploads"] += 1
            stock["counted_uploads"] += 1

        if undated_export:
            flags.append(str(undated_export) + " row(s) in " + rel + " have no readable "
                         "created date, so they are not on the calendar. Everything else "
                         "from that file is.")
        if stock["rows"] <= skip_rows:
            flags.append(rel + " has " + str(stock["rows"]) + " rows, which is not more "
                         "than the " + str(skip_rows) + " first-batch rows being skipped. "
                         "No new uploads were taken from it.")
    else:
        # No export yet: the first batch is all there is, and it is all live.
        stock["live"] = len(uploads)

    # ── derived figures ──────────────────────────────────────────────────────
    # ── cost of goods: what profit is actually worked out from ───────────────
    # Resolved per item, cheapest source of truth first: the cost recorded against
    # the item, then the bundle rate for its SKU. The store export contributes only
    # its cost column and SKU — never a listing price.
    def resolve_cost(explicit, sku):
        # `explicit` arrives already parsed from items.csv, and as raw text from the
        # export, so accept either rather than assuming one.
        direct = explicit if isinstance(explicit, (int, float)) else price_of(explicit)
        if direct:
            return float(direct)
        return rates.get(norm(sku))

    cost_values, cost_sources = [], {"items.csv": 0, "store export": 0}
    for item in uploads.values():
        if item["date"] is None or item["date"] < live_from_day:
            continue
        found = resolve_cost(item.get("cost"), item.get("sku", ""))
        if found:
            cost_values.append(found)
            cost_sources["items.csv"] += 1
    for explicit, sku in export_cost_rows:
        found = resolve_cost(explicit, sku)
        if found:
            cost_values.append(found)
            cost_sources["store export"] += 1

    avg_cost_of_goods = round(sum(cost_values) / len(cost_values), 4) if cost_values else 0.0

    # Owner's instruction: no average is built from anything before the cutoff.
    def in_window(item):
        return item["date"] is not None and item["date"] >= live_from_day

    priced = {n: v for n, v in uploads.items() if v["price"] is not None}
    before_cutoff = sorted(n for n, v in priced.items() if not in_window(v))
    if before_cutoff:
        flags.append(str(len(before_cutoff)) + " priced item(s) are dated before " +
                     live_from_day + " and are left out of the average item value, "
                     "per the live-from rule: " +
                     ", ".join(str(n) for n in before_cutoff[:12]) +
                     ("…" if len(before_cutoff) > 12 else "") + ".")
    priced = {n: v for n, v in priced.items() if in_window(v)}

    prices = [v["price"] for v in priced.values()]
    avg_price = round(sum(prices) / len(prices), 2) if prices else 0.0

    costed = [(v["price"], v["cost"] if v["cost"] is not None else rates.get(norm(v["sku"])))
              for v in priced.values()]
    costed = [(p, c) for p, c in costed if c is not None and c > 0]

    if costed:
        avg_costed_price = sum(p for p, _ in costed) / len(costed)
        avg_cost = sum(c for _, c in costed) / len(costed)
        implied_markup = (avg_costed_price - avg_cost) / avg_cost
        implied_share = (avg_costed_price - avg_cost) / avg_costed_price
    else:
        avg_costed_price = avg_cost = implied_markup = implied_share = 0.0

    logo_uri, logo_note = find_logo()

    now = datetime.now(timezone.utc)
    payload = {
        "logo": logo_uri,
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
            "observed_sell_through": (
                round(stock["window_sold"] / stock["window_listings"], 4)
                if stock["window_listings"] else None),
            "observed_sold": stock["window_sold"],
            "observed_listings": stock["window_listings"],
            "csv_average_cost_of_goods": avg_cost_of_goods,
            "costed_items": len(cost_values),
            "cost_sources": cost_sources,
        },
        "stock": stock,
        "live_from_day": live_from_day,
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
    if cost_values:
        print("  cost of goods: £" + format(avg_cost_of_goods, ".2f") + " average across "
              + str(len(cost_values)) + " costed items ("
              + ", ".join(k + " " + str(v) for k, v in cost_sources.items() if v) + ")")
        if avg_price:
            print("    → profit £" + format(avg_price - avg_cost_of_goods, ".2f")
                  + " per item sold, a "
                  + format((avg_price - avg_cost_of_goods) / avg_price * 100, ".1f")
                  + "% share of the sale price")
    else:
        flags.append("No cost of goods could be resolved for any item, so profit cannot "
                     "be worked out from cost. Add rates to crosslist/cost-rates.csv, or "
                     "set average_cost_of_goods in settings.json.")
    if costed:
        print("  markup implied by your cost data: "
              + format(implied_markup * 100, ".1f") + "% "
              + "(a " + format(implied_share * 100, ".1f") + "% profit share)")
    if stock["has_export"]:
        print("  store export " + stock["path"] + ": " + str(stock["rows"]) + " rows — "
              + str(stock["live"]) + " live, " + str(stock["sold"]) + " sold, "
              + str(stock["not_live"]) + " not live; " + str(stock["counted_uploads"])
              + " counted as uploads (first " + str(stock["skipped"]) + " skipped)")
        print("  first batch identified by " + stock["matched_by"] + ": "
              + str(stock["matched_batch"] if stock["matched_by"] == "title" else stock["skipped"])
              + " row(s) already counted from items.csv, not re-counted as uploads")
        if stock["window_listings"]:
            print("  observed sell-through since the cutoff: " + str(stock["window_sold"])
                  + "/" + str(stock["window_listings"]) + " = "
                  + format(stock["window_sold"] / stock["window_listings"] * 100, ".1f")
                  + "% (a floor — the newest listings have not had time to sell)")
        print("  live from " + str(live_from_raw) + " — " + str(stock["stale"])
              + " listing(s) last listed before that are counted as not live")
        if stock["live_by_created"] != stock["live"]:
            print("  note: measured on the created date instead of Last Listed, live "
                  "would be " + str(stock["live_by_created"]) + " rather than "
                  + str(stock["live"]) + ". Say which you meant if that matters.")
    else:
        print("  store export: none found. Commit it as crosslist/store-export.csv "
              "(any name works if it has a 'Last Listed' column) to get live stock.")
    print("  " + logo_note)
    for flag in flags:
        print("  ! " + flag)

    try:
        subprocess.run(["open", str(OUT)], capture_output=True)
    except FileNotFoundError:
        pass


if __name__ == "__main__":
    main()
