# Instagram adverts

Six files, three adverts. Each advert is cut twice because Instagram crops
differently in the two places you post it — a feed post is 4:5, a story or reel
is 9:16, and one file will not do both without losing either the type or the
garment.

| File | Where it goes | Size | Length |
|---|---|---|---|
| `reseller-boxes-feed.mp4` | Feed post · Explore | 1080 × 1350 (4:5) | 14.4s |
| `reseller-boxes-story.mp4` | Stories · Reels | 1080 × 1920 (9:16) | 14.4s |
| `ralph-tommy-lacoste-mix-feed.mp4` | Feed post · Explore | 1080 × 1350 (4:5) | 14.0s |
| `ralph-tommy-lacoste-mix-story.mp4` | Stories · Reels | 1080 × 1920 (9:16) | 14.0s |
| `three-boxes-feed.mp4` | Feed post · Explore | 1080 × 1350 (4:5) | 9.0s |
| `three-boxes-story.mp4` | Stories · Reels | 1080 × 1920 (9:16) | 9.0s |

H.264, 30fps, silent stereo track, faststart. Under fifteen seconds each, as
asked. Captions to go with them are in [`CAPTIONS.md`](CAPTIONS.md).

---

## Advert one — the reseller boxes, and the introduction

It has two jobs, so it does the introduction inside the sell rather than before
it. The logo and *Vintage wholesale · Lancashire, UK* sit above the picture for
the whole advert, and the second beat says who we are in one line — which means
the first two seconds can still be the hook rather than a title card.

1. **0.0s** — Starter Box intake, opening on the Chaps Ralph Lauren spellout
   and turning it over. *Boxed. Graded. Priced.*
2. **2.8s** — *New out of Lancashire. We sort and grade it here.* Branded
   vintage for vintage shops, market traders and online resellers.
3. **5.4s** — **Three reseller boxes on one card.** All three photographs run
   edge to edge as a triptych, then the price ladder lands under them.
4. **11.0s** — Closing card: the wordmark, *We sort it. You sell it.*, the
   grade and the labels, and archivewholesale.co.uk on a green block.

### Why the prices are written the way they are

The two Mix boxes are priced identically — ten pieces £100, twenty £180 — so
the ladder is written **per price rather than per box**. Each figure appears
exactly once:

| | |
|---|---|
| Starter Box · 10 | £90 |
| Either Mix Box · 10 | £100 |
| Either Mix Box · 20 | £180 |

The Starter Box keeps its own line because it is *not* the same price and has
no twenty-piece option. Repeating £100/£180 under both Mix boxes would have
read as four prices where there are three.

The three photographs run edge to edge with no gutter between them. Three
across a 1080-wide canvas is only ever about 360px each, so every pixel of
white space between them comes off the garments — the names underneath do the
dividing instead.

## Advert three — the three boxes, without the footage

`three-boxes-*.mp4` is advert one with the opening taken off: no intake footage,
just the box card and the closing card. Nine seconds instead of fourteen, and
nothing in it that is not in the long cut — both adverts build their cards from
the same `BOXES_CARD` and `CLOSING_CARD` in `build/ads.mjs`, so a price can only
ever be changed in both at once.

It opens differently, because it has to. With no footage ahead of it, the first
frame *is* the cover image, so the headline and all three photographs are up
from frame one and only the prices arrive — a white card caught mid-fade would
waste the one frame that gets seen whether or not anyone presses play. The
photographs also carry a very slow push, because nine seconds of a dead still
reads as a picture and gets scrolled past.

Use it where the price is the whole message: retargeting someone who has
already seen the long cut, or a story slide that has to land in a thumb-flick.

## Advert two — Ralph, Tommy, Lacoste Mix

Built on the clip that already exists at
`site/public/videos/products/ralph-tommy-lacoste-mix/01.mp4`. It runs as one
unbroken take under the type, because the flip-through *is* the advert: pink,
yellow and blue Ralph Lauren polos, a brown Lacoste jumper, the orange
cardigan, the red gingham shirt, Tommy Jeans. Cutting it up would only
interrupt it.

1. **0.0s** — *Ralph. Tommy. Lacoste.* — one label per beat.
2. **2.6s** — One lot, three labels.
3. **5.4s** — Bright from across a market hall. Graded A/B.
4. **8.2s** — The price ladder: 10 · £95 · 25 · £225 · 50 · £425
5. **11.4s** — Closing card: *Test ten. Then buy in depth.*

