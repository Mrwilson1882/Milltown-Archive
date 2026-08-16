#!/usr/bin/env python3
"""
Final stage: turn items.csv + mapping.csv into a Crosslist upload.

    python3 build.py "Batch 1"

Produces build/ :
    listings.csv    one row per item, 33 columns in Template order
    images/         photos renamed 001_1.jpg, 001_2.jpg ...
    images.zip      the same photos, zipped for upload

The Images column and the zip are generated from one list, so the filenames
cannot disagree. Source photos are only ever read. Standard library only.
"""
import csv, shutil, subprocess, sys, zipfile
from pathlib import Path

COLUMNS = ["Id","Title","Description","Price","Original Price","Brand","Category id","Size id",
"Condition","Color","Secondary color","Images","Quantity","Shipping weight","Shipping weight unit",
"Shipping height","Shipping width","Shipping length","Domestic shipping price",
"Worldwide shipping price","Free domestic shipping","Free worldwide shipping","Tags","SKU",
"Who made","When made","Smart pricing","Smart pricing price","Accept offers","Is auction",
"Auction starting price","Cost of Goods","Internal note"]

inbox = Path(sys.argv[1] if len(sys.argv) > 1 else "Batch 1")
for f in ("items.csv", "mapping.csv"):
    if not Path(f).exists():
        sys.exit(f"{f} is not in this folder. Put it here and try again.")

build = Path("build"); images = build / "images"
if build.exists():
    shutil.rmtree(build)          # disposable by design; rebuilt every run
images.mkdir(parents=True)

photos = {}
for r in csv.DictReader(open("mapping.csv")):
    if r["shot_type"] == "card":            # number cards never reach a buyer
        continue
    photos.setdefault(r["item_no"], []).append((int(r["photo_index"]), r["source_filename"]))

rows, missing, blocked = [], [], []
for it in csv.DictReader(open("items.csv")):
    n = it["item_no"]
    names = []
    for idx, src in sorted(photos.get(n, [])):
        s = inbox / src
        if not s.exists():
            missing.append(src); continue
        dest = f"{n}_{idx}.jpg"
        shutil.copy2(s, images / dest)
        names.append(dest)

    if not it["size_id"]:
        blocked.append(f"item {n}: {it['flags']}")

    row = dict.fromkeys(COLUMNS, "")
    row.update({"Title": it["title"], "Description": it["description"], "Price": it["price"],
                "Brand": it["brand"], "Category id": it["category_id"], "Size id": it["size_id"],
                "Condition": it["condition"], "Color": it["color"],
                "Secondary color": it["secondary_color"], "Images": "|".join(names),
                "Quantity": it["quantity"], "SKU": it["sku"]})
    rows.append([row[c] for c in COLUMNS])

with open(build / "listings.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(COLUMNS); w.writerows(rows)

with zipfile.ZipFile(build / "images.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for p in sorted(images.iterdir()):
        z.write(p, p.name)

total = sum(1 for _ in images.iterdir())
print(f"\nbuild/listings.csv   {len(rows)} items")
print(f"build/images/        {total} photos")
print(f"build/images.zip     {(build / 'images.zip').stat().st_size // 1_000_000} MB")
if missing:
    print(f"\nMISSING from {inbox}: {len(missing)} photos - {', '.join(missing[:5])}")
if blocked:
    print("\nUploads with no Size id - Crosslist may reject these rows:")
    for b in blocked:
        print(f"  {b}")
print("\nUpload listings.csv and images.zip to Crosslist together.")
try:
    subprocess.run(["open", str(build)], capture_output=True)
except FileNotFoundError:
    pass
