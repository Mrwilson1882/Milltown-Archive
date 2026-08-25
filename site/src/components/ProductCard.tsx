import Image from "next/image";
import Link from "next/link";
import { quantityLabel, type Product } from "@/data/catalogue";
import { perPiece } from "@/lib/format";
import { siteConfig } from "@/config/site";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const photo = product.photos?.[0];
  const src = photo?.src ?? `/images/tiles/${product.art}.svg`;
  const alt = photo?.alt ?? `${product.name} — ${product.summary}`;

  const hasChoice = product.variants.length > 1;
  // Cards lead on the per-piece rate — the number a buyer actually compares.
  const cheapestLot = product.variants
    .filter((v) => v.priceGBP !== null)
    .sort((a, b) => a.priceGBP! / a.pieces - b.priceGBP! / b.pieces)[0];

  return (
    <article className="group flex flex-col border border-ash transition-colors hover:border-ink">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-smoke"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-ink px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-paper uppercase">
            Sold out
          </span>
        )}
        {product.variants.length > 0 && (
          <span className="absolute top-3 right-3 bg-forest px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-paper uppercase">
            {hasChoice
              ? `${product.variants[0].pieces}–${product.variants[product.variants.length - 1].pieces} ${product.unit}`
              : `${product.variants[0].pieces} ${product.unit}`}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="display text-base leading-tight sm:text-lg">
          <Link href={`/products/${product.slug}`} className="transition-colors hover:text-forest">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-snug text-slate">{product.summary}</p>

        <p className="mt-4 text-xs">
          <span className="font-bold">Lot sizes</span>{" "}
          <span className="text-slate">{quantityLabel(product)}</span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className={`font-bold ${cheapestLot === undefined ? "text-sm text-forest" : "display text-xl"}`}>
            {cheapestLot === undefined ? (
              "Price on request"
            ) : (
              <>
                {hasChoice && (
                  <span className="mr-1 text-xs font-semibold tracking-normal text-slate normal-case">
                    from
                  </span>
                )}
                {perPiece(cheapestLot.priceGBP as number, cheapestLot.pieces)}
                <span className="ml-1 text-xs font-semibold tracking-normal text-slate normal-case">
                  per {product.unit === "pairs" ? "pair" : "piece"} {siteConfig.vat.suffix}
                </span>
              </>
            )}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center bg-ink px-4 py-2 text-xs font-bold tracking-wide text-paper uppercase transition-colors group-hover:bg-forest"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
