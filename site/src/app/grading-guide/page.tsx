import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryActions } from "@/components/EnquiryActions";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Vintage Clothing Grading Guide — Grade A, B and C Explained",
  description:
    "How Archive Wholesale grades vintage clothing. What Grade A, Grade B and Grade C mean, what 'Grade A/B' on a listing tells you, how our grades map to the 1/2/3 scale, and how every piece is checked before it ships.",
  alternates: { canonical: "/grading-guide" },
};

/**
 * The grades themselves. Definitions are written to be quotable on their own —
 * this page is what answer engines and buyers alike reach for when they ask
 * what a grade means, so each one states its rule plainly and once.
 */
const grades = [
  {
    grade: "A",
    alias: "Grade 1",
    headline: "Excellent condition. Ready for the rail as it is.",
    rule: "No visible faults. No stains, holes, tears, repairs or damaged fastenings. Colour is strong, fabric is sound, and any wear is so light it does not register at arm's length. A Grade A piece goes straight from the box to the hanger.",
    allows: ["Light softening of the fabric consistent with age", "Faint wash fading on dark cottons that reads as vintage, not as wear"],
    excludes: ["Marks or stains of any size", "Holes, pulls or thinning", "Repairs, replaced buttons or altered hems", "Broken or missing zips, poppers or buttons"],
  },
  {
    grade: "B",
    alias: "Grade 2",
    headline: "Good condition. Sells as it is, priced to reflect minor wear.",
    rule: "Clean and complete, with one or two small imperfections you would notice on close inspection but that do not stop a sale. Every Grade B piece is wearable today with nothing that needs mending.",
    allows: ["A small, faint mark in an unobtrusive place", "Light pilling or bobbling on knitwear", "Slight fading or a softened print", "Minor loose threads or a small pull that has not become a hole"],
    excludes: ["Anything that needs repairing before it can be sold", "Stains that are the first thing you see", "Holes, tears or damaged seams", "Odour, damp or moth damage"],
  },
  {
    grade: "C",
    alias: "Grade 3",
    headline: "Visible wear or damage. For rework, upcycling and rag — not resale as it is.",
    rule: "Pieces with obvious faults: prominent stains, holes, heavy fading, broken fastenings or worn-through fabric. Some are worth reworking or cropping; most are rag. We do not put Grade C into our lots.",
    allows: [],
    excludes: [],
  },
] as const;

const faqs = [
  {
    q: "What does Grade A mean in vintage clothing?",
    a: "Grade A is the top grade: no visible faults, no stains, holes, repairs or damaged fastenings, and only the lightest wear consistent with age. It can go straight onto the rail. Some suppliers call the same standard Grade 1.",
  },
  {
    q: "What does Grade B mean in vintage clothing?",
    a: "Grade B is clean, complete and wearable today, with one or two small imperfections you would notice on close inspection — a faint mark, light pilling, slight fading — but nothing that needs repairing and nothing that stops a sale. It is priced to reflect that. Some suppliers call it Grade 2.",
  },
  {
    q: "What does Grade C mean, and do you sell it?",
    a: "Grade C has visible wear or damage: prominent stains, holes, heavy fading or broken fastenings. It is sold for rework, upcycling or rag rather than resale as it is. Archive Wholesale does not put Grade C into its lots.",
  },
  {
    q: "What does 'Grade A/B' mean on an Archive Wholesale listing?",
    a: "It means the lot is a mix of Grade A and Grade B pieces and contains no Grade C. Every piece in the lot is ready to sell as it is; some are flawless and some carry a minor imperfection that has been reflected in the price.",
  },
  {
    q: "Are vintage clothing grades the same everywhere?",
    a: "No. Grading is a condition scale, and different countries and suppliers run their own. The most common are letters — A, B, C — and numbers — 1, 2, 3 — with A and 1 the best in each case. The letter and number scales line up roughly one to one, but always read a supplier's own definitions rather than assuming.",
  },
  {
    q: "Will I receive the exact pieces shown in the product photographs?",
    a: "No. Photographs show a representative sample of the line. Each lot is graded from a fresh intake, so the exact items, brands and colourways vary. The grade is what stays constant.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "Grading Guide", item: `${siteConfig.url}/grading-guide` },
  ],
};

