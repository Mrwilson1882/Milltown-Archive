"use client";

import Image from "next/image";
import { useState } from "react";

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
 * The product reel: one big square, a row of square thumbnails under it, tap
 * a thumbnail to bring it up. Photographs first, then video — a photo sells
 * the look, the video proves the rail.
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
  const [active, setActive] = useState(0);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const current = items[Math.min(active, items.length - 1)];

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
            priority={priority && active === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      {items.length > 1 && (
        <div className="grid grid-cols-4 gap-3" role="tablist" aria-label="Product photos and video">
          {items.slice(0, 8).map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.src}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={item.kind === "video" ? `Play video: ${item.alt}` : item.alt}
                onClick={() => setActive(i)}
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
        </div>
      )}
    </div>
  );
}
