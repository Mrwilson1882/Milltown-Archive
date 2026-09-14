import { PageHeader, type Crumb } from "@/components/PageHeader";
import { ShopBrowser } from "@/components/ShopBrowser";
import { priceCeiling } from "@/data/catalogue";
import type { Listing } from "@/types/listing";

/**
 * Every browsing page — shop, category, edit, brand, department — is this.
 * One layout means a filter learned in one place works in all of them.
 */
export function SectionPage({
  eyebrow,
  title,
  blurb,
  seoCopy,
  crumbs,
  listings,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  seoCopy?: string;
  crumbs?: Crumb[];
  listings: Listing[];
}) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        blurb={blurb}
        crumbs={crumbs}
        count={listings.length}
      />

      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
        <ShopBrowser listings={listings} priceCeiling={priceCeiling(listings)} />
      </div>

      {seoCopy && (
        <div className="mx-auto max-w-[1400px] px-4 pb-6 sm:px-6 lg:px-10">
          <div className="max-w-3xl border-t rule pt-8">
            <p className="text-sm text-ink-2">{seoCopy}</p>
          </div>
        </div>
      )}
    </>
  );
}
