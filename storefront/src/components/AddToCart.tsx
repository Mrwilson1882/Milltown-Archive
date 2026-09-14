"use client";

import Link from "next/link";
import { useState } from "react";
import { addLine } from "@/lib/cart";
import { useCart } from "@/components/useCart";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";
import type { Listing } from "@/types/listing";

/**
 * The buy button, or the honest alternative to one.
 *
 * A piece with no price cannot be added to a bag, because there is no price to
 * charge. It gets a message button instead — the same rule as the ledger: the
 * owner sets every price, nothing here invents one.
 */
export function AddToCart({ listing }: { listing: Listing }) {
  const { lines, ready } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inBag = lines.some((line) => line.slug === listing.slug);

  if (!listing.inStock) {
    return (
      <div className="space-y-3">
        <p className="border rule bg-paper-2 px-4 py-3 text-sm text-ink-2">
          This one has sold. It was the only one.
        </p>
        <Link href="/shop" className="block text-sm text-brick hover:underline">
          See what else is in →
        </Link>
      </div>
    );
  }

  if (listing.priceGBP === null) {
    const enquiry = `${siteConfig.whatsappMessage}${listing.title}${
      listing.size ? ` (${listing.size})` : ""
    }`;

    return (
      <div className="space-y-3">
        <p className="text-sm text-ink-2">
          This piece has not been priced yet. Ask and it will be priced for you.
        </p>
        <div className="flex flex-wrap gap-3">
          {hasWhatsApp && (
            <a
              href={whatsappUrl(enquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-brick"
            >
              Ask on WhatsApp
            </a>
          )}
          <a
            href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(listing.title)}`}
            className="border rule px-6 py-3 text-sm transition-colors hover:border-brick hover:text-brick"
          >
            Email us
          </a>
        </div>
      </div>
    );
  }

  const add = () => {
    addLine(
      {
        slug: listing.slug,
        title: listing.title,
        priceGBP: listing.priceGBP,
        image: listing.images[0] ?? null,
        size: listing.size,
        brand: listing.brand,
      },
      listing.quantity,
    );
    setJustAdded(true);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={add}
        disabled={!ready || inBag}
        className="w-full bg-ink px-6 py-3.5 text-sm text-paper transition-colors hover:bg-brick disabled:cursor-not-allowed disabled:bg-ink-3"
      >
        {inBag ? "In your bag" : "Add to bag"}
      </button>

      {(inBag || justAdded) && (
        <Link
          href="/cart"
          className="block border rule px-6 py-3 text-center text-sm transition-colors hover:border-brick hover:text-brick"
        >
          Go to bag →
        </Link>
      )}

      <p className="text-xs text-ink-3">
        One of one. Once it is gone it is not coming back.
      </p>
    </div>
  );
}
