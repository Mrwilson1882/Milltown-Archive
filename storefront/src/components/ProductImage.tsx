import Image from "next/image";

/**
 * One product photograph, or an honest stand-in for one.
 *
 * Most of the archive has no photography yet — the ledger is written from
 * voice notes and the Images column is blank until a shoot happens. Rather
 * than a grey box or, worse, a stock photo of something that is not the
 * garment, a missing picture is drawn as a patterned plate carrying the
 * piece's own initial, seeded from its slug so the same item always looks
 * the same.
 */

type Ratio = "portrait" | "square";

const RATIO_CLASS: Record<Ratio, string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
};

function seedNumber(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function ProductImage({
  src,
  alt,
  seed = alt,
  ratio = "portrait",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
  note = true,
  className = "",
}: {
  src: string | null | undefined;
  alt: string;
  seed?: string;
  ratio?: Ratio;
  sizes?: string;
  priority?: boolean;
  /** Set false on plates too small to carry the "photograph to follow" line. */
  note?: boolean;
  className?: string;
}) {
  const frame = `relative overflow-hidden bg-paper-2 ${RATIO_CLASS[ratio]} ${className}`;

  if (!src) {
    const n = seedNumber(seed);
    const angle = 15 + (n % 60);
    const gap = 7 + (n % 9);
    const initial = alt.trim().charAt(0).toUpperCase() || "M";

    return (
      <div className={frame} role="img" aria-label={`${alt} — photograph to follow`}>
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: `repeating-linear-gradient(${angle}deg, var(--color-ink) 0 1px, transparent 1px ${gap}px)`,
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <span className="display text-ink-3/70 text-[3.5rem] leading-none select-none">
            {initial}
          </span>
        </div>
        {note && (
          <span className="absolute bottom-2 left-2 right-2 truncate text-[0.625rem] uppercase tracking-[0.12em] text-ink-3">
            Photograph to follow
          </span>
        )}
      </div>
    );
  }

  // Photography served from /public is optimised by Next. A full URL means the
  // photos have moved to a CDN, which needs its hostname in next.config.ts
  // before next/image will touch it — so those are rendered plainly.
  const isRemote = /^https?:\/\//i.test(src);

  return (
    <div className={frame}>
      {isRemote ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className="media-fade absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="media-fade object-cover"
        />
      )}
    </div>
  );
}
