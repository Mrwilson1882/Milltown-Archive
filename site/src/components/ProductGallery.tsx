"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type GalleryItem =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string; alt: string; hdr?: string };

/**
 * MIME types with codec strings, so a browser decides from the tag alone and
 * never downloads a file it cannot decode. The HDR string is read from the
 * files themselves (Main 10 profile, level 4); the H.264 one is High 4.0.
 */
const HDR_TYPE = 'video/mp4; codecs="hvc1.2.4.L120.90"';
const SDR_TYPE = 'video/mp4; codecs="avc1.640028"';

/**
 * The product reel.
 *
 * The video leads, always: it is the only thing on the page that shows the
 * volume and the condition of a real rail, and it is what converts. The
 * photographs sit behind a single tile marked "Example product pictures" and
 * open in a viewer the buyer steps through.
 *
 * Keeping them behind one door is deliberate. A row of eight individual
 * garment thumbnails reads as a catalogue of what is in the box, which is the
 * one thing these lots are not — stock is counted out from a fresh intake at
 * dispatch. The tile and the viewer both say so in as many words.
 *
 * Video plays the way a reel does: muted, looping, inline on a phone, no
 * fullscreen hijack. Someone who has asked for reduced motion gets a still
 * with ordinary controls instead of autoplay.
 */
export function ProductGallery({
  items,
  priority = false,
}: {
  items: GalleryItem[];
  /** Set on the one gallery that sits above the fold. */
  priority?: boolean;
}) {
  const videos = items.filter((item): item is Extract<GalleryItem, { kind: "video" }> =>
    item.kind === "video",
  );
  const photos = items.filter((item): item is Extract<GalleryItem, { kind: "image" }> =>
    item.kind === "image",
  );

  // Video first, always. Photographs only take the stage when there is no video.
  const stageItems: GalleryItem[] = videos.length > 0 ? videos : photos.slice(0, 1);

  const [stage, setStage] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const current = stageItems[Math.min(stage, stageItems.length - 1)];
  const tiles = stageItems.length + (photos.length > 0 ? 1 : 0);

  // Plain functions: the React Compiler memoizes these, and a manual
  // useCallback here only stops it optimising the component at all.
  const close = () => setViewer(null);
  const step = (delta: number) =>
    setViewer((n) => (n === null ? null : (n + delta + photos.length) % photos.length));

  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden border border-ash bg-smoke">
        {current.kind === "video" ? (
          <video
            key={current.src}
            poster={current.poster}
            autoPlay={!reducedMotion}
            controls={reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={current.alt}
            className="h-full w-full object-cover"
          >
            {/* Sources are tried in order: the HDR original where it plays, else the standard file. */}
            {current.hdr && <source src={current.hdr} type={HDR_TYPE} />}
            <source src={current.src} type={SDR_TYPE} />
          </video>
        ) : (
          <Image
            src={current.src}
            alt={current.alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      {tiles > 1 && (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${Math.min(tiles, 4)}, minmax(0, 1fr))` }}
        >
          {stageItems.map((item, i) => {
            const selected = i === stage;
            return (
              <button
                key={item.src}
                type="button"
                aria-pressed={selected}
                aria-label={item.kind === "video" ? `Play video: ${item.alt}` : item.alt}
                onClick={() => setStage(i)}
                className={`relative aspect-square overflow-hidden border-2 bg-smoke transition-colors ${
                  selected ? "border-forest" : "border-ash hover:border-ink"
                }`}
              >
                <Image
                  src={item.kind === "video" ? item.poster : item.src}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
                {item.kind === "video" && (
                  <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-ink/80 text-paper shadow">
                      <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                )}
              </button>
            );
          })}

          {photos.length > 0 && (
            <button
              type="button"
              onClick={() => setViewer(0)}
              aria-label={`Example product pictures — ${photos.length} ${
                photos.length === 1 ? "photograph" : "photographs"
              } of the kind of pieces in this line, not the items you will receive`}
              className="relative aspect-square overflow-hidden border-2 border-ash bg-smoke transition-colors hover:border-ink"
            >
              <Image src={photos[0].src} alt="" fill sizes="25vw" className="object-cover" />
              <span aria-hidden="true" className="absolute inset-0 bg-ink/65" />
              <span
                aria-hidden="true"
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2 text-center text-paper"
              >
                <span className="text-[0.62rem] leading-tight font-bold tracking-wide uppercase sm:text-xs">
                  Example product
                  <br />
                  pictures
                </span>
                <span className="text-[0.62rem] tabular-nums opacity-80 sm:text-xs">
                  {photos.length}
                </span>
              </span>
            </button>
          )}
        </div>
      )}

      {viewer !== null && (
        <PhotoViewer
          photos={photos}
          index={viewer}
          onClose={close}
          onStep={step}
          onJump={setViewer}
        />
      )}
    </div>
  );
}

/**
 * The example-pictures viewer.
 *
 * Full-bleed on a phone, a panel on a desktop. The line about these not being
 * the pieces you receive is fixed to the top of the frame rather than dropped
 * under the image, because it is the whole reason the photographs are behind a
 * door in the first place.
 */
function PhotoViewer({
  photos,
  index,
  onClose,
  onStep,
  onJump,
}: {
  photos: Extract<GalleryItem, { kind: "image" }>[];
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
  onJump: (n: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = photos[index];

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
    }
    document.addEventListener("keydown", onKey);
    // The page behind must not scroll while the viewer is up.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, onStep]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Example product pictures"
      className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-full w-full max-w-3xl flex-col gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-wide text-paper uppercase">
              Example product pictures
            </p>
            <p className="mt-1 text-xs leading-relaxed text-paper/70">
              Pieces from a previous intake, shown so you can judge the brands and condition.{" "}
              <strong className="text-paper">These are not the items you will receive</strong> — lots
              are counted out from a fresh intake at dispatch.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close example pictures"
            className="shrink-0 border-2 border-paper/40 px-3 py-2 text-xs font-bold tracking-wide text-paper uppercase transition-colors hover:border-paper"
          >
            Close
          </button>
        </div>

        <div className="relative min-h-0 flex-1 bg-paper">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
          />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onStep(-1)}
                aria-label="Previous picture"
                className="absolute top-1/2 left-2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-paper transition-colors hover:bg-ink"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onStep(1)}
                aria-label="Next picture"
                className="absolute top-1/2 right-2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-paper transition-colors hover:bg-ink"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M8.6 7.4 10 6l6 6-6 6-1.4-1.4 4.6-4.6z" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs tabular-nums text-paper/70">
            {index + 1} / {photos.length}
          </p>
          {photos.length > 1 && (
            <div className="flex flex-wrap justify-end gap-1.5">
              {photos.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => onJump(i)}
                  aria-label={`Picture ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i === index ? "bg-paper" : "bg-paper/35 hover:bg-paper/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