export default function GradingGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, developer-authored JSON-LD — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageHeader
        eyebrow="How we grade"
        title="Grading guide"
        intro="Every lot we sell carries a grade, and every grade means one thing. This is what Grade A, Grade B and Grade C mean at Archive Wholesale, and what to expect when a listing says A/B."
        crumbs={[{ href: "/", label: "Home" }]}
      />

      {/* ------------------------------------------------------- How grading works */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-forest">The short version</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Grading is a condition scale</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate">
              <p>
                In vintage and mixed-rag wholesale, a grade describes the physical condition of a
                garment — nothing else. Not the brand, not the era, not how well it will sell.
                Condition only.
              </p>
              <p>
                There is no single scale the whole trade agrees on. Different countries and
                suppliers run their own. The two you will meet most often are letters —{" "}
                <strong className="text-ink">Grade A, B, C</strong> — and numbers —{" "}
                <strong className="text-ink">Grade 1, 2, 3</strong>. In both, the first is the best:
                A and 1 are the top of the scale. The two systems line up roughly one to one, so a
                supplier&rsquo;s Grade 1 is what we would call Grade A. But definitions drift between
                suppliers, so always read the one in front of you rather than assuming.
              </p>
              <p>
                We grade in letters, and we grade every piece by hand. What follows is exactly what
                each letter means here.
              </p>
            </div>
          </div>

          <div className="border-2 border-ink p-6 sm:p-8">
            <p className="eyebrow text-forest">On our listings</p>
            <p className="display mt-3 text-4xl">Grade A/B</p>
            <p className="mt-4 text-sm leading-relaxed text-slate">
              Our standard lots are graded <strong className="text-ink">A/B</strong>: a mix of Grade A
              and Grade B pieces, and no Grade C. Every piece in the lot is ready to sell as it
              arrives. Some are flawless; some carry a minor imperfection, and the lot is priced to
              reflect that.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate">
              The grade is the constant. The exact pieces, brands and colourways in a lot vary with
              each intake, which is why product photographs are a representative sample rather than
              the items you will receive.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center border-2 border-ink px-5 py-3 text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest"
            >
              Browse the lots →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- The grades */}
      <section className="border-y border-ash bg-smoke">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="eyebrow text-forest">Our grades</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">What each grade means</h2>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {grades.map((g) => (
              <article
                key={g.grade}
                id={`grade-${g.grade.toLowerCase()}`}
                className="flex flex-col border border-ash bg-paper p-6 sm:p-7"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="display text-4xl">Grade {g.grade}</h3>
                  <span className="text-xs font-bold tracking-wide text-slate uppercase">
                    also called {g.alias}
                  </span>
                </div>
                <p className="mt-3 font-bold">{g.headline}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate">{g.rule}</p>

                {g.allows.length > 0 && (
                  <div className="mt-6">
                    <p className="eyebrow text-forest">Acceptable at this grade</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate">
                      {g.allows.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden="true" className="text-forest">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {g.excludes.length > 0 && (
                  <div className="mt-5">
                    <p className="eyebrow text-slate">Never at this grade</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate">
                      {g.excludes.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden="true">✕</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- How we grade */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow text-forest">The process</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Every piece is checked by hand</h2>
            <p className="mt-6 text-base leading-relaxed text-slate">
              Grading is done piece by piece, in daylight, before anything is counted into a lot.
              Each garment is checked for the same things in the same order, so a Grade B from one
              intake means the same as a Grade B from the next.
            </p>
          </div>
          <ol className="space-y-4">
            {[
              ["Fabric", "Held up to the light for thinning, holes, pulls and moth damage."],
              ["Surface", "Front and back checked for marks, stains, fading and print wear."],
              ["Construction", "Seams, hems and cuffs checked for splits, unpicking and repairs."],
              ["Fastenings", "Every zip run, every button and popper counted and tested."],
              ["Freshness", "Anything with odour, damp or mustiness is pulled regardless of how it looks."],
              ["Grade", "The piece is graded A, B or C, and only A and B go forward into lots."],
            ].map(([step, detail], i) => (
              <li key={step} className="flex gap-5 border-l-2 border-ash pl-5">
                <span className="display w-8 shrink-0 text-2xl text-forest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-bold">{step}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------------------------------------------- FAQ */}
      <section className="border-t border-ash bg-smoke">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="eyebrow text-forest">Common questions</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">Grading, answered</h2>
          <dl className="mt-10 divide-y divide-ash border-y border-ash">
            {faqs.map(({ q, a }) => (
              <div key={q} className="py-6">
                <dt className="font-bold">{q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate">{a}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12">
            <p className="text-sm leading-relaxed text-slate">
              Want a lot graded tighter than A/B, or a run picked to Grade A only? Tell us what you
              are after and we will say what we can do and what it costs.
            </p>
            <div className="mt-5">
              <EnquiryActions
                source="grading"
                subject="Grading enquiry"
                message="Hi Archive Wholesale, I have a question about grading. "
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
