import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { brands, categoryPath } from "@/data/taxonomy";

/**
 * The labels we stock, rolling past under the hero.
 *
 * It answers the first question a trade buyer has — "whose stock is it?" —
 * before they have scrolled anywhere, and every name is a link, so the row
 * doubles as the shortest path into the brand pages.
 *
 * A brand shows its real mark when we hold the artwork and its name set in our
 * own type when we do not, so the row is complete either way and a new logo
 * only has to be dropped into public/images/brands to appear. The file is read
 * at build time, not in the browser, and inlined so the mark takes the link's
 * colour and turns green on hover with everything else.
 *
 * The list is rendered twice and slid left by half the track, which is what
 * makes the wrap invisible — see the marquee keyframes in globals.css.
 */
const marqueeBrands = brands.filter((b) => b.slug !== "mixed-brands");

const logoDir = path.join(process.cwd(), "public", "images", "brands");

/**
 * The brand's own artwork, ready to inline, or null if we do not hold it.
 *
 * `fill="currentColor"` is forced on so the mark inherits the link colour
 * rather than sitting at its own black, and the `<title>` is dropped because
 * the link already carries the brand name for a screen reader — left in, every
 * logo would be announced twice.
 */
function brandLogo(slug: string): string | null {
  try {
    return fs
      .readFileSync(path.join(logoDir, `${slug}.svg`), "utf8")
      .replace(/<title>.*?<\/title>/s, "")
      .replace(/\s(?:width|height|fill)="[^"]*"/g, "")
      .replace(/<svg/, '<svg fill="currentColor"');
  } catch {
    return null;
  }
}

const row = marqueeBrands.map((brand) => ({ ...brand, logo: brandLogo(brand.slug) }));

export function BrandMarquee() {
  return (
    <section aria-label="Brands we stock" className="border-b border-ash bg-paper py-5 sm:py-6">
      {/* The mask fades the row out at both ends so names enter and leave
          rather than being chopped off by the edge of the screen. */}
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div className="flex w-max animate-[marquee_60s_linear_infinite] hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {row.map((brand) => (
                <li key={brand.slug} className="px-6 sm:px-9">
                  <Link
                    href={categoryPath("brand", brand.slug)}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="flex h-8 items-center text-ink transition-colors hover:text-forest"
                  >
                    {brand.logo ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="block [&>svg]:h-6 [&>svg]:w-auto sm:[&>svg]:h-7"
                          // Brand artwork from our own public/images/brands folder,
                          // read at build time. No user input reaches this.
                          dangerouslySetInnerHTML={{ __html: brand.logo }}
                        />
                        <span className="sr-only">{brand.name}</span>
                      </>
                    ) : (
                      <span className="display text-lg whitespace-nowrap sm:text-2xl">
                        {brand.name}
                      </span>
                    )}
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
