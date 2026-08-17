import Link from "next/link";
import { Logo } from "@/components/Logo";
import { brands, collections, productTypes } from "@/data/taxonomy";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";

function Column({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="eyebrow text-slate">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-medium text-ink transition-colors hover:text-forest"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo size="md" className="items-start" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate">
              {siteConfig.description}
            </p>
            <dl className="mt-6 space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="font-bold">Email</dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-forest underline underline-offset-4"
                  >
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              {hasWhatsApp && (
                <div className="flex gap-2">
                  <dt className="font-bold">WhatsApp</dt>
                  <dd>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forest underline underline-offset-4"
                    >
                      Message us
                    </a>
                  </dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="font-bold">Based in</dt>
                <dd className="text-slate">{siteConfig.location}</dd>
              </div>
            </dl>
          </div>

          <Column
            title="Brands"
            links={brands.map((b) => ({ href: `/brands/${b.slug}`, label: b.name }))}
          />
          <Column
            title="Product Types"
            links={productTypes.map((t) => ({ href: `/types/${t.slug}`, label: t.name }))}
          />
          <Column
            title="Collections"
            links={[
              ...collections.map((c) => ({ href: `/collections/${c.slug}`, label: c.name })),
              { href: "/bundles", label: "All Bundles" },
              { href: "/contact", label: "Contact Us" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ash pt-6 text-xs text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Part of {siteConfig.parent} /{" "}
            {siteConfig.legalName}.
          </p>
          <p>Wholesale only. Trade enquiries welcome.</p>
        </div>
      </div>
    </footer>
  );
}
