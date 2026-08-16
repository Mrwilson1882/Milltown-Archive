#!/usr/bin/env python3
"""Copy the label and care-tag shots out of a batch so composition can be read
at full resolution.  Usage: python3 gather.py "Batch 1" """
import shutil, subprocess, sys
from pathlib import Path

inbox = Path(sys.argv[1] if len(sys.argv) > 1 else "Batch 1")
out = Path("to-send"); out.mkdir(exist_ok=True)

# Label and care-tag candidates spotted in the contact sheets, per item.
TAGS = {1:["IMG_0006"], 2:["IMG_0011"], 3:["IMG_0027"], 4:["IMG_0033"], 5:["IMG_0047"],
        6:["IMG_0053"], 7:["IMG_0064"], 8:["IMG_0074"], 9:["IMG_0079","IMG_0089"],
        10:["IMG_0098"], 11:["IMG_0112"], 12:["IMG_0114"], 13:["IMG_0128"],
        14:["IMG_0135"], 15:["IMG_0147"]}

n = 0
for item, stems in sorted(TAGS.items()):
    for j, stem in enumerate(stems, 1):
        src = inbox / f"{stem}-Photoroom.JPG"
        if src.exists():
            suffix = "" if len(stems) == 1 else f"-{j}"
            shutil.copy2(src, out / f"item{item:02d}-tag{suffix}.JPG"); n += 1

print(f"Copied {n} tag photos into {out}/ - send these to Claude.")
try:
    subprocess.run(["open", str(out)], capture_output=True)
except FileNotFoundError:
    pass
