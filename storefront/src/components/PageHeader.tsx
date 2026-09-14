import Link from "next/link";

export type Crumb = { href: string; label: string };

/** The standard page opening: breadcrumb, title, one line of context. */
export function PageHeader({
  eyebrow,
  title,
  blurb,
  crumbs = [],
  count,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  crumbs?: Crumb[];
  count?: number;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-10">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-5 text-xs text-ink-3">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <Link href={crumb.href} className="hover:text-brick">{crumb.label}</Link>
                <span aria-hidden>/</span>
              </li>
            ))}
            <li aria-current="page" className="text-ink-2">{title}</li>
          </ol>
        </nav>
      )}

      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="display text-[2.5rem] sm:text-[3.25rem]">{title}</h1>
        {count !== undefined && (
          <span className="numeric text-sm text-ink-3">
            {count} {count === 1 ? "piece" : "pieces"}
          </span>
        )}
      </div>

      {blurb && <p className="mt-3 max-w-2xl text-base text-ink-2">{blurb}</p>}
    </div>
  );
}
