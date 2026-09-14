"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ProductImage";

/**
 * The photographs of one piece.
 *
 * Vintage is bought on the pictures — the fault, the fade, the label — so the
 * main frame is as large as the column allows and every other shot is one tap
 * away rather than behind a carousel arrow.
 */
export function ProductGallery({
  images,
  title,
  seed,
}: {
  images: string[];
  title: string;
  seed: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? null;

  return (
    <div>
      <ProductImage
        src={current}
        alt={images.length > 1 ? `${title} — photograph ${active + 1} of ${images.length}` : title}
        seed={seed}
        priority
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="rounded-card"
      />

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photograph ${index + 1}`}
              aria-current={index === active}
              className={`overflow-hidden rounded-card border transition-colors ${
                index === active ? "border-brick" : "border-transparent hover:border-line"
              }`}
            >
              <ProductImage
                src={image}
                alt=""
                seed={`${seed}-${index}`}
                ratio="square"
                sizes="100px"
                note={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
