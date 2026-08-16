#!/usr/bin/env python3
"""Render mapping.csv as a page of pictures.  Usage: python3 review.py "Batch 1" """
import csv, html, subprocess, sys
from pathlib import Path

inbox = sys.argv[1] if len(sys.argv) > 1 else "Batch 1"
if not Path("mapping.csv").exists():
    sys.exit("mapping.csv is not in this folder. Put it next to this script and try again.")

NAMES = {1:"Skinny Minnie floral tunic", 2:"RL Polo, navy pinstripe, XXL",
 3:"RL Polo, tartan check, S Men's", 4:"RL Women's Polo, black, L", 5:"Bralette, red, 36",
 6:"Bralette, black, S", 7:"RL Women's Polo, navy, M (10-12)", 8:"Nike Track Jacket, green, L",
 9:"Harley Davidson Cardigan, white, M", 10:"RL Women's Polo, navy, XL", 11:"Nike Track Jacket, black/navy, XL",
 12:"RL Polo, green/orange pony, XXL Men's", 13:"Lacoste Polo, light green, UK S",
 14:"Lacoste Polo, dark green, UK L", 15:"RL Polo, turquoise, L"}

items = {}
for r in csv.DictReader(open("mapping.csv")):
    items.setdefault(int(r["item_no"]), []).append(r)

css = """body{font:15px/1.5 -apple-system,sans-serif;margin:24px;background:#fff;color:#111}
section{border-top:2px solid #e3e3e3;padding:18px 0}h2{font-size:17px;margin:0 0 12px}
.row{display:flex;flex-wrap:wrap;gap:14px}figure{margin:0;width:170px}
img{width:170px;height:170px;object-fit:contain;background:#f4f4f5;border:1px solid #ddd;border-radius:6px}
figcaption{font-size:12px;color:#666;margin-top:4px;word-break:break-all}
.flag img{border:2px solid #b45309}.flag b{color:#b45309}.card img{opacity:.4}
.note{background:#fef6e7;color:#b45309;padding:8px 12px;border-radius:6px;font-size:13px}
@media(prefers-color-scheme:dark){body{background:#16181c;color:#eee}img{background:#0e0f12;border-color:#333}
section{border-color:#2c2f36}figcaption{color:#9aa0a6}}"""

h = [f"<!doctype html><meta charset=utf-8><title>Photo order check</title><style>{css}</style>",
     "<h1>Photo order check</h1><p>Orange = please check. Faded = number card, not used.</p>"]
for n in sorted(items):
    h.append(f"<section><h2>{n}. {html.escape(NAMES.get(n,''))}</h2>")
    for note in {p["notes"] for p in items[n] if p["notes"].startswith("AMBIG")}:
        h.append(f"<p class=note>{html.escape(note)}</p>")
    h.append("<div class=row>")
    for p in items[n]:
        card = p["shot_type"] == "card"
        cls = "card" if card else ("flag" if p["notes"] else "")
        pos = "not used" if card else p["photo_index"]
        h.append(f"<figure class='{cls}'><img src='{html.escape(inbox)}/{html.escape(p['source_filename'])}' loading=lazy>"
                 f"<figcaption><b>{pos} &middot; {p['shot_type']}</b><br>{html.escape(p['source_filename'])}</figcaption></figure>")
    h.append("</div></section>")

Path("review.html").write_text("\n".join(h), encoding="utf-8")
print(f"Built review.html - {sum(len(v) for v in items.values())} photos, {len(items)} items")
try:
    subprocess.run(["open", "review.html"], capture_output=True)
except FileNotFoundError:
    pass
