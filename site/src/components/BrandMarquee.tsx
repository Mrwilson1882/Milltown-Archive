import Link from "next/link";
import { brands, categoryPath } from "@/data/taxonomy";

/**
 * The labels we stock, rolling past under the hero.
 *
 * It answers the first question a trade buyer has — "whose stock is it?" —
 * before they have scrolled anywhere, and every name is a link, so the row
 * doubles as the shortest path into the brand pages.
 *
 * Set in our own type rather than as logo files. We have no licence to
 * reproduce anyone's wordmark, and a row of borrowed logos on a wholesaler's
 * site reads as a claim of endorsement rather than of stock. The names are the
 * honest version of the same signal.
 *
 * The list is rendered twice and slid left by half the track, which is what
 * makes the wrap invisible — see the marquee keyframes in globals.css.
 */
const marqueeBrands = brands.filter((b) => b.slug !== "mixed-brands");

export function BrandMarquee() {
  return (
    <section
      aria-label="Brands we stock"
      className="border-b border-ash bg-paper py-5 sm:py-6"
    >
      {/* The mask fades the row out at both ends so names enter and leave
          rather than being chopped off by the edge of the screen. */}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div
          className="flex w-max animate-[marquee_60s_linear_infinite] hover:[animation-play-state:paused]"
        >
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {marqueeBrands.map((brand) => (
                <li key={brand.slug} className="px-6 sm:px-9">
                  <Link
                    href={categoryPath("brand", brand.slug)}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="display block text-lg whitespace-nowrap text-ink transition-colors hover:text-forest sm:text-2xl"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
