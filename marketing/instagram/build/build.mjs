/**
 * Renders the Instagram adverts.
 *
 *   node build.mjs [adId ...]
 *
 * Two layers. The footage layer is cut and placed by ffmpeg; the brand layer —
 * white ground, type, logo — is drawn frame by frame in Chromium with a
 * transparent background and laid over the top. Keeping them apart means the
 * typography is real CSS at full resolution and the footage is never re-scaled
 * by a browser.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { LAYOUTS } from "./layouts.mjs";
import { ADS } from "./ads.mjs";
import { buildHtml } from "./overlay.mjs";

const HERE = import.meta.dirname;
const REPO = path.resolve(HERE, "../../..");
/** The footage, photography and wordmark all come from the web build. */
const PUBLIC = path.join(REPO, "site/public");
const FFMPEG = path.join(HERE, "node_modules/ffmpeg-static/ffmpeg");
const FONTS = path.join(HERE, "node_modules/@fontsource/archivo/files");
/** Any Chromium will do. CHROME=/path/to/chrome overrides Playwright's own. */
const CHROME = process.env.CHROME || undefined;
/** Finished adverts land beside this folder, where they are committed. */
const OUT = path.resolve(HERE, "..");
const WORK = path.join(HERE, "work");
const FPS = 30;

const ff = (args) =>
  execFileSync(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...args], {
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 1 << 28,
  });

const frames = (seconds) => Math.round(seconds * FPS);

/**
 * Where the garments actually sit in a shot-on-white photograph. The lots are
 * laid out with a generous white margin, which reads as a small pile floating
 * in space once it is dropped into the media window — so each still is cropped
 * to a square around its own content, with a little air left round the edge.
 */
const bboxCache = new Map();
function contentSquare(src) {
  if (bboxCache.has(src)) return bboxCache.get(src);
  const N = 400;
  const gray = execFileSync(
    FFMPEG,
    ["-v", "error", "-i", src, "-vf", `scale=${N}:${N}`, "-pix_fmt", "gray", "-f", "rawvideo", "-"],
    { maxBuffer: 1 << 26 },
  );
  let x0 = N, y0 = N, x1 = -1, y1 = -1;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (gray[y * N + x] < 242) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  let box = null;
  if (x1 >= x0) {
    const air = 0.06;
    let side = Math.max((x1 - x0 + 1) / N, (y1 - y0 + 1) / N) + air * 2;
    side = Math.min(side, 1);
    const cx = Math.min(Math.max((x0 + x1 + 1) / 2 / N, side / 2), 1 - side / 2);
    const cy = Math.min(Math.max((y0 + y1 + 1) / 2 / N, side / 2), 1 - side / 2);
    box = { side, cx, cy };
  }
  bboxCache.set(src, box);
  return box;
}


/* ------------------------------------------------------------------ footage */

/** One shot, placed in the media window on a white canvas. */
function renderShot(shot, L, dest) {
  const n = frames(shot.dur);
  const { x, y, w, h } = L.media;
  const canvas = `color=c=white:s=${L.W}x${L.H}:r=${FPS}`;

  if (shot.kind === "plain") {
    ff(["-f", "lavfi", "-i", canvas, "-frames:v", String(n),
      "-c:v", "libx264", "-crf", "14", "-preset", "veryfast", "-pix_fmt", "yuv420p", dest]);
    return n;
  }

  const src = path.join(PUBLIC, shot.src);
  // "cover" fills the window and loses the overspill; "contain" fits the whole
  // frame and pads with white, which is invisible against the white ground.
  const fit =
    shot.fit === "contain"
      ? `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:white`
      : `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`;

  if (shot.kind === "video") {
    ff([
      "-f", "lavfi", "-i", canvas,
      "-ss", String(shot.ss ?? 0), "-i", src,
      "-filter_complex",
      `[1:v]fps=${FPS},setpts=PTS-STARTPTS,${fit},setsar=1[m];[0:v][m]overlay=${x}:${y}[o]`,
      "-map", "[o]", "-frames:v", String(n),
      "-c:v", "libx264", "-crf", "14", "-preset", "veryfast", "-pix_fmt", "yuv420p", dest,
    ]);
    return n;
  }

  // Stills get a slow push in. Oversampling to 2600px first keeps zoompan's
  // stepping below a pixel, so the move reads as smooth rather than ratcheted.
  const z = shot.zoom ?? 0.08;
  const S = 2600;
  const box = shot.autoCrop === false ? null : contentSquare(src);
  const pre = box
    ? `crop=iw*${box.side.toFixed(4)}:ih*${box.side.toFixed(4)}:` +
      `iw*${(box.cx - box.side / 2).toFixed(4)}:ih*${(box.cy - box.side / 2).toFixed(4)},`
    : "";
  ff([
    "-f", "lavfi", "-i", canvas,
    "-loop", "1", "-i", src,
    "-filter_complex",
    `[1:v]${pre}scale=${S}:${S}:force_original_aspect_ratio=decrease,` +
      `pad=${S}:${S}:(ow-iw)/2:(oh-ih)/2:white,` +
      `zoompan=z='1+${z}*on/${n - 1}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':` +
      `d=${n}:s=${S}x${S}:fps=${FPS},${fit},setsar=1[m];[0:v][m]overlay=${x}:${y}[o]`,
    "-map", "[o]", "-frames:v", String(n),
    "-c:v", "libx264", "-crf", "14", "-preset", "veryfast", "-pix_fmt", "yuv420p", dest,
  ]);
  return n;
}

