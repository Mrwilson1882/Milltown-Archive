#!/usr/bin/env python3
"""
Stage 1 of the Crosslist export: build contact sheets from a batch of photos.

Runs on the Mac where the photos live. Produces a handful of labelled contact
sheets small enough to send to Claude, who reads the number cards, assigns a
shot_type to each photo, and returns mapping.csv. Nothing is renamed, moved or
modified here — the source folder is only ever read.

    python3 prepare.py "/Users/tobywilson94/Downloads/Batch 1"

Output lands in ./prepared/ :
    manifest.csv      every photo, with its index and capture time
    sheet_01.jpg ...  contact sheets, 20 photos each, tiles labelled by index

Needs Pillow:  pip3 install pillow
HEIC files are converted via macOS's built-in `sips`, so no extra dependency.
"""

import argparse, csv, shutil, subprocess, sys, tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".tif", ".tiff", ".webp"}
COLS, ROWS = 5, 4          # 20 tiles per sheet
TILE = 420                 # tile width in px; height follows the 4:3 label box
LABEL_H = 34
PAD = 8
BG = (250, 250, 250)
FG = (20, 20, 20)


def capture_time(path):
    """EXIF DateTimeOriginal if present, else file mtime. Used only for ordering."""
    try:
        with Image.open(path) as im:
            exif = im.getexif()
            for tag in (36867, 36868, 306):     # DateTimeOriginal, Digitized, DateTime
                if exif.get(tag):
                    return str(exif[tag])
    except Exception:
        pass
    return ""


def load(path, tmpdir):
    """Open an image, routing HEIC through sips since Pillow cannot read it."""
    if path.suffix.lower() in {".heic", ".heif"}:
        out = Path(tmpdir) / (path.stem + ".jpg")
        if not shutil.which("sips"):
            raise RuntimeError(
                f"{path.name} is HEIC and `sips` is unavailable. "
                "Run this on macOS, or convert the batch to JPEG first."
            )
        subprocess.run(
            ["sips", "-s", "format", "jpeg", str(path), "--out", str(out)],
            check=True, capture_output=True,
        )
        return Image.open(out)
    return Image.open(path)


def font(size):
    for name in ("/System/Library/Fonts/Supplemental/Arial.ttf",
                 "/System/Library/Fonts/Helvetica.ttc",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def build_sheet(entries, tmpdir, label_font):
    cell_w, cell_h = TILE, TILE + LABEL_H
    sheet = Image.new("RGB", (COLS * cell_w + PAD * (COLS + 1),
                              ROWS * cell_h + PAD * (ROWS + 1)), BG)
    draw = ImageDraw.Draw(sheet)

    for i, (idx, path) in enumerate(entries):
        col, row = i % COLS, i // COLS
        x = PAD + col * (cell_w + PAD)
        y = PAD + row * (cell_h + PAD)
        try:
            with load(path, tmpdir) as im:
                im = im.convert("RGB")
                # Respect the camera's rotation flag so portrait shots stay upright.
                try:
                    from PIL import ImageOps
                    im = ImageOps.exif_transpose(im)
                except Exception:
                    pass
                im.thumbnail((TILE, TILE), Image.LANCZOS)
                sheet.paste(im, (x + (TILE - im.width) // 2,
                                 y + (TILE - im.height) // 2))
        except Exception as e:
            draw.rectangle([x, y, x + TILE, y + TILE], outline=(200, 0, 0), width=2)
            draw.text((x + 10, y + 10), f"unreadable\n{e}", fill=(200, 0, 0), font=label_font)

        draw.text((x + 4, y + TILE + 8), f"#{idx:03d}  {path.name}",
                  fill=FG, font=label_font)
    return sheet


def main():
    ap = argparse.ArgumentParser(description="Build contact sheets for a photo batch.")
    ap.add_argument("inbox", type=Path, help="folder of raw photos (read-only)")
    ap.add_argument("-o", "--out", type=Path, default=Path("prepared"))
    args = ap.parse_args()

    if not args.inbox.is_dir():
        sys.exit(f"Not a folder: {args.inbox}")

    photos = sorted(p for p in args.inbox.iterdir()
                    if p.is_file() and p.suffix.lower() in EXTS)
    if not photos:
        sys.exit(f"No images found in {args.inbox}")

    # Order by capture time where EXIF gives it, so runs of photos stay together.
    # Falls back to filename, which is the same order for phone-camera exports.
    photos.sort(key=lambda p: (capture_time(p) or "", p.name))

    args.out.mkdir(parents=True, exist_ok=True)
    with open(args.out / "manifest.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["index", "filename", "capture_time"])
        for i, p in enumerate(photos, 1):
            w.writerow([f"{i:03d}", p.name, capture_time(p)])

    label_font = font(19)
    per_sheet = COLS * ROWS
    indexed = list(enumerate(photos, 1))
    sheets = 0
    with tempfile.TemporaryDirectory() as tmpdir:
        for s in range(0, len(indexed), per_sheet):
            sheets += 1
            sheet = build_sheet(indexed[s:s + per_sheet], tmpdir, label_font)
            dest = args.out / f"sheet_{sheets:02d}.jpg"
            sheet.save(dest, "JPEG", quality=72, optimize=True)
            print(f"  {dest}  ({dest.stat().st_size // 1024} KB)")

    print(f"\n{len(photos)} photos → {sheets} sheets in {args.out}/")
    print("Send the sheet_*.jpg files and manifest.csv to Claude.")


if __name__ == "__main__":
    main()
