import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Milltown Archive — ask for measurements, ask after a label or a size, or ask about a piece you have seen.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Ask us anything"
        blurb="Measurements, a label you are hunting, a question about a fault — whatever it is, ask before you order."
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div className="max-w-xl">
            <ContactForm />
          </div>

          <aside className="space-y-6 text-sm">
            <div>
              <p className="eyebrow">Email</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-1 block hover:text-brick"
              >
                {siteConfig.email}
              </a>
            </div>

            {hasWhatsApp && (
              <div>
                <p className="eyebrow">WhatsApp</p>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block hover:text-brick"
                >
                  Message us
                </a>
                <p className="mt-1 text-xs text-ink-3">
                  Quickest for measurements and photographs.
                </p>
              </div>
            )}

            <div>
              <p className="eyebrow">Where we are</p>
              <p className="mt-1 text-ink-2">{siteConfig.location}</p>
            </div>

            <div>
              <p className="eyebrow">Company</p>
              <p className="mt-1 text-ink-2">
                {siteConfig.legalName}
                <br />
                Company number {siteConfig.companyNumber}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
