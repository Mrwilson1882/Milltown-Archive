"use client";

import { useState } from "react";

/**
 * The rail behind the headline.
 *
 * Footage of the owner's own lock-up, graded and cut to a seven-second loop
 * that starts and ends on the same frame. It is scenery, not content: blurred
 * a touch and sat under a dark scrim so the type stays the thing you read.
 * Nothing on the page depends on anyone seeing it.
 *
 * The poster paints first and stays put behind the video, so the band is never
 * empty while the file arrives and never collapses if it does not. Someone who
 * has asked for reduced motion gets the poster and nothing else.
 */
export function HeroVideo() {
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-ink">
      {/* The footage was shot in a lock-up under one strip light, so it is dim
          before anything is laid over it. Lifted and warmed here rather than in
          the encode, so the file stays small and the grade stays adjustable. */}
      <div className="absolute inset-0 brightness-[1.35] saturate-[1.15]">
        {/* The still. Always there, under everything. */}
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/videos/home/lockup-poster.jpg')",
            backgroundPosition: "58% 26%",
          }}
        />

        {!reducedMotion && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/videos/home/lockup-poster.jpg"
            /* Scaled up a shade so the blur has no soft edge to show at the sides.
               Framed on the upper rail, which is where the colour is — lower down
               the shot is a black coat and reads as nothing at all. */
            className="absolute inset-0 h-full w-full scale-105 object-cover object-[58%_26%] blur-[2px]"
          >
            <source src="/videos/home/lockup.mp4" type='video/mp4; codecs="avc1.640028"' />
          </video>
        )}
      </div>

      {/* One scrim, not two: stacking a flat layer under a gradient compounds to
          near-black and the rail disappears. Heaviest on the left where the
          headline sits, lifting to the right so the footage still reads as a
          room full of clothes rather than a dark wash. On a phone the type runs
          the full width, so there is no quiet right-hand side to lift into and
          the gradient stays firmer all the way across. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/76 via-ink/62 to-ink/46 sm:from-ink/72 sm:via-ink/46 sm:to-ink/24" />
    </div>
  );
}
