#!/usr/bin/env python3
"""
Stage 1 of the Crosslist export: build a contact sheet PDF from a batch of photos.

Runs on the Mac where the photos live. Produces one PDF small enough to send to
Claude, who reads the number cards, assigns a shot_type to each photo, and
returns mapping.csv. Nothing in the source folder is renamed, moved or modified
— it is only ever read.

    python3 prepare.py "/Users/tobywilson94/Downloads/Batch 1"

Output lands in ./prepared/ :
    YYYY-MM-DD-contact-sheets.pdf 12 photos per page, captioned with index + filename
    YYYY-MM-DD-manifest.csv       every photo, with its index and capture time

No installation required. Thumbnails are made with `sips`, which is built into
macOS and reads HEIC natively, and the PDF is assembled with nothing but the
Python standard library. (Pillow is used instead of sips if sips is missing,
which is only the case off macOS.)
"""

import argparse, csv, datetime, os, shutil, struct, subprocess, sys, tempfile, zlib
from pathlib import Path

EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".tif", ".tiff", ".webp"}

THUMB_PX = 500          # long edge of each embedded thumbnail
COLS, ROWS = 3, 4       # 12 per page
PAGE_W, PAGE_H = 595, 842   # A4 in points
MARGIN, LABEL_H, GUTTER = 24, 16, 10


# ---------------------------------------------------------------- thumbnails

def make_thumb(src, dest):
    """Downscale one photo to a JPEG. sips on macOS, Pillow as a fallback."""
    if shutil.which("sips"):
        r = subprocess.run(
            ["sips", "-s", "format", "jpeg", "-s", "formatOptions", "55",
             "-Z", str(THUMB_PX), str(src), "--out", str(dest)],
            capture_output=True,
        )
        return r.returncode == 0 and dest.exists()
    try:
        from PIL import Image, ImageOps
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((THUMB_PX, THUMB_PX))
            im.save(dest, "JPEG", quality=55, optimize=True)
        return True
    except Exception:
        return False


def jpeg_size(path):
    """Width and height straight out of the JPEG's SOF marker."""
    with open(path, "rb") as f:
        if f.read(2) != b"\xff\xd8":
            return None
        while True:
            b = f.read(1)
            if not b:
                return None
            if b != b"\xff":
                continue
            while b == b"\xff":
                b = f.read(1)
            marker = b[0]
            if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
                continue
            length = struct.unpack(">H", f.read(2))[0]
            # SOF0-SOF15, excluding the non-frame markers DHT/JPG/DAC
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                          0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                f.read(1)
                h, w = struct.unpack(">HH", f.read(4))
                return w, h
            f.seek(length - 2, os.SEEK_CUR)


# ---------------------------------------------------------------------- PDF

def pdf_escape(s):
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def build_pdf(pages, dest):
    """
    pages: list of pages; each page is a list of (thumb_path, w, h, caption).
    Writes a minimal PDF embedding each JPEG directly via DCTDecode.
    """
    objects = []                # object N is stored at objects[N-1]
    def add(body):
        objects.append(body)
        return len(objects)

    font_id = add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica "
                  b"/Encoding /WinAnsiEncoding >>")

    cell_w = (PAGE_W - 2 * MARGIN - (COLS - 1) * GUTTER) / COLS
    cell_h = (PAGE_H - 2 * MARGIN - (ROWS - 1) * GUTTER) / ROWS
    img_h = cell_h - LABEL_H

    page_ids, page_objs = [], []
    for page in pages:
        content, xobjects = [], {}
        for i, (thumb, w, h, caption) in enumerate(page):
            col, row = i % COLS, i // COLS
            x = MARGIN + col * (cell_w + GUTTER)
            # PDF's origin is bottom-left, so rows count down from the top.
            y = PAGE_H - MARGIN - (row + 1) * cell_h - row * GUTTER

            scale = min(cell_w / w, img_h / h)
            dw, dh = w * scale, h * scale
            ix = x + (cell_w - dw) / 2
            iy = y + LABEL_H + (img_h - dh) / 2

            name = f"Im{i}"
            data = thumb.read_bytes()
            xid = add(
                b"<< /Type /XObject /Subtype /Image /Width " + str(w).encode() +
                b" /Height " + str(h).encode() +
                b" /ColorSpace /DeviceRGB /BitsPerComponent 8 "
                b"/Filter /DCTDecode /Length " + str(len(data)).encode() +
                b" >>\nstream\n" + data + b"\nendstream"
            )
            xobjects[name] = xid
            content.append(
                f"q {dw:.2f} 0 0 {dh:.2f} {ix:.2f} {iy:.2f} cm /{name} Do Q"
            )
            content.append(
                f"BT /F1 7 Tf {x:.2f} {y + 4:.2f} Td ({pdf_escape(caption)}) Tj ET"
            )

        stream = zlib.compress("\n".join(content).encode("latin-1", "replace"))
        cid = add(b"<< /Filter /FlateDecode /Length " + str(len(stream)).encode() +
                  b" >>\nstream\n" + stream + b"\nendstream")

        res = b"<< /Font << /F1 " + str(font_id).encode() + b" 0 R >> /XObject << " + \
              b" ".join(f"/{n} {i} 0 R".encode() for n, i in xobjects.items()) + b" >> >>"
        pid = add(b"")          # reserve; filled once the Pages id is known
        page_ids.append(pid)
        page_objs.append((pid, res, cid))

    pages_id = add(b"")
    for pid, res, cid in page_objs:
        objects[pid - 1] = (
            b"<< /Type /Page /Parent " + str(pages_id).encode() + b" 0 R "
            b"/MediaBox [0 0 " + str(PAGE_W).encode() + b" " + str(PAGE_H).encode() + b"] "
            b"/Resources " + res + b" /Contents " + str(cid).encode() + b" 0 R >>"
        )
    objects[pages_id - 1] = (
        b"<< /Type /Pages /Count " + str(len(page_ids)).encode() + b" /Kids [" +
        b" ".join(str(i).encode() + b" 0 R" for i in page_ids) + b"] >>"
    )
    root_id = add(b"<< /Type /Catalog /Pages " + str(pages_id).encode() + b" 0 R >>")

    out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0] * (len(objects) + 1)
    for num in range(1, len(objects) + 1):
        offsets[num] = len(out)
        out += str(num).encode() + b" 0 obj\n" + objects[num - 1] + b"\nendobj\n"

    xref = len(out)
    n = len(objects) + 1        # +1 for the free object 0
    out += b"xref\n0 " + str(n).encode() + b"\n0000000000 65535 f \n"
    for num in range(1, n):
        out += f"{offsets[num]:010d} 00000 n \n".encode()
    out += (b"trailer\n<< /Size " + str(n).encode() + b" /Root " +
            str(root_id).encode() + b" 0 R >>\nstartxref\n" +
            str(xref).encode() + b"\n%%EOF\n")
    dest.write_bytes(bytes(out))


