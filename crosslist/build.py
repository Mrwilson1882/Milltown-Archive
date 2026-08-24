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
import csv, datetime, shutil, subprocess, sys, zipfile
from pathlib import Path

def copy_photo(src, dest, max_px):
    """Copy a photo as JPEG, optionally downscaling its long edge to max_px.

    HEIC sources must be converted, not just renamed: the destination is always
    .jpg and Crosslist reads the bytes, not the extension.
    """
    heic = src.suffix.lower() in (".heic", ".heif")
    if not max_px and not heic:
        shutil.copy2(src, dest); return
    if shutil.which("sips"):        # built into macOS, no dependency
        cmd = ["sips", "-s", "format", "jpeg", "-s", "formatOptions", "80"]
        if max_px:
            cmd += ["-Z", str(max_px)]
        r = subprocess.run(cmd + [str(src), "--out", str(dest)], capture_output=True)
        if r.returncode == 0 and dest.exists():
            return
    try:                            # fallback, used off macOS
        from PIL import Image, ImageOps
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            if max_px:
                im.thumbnail((max_px, max_px))
            im.save(dest, "JPEG", quality=80, optimize=True)
        return
    except Exception:
        pass
    if heic:
        # Never copy HEIC bytes to a .jpg name - Crosslist reads the bytes.
        raise RuntimeError(f"cannot convert {src.name} to JPEG")
    shutil.copy2(src, dest)

COLUMNS = ["Id","Title","Description","Price","Original Price","Brand","Category id","Size id",
"Condition","Color","Secondary color","Images","Quantity","Shipping weight","Shipping weight unit",
"Shipping height","Shipping width","Shipping length","Domestic shipping price",
"Worldwide shipping price","Free domestic shipping","Free worldwide shipping","Tags","SKU",
"Who made","When made","Smart pricing","Smart pricing price","Accept offers","Is auction",
"Auction starting price","Cost of Goods","Internal note"]

args = [a for a in sys.argv[1:] if not a.startswith("--")]
inbox = Path(args[0] if args else "Batch 1")
itemfile = args[1] if len(args) > 1 else "items.csv"
mapfile  = args[2] if len(args) > 2 else "mapping.csv"
max_px = next((int(a.split("=")[1]) for a in sys.argv if a.startswith("--max-px=")), 0)
build = Path("build"); images = build / "images"
if build.exists():
    shutil.rmtree(build)          # cleared first: a failed run must not leave
    if build.exists():            # a previous day's zip looking like today's
        sys.exit("Could not clear build/. Close anything open in it and re-run.")

for f in (itemfile, mapfile):
    if not Path(f).exists():
        sys.exit(f"{f} is not in this folder. Put it here and try again.")

# Report what is about to be used, so the wrong batch is obvious before the work.
n_items = sum(1 for _ in csv.DictReader(open(itemfile)))
n_photos = sum(1 for r in csv.DictReader(open(mapfile)) if r["shot_type"] != "card")
print(f"{itemfile}: {n_items} items\n{mapfile}: {n_photos} listed photos\nphotos from: {inbox}\n")

stamp = datetime.date.today().isoformat()   # so batches never overwrite each other
images.mkdir(parents=True)

photos = {}
for r in csv.DictReader(open(mapfile)):
    if r["shot_type"] == "card":            # number cards never reach a buyer
        continue
    photos.setdefault(r["item_no"], []).append((int(r["photo_index"]), r["source_filename"]))

rows, missing, blocked, failed = [], [], [], []
for it in csv.DictReader(open(itemfile)):
    n = it["item_no"]
    names = []
    for idx, src in sorted(photos.get(n, [])):
        s = inbox / src
        if not s.exists():
            missing.append(src); continue
        # Zero-padded: Crosslist orders photos by filename as text, so an
        # unpadded 029_10.jpg sorts straight after 029_1.jpg and a tape-measure
        # shot lands in slot 2. Two digits covers the largest item seen (17).
        dest = f"{n}_{idx:02d}.jpg"
        try:
            copy_photo(s, images / dest, max_px)
        except Exception as e:
            failed.append(f"{src}: {e}"); continue
        names.append(dest)

    if not it["size_id"]:
        blocked.append(f"item {n}: {it['flags']}")

    row = dict.fromkeys(COLUMNS, "")
    row.update({"Title": it["title"], "Description": it["description"], "Price": it["price"],
                "Brand": it["brand"], "Category id": it["category_id"], "Size id": it["size_id"],
                "Condition": it["condition"], "Color": it["color"],
                "Secondary color": it["secondary_color"], "Images": "|".join(names),
                "Quantity": it["quantity"], "SKU": it["sku"]})
    # Any items.csv column named exactly like a Crosslist column passes straight
    # through, so adding a field later means editing items.csv, not this script.
    for col in COLUMNS:
        if col in it and it[col] != "":
            row[col] = it[col]
    rows.append([row[c] for c in COLUMNS])

with open(build / f"{stamp}-listings.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(COLUMNS); w.writerows(rows)

with zipfile.ZipFile(build / f"{stamp}-images.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for p in sorted(images.iterdir()):
        z.write(p, p.name)

total = sum(1 for _ in images.iterdir())
print(f"\nbuild/{stamp}-listings.csv   {len(rows)} items")
print(f"build/images/        {total} photos")
size_mb = (build / f"{stamp}-images.zip").stat().st_size / 1_000_000
print(f"build/{stamp}-images.zip     {size_mb:.0f} MB" + (f"  (resized to {max_px}px)" if max_px else ""))
if not max_px and size_mb > 100:
    print("  Large. If Crosslist baulks, re-run with --max-px=1600")
if missing:
    print(f"\nMISSING from {inbox}: {len(missing)} photos - {', '.join(missing[:5])}")
if failed:
    print(f"\nCOULD NOT CONVERT {len(failed)} photos - these are left out of the listing:")
    for f in failed[:5]:
        print(f"  {f}")
if blocked:
    print("\nUploads with no Size id - Crosslist may reject these rows:")
    for b in blocked:
        print(f"  {b}")
# Prove the zip matches the CSV rather than assuming it. A stale or partial zip
# is otherwise invisible until Crosslist rejects the rows.
cited = set()
for r in rows:
    v = r[COLUMNS.index("Images")]
    if v:
        cited.update(v.split("|"))
zipped = set(zipfile.ZipFile(build / f"{stamp}-images.zip").namelist())
on_disk = {p.name for p in images.iterdir()}
problems = []
if zipped != cited:
    problems.append(f"zip has {len(zipped)} files, CSV cites {len(cited)}")
    for n in sorted(cited - zipped)[:5]: problems.append(f"  cited but not zipped: {n}")
    for n in sorted(zipped - cited)[:5]: problems.append(f"  zipped but not cited: {n}")
if on_disk != zipped:
    problems.append(f"build/images has {len(on_disk)} files, zip has {len(zipped)}")
if problems:
    print("\n*** DO NOT UPLOAD - the zip does not match the CSV ***")
    for pr in problems:
        print(f"  {pr}")
    sys.exit(1)

print(f"\nVerified: {len(zipped)} photos, zip and CSV match exactly.")
print(f"Upload the two {stamp}-* files in build/ to Crosslist together.")
try:
    subprocess.run(["open", str(build)], capture_output=True)
except FileNotFoundError:
    pass
