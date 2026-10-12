"""Make 4x6 inch parcel labels for the Jadens JD168BT thermal printer.

One page per transaction number, all in one PDF:

    python3 labels/make_labels.py TXN-10482 TXN-10483 -o labels/out/batch.pdf

Layout, top to bottom: the company logo large, the transaction number,
then the small logo and the return address in very small type.

Thermal printers print black only, so both logos are turned solid black
(using the artwork's transparency) to print crisply instead of as grey dots.
Print at 100% / Actual size on 4x6 in (100x150 mm) paper.
"""

import argparse
import io
from pathlib import Path

from PIL import Image
from reportlab.lib.units import inch, mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_LOGO = ROOT / "site" / "public" / "logo.png"

PAGE_W, PAGE_H = 4 * inch, 6 * inch
MARGIN = 5 * mm

RETURN_ADDRESS = [
    "Archive Wholesale",
    "Vo-10, Empire Business Park, 2 Empire Way",
    "Burnley, Lancashire BB12 6HA, United Kingdom",
]


def black_logo(path):
    """Return the logo as solid black on white, cropped to the artwork."""
    img = Image.open(path).convert("RGBA")
    alpha = img.getchannel("A")
    box = alpha.getbbox()
    if box:
        img, alpha = img.crop(box), alpha.crop(box)
    out = Image.new("RGB", img.size, "white")
    out.paste(Image.new("RGB", img.size, "black"), mask=alpha)
    buf = io.BytesIO()
    out.save(buf, "PNG")
    buf.seek(0)
    return ImageReader(buf), img.size


def draw_logo(c, logo, max_w, max_h, centre_x, top_y):
    """Draw a logo scaled to fit max_w x max_h; return its drawn height."""
    reader, (w, h) = logo
    scale = min(max_w / w, max_h / h)
    dw, dh = w * scale, h * scale
    c.drawImage(reader, centre_x - dw / 2, top_y - dh, dw, dh)
    return dh


def fit_font(c, text, font, max_size, max_w):
    size = max_size
    while size > 8 and c.stringWidth(text, font, size) > max_w:
        size -= 1
    return size


def draw_label(c, txn, logo, small_logo):
    inner_w = PAGE_W - 2 * MARGIN
    cx = PAGE_W / 2

    # Company logo, large, across the top.
    logo_h = draw_logo(c, logo, inner_w, 1.6 * inch, cx, PAGE_H - MARGIN - 4 * mm)
    rule_y = PAGE_H - MARGIN - 4 * mm - logo_h - 6 * mm
    c.setLineWidth(1.2)
    c.line(MARGIN, rule_y, PAGE_W - MARGIN, rule_y)

    # Transaction number, the thing someone scans the label for.
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(cx, rule_y - 10 * mm, "TRANSACTION NO.")
    size = fit_font(c, txn, "Courier-Bold", 30, inner_w)
    c.setFont("Courier-Bold", size)
    c.drawCentredString(cx, rule_y - 10 * mm - size - 2 * mm, txn)

    # Bottom block: small logo, then the return address in very small type.
    line_h = 6.5
    addr_top = MARGIN + line_h * (len(RETURN_ADDRESS) + 1)
    c.setLineWidth(0.5)
    c.line(MARGIN, addr_top + 16 * mm, PAGE_W - MARGIN, addr_top + 16 * mm)
    draw_logo(c, small_logo, 1.3 * inch, 10 * mm, cx, addr_top + 13 * mm)
    c.setFont("Helvetica-Bold", 5.5)
    c.drawCentredString(cx, addr_top, "IF UNDELIVERED PLEASE RETURN TO")
    c.setFont("Helvetica", 5.5)
    for i, line in enumerate(RETURN_ADDRESS, start=1):
        c.drawCentredString(cx, addr_top - i * line_h, line)


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("transactions", nargs="+", help="transaction numbers, one label each")
    p.add_argument("-o", "--output", default=str(ROOT / "labels" / "out" / "labels.pdf"))
    p.add_argument("--logo", default=str(DEFAULT_LOGO), help="large company logo (PNG)")
    p.add_argument("--small-logo", default=str(DEFAULT_LOGO), help="small logo (PNG)")
    args = p.parse_args()

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    logo, small_logo = black_logo(args.logo), black_logo(args.small_logo)

    c = canvas.Canvas(str(out), pagesize=(PAGE_W, PAGE_H))
    c.setTitle("Parcel labels")
    for txn in args.transactions:
        draw_label(c, txn.strip(), logo, small_logo)
        c.showPage()
    c.save()
    print(f"{len(args.transactions)} label(s) -> {out}")


if __name__ == "__main__":
    main()
