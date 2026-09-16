/**
 * Polishes a phone clip into a post: speeds it up a touch and bookends it with
 * the wordmark, at the clip's own resolution and frame rate.
 *
 *   node polish.mjs <clip.mp4> [--speed 1.15] [--out name] [--crf 16]
 *
 * The output lands beside the build folder as <name>.mp4, where <name> is the
 * clip's own filename unless --out says otherwise.
 *
 * What it does to the picture, and what it does not
 * -------------------------------------------------
 * The clip is re-encoded once — there is no way round that, because changing
 * its speed and joining it to two cards both mean new frames. It is encoded on
 * the slow preset at CRF 16 (H.264) or 18 (10-bit HEVC), a notch below
 * "visually lossless" and well above anything Instagram keeps: the upload is
 * re-encoded far harder on their side whatever it is fed. Resolution, frame
 * rate and colour are the source's own — an HDR clip stays HDR, nothing is
 * tonemapped — and nothing is scaled or dropped except the frames the speed-up
 * removes, which is how every editor does it.
 *
 * The two cards are rendered in Chromium at the clip's size, so the wordmark
 * is sharp at 4K and the type is the storefront's own Archivo.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { fontFaces } from "./overlay.mjs";
import { BRAND } from "./layouts.mjs";

const HERE = import.meta.dirname;
const REPO = path.resolve(HERE, "../../..");
const PUBLIC = path.join(REPO, "site/public");
const FFMPEG = path.join(HERE, "node_modules/ffmpeg-static/ffmpeg");
const FFPROBE = path.join(HERE, "node_modules/ffprobe-static/bin/linux/x64/ffprobe");
const FONTS = path.join(HERE, "node_modules/@fontsource/archivo/files");
const CHROME = process.env.CHROME || undefined;
const OUT = path.resolve(HERE, "..");

/** How long each card holds, and how long each join takes, in seconds. */
const OPEN = 1.2;
const CLOSE = 2.2;
const FADE_IN = 0.3;
const FADE_OUT = 0.45;

/* ---------------------------------------------------------------- args */

const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith("--"));
if (!src) {
  console.error("usage: node polish.mjs <clip.mp4> [--speed 1.15] [--out name]");
  process.exit(1);
}
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const speed = parseFloat(flag("speed", "1.15"));
const outName = flag("out", path.basename(src, path.extname(src)));
// The master. Raise it only for a copy that has to fit through a size limit.
// (Set after the probe: x265 and x264 do not share a CRF scale.)
const crfFlag = flag("crf", null);

/* --------------------------------------------------------------- probe */

const probe = JSON.parse(
  execFileSync(FFPROBE, [
    "-v", "error", "-print_format", "json", "-show_streams", "-show_format", src,
  ]).toString(),
);
const video = probe.streams.find((s) => s.codec_type === "video");
const audio = probe.streams.find((s) => s.codec_type === "audio");
if (!video) throw new Error(`${src}: no video stream`);

// A phone clip may be tagged with a rotation; the frames are stored one way
// and displayed the other. Work in the displayed orientation.
const rotation = Math.abs(
  parseInt(video.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? video.tags?.rotate ?? 0, 10),
);
const rotated = rotation === 90 || rotation === 270;
const W = rotated ? video.height : video.width;
const H = rotated ? video.width : video.height;

const [fn, fd] = video.r_frame_rate.split("/").map(Number);
const fps = Math.round((fn / fd) * 1000) / 1000;
const srcDur = parseFloat(probe.format.duration);
const mainDur = srcDur / speed;
const total = OPEN - FADE_IN + mainDur - FADE_OUT + CLOSE;

const hdr = /smpte2084|arib-std-b67/.test(video.color_transfer ?? "") || /10le/.test(video.pix_fmt ?? "");
const crf = crfFlag ?? (hdr ? "18" : "16");

console.log(
  `${path.basename(src)}: ${W}x${H} ${fps}fps ${srcDur.toFixed(2)}s ${video.codec_name}` +
    `${audio ? ` + ${audio.codec_name} audio` : ", silent"}${hdr ? `  [HDR ${video.color_transfer} — kept as shot]` : ""}`,
);
console.log(`→ ${speed}× speed, ${OPEN}s open card, ${CLOSE}s close card, ${total.toFixed(2)}s total`);

/* --------------------------------------------------------------- cards */

const work = path.join(HERE, "work", `polish-${outName}`);
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

const logo = `data:image/png;base64,${fs.readFileSync(path.join(PUBLIC, "logo.png")).toString("base64")}`;

