# Batch 8 — 27th September Upload

20 items, 290 photographs, ledger `inventory-2026-09-26.csv`.
Photos live in the folder **27th September Upload**.

```
python3 build.py "27th September Upload" itemsb8.csv mappingb8.csv
```

266 photos go into the upload. 20 are number cards and 4 are duplicate frames;
both are recorded in `mapping.csv` so nothing looks lost, and `build.py` skips
them.

## How the batch is laid out

This one arrived as **two passes from two cameras**, which is why the card
numbers do not run in file order:

* **DSC00035–DSC00079 (#001–#053)** — the clean Photoroom flat-lays, in ledger
  order, item 1 through item 20. Cards for items 5, 6 and 14–20 sit in here.
* **IMG_2921–IMG_3167 (#054–#283)** — the detail, label, measurement and defect
  shots, also in ledger order. Cards for items 1–4 and 7–13 sit in here.
* **IMG_7935–IMG_7940 (#285–#289)** and **IMG_3219 (#284)** — a late third pass;
  the green Izod Lacoste jumper (item 17) and the Les Copains jacket (item 1).
* **Photoroom_20260927_172011.JPEG (#290)** — the loose pink shot that had no
  home. It is the **Emanuel Ungaro brand label** on the pink lining of item 2.

## Corrections the photographs forced on the ledger

| Item | Ledger says | Label says |
|---|---|---|
| 1 | Les Copains **Denim** Jacket | cotton twill, not denim; label `JEANS Les Copains`, `42 / 28` |
| 2 | Emanuel Ungaro Jacket | `emanuel ungaro SPORT D'HIVER paris, MADE IN ITALY` |
| 8 | **Fur** Jacket | **Fay** — `Fay / Made with special materials`, size L |
| 9 | **Mizone** Uomo Cardigan | **MISSONI UOMO**, MADE IN ITALY |
| 10 | filed under **Women's** | Taglia 54 is a continental mens 44in chest → Mens XL |
| 11 | "Dress Tartan (red/pink based)" | Dress Tartan is the *lining*; the shell is navy |
| 20 | Lacoste **Jacket** | a button-front **cardigan**, `IZOD LACOSTE`, size L |

Item 8's correction also clears the ledger's platform-restriction worry — that
only applied to real fur.

Items 17–20 are all **Izod Lacoste**, the US-made licence that ran to 1993. The
`Brand` field stays `Lacoste`, as in batch 6; "Izod Lacoste" goes in the title.

## Sizes

Read off a label where one exists, otherwise from the tape-measure shots.

| Item | Size | Where it came from |
|---|---|---|
| 1 | Mens L | label reads `42 / 28`; pit to pit ~22in agrees with a 42in chest |
| 2 | Womens L | no label; pit to pit ~22–23in, oversized 1980s cut |
| 3 | Mens XXL | no legible `C__/__CM`; pit to pit ~26in = Barbour C46 |
| 4 | Mens L | ledger, IT 50 |
| 5 | Mens L | no label; pit to pit ~21in |
| 6 | Womens UK 14 | label reads `I 46 / USA 12` |
| 7 | Mens L | no label; pit to pit ~21in |
| 8 | Mens L | Fay label size tab |
| 9 | Mens L | no label; pit to pit ~21in |
| 10 | Mens XL | label Taglia/Talla 54 |
| 11 | Mens M | Barbour Dress Tartan label |
| 12 | Mens L | **estimated** — no label and no tape shot |
| 13 | Mens XL | no label; pit to pit ~23in |
| 14 | Mens XXL | Diesel neck label |
| 15 | Mens L | label 102cm / 40in chest |
| 16 | Mens XXL | no label; pit to pit ~25–26in |
| 17 | Mens L | no label; pit to pit ~20–21in |
| 18 | Mens L | ledger; pit to pit agrees |
| 19 | Mens L | no label; pit to pit ~20–21in |
| 20 | Mens L | Izod Lacoste neck label |

Every measured size carries the pit-to-pit figure in `flags`, and the tape shots
sit at photo 3 and 4 on each listing so a buyer can check.

## Pricing

Owner-set and kept: 1 (49.99), 2 (69.99), 9 (45.00), 10 (150.00).
Everything else is priced from UK Vinted pro-seller comps, written out per item
in `price_basis`. The Izod Lacoste knits follow the owner's standing guide —
25–35 normally, 20 for the poorer ones — so 18 and 20 sit at 32.99 and the two
with defects at 22.99.

Item 3 is the one real departure from the ledger: it asked 74.99, and a
made-in-England Beaufort in this size sells for 90–160 on Vinted UK, so it is
listed at 119.99.

## Photo order

`mapping.csv` was rebuilt on 28 Sep to the owner's layout: whole-garment shots
and key details first, **chest measure at 9 and length measure at 10**, the rest
of the details after, defects last. It first shipped with the measurements at
slots 3 and 4 on every item — the shapewear exception applied where it does not
belong. **The upload the owner imported on 27 Sep carries the old order**, so
the repo and that import disagree on photo order until the batch is rebuilt.

## Still open

* **Item 6's condition is blank in the ledger** and has now been asked about
  three times. It is set to Very Good from the photographs, which show no wear.
* **Item 12 has no size evidence at all** — no label photographed, no tape shot.
  Large is a reading of its proportions against the rest of the batch.
* **Item 3's `C__/__CM` label** is not legible in any frame. XXL is from the tape.