# --------------------------------------------------------------------- main

def capture_time(path):
    """Capture timestamp via sips, used only for ordering. Empty if unavailable."""
    if not shutil.which("sips"):
        return ""
    r = subprocess.run(["sips", "-g", "creation", str(path)],
                       capture_output=True, text=True)
    for line in r.stdout.splitlines():
        if "creation:" in line:
            return line.split("creation:", 1)[1].strip()
    return ""


def main():
    ap = argparse.ArgumentParser(description="Build a contact sheet PDF for a photo batch.")
    ap.add_argument("inbox", type=Path, help="folder of raw photos (read-only)")
    ap.add_argument("-o", "--out", type=Path, default=Path("prepared"))
    args = ap.parse_args()

    if not args.inbox.is_dir():
        sys.exit(f"Not a folder: {args.inbox}")

    photos = sorted(p for p in args.inbox.iterdir()
                    if p.is_file() and p.suffix.lower() in EXTS)
    if not photos:
        sys.exit(f"No images found in {args.inbox}")

    print(f"Found {len(photos)} photos. Making thumbnails...")
    args.out.mkdir(parents=True, exist_ok=True)
    # Date-stamped so a later batch never overwrites or is mistaken for an earlier one.
    stamp = datetime.date.today().isoformat()

    tiles, failed, rows = [], [], []
    with tempfile.TemporaryDirectory() as tmp:
        for i, src in enumerate(photos, 1):
            if i % 25 == 0:
                print(f"  {i}/{len(photos)}")
            thumb = Path(tmp) / f"{i:03d}.jpg"
            size = None
            if make_thumb(src, thumb):
                size = jpeg_size(thumb)
            if not size:
                failed.append(src.name)
                continue
            tiles.append((thumb, size[0], size[1], f"#{i:03d}  {src.name}"))
            rows.append([f"{i:03d}", src.name, capture_time(src)])

        per_page = COLS * ROWS
        pages = [tiles[j:j + per_page] for j in range(0, len(tiles), per_page)]
        pdf = args.out / f"{stamp}-contact-sheets.pdf"
        print(f"Writing {len(pages)} pages...")
        build_pdf(pages, pdf)

    with open(args.out / f"{stamp}-manifest.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["index", "filename", "capture_time"])
        w.writerows(rows)

    mb = pdf.stat().st_size / 1_000_000
    print(f"\nDone. {len(tiles)} photos over {len(pages)} pages — {mb:.1f} MB")
    print(f"  {pdf}")
    print(f"  {args.out / (stamp + '-manifest.csv')}")
    if failed:
        print(f"\n{len(failed)} could not be read: {', '.join(failed[:10])}"
              + (" ..." if len(failed) > 10 else ""))
    print(f"\nSend both {stamp}-* files to Claude.")


if __name__ == "__main__":
    main()
