"use client";

import { useState } from "react";

/**
 * The rail behind the headline.
 *
 * Footage of the owner's own unit: the counted lots bagged on the floor, then
 * the rails they come off. It is scenery, not content, and sits under a dark
 * scrim so the type stays the thing you read. Nothing on the page depends on
 * anyone seeing it.
 *
 * The walk is played forwards and then backwards, which is what makes the loop
 * seamless — there is no cut anywhere in it, so nothing jumps. A crossfaded
 * loop was the first attempt and the join read as a lurch every few seconds.
 *
 * No CSS blur. The clip was shot walking, so every frame already carries its
 * own motion blur; a frame straight from the phone is as soft as the shipped
 * encode. Blurring further only made that worse, and the darkness of the scrim
 * is what settles the footage behind the headline instead.
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
      {/* Grade, kept here rather than baked into the encode so it stays
          adjustable when the footage changes. This clip came off the phone
          brighter than the last one, so it is held back rather than lifted —
          a bright background and light type fight each other. */}
      <div className="absolute inset-0 brightness-[0.98] saturate-[1.08]">
        {/* The still. Always there, under everything. */}
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/videos/home/lockup-poster.jpg')",
            backgroundPosition: "50% 42%",
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
            /* The clip is 16:9 and the band is close to it, so this is barely a
               crop — pulled down a little to keep the rail rather than the roof. */
            className="absolute inset-0 h-full w-full object-cover object-[50%_42%]"
          >
            {/* Two files, picked once at load. A phone's band is about 1,170
                device pixels across, so the 720p file lands on it close to one
                for one and the larger download would buy nothing. A desktop
                band at two times the pixel ratio is nearer 2,900 across, which
                is where the smaller file showed as soft. */}
            <source
              src="/videos/home/lockup-1080.mp4"
              media="(min-width: 768px)"
              type='video/mp4; codecs="avc1.640028"'
            />
            <source src="/videos/home/lockup.mp4" type='video/mp4; codecs="avc1.640028"' />
          </video>
        )}
      </div>

      {/* One scrim, not two: stacking a flat layer under a gradient compounds to
          near-black and the rail disappears. Heaviest on the left where the
          headline sits, lifting to the right so the footage still reads as a
          room full of clothes rather than a dark wash. On a phone the type runs
          the full width, so there is no quiet right-hand side to lift into and
          the gradient stays firmer all the way across.

          Deeper than it needs to be for legibility alone. The footage is soft
          at source and a dark frame hides that in a way sharpening cannot. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/84 via-ink/72 to-ink/58 sm:from-ink/82 sm:via-ink/60 sm:to-ink/40" />
    </div>
  );
}
