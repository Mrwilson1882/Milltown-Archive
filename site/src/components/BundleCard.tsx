import Image from "next/image";
import Link from "next/link";
import type { Bundle } from "@/data/bundles";
import { priceLabel } from "@/lib/format";

export function BundleCard({ bundle, priority = false }: { bundle: Bundle; priority?: boolean }) {
  const photo = bundle.photos?.[0];
  const src = photo?.src ?? `/images/tiles/${bundle.art}.svg`;
  const alt = photo?.alt ?? `${bundle.name} — ${bundle.summary}`;

  return (
    <article className="group flex flex-col border border-ash transition-colors hover:border-ink">
      <Link href={`/bundles/${bundle.slug}`} className="relative block aspect-square overflow-hidden bg-smoke">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!bundle.inStock && (
          <span className="absolute top-3 left-3 bg-ink px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-paper uppercase">
            Sold out
          </span>
        )}
        <span className="absolute top-3 right-3 bg-forest px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-paper uppercase">
          {bundle.pieces} pieces
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="display text-base leading-tight sm:text-lg">
          <Link href={`/bundles/${bundle.slug}`} className="transition-colors hover:text-forest">
            {bundle.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-snug text-slate">{bundle.summary}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div className="flex gap-1.5">
            <dt className="font-bold">Sizes</dt>
            <dd className="text-slate">{bundle.sizeRun}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="font-bold">Weight</dt>
            <dd className="text-slate">approx. {bundle.weightKg}kg</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p
            className={`font-bold ${
              bundle.priceGBP === null ? "text-sm text-forest" : "display text-xl"
            }`}
          >
            {priceLabel(bundle.priceGBP)}
          </p>
          <Link
            href={`/bundles/${bundle.slug}`}
            className="inline-flex items-center bg-ink px-4 py-2 text-xs font-bold tracking-wide text-paper uppercase transition-colors group-hover:bg-forest"
          >
            View bundle
          </Link>
        </div>
      </div>
    </article>
  );
}
