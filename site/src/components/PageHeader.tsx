import Link from "next/link";

export type Crumb = { href: string; label: string };

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
}) {
  return (
    <div className="border-b border-ash">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide uppercase text-slate">
              {crumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  <Link href={crumb.href} className="transition-colors hover:text-forest">
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow text-forest">{eyebrow}</p>}
        <h1 className="display mt-3 text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate">{intro}</p>}
      </div>
    </div>
  );
}

/** Keyword-rich copy block that closes a category or listing page. */
export function SeoBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ash bg-smoke">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="display text-2xl sm:text-3xl">{heading}</h2>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate">{children}</div>
      </div>
    </section>
  );
}
