import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryActions } from "@/components/EnquiryActions";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Vintage Clothing Grading Guide — Grade A and Grade B Explained",
  description:
    "How Archive Wholesale grades vintage clothing. What Grade A and Grade B mean, why fading does not cost a grade, where the line falls between a small hole and a large one, and what 'Grade A/B' on a listing tells you.",
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
    rule: "No stains, no holes, no tears and no repairs. Fabric is sound throughout. Fading does not cost a grade — on a piece this old it is expected, and it is what vintage looks like. One minor broken fastening, a clasp or a popper, on a garment that is otherwise perfect does not cost a grade either, and nor does a pluck in the weave. Everything ships as graded rather than laundered, so wash it before it goes on the rail.",
    allows: ["Fading appropriate to the age of the piece, including wash fading on dark cottons", "A pluck or small snag in the weave", "One minor broken fastening, such as a clasp or popper, where the rest of the garment is sound", "Light softening of the fabric consistent with age"],
  },
  {
    grade: "B",
    alias: "Grade 2",
    headline: "Good condition with honest wear, priced to reflect it.",
    rule: "Small holes, small stains or small marks, pilling, or a zip that no longer works. Grade B is where a fault is named and reflected in the price, and it sells hard as workwear — Carhartt, Dickies and Lacoste especially. The line is size: a small hole grades B. A large hole, several holes, or a stain that would stop the piece being worn even as workwear is Grade C, and we do not sell Grade C.",
    allows: ["A small stain or mark", "A small hole, pull or thinning patch", "Light pilling or bobbling on knitwear", "A broken, stuck or missing zip"],
  },
] as const;

const faqs = [
  {
    q: "What does Grade A mean in vintage clothing?",
    a: "Grade A is the top grade: no stains, no holes, no tears and no repairs. Fading does not cost a grade — on a thirty-year-old garment it is expected, and it is what vintage looks like. A single minor broken fastening, such as one clasp or popper, on a piece that is otherwise perfect stays Grade A, as does a pluck in the weave. Some suppliers call the same standard Grade 1. Lots ship as graded rather than laundered, so everything is washed before it goes on the rail.",
  },
  {
    q: "What does Grade B mean in vintage clothing?",
    a: "Grade B is a piece that still wears and still sells, but carries a visible sign of use: a small hole, a small stain or mark, pilling, or a zip that no longer works. The fault is reflected in the price, and Grade B moves quickly as workwear — Carhartt, Dickies and Lacoste especially. Size is what separates B from C: a small hole is Grade B; a large hole, several holes, or a stain that would stop the piece being worn even as workwear is Grade C. Some suppliers call Grade B Grade 2.",
  },
  {
    q: "What does 'Grade A/B' mean on an Archive Wholesale listing?",
    a: "It means the lot is a mix of Grade A and Grade B pieces. Grade A carries no stains, holes, tears or repairs, though fading is expected and does not cost it the grade. Grade B carries honest wear such as a small hole, a small stain, pilling or a faulty zip, and the lot is priced to reflect that. Nothing graded C goes into a lot.",
  },
  {
    q: "What grade is a garment with a hole in it?",
    a: "It depends on the size and the number. A single small hole, pull or thinning patch is Grade B: the piece still sells, and the fault is reflected in the price. A large hole, or several holes, is Grade C, and Archive Wholesale does not sell Grade C, so it never goes into a lot.",
  },
  {
    q: "What grade is a garment with a broken zip?",
    a: "Grade B. A zip is the fastening a garment is worn by, so when it no longer works the piece is graded and priced as B. Smaller fastenings are treated differently: one broken clasp or popper on a garment that is otherwise perfect stays Grade A.",
  },
  {
    q: "Are vintage clothing grades the same everywhere?",
    a: "No. Grading is a condition scale, and different countries and suppliers run their own. The most common are letters — A, B, C — and numbers — 1, 2, 3 — with A and 1 the best in each case. Archive Wholesale sells Grade A and Grade B only. The letter and number scales line up roughly one to one, but always read a supplier's own definitions rather than assuming.",
  },
  {
    q: "Are all pieces guaranteed authentic?",
    a: "Yes. Every branded piece Archive Wholesale sells is guaranteed genuine. Labels, branding and construction are checked as part of grading, and anything that does not pass is not sold.",
  },
  {
    q: "Can I see photos of the actual pieces before I order?",
    a: "We can send recent photographs of the line on WhatsApp, showing the kind of pieces and condition in the current intake. Like every wholesaler, we cannot photograph the specific pieces that will be picked for your lot, because lots are counted out at dispatch. The grade is the constant.",
  },
  {
    q: "Do the pieces arrive washed and pressed?",
    a: "No. Lots ship as graded — checked, counted and packed, not laundered. Wash and iron everything before it goes out on the rail, as you would with any vintage intake.",
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
        intro="Every lot we sell carries a grade, and every grade means one thing. This is what Grade A and Grade B mean at Archive Wholesale, and what to expect when a listing says A/B."
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
              and Grade B pieces. Grade A carries no stains, holes, tears or repairs — fading is
              expected on vintage and does not cost it the grade. Grade B carries honest wear — a
              small hole, a small stain, pilling or a faulty zip — and the lot is priced to reflect
              that. Nothing graded C goes into a lot.
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
              ["Fastenings", "Every zip run, every button and popper counted and tested. A zip that sticks, breaks or is missing grades the piece B."],
              ["Grade", "The piece is graded A or B. A large hole, several holes, or a stain that would stop it being worn even as workwear grades C, and Grade C is kept out of the lots."],
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
