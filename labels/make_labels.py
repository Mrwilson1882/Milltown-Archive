"""Make 4x6 inch delivery labels for the Jadens JD168BT thermal printer.

Reads a JSON file of parcels and writes one PDF, one label per page:

    python3 labels/make_labels.py parcels.json -o labels/out/labels.pdf

Each parcel in the JSON list looks like:

    {"order": "AW-9Y7KNEAX", "name": "Connor Niblett",
     "address": ["13 Brook Road", "Beeston", "Nottingham"],
     "postcode": "NG9 2RA", "parcel": 1, "of": 1}

An order sent as two parcels is two entries, "parcel": 1 and 2 with "of": 2,
and each label then says which parcel it is.

The layout follows the earlier Archive Wholesale label: order number top
right, the delivery address in the middle with the postcode largest, and the
small logo with the return address along the bottom. Type is Archivo, the
website's face. The logo prints solid black because the printer has no grey.

Print at 100% / Actual size on 4x6 in (100x150 mm) paper. The output PDFs
hold customer addresses, so labels/out/ is kept out of git.
"""

import argparse
import io
import json
from pathlib import Path

from PIL import Image
from reportlab.lib.units import inch, mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

HERE = Path(__file__).resolve().parent
LOGO = HERE.parent / "site" / "public" / "logo.png"

for name in ("Regular", "SemiBold", "ExtraBold"):
    pdfmetrics.registerFont(TTFont(f"Archivo-{name}", HERE / "fonts" / f"Archivo-{name}.ttf"))
REG, SEMI, BOLD = "Archivo-Regular", "Archivo-SemiBold", "Archivo-ExtraBold"

PAGE_W, PAGE_H = 4 * inch, 6 * inch
MARGIN = 6 * mm
INNER_W = PAGE_W - 2 * MARGIN

RETURN_LINES = [
    "Archive Wholesale, Vo-10 Empire Business Park,",
    "2 Empire Way, Burnley, BB12 6HA",
]


def black_logo(path):
    """The logo as solid black on white, cropped to the artwork."""
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


def fit(c, text, font, size, max_w, smallest=9):
    while size > smallest and c.stringWidth(text, font, size) > max_w:
        size -= 0.5
    return size


def spaced(c, x, y, text, font, size, tracking):
    """Draw letterspaced uppercase text, left-aligned at x."""
    c.saveState()  # character spacing would otherwise carry into later text
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setCharSpace(tracking)
    t.textLine(text)
    c.drawText(t)
    c.restoreState()


def draw_label(c, p, logo):
    top = PAGE_H - MARGIN

    # Header: order number on the right, parcel count on the left when split.
    c.setFont(BOLD, 13)
    c.drawRightString(PAGE_W - MARGIN, top - 13, p["order"])
    if p.get("of", 1) > 1:
        spaced(c, MARGIN, top - 12, f"PARCEL {p['parcel']} OF {p['of']}", BOLD, 10, 0.8)
    c.setLineWidth(2)
    c.line(MARGIN, top - 20, PAGE_W - MARGIN, top - 20)

    # Footer: small logo and return address, under a rule.
    foot_rule = MARGIN + 17 * mm
    c.line(MARGIN, foot_rule, PAGE_W - MARGIN, foot_rule)
    reader, (lw, lh) = logo
    logo_w = 25 * mm
    logo_h = logo_w * lh / lw
    logo_y = foot_rule - 8.5 * mm - logo_h / 2
    c.drawImage(reader, MARGIN, logo_y, logo_w, logo_h)
    tx = MARGIN + logo_w + 3 * mm
    c.setFont(SEMI, 6.5)
    c.drawString(tx, foot_rule - 6 * mm, "If undelivered, return to:")
    c.setFont(REG, 6)
    for i, line in enumerate(RETURN_LINES):
        c.drawString(tx, foot_rule - 9.5 * mm - i * 7.5, line)

    # Address block, sized to the text and centred in the space between.
    name_size = fit(c, p["name"], BOLD, 24, INNER_W)
    addr_sizes = [fit(c, line, REG, 17, INNER_W) for line in p["address"]]
    pc_size = fit(c, p["postcode"], BOLD, 40, INNER_W)
    rows = [("DELIVER TO", SEMI, 10, 1.6, 8)]
    rows.append((p["name"], BOLD, name_size, 0, 6))
    rows += [(line, REG, s, 0, 4) for line, s in zip(p["address"], addr_sizes)]
    rows.append((p["postcode"], BOLD, pc_size, 0, 0))
    lead = [r[2] * 1.12 + r[4] for r in rows]
    lead[-1] += 6  # a little extra air above the postcode
    block_h = sum(lead)
    space_top, space_bottom = top - 20, foot_rule
    y = (space_top + space_bottom) / 2 + block_h / 2
    for (text, font, size, tracking, _), step in zip(rows, lead):
        y -= size * (1.12 + (0.12 if text is p["postcode"] else 0))
        if tracking:
            spaced(c, MARGIN, y, text, font, size, tracking)
        else:
            c.setFont(font, size)
            c.drawString(MARGIN, y, text)
        y -= step - size * 1.12


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("parcels", help="JSON file listing the parcels")
    ap.add_argument("-o", "--output", default=str(HERE / "out" / "labels.pdf"))
    args = ap.parse_args()

    parcels = json.loads(Path(args.parcels).read_text())
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    logo = black_logo(LOGO)

    c = canvas.Canvas(str(out), pagesize=(PAGE_W, PAGE_H))
    c.setTitle("Delivery labels")
    for p in parcels:
        draw_label(c, p, logo)
        c.showPage()
    c.save()
    print(f"{len(parcels)} label(s) -> {out}")


if __name__ == "__main__":
    main()
