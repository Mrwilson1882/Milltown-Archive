#!/usr/bin/env python3
"""Render a mapping as a page of pictures.

    python3 review.py "Batch 3"                  reads mapping.csv
    python3 review.py "Batch 3" mapping-b3.csv   reads a named mapping

Batch-agnostic: item labels come from the mapping itself, so it can never show
the wrong batch's names. Prints the item count first - check it before looking.
"""
import csv, html, subprocess, sys
from pathlib import Path

inbox = sys.argv[1] if len(sys.argv) > 1 else "Batch 1"
mapfile = sys.argv[2] if len(sys.argv) > 2 else "mapping.csv"
if not Path(mapfile).exists():
    sys.exit(f"{mapfile} is not in this folder.")

items = {}
for r in csv.DictReader(open(mapfile)):
    items.setdefault(int(r["item_no"]), []).append(r)
listed = sum(1 for v in items.values() for p in v if p["shot_type"] != "card")
print(f"{mapfile}: {len(items)} items, {listed} listed photos, "
      f"{sum(len(v) for v in items.values())} files")

css = """body{font:15px/1.5 -apple-system,sans-serif;margin:24px;background:#fff;color:#111}
section{border-top:2px solid #e3e3e3;padding:18px 0}h2{font-size:17px;margin:0 0 12px}
.row{display:flex;flex-wrap:wrap;gap:14px}figure{margin:0;width:170px}
img{width:170px;height:170px;object-fit:contain;background:#f4f4f5;border:1px solid #ddd;border-radius:6px}
figcaption{font-size:12px;color:#666;margin-top:4px;word-break:break-all}
.flag img{border:2px solid #b45309}.flag b{color:#b45309}.card img{opacity:.4}
@media(prefers-color-scheme:dark){body{background:#16181c;color:#eee}img{background:#0e0f12;border-color:#333}
section{border-color:#2c2f36}figcaption{color:#9aa0a6}}"""

h = [f"<!doctype html><meta charset=utf-8><title>Photo order check</title><style>{css}</style>",
     f"<h1>Photo order check</h1><p>{mapfile} &middot; {len(items)} items &middot; "
     f"{listed} listed photos. Faded = number card, not used.</p>"]
for n in sorted(items):
    pics = items[n]
    shown = [p for p in pics if p["shot_type"] != "card"]
    h.append(f"<section><h2>Item {n} &mdash; {len(shown)} photos</h2><div class=row>")
    for p in pics:
        card = p["shot_type"] == "card"
        cls = "card" if card else ("flag" if p["notes"] else "")
        pos = "not used" if card else p["photo_index"]
        h.append(f"<figure class='{cls}'><img src='{html.escape(inbox)}/{html.escape(p['source_filename'])}' loading=lazy>"
                 f"<figcaption><b>{pos} &middot; {p['shot_type']}</b><br>{html.escape(p['source_filename'])}</figcaption></figure>")
    h.append("</div></section>")
Path("review.html").write_text("\n".join(h), encoding="utf-8")
print("Built review.html")
try:
    subprocess.run(["open", "review.html"], capture_output=True)
except FileNotFoundError:
    pass
