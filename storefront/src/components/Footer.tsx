import Link from "next/link";
import { siteConfig, hasWhatsApp, whatsappUrl } from "@/config/site";
import type { NavSection } from "@/components/Header";

const HELP_LINKS = [
  { href: "/about", label: "About the archive" },
  { href: "/condition-guide", label: "Condition & grading" },
  { href: "/sizing", label: "Sizing & measurements" },
  { href: "/delivery-returns", label: "Delivery & returns" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer({ types, brands }: { types: NavSection[]; brands: NavSection[] }) {
  const socials = Object.entries(siteConfig.social).filter(([, url]) => url);

  return (
    <footer className="mt-24 border-t rule bg-paper-2">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <p className="display text-2xl">
              Milltown <span className="italic text-brick">Archive</span>
            </p>
            <p className="mt-3 text-sm text-ink-2">{siteConfig.description}</p>
            <p className="mt-4 text-sm text-ink-3">{siteConfig.location}</p>
          </div>

          <div>
            <p className="eyebrow">Shop</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-brick">Everything</Link>
              </li>
              {types.slice(0, 7).map((type) => (
                <li key={type.slug}>
                  <Link href={`/shop/${type.slug}`} className="hover:text-brick">
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Brands</p>
            <ul className="mt-3 space-y-2 text-sm">
              {brands.slice(0, 7).map((brand) => (
                <li key={brand.slug}>
                  <Link href={`/brands/${brand.slug}`} className="hover:text-brick">
                    {brand.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/brands" className="text-ink-3 hover:text-brick">
                  All brands
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Help</p>
            <ul className="mt-3 space-y-2 text-sm">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brick">{link.label}</Link>
                </li>
              ))}
            </ul>

            <p className="eyebrow pt-6">Get in touch</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-brick">
                  {siteConfig.email}
                </a>
              </li>
              {hasWhatsApp && (
                <li>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brick"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="capitalize hover:text-brick"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t rule pt-6">
          <a
            href={siteConfig.wholesale.url}
            className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm"
          >
            <span className="eyebrow">Trade</span>
            <span className="text-ink-2">{siteConfig.wholesale.blurb}</span>
            <span className="text-brick group-hover:underline underline-offset-4">
              {siteConfig.wholesale.name} →
            </span>
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t rule pt-6 text-xs text-ink-3">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          <p>Company number {siteConfig.companyNumber}</p>
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brick">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
