import Image from "next/image";

/**
 * The Archive Wholesale wordmark — the owner's own artwork, at
 * public/logo.png, rather than a recreation in type.
 *
 * The file is a transparent PNG lifted from the supplied original, so it sits
 * on any background. Its two inks are black and the logo's own green
 * (#1D502C), which is a shade warmer than the site's forest (#0F4A2E) — that
 * difference is in the artwork and is deliberately preserved.
 *
 * To replace it, drop a new file at public/logo.png with the same 1200×296
 * proportions and update LOGO_W / LOGO_H if they change.
 */

const LOGO_W = 1200;
const LOGO_H = 296;

type LogoProps = {
  /** Rendered height of the wordmark. Width follows the artwork's proportions. */
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Set on the one instance that appears above the fold. */
  priority?: boolean;
};

const heights = {
  sm: "h-7",
  md: "h-10",
  lg: "h-14 sm:h-20",
  xl: "h-20 sm:h-28",
} as const;

export function Logo({ size = "md", className = "", priority = false }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Archive Wholesale"
      width={LOGO_W}
      height={LOGO_H}
      priority={priority}
      sizes="(max-width: 640px) 220px, 320px"
      className={`${heights[size]} w-auto ${className}`}
    />
  );
}
