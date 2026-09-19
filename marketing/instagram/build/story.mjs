/**
 * Cuts an Instagram story from a run of square product clips.
 *
 *   node story.mjs
 *
 * Wordmark in; then for each lot, a few seconds of its footage in the square
 * window with the lot's name and price in the white band beneath; wordmark and
 * address out. 9:16, and well under a story's sixty seconds.
 *
 * The footage is never colour-converted — these are HDR clips straight off the
 * phone and they stay that way, same primaries, transfer and bit depth. The
 * white ground and the type are what move: rendered as ordinary sRGB, then
 * lifted into the clips' own space with white pinned to where a lit floor sits
 * (about 0.78 of the HLG signal), so the footage does not step in brightness
 * against its surround. Same approach as polish.mjs, proven on IMG_2763.
 *
 * Silent on purpose: five clips of rustling do not cut together, and a story
 * gets its music in the app.
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
const SRC = path.resolve(HERE, "../source");
const OUT = path.resolve(HERE, "..");
const FFMPEG = path.join(HERE, "node_modules/ffmpeg-static/ffmpeg");
const FFPROBE = path.join(HERE, "node_modules/ffprobe-static/bin/linux/x64/ffprobe");
const FONTS = path.join(HERE, "node_modules/@fontsource/archivo/files");
const CHROME = process.env.CHROME || undefined;

const W = 1080, H = 1920, FPS = 30;
/** The square window the clips play in — same place as the ad cuts. */
const WIN = { x: 0, y: 340, w: 1080, h: 1080 };
const OPEN = 1.5, SEG = 4.0, CLOSE = 2.4, FADE = 0.4;
const SITE = "ARCHIVEWHOLESALE.CO.UK";
const OUT_NAME = "this-weeks-lots-story";

/**
 * Names and prices are the storefront's (site/src/data/catalogue.ts), the
 * ten-piece price leading because it is the way in. `ss` is where in the clip
 * the four seconds start — chosen off a contact sheet for the moment a piece
 * is being laid down or turned over.
 */
const segments = [
  { src: "windbreakers.MOV",      ss: 2.0, name: "JACKETS & WINDBREAKER MIX",     lead: "10 PIECES · £125", also: "ALSO 25 · £275 AND 50 · £450" },
  { src: "t-shirts.MOV",          ss: 0.3, name: "BRANDED T-SHIRT MIX",           lead: "10 PIECES · £65",  also: "ALSO 25 · £150 AND 50 · £275" },
  { src: "womens-y2k-mix.MOV",    ss: 0.5, name: "Y2K DESIGNER FEMALE MIX",       lead: "10 PIECES · £100", also: "OR 20 PIECES · £180" },
  { src: "hoodies.MOV",           ss: 0.5, name: "MIXED PREMIUM VINTAGE HOODIES", lead: "10 PIECES · £95",  also: "ALSO 25 · £225 AND 50 · £425" },
  { src: "carhartt-t-shirts.MOV", ss: 4.0, name: "CARHARTT / DICKIES T-SHIRTS",   lead: "10 PIECES · £75",  also: "ALSO 25 · £181.25 AND 50 · £375" },
];

const ff = (args, opts = {}) =>
  execFileSync(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: ["ignore", "pipe", "inherit"], maxBuffer: 1 << 28, ...opts });

/* --------------------------------------------------------------- probe */

const probeVideo = (file) =>
  JSON.parse(execFileSync(FFPROBE, ["-v", "error", "-print_format", "json", "-show_streams", file]).toString())
    .streams.find((s) => s.codec_type === "video");

const first = probeVideo(path.join(SRC, segments[0].src));
const space = { p: first.color_primaries, t: first.color_transfer, m: first.color_space };
const hdr = /smpte2084|arib-std-b67/.test(space.t ?? "");
for (const s of segments) {
  const v = probeVideo(path.join(SRC, s.src));
  if (v.color_transfer !== space.t || v.width !== v.height)
    throw new Error(`${s.src}: expected a square ${space.t} clip like the others, got ${v.width}x${v.height} ${v.color_transfer}`);
}
console.log(`${segments.length} clips, ${space.t}${hdr ? " (HDR, kept as shot)" : ""}, ${W}x${H} @ ${FPS}`);

/* --------------------------------------------------------------- cards */

const work = path.join(HERE, "work", "story");
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });
const logo = `data:image/png;base64,${fs.readFileSync(path.join(PUBLIC, "logo.png")).toString("base64")}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const shell = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces(FONTS)}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;background:${BRAND.paper};overflow:hidden;
  font-family:Archivo,sans-serif;-webkit-font-smoothing:antialiased;color:${BRAND.ink}}
.eyebrow{font-weight:700;text-transform:uppercase;letter-spacing:.18em;font-size:26px;color:${BRAND.forest}}
.mark{position:absolute;left:50%;transform:translateX(-50%);top:252px;height:66px;width:auto}
.centre{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px}
.centre img{width:600px;height:auto}
.rule{width:130px;height:4px;background:${BRAND.forest}}
.url{font-weight:900;letter-spacing:.02em;font-size:50px;color:${BRAND.paper};background:${BRAND.forest};padding:20px 32px}
.band{position:absolute;left:60px;right:60px;top:${WIN.y + WIN.h + 42}px}
.name{font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.95;font-size:50px}
.lead{margin-top:16px;font-weight:900;letter-spacing:-.02em;line-height:1;font-size:66px;color:${BRAND.forest}}
.also{margin-top:14px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:24px;color:${BRAND.slate}}
</style></head><body>${body}</body></html>`;

