import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig, hasWhatsApp, whatsappUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Sizing & measurements",
  description:
    "How sizes are recorded at Milltown Archive — as they are written on the garment, with the fit noted where it differs.",
  alternates: { canonical: "/sizing" },
};

export default function SizingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Guide"
        title="Sizing & measurements"
        blurb="Vintage sizing is not modern sizing. Here is how it is handled."
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto max-w-[70ch] px-4 py-10 sm:px-6 lg:px-10">
        <div className="space-y-5 text-base text-ink-2">
          <p>
            Sizes are recorded as they are written on the garment, not converted
            into a modern equivalent. A nineties &ldquo;Large&rdquo; is not a 2026
            &ldquo;Large&rdquo;, and pretending otherwise causes more returns than it
            saves.
          </p>
          <p>
            Where the cut differs from what the label suggests, it is noted in
            brackets on the listing — <em>Large (oversized fit)</em>,{" "}
            <em>Medium (10&ndash;12)</em>. Where the label has been cut out or worn
            away, the listing says so.
          </p>

          <h2 className="display pt-6 text-2xl text-ink">Want it measured?</h2>
          <p>
            Ask for pit-to-pit, length, or anything else you need before you
            order, and it will be measured flat and sent over. That takes minutes
            and it is a far better use of everyone&rsquo;s time than a return.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {hasWhatsApp && (
            <a
              href={whatsappUrl("Hi Milltown Archive, could you measure: ")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink px-6 py-3 text-sm text-paper hover:bg-brick"
            >
              Ask on WhatsApp
            </a>
          )}
          <a
            href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Measurement request")}`}
            className="border rule px-6 py-3 text-sm hover:border-brick hover:text-brick"
          >
            Email us
          </a>
        </div>
      </div>
    </>
  );
}
