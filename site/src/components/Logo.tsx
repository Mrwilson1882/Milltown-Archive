/**
 * The Archive Wholesale wordmark, set in type rather than shipped as an image
 * so it stays crisp at every size and in high-contrast mode.
 *
 * Bold black italic "ARCHIVE" over tracked forest-green "WHOLESALE", matching
 * the supplied logo. If you would rather use the original artwork file, drop it
 * at public/logo.svg and swap the markup below for an <Image>.
 */

type LogoProps = {
  /** Scale of the wordmark. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Render in white for use on a dark ground. */
  inverted?: boolean;
  className?: string;
};

/**
 * `nudge` re-centres the second line: letter-spacing adds a trailing gap after
 * the final S, which otherwise pulls the word visually to the left.
 */
const sizes = {
  sm: { main: "text-xl", sub: "text-[0.5rem] tracking-[0.42em]", nudge: "translate-x-[0.21em]" },
  md: { main: "text-3xl", sub: "text-[0.6rem] tracking-[0.44em]", nudge: "translate-x-[0.22em]" },
  lg: {
    main: "text-5xl sm:text-6xl",
    sub: "text-[0.7rem] sm:text-xs tracking-[0.5em]",
    nudge: "translate-x-[0.25em]",
  },
  xl: {
    main: "text-6xl sm:text-8xl",
    sub: "text-xs sm:text-base tracking-[0.52em]",
    nudge: "translate-x-[0.26em]",
  },
} as const;

export function Logo({ size = "md", inverted = false, className = "" }: LogoProps) {
  const s = sizes[size];
  return (
    <span
      className={`inline-flex flex-col items-center leading-none ${className}`}
      aria-label="Archive Wholesale"
      role="img"
    >
      <span aria-hidden="true" className={`wordmark ${s.main} ${inverted ? "text-paper" : "text-ink"}`}>
        Archive
      </span>
      <span
        aria-hidden="true"
        className={`wordmark-sub ${s.sub} ${s.nudge} mt-[0.35em] ${
          inverted ? "text-paper/85" : "text-forest"
        }`}
      >
        Wholesale
      </span>
    </span>
  );
}