const cards = {
  open: shell(`<div class="centre"><div class="eyebrow">Vintage wholesale · Lancashire, UK</div><img src="${logo}"></div>`),
  close: shell(`<div class="centre"><img src="${logo}"><div class="rule"></div><div class="url">${SITE}</div></div>`),
  ...Object.fromEntries(
    segments.map((s, i) => [
      `seg${i}`,
      shell(`<img class="mark" src="${logo}"><div class="band">
        <div class="name">${esc(s.name)}</div><div class="lead">${esc(s.lead)}</div><div class="also">${esc(s.also)}</div></div>`),
    ]),
  ),
};

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
for (const [name, html] of Object.entries(cards)) {
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(work, `${name}.png`) });
}
await browser.close();

/* -------------------------------------------------------------- encode */

const pix = hdr ? "yuv420p10le" : "yuv420p";
// sRGB card → the clips' own space, white at ~0.78 of the signal (see polish.mjs).
const cardToClip = hdr
  ? `format=rgb24,zscale=tin=iec61966-2-1:pin=bt709:min=bt709:rin=full:t=${space.t}:p=${space.p}:m=${space.m}:r=tv:npl=270,format=${pix}`
  : `format=${pix}`;

// Inputs: open card; then per lot, its card and its clip; then close card.
const inputs = ["-loop", "1", "-t", String(OPEN), "-i", path.join(work, "open.png")];
segments.forEach((s, i) => {
  inputs.push("-loop", "1", "-t", String(SEG), "-i", path.join(work, `seg${i}.png`));
  inputs.push("-ss", String(s.ss), "-t", String(SEG), "-i", path.join(SRC, s.src));
});
inputs.push("-loop", "1", "-t", String(CLOSE), "-i", path.join(work, "close.png"));
const closeIdx = 1 + segments.length * 2;

const graph = [`[0:v]fps=${FPS},${cardToClip},setsar=1[open]`, `[${closeIdx}:v]fps=${FPS},${cardToClip},setsar=1[close]`];
segments.forEach((s, i) => {
  const c = 1 + i * 2, v = c + 1;
  graph.push(`[${c}:v]fps=${FPS},${cardToClip},setsar=1[c${i}]`);
  graph.push(`[${v}:v]setpts=PTS-STARTPTS,fps=${FPS},scale=${WIN.w}:${WIN.h}:flags=lanczos,setsar=1,format=${pix}[v${i}]`);
  graph.push(`[c${i}][v${i}]overlay=${WIN.x}:${WIN.y}:format=${hdr ? "yuv420p10" : "yuv420"}:shortest=1[s${i}]`);
});

// Crossfade the run together. Each xfade offset is where, in the timeline of
// what has been joined so far, the next join begins.
const streams = ["open", ...segments.map((_, i) => `s${i}`), "close"];
const durs = [OPEN, ...segments.map(() => SEG), CLOSE];
let running = durs[0], prev = streams[0];
streams.slice(1).forEach((name, i) => {
  const offset = running - FADE;
  const label = i === streams.length - 2 ? "v" : `x${i}`;
  graph.push(`[${prev}][${name}]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(3)}[${label}]`);
  running = offset + durs[i + 1];
  prev = label;
});
graph.push(`anullsrc=channel_layout=stereo:sample_rate=48000[a]`);
const total = running;

const dest = path.join(OUT, `${OUT_NAME}.mp4`);
ff([
  ...inputs,
  "-filter_complex", graph.join(";"),
  "-map", "[v]", "-map", "[a]", "-t", total.toFixed(3),
  ...(hdr
    ? ["-c:v", "libx265", "-preset", "slow", "-crf", "18", "-pix_fmt", pix, "-tag:v", "hvc1",
       "-color_primaries", space.p, "-color_trc", space.t, "-colorspace", space.m, "-color_range", "tv",
       "-x265-params", `colorprim=${space.p}:transfer=${space.t}:colormatrix=${space.m}:range=limited:log-level=error`]
    : ["-c:v", "libx264", "-preset", "slow", "-crf", "16", "-profile:v", "high", "-level", "4.2", "-pix_fmt", pix]),
  "-r", String(FPS), "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", dest,
]);

console.log(`${path.relative(REPO, dest)}  ${W}x${H}  ${total.toFixed(2)}s  ${(fs.statSync(dest).size / 1e6).toFixed(1)} MB`);
