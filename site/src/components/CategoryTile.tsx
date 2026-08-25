import Image from "next/image";
import Link from "next/link";
import type { Category, CategoryKind } from "@/data/taxonomy";
import { categoryPath } from "@/data/taxonomy";
import { productsInCategory } from "@/data/catalogue";

const kindLabel: Record<CategoryKind, string> = {
  brand: "Brand",
  type: "Product Type",
  collection: "Collection",
};

/**
 * The square image tile that carries the home page. The category name is set in
 * live type over the artwork rather than baked into it, so it stays sharp and
 * survives a swap to real photography.
 */
export function CategoryTile({
  category,
  kind,
  priority = false,
}: {
  category: Category;
  kind: CategoryKind;
  priority?: boolean;
}) {
  /**
   * Show our own stock rather than generated artwork wherever a product in this
   * category has been photographed. A real rail of Lacoste sells the category
   * better than an abstract tile — and better than a brand logo we have no
   * right to use.
   */
  const ownPhoto = productsInCategory(kind, category.slug).find((p) => p.photos?.[0])?.photos?.[0];
  const src = ownPhoto?.src ?? `/images/tiles/${category.art}.svg`;
  const alt = ownPhoto
    ? `${category.name} — ${ownPhoto.alt}`
    : `${category.name} — vintage wholesale lots`;

  return (
    <Link
      href={categoryPath(kind, category.slug)}
      className="group relative block aspect-square overflow-hidden border border-ash bg-smoke"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* White scrim so the caption stays legible without burying the photograph.
          Solid behind the text, then clears quickly — now that nearly every tile
          carries real stock, the garments need to read through it. */}
      <span className="absolute inset-0 bg-gradient-to-t from-paper from-28% via-paper/55 via-50% to-transparent to-72%" />

      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 sm:p-5">
        <span className="eyebrow text-forest">{kindLabel[kind]}</span>
        <span className="display text-xl leading-none sm:text-2xl">{category.name}</span>
        <span className="mt-1 hidden text-xs leading-snug text-slate sm:block">
          {category.blurb}
        </span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-forest uppercase">
          Shop now
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </span>
    </Link>
  );
}
