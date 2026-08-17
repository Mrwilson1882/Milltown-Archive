import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Trade enquiries for Archive Wholesale — UK vintage sportswear wholesale. Message us on WhatsApp, email us, or send an enquiry for custom bundles and volume pricing.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trade enquiries"
        title="Contact us"
        intro="Tell us what you sell and we will tell you what we have. Custom lots, specific size runs and larger volumes are all doable — just ask."
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div>
          <h2 className="display text-2xl">Send an enquiry</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate">
            Fields marked * are required. We reply to trade enquiries the same working day wherever
            we can.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-8">
          <div className="border-2 border-ink p-6">
            <h2 className="display text-xl">Quickest way to reach us</h2>

            {hasWhatsApp ? (
              <>
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  WhatsApp is the fastest route — send us a message and we will come straight back
                  with photos, prices and availability.
                </p>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-forest px-6 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-slate">
                WhatsApp enquiries are coming shortly. In the meantime, email us or use the form and
                we will pick it up from there.
              </p>
            )}

            <dl className="mt-6 space-y-4 border-t border-ash pt-6 text-sm">
              <div>
                <dt className="eyebrow text-slate">Email</dt>
                <dd className="mt-1.5">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="font-bold text-forest underline underline-offset-4"
                  >
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-slate">Based in</dt>
                <dd className="mt-1.5 text-slate">{siteConfig.location}</dd>
              </div>
              <div>
                <dt className="eyebrow text-slate">Trading as</dt>
                <dd className="mt-1.5 text-slate">
                  {siteConfig.name}, part of {siteConfig.parent} / {siteConfig.legalName}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-slate">Hours</dt>
                <dd className="mt-1.5 text-slate">Monday to Friday, 9am–5pm</dd>
              </div>
            </dl>
          </div>

          <div className="bg-smoke p-6">
            <h2 className="display text-lg">Before you write</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate">
              <li className="flex gap-3">
                <span aria-hidden="true" className="font-bold text-forest">
                  —
                </span>
                Tell us where you sell: shop, stall, online, or a mix.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="font-bold text-forest">
                  —
                </span>
                Say which brands and garment types move for you.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="font-bold text-forest">
                  —
                </span>
                Give us a rough volume and delivery destination so we can quote freight.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
