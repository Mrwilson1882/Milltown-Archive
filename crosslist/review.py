#!/usr/bin/env python3
"""
Visual check of mapping.csv: builds a web page showing every item's photos in
the exact order they would appear in the listing.

    python3 review.py "Batch 1"

Writes review.html next to mapping.csv and opens it. Scroll through, and if
anything is wrong just say so in plain English — "item 7, photo 5 is a defect
shot" — no spreadsheet editing needed.

No installation required; standard library only.
"""

import argparse, csv, html, subprocess, sys
from pathlib import Path

# From inventory.csv, so each item can be recognised at a glance.
ITEMS = {
    1: "Skinny Minnie — floral tunic",
    2: "Ralph Lauren Polo — navy with pinstripes, XXL",
    3: "Ralph Lauren Polo — tartan check, Small Men's",
    4: "Ralph Lauren Women's Polo — black, Large Women's",
    5: "Women's Bralette — red, 36",
    6: "Women's Bralette — black, Small",
    7: "Ralph Lauren Women's Polo — navy, Medium (10-12)",
    8: "Nike Track Jacket — green, Large (oversized fit)",
    9: "Harley Davidson Women's Cardigan — white, Medium",
    10: "Ralph Lauren Women's Polo — navy, XL Women's",
    11: "Nike Track Jacket — black and navy, XL",
    12: "Ralph Lauren Polo — green with orange pony, XXL Men's",
    13: "Lacoste Polo — light green, UK Small",
    14: "Lacoste Polo — dark green, UK Large",
    15: "Ralph Lauren Polo — turquoise, Large",
}

CSS = """
:root { --bg:#fff; --fg:#111; --muted:#666; --line:#e3e3e3; --flag:#b45309; --flagbg:#fef6e7; }
@media (prefers-color-scheme: dark) {
  :root { --bg:#16181c; --fg:#eee; --muted:#9aa0a6; --line:#2c2f36; --flag:#fbbf24; --flagbg:#2a2313; }
}
* { box-sizing: border-box; }
body { background:var(--bg); color:var(--fg); margin:0; padding:24px;
       font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
h1 { font-size:22px; margin:0 0 4px; }
.sub { color:var(--muted); margin:0 0 28px; }
section { border-top:2px solid var(--line); padding:20px 0 8px; }
h2 { font-size:17px; margin:0 0 2px; }
h2 .n { display:inline-block; min-width:2.2em; color:var(--muted); }
.desc { color:var(--muted); margin:0 0 14px; font-size:14px; }
.row { display:flex; flex-wrap:wrap; gap:14px; }
figure { margin:0; width:170px; }
img { width:170px; height:170px; object-fit:contain; background:#f4f4f5;
      border:1px solid var(--line); border-radius:6px; display:block; }
@media (prefers-color-scheme: dark) { img { background:#0e0f12; } }
figcaption { font-size:12px; color:var(--muted); margin-top:5px; word-break:break-all; }
figcaption b { color:var(--fg); }
.flag figcaption b { color:var(--flag); }
.flag img { border-color:var(--flag); border-width:2px; }
.excluded img { opacity:.45; }
.note { background:var(--flagbg); color:var(--flag); border-radius:6px;
        padding:8px 12px; margin:0 0 14px; font-size:13px; }
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inbox", type=Path, help="folder holding the photos")
    ap.add_argument("-m", "--mapping", type=Path, default=Path("mapping.csv"))
    ap.add_argument("-o", "--out", type=Path, default=Path("review.html"))
    args = ap.parse_args()

    if not args.mapping.exists():
        sys.exit(f"Can't find {args.mapping} — put it in this folder first.")

    rows = list(csv.DictReader(args.mapping.open()))
    items = {}
    for r in rows:
        items.setdefault(int(r["item_no"]), []).append(r)

    n_flag = sum(1 for r in rows if r["notes"] and r["shot_type"] != "card")
    out = [f"<!doctype html><meta charset=utf-8><title>Photo order check</title>",
           f"<style>{CSS}</style>",
           "<h1>Photo order check</h1>",
           f"<p class=sub>{len(rows)} photos across {len(items)} items, shown in listing order. "
           f"Orange = needs your eye ({n_flag}). Faded = number card, excluded from the listing.</p>"]

    for num in sorted(items):
        photos = items[num]
        out.append("<section>")
        out.append(f"<h2><span class=n>{num}.</span>{html.escape(ITEMS.get(num,''))}</h2>")
        listed = [p for p in photos if p["shot_type"] != "card"]
        out.append(f"<p class=desc>{len(listed)} photos in the listing</p>")

        amb = {p["notes"] for p in photos if p["notes"].startswith("AMBIGUOUS")}
        for a in amb:
            out.append(f"<p class=note>{html.escape(a)}</p>")

        out.append("<div class=row>")
        for p in photos:
            src = html.escape(str(args.inbox / p["source_filename"]))
            card = p["shot_type"] == "card"
            flag = bool(p["notes"]) and not card
            cls = " ".join(c for c in ("flag" if flag else "",
                                       "excluded" if card else "") if c)
            pos = "excluded" if card else f"{p['photo_index']}"
            out.append(
                f"<figure class='{cls}'><img src='{src}' loading=lazy>"
                f"<figcaption><b>{pos} &middot; {p['shot_type']}</b><br>"
                f"{html.escape(p['source_filename'])}</figcaption></figure>"
            )
        out.append("</div></section>")

    args.out.write_text("\n".join(out), encoding="utf-8")
    print(f"Wrote {args.out} — {len(rows)} photos, {len(items)} items, {n_flag} flagged")
    try:                        # macOS only; harmless everywhere else
        subprocess.run(["open", str(args.out)], capture_output=True)
    except FileNotFoundError:
        print(f"Open it manually: {args.out.resolve()}")


if __name__ == "__main__":
    main()