function buildFootage(ad, L, dir) {
  const parts = [];
  let total = 0;
  ad.shots.forEach((shot, i) => {
    const dest = path.join(dir, `shot-${String(i).padStart(2, "0")}.mp4`);
    total += renderShot(shot, L, dest);
    parts.push(dest);
  });
  const list = path.join(dir, "concat.txt");
  fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n"));
  const out = path.join(dir, "footage.mp4");
  ff(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", out]);
  return { out, total };
}

/* ------------------------------------------------------------- brand layer */

async function buildOverlay(ad, L, dir, browser) {
  const logo = `data:image/png;base64,${fs.readFileSync(path.join(PUBLIC, "logo.png")).toString("base64")}`;
  const html = buildHtml(ad, L, { fontDir: FONTS, logoDataUri: logo });
  fs.writeFileSync(path.join(dir, "overlay.html"), html);

  const page = await browser.newPage({
    viewport: { width: L.W, height: L.H },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  // Instagram paints its own chrome over the top and bottom of a story, so
  // nothing that matters may sit outside the safe band. And a scene's copy has
  // to stay in the white below the window — green type over the footage is
  // unreadable.
  const safeTop = L.id === "story" ? 250 : 0;
  const safeBottom = L.id === "story" ? 1670 : L.H;
  const bandTop = L.media.y + L.media.h;
  const problems = [];
  for (const m of await page.evaluate(() => window.measureScenes())) {
    const label = `${ad.id}/${L.id} scene @${m.start}s`;
    if (m.kind.includes("copy") && m.top < bandTop - 1)
      problems.push(`${label}: copy rides ${Math.round(bandTop - m.top)}px up over the window`);
    if (m.top < safeTop - 1 || m.bottom > safeBottom + 1)
      problems.push(`${label}: ${Math.round(m.top)}–${Math.round(m.bottom)} outside safe ${safeTop}–${safeBottom}`);
  }
  if (problems.length) {
    await page.close();
    throw new Error("layout:\n  " + problems.join("\n  "));
  }

  const framesDir = path.join(dir, "overlay");
  fs.mkdirSync(framesDir, { recursive: true });
  const n = frames(ad.duration);
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => window.renderFrame(t), i / FPS);
    await page.screenshot({
      path: path.join(framesDir, `${String(i + 1).padStart(5, "0")}.png`),
      omitBackground: true,
    });
  }
  await page.close();
  return { framesDir, n };
}

/* ------------------------------------------------------------------ encode */

function encode(footage, framesDir, n, L, dest) {
  ff([
    "-i", footage,
    "-framerate", String(FPS), "-i", path.join(framesDir, "%05d.png"),
    "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-filter_complex", "[0:v][1:v]overlay=0:0:format=auto,format=yuv420p[v]",
    "-map", "[v]", "-map", "2:a",
    "-frames:v", String(n), "-shortest",
    "-c:v", "libx264", "-profile:v", "high", "-level", "4.1",
    "-preset", "slow", "-crf", "20", "-maxrate", "8M", "-bufsize", "12M",
    "-r", String(FPS), "-g", String(FPS * 2),
    "-c:a", "aac", "-b:a", "128k", "-ar", "44100",
    "-movflags", "+faststart", dest,
  ]);
}

/**
 * The opening frame is the cover image Instagram shows before anything plays,
 * so it has to have the garment in it. Flat white means the footage layer
 * started late and the window opened empty.
 */
function assertOpeningFrameHasContent(file, L, tag) {
  const { x, y, w, h } = L.media;
  const N = 64;
  const gray = execFileSync(
    FFMPEG,
    ["-v", "error", "-i", file, "-vf", `crop=${w}:${h}:${x}:${y},scale=${N}:${N}`,
     "-frames:v", "1", "-pix_fmt", "gray", "-f", "rawvideo", "-"],
    { maxBuffer: 1 << 22 },
  );
  let min = 255, max = 0;
  for (const v of gray) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (max - min < 12) throw new Error(`${tag}: opening frame is blank (media window ${min}-${max})`);
}

/* -------------------------------------------------------------------- main */

const wanted = process.argv.slice(2);
const todo = wanted.length ? ADS.filter((a) => wanted.includes(a.id)) : ADS;

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});

for (const ad of todo) {
  for (const L of Object.values(LAYOUTS)) {
    const tag = `${ad.id}-${L.id}`;
    const dir = path.join(WORK, tag);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });

    const t0 = Date.now();
    const { out: footage, total } = buildFootage(ad, L, dir);
    const { framesDir, n } = await buildOverlay(ad, L, dir, browser);
    const dest = path.join(OUT, `${tag}.mp4`);
    encode(footage, framesDir, Math.min(n, total), L, dest);

    assertOpeningFrameHasContent(dest, L, tag);

    const mb = (fs.statSync(dest).size / 1e6).toFixed(2);
    console.log(
      `${tag.padEnd(38)} ${L.W}x${L.H}  ${(n / FPS).toFixed(2)}s  ${n} frames  ${mb} MB  ` +
        `(${((Date.now() - t0) / 1000).toFixed(0)}s)`,
    );
  }
}

await browser.close();
