import { ProductCard } from "@/components/ProductCard";
import type { Listing } from "@/types/listing";

/** The standard grid: two up on a phone, four on a desktop. */
export function ProductGrid({
  listings,
  priorityCount = 4,
}: {
  listings: Listing[];
  priorityCount?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
      {listings.map((listing, index) => (
        <ProductCard
          key={listing.slug}
          listing={listing}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