// The wordmark takes just over half the width; the URL is set to the same
// measure so the two read as one lockup. Sizes are fractions of the short
// side so a 4K portrait clip and a 1080 square get the same card.
const short = Math.min(W, H);
const cardHtml = (closing) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces(FONTS)}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;background:${BRAND.paper};overflow:hidden}
.card{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:${Math.round(short * 0.05)}px;font-family:Archivo,sans-serif;-webkit-font-smoothing:antialiased}
img{width:${Math.round(W * 0.56)}px;height:auto;display:block}
.rule{width:${Math.round(short * 0.12)}px;height:${Math.max(3, Math.round(short * 0.004))}px;background:${BRAND.forest}}
.url{font-weight:900;letter-spacing:.02em;font-size:${Math.round(short * 0.048)}px;color:${BRAND.paper};
  background:${BRAND.forest};padding:${Math.round(short * 0.018)}px ${Math.round(short * 0.03)}px}
</style></head><body><div class="card">
  <img src="${logo}">
  ${closing ? `<div class="rule"></div><div class="url">ARCHIVEWHOLESALE.CO.UK</div>` : ""}
</div></body></html>`;

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
for (const [name, closing] of [["open", false], ["close", true]]) {
  await page.setContent(cardHtml(closing), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(work, `${name}.png`) });
}
await browser.close();

/* -------------------------------------------------------------- encode */

const openPng = path.join(work, "open.png");
const closePng = path.join(work, "close.png");
const dest = path.join(OUT, `${outName}.mp4`);

// The footage is never colour-converted. An HDR clip stays HDR — same
// primaries, same transfer, same 10-bit depth — because converting it to
// standard range is exactly the "lighting" change nobody asked for. The two
// cards are the ones that move: rendered as ordinary sRGB, they are lifted
// into the clip's own space so the white card lands at HDR reference white
// (about 0.75 of the signal, which is where a lit white floor sits) rather
// than reading as a grey slab between two bright shots.
const pix = hdr ? "yuv420p10le" : "yuv420p";
const norm = `fps=${fps},scale=${W}:${H}:flags=lanczos,setsar=1`;
// One zscale does the whole trip — sRGB card to the clip's primaries, transfer
// and matrix. npl sets how bright the card's white comes out: 270 nits puts it
// at ~0.78 of the HLG signal, which is where this footage's lit floor sits, so
// the crossfade from card to clip does not step in brightness. (Splitting the
// conversion into stages, tonemap-style, breaks: zimg finds no path.)
const cardToClip = hdr
  ? `format=rgb24,zscale=tin=iec61966-2-1:pin=bt709:min=bt709:rin=full:` +
    `t=${video.color_transfer}:p=${video.color_primaries}:m=${video.color_space}:r=tv:npl=270,` +
    `format=${pix}`
  : `format=${pix}`;

const filter = [
  `[1:v]${norm},${cardToClip}[open]`,
  `[0:v]setpts=PTS/${speed},${norm},format=${pix}[main]`,
  `[2:v]${norm},${cardToClip}[close]`,
  `[open][main]xfade=transition=fade:duration=${FADE_IN}:offset=${(OPEN - FADE_IN).toFixed(3)}[ab]`,
  `[ab][close]xfade=transition=fade:duration=${FADE_OUT}:offset=${(OPEN - FADE_IN + mainDur - FADE_OUT).toFixed(3)}[v]`,
  audio
    ? // Speed the sound up with the picture, start it where the clip lands
      // after the open card, and run silence under the close card.
      `[0:a]atempo=${speed},adelay=${Math.round((OPEN - FADE_IN) * 1000)}:all=1,apad[a]`
    : `anullsrc=channel_layout=stereo:sample_rate=48000[a]`,
].join(";");

execFileSync(
  FFMPEG,
  [
    "-y", "-hide_banner", "-loglevel", "error", "-stats",
    "-i", src,
    "-loop", "1", "-t", String(OPEN), "-i", openPng,
    "-loop", "1", "-t", String(CLOSE), "-i", closePng,
    "-filter_complex", filter,
    "-map", "[v]", "-map", "[a]",
    "-t", total.toFixed(3),
    ...(hdr
      ? [
          // HEVC 10-bit with the source's own colour signalling, tagged hvc1 so
          // an iPhone and QuickTime play it without complaint.
          "-c:v", "libx265", "-preset", "slow", "-crf", crf, "-pix_fmt", pix, "-tag:v", "hvc1",
          "-color_primaries", video.color_primaries, "-color_trc", video.color_transfer,
          "-colorspace", video.color_space, "-color_range", "tv",
          "-x265-params",
          `colorprim=${video.color_primaries}:transfer=${video.color_transfer}:colormatrix=${video.color_space}:range=limited:log-level=error`,
        ]
      : ["-c:v", "libx264", "-preset", "slow", "-crf", crf, "-profile:v", "high", "-level", "4.2", "-pix_fmt", pix]),
    "-r", String(fps),
    "-c:a", "aac", "-b:a", "192k",
    "-movflags", "+faststart",
    dest,
  ],
  { stdio: "inherit" },
);

const mb = (fs.statSync(dest).size / 1e6).toFixed(1);
console.log(`\n${path.relative(REPO, dest)}  ${W}x${H}  ${total.toFixed(2)}s  ${mb} MB`);