---

## The square window

The footage is square — 1080 × 1080 straight off the phone — so the window it
plays in is square too, and runs the **full width of the canvas in both
formats**. Nothing is cropped. A square source cannot be made taller without
cutting the sides off the garment, and the garments are the advert.

That width is paid for out of the type:

- **9:16** carries the wordmark above the window and the copy below it, both
  inside the story safe area. The eyebrow line that used to sit under the
  wordmark was the price of the wider window.
- **4:5** has only 270px left underneath a full-width square, so its wordmark
  rides the same line as the kicker and costs no height at all.

## Branding

Taken from the web build, not reinvented:

- **Wordmark** — `site/public/logo.png`, the owner's own artwork.
- **Colour** — black type on a white ground, forest `#0F4A2E` as the only
  accent. Nothing else earns a colour, same rule as the site.
- **Type** — Archivo, the same face the storefront loads: 900 for display, 700
  letterspaced for eyebrows and kickers.
- **Structure** — the square media window with a white margin round it is the
  category tile from the home page, scaled up.

Nothing in either advert claims anything the site does not. Every price comes
from `site/src/data/catalogue.ts`; the grade, the brand lists and the
representative-stock line come from the same place. No price was inferred —
`pricing-notes.md` still applies.

## Before you post

- **Sound.** Both files carry a silent audio track, which uploads cleanly and
  reads fine — the adverts are written to work muted, which is how most of the
  feed watches them. If you want music, add it in Instagram at the point of
  posting. Do not add a track to the file: **a promoted post can only use music
  Instagram licenses for business accounts**, and a normal library track will
  get the promotion rejected or the audio stripped.
- **Story safe area.** The 9:16 cut keeps everything between y=250 and y=1670,
  so the profile chip at the top and the reply bar at the bottom do not sit on
  any type. Stickers you add yourself will.
- **Link.** Promoted posts take a website button — point it at
  `https://www.archivewholesale.co.uk/collections/reseller-boxes` for advert
  one and `.../products/ralph-tommy-lacoste-mix` for advert two, rather than
  the home page. Fewer taps to the thing the advert just showed.
- **Prices.** Change one on the site and this folder is out of date. Edit
  `build/ads.mjs` and re-render, then update `CAPTIONS.md`.

## Polishing a raw clip

`build/polish.mjs` takes a phone clip as shot, speeds it up a touch and
bookends it with the wordmark — a plain card in, wordmark and address out — at
the clip's own resolution and frame rate.

```bash
cd marketing/instagram/build
node polish.mjs ../source/clip.mp4 --speed 1.15        # 15% faster
node polish.mjs ../source/clip.mp4 --speed 1.1 --out rtl-polos
```

The output lands in this folder as `<name>.mp4`. Drop raw clips in
[`source/`](source/README.md) — that file explains how to get one here when
it is too big for the chat.

**On quality.** The clip is re-encoded once; there is no way round that,
because changing its speed and joining it to two cards both mean new frames.
It is encoded at CRF 16 on the slow preset — a notch below "visually
lossless" and far above anything Instagram keeps, because the upload is
re-encoded much harder on their side whatever it is fed. Resolution and frame
rate are the source's own, and nothing is scaled or dropped except the frames
the speed-up removes, which is how every editor does it. HDR footage from a
recent iPhone is flattened to SDR, which Instagram would do anyway.

## Re-rendering

```bash
cd marketing/instagram/build
npm install
node build.mjs                      # both adverts, both formats
node build.mjs reseller-boxes       # just the one
```

Copy lives in `build/ads.mjs` — change a price or a line there and re-run. The
layouts are in `build/layouts.mjs`, the type and the white ground in
`build/overlay.mjs`.

How it works: the footage layer is cut and placed by ffmpeg, the brand layer is
drawn frame by frame in headless Chromium with a transparent background, and
the two are composited. That way the typography is real CSS at full resolution
instead of a browser's idea of a rescaled video, and the white ground always
lines up with the window it surrounds.

It needs a Chromium — the build points at the one on this machine via
`CHROME`, set that to your own path (or `npx playwright install chromium`).
