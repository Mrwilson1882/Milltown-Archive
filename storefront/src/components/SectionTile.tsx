import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import type { Section } from "@/data/taxonomy";

/**
 * A category tile. Fronted by a real garment from inside the category wherever
 * one has been photographed, so the tile shows the thing rather than a mood.
 */
export function SectionTile({
  section,
  href,
  cover,
  count,
}: {
  section: Section;
  href: string;
  cover: string | null;
  count?: number;
}) {
  return (
    <Link href={href} className="group block">
      <ProductImage
        src={cover}
        alt={section.name}
        seed={section.art}
        ratio="square"
        sizes="(max-width: 640px) 50vw, 25vw"
        className="rounded-card transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.012]"
      />
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="display text-xl group-hover:text-brick transition-colors">
          {section.name}
        </h3>
        {count !== undefined && (
          <span className="numeric text-xs text-ink-3">{count}</span>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-2">{section.blurb}</p>
    </Link>
  );
}
