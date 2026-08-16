#!/usr/bin/env python3
"""Copy the photos Claude still needs to read into one folder, renamed so each
one says which item it belongs to.  Usage: python3 gather.py "Batch 1" """
import csv, shutil, subprocess, sys
from pathlib import Path

inbox = Path(sys.argv[1] if len(sys.argv) > 1 else "Batch 1")
out = Path("to-send"); out.mkdir(exist_ok=True)

# Neck / care label shots, one per item — these carry brand and size.
LABELS = {1:"IMG_0006", 2:"IMG_0011", 3:"IMG_0027", 4:"IMG_0033", 5:"IMG_0047",
          6:"IMG_0053", 7:"IMG_0064", 8:"IMG_0074", 9:"IMG_0089", 10:"IMG_0098",
          11:"IMG_0112", 12:"IMG_0114", 13:"IMG_0128", 14:"IMG_0135", 15:"IMG_0147"}

rows = list(csv.DictReader(open("mapping.csv")))
n = 0
for item in sorted({int(r["item_no"]) for r in rows}):
    meas = [r["source_filename"] for r in rows
            if int(r["item_no"]) == item and r["shot_type"] == "measure"]
    for i, fn in enumerate(sorted(meas), 1):
        src = inbox / fn
        if src.exists():
            shutil.copy2(src, out / f"item{item:02d}-measure{i}.JPG"); n += 1
    lab = inbox / f"{LABELS[item]}-Photoroom.JPG"
    if lab.exists():
        shutil.copy2(lab, out / f"item{item:02d}-label.JPG"); n += 1

print(f"Copied {n} photos into {out}/ — drag them into the chat in batches.")
try:
    subprocess.run(["open", str(out)], capture_output=True)
except FileNotFoundError:
    pass
