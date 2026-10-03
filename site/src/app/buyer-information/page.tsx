import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryActions } from "@/components/EnquiryActions";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Buyer Information — How to Order Vintage Clothing Wholesale",
  description:
    "Everything a first-time trade buyer needs: how to order, how to pay, what delivery costs and how long it takes, the minimum order, and what arrives in the box. UK vintage clothing wholesale from Lancashire.",
  alternates: { canonical: "/buyer-information" },
};

/**
 * The questions a trade buyer asks before a first order — ordering, payment,
 * delivery, minimums. Grading lives on its own page and is linked rather than
 * repeated, so the two pages never drift apart or compete in search.
 */
const faqs = [
  {
    q: "How do I order from Archive Wholesale?",
    a: "Add the lots you want to your basket on the site and send it over, or message us directly on WhatsApp with the lot and the size you want. We confirm it is in stock, confirm the delivery cost to your address, and send you a secure card payment link. Card checkout on the site is coming shortly.",
  },
  {
    q: "How do I pay?",
    a: "By card, through a secure payment link. Payments are handled by Stripe, so your card details go to them and never to us. We do not ask for bank transfers.",
  },
  {
    q: "What do you need from me when I pay?",
    a: "Three things: your full name, which goes on the parcel; your email address, which is where Evri send your tracking link; and your delivery address with postcode. Without the email address there is no way for the courier to send you tracking, so it is the one worth checking twice.",
  },
  {
    q: "What is the minimum order?",
    a: "The smallest thing we sell is the 10-piece Starter Box at £90. Counted lots start at 10 pieces. We are wholesale only and do not sell single pieces.",
  },
  {
    q: "How much is delivery and how long does it take?",
    a: "UK delivery is £10 per 10 pieces — £10 on a lot of 10, £25 on a 25, £50 on a 50 — worked out in the basket and included in the total before you pay, so there is nothing to settle afterwards. Orders are dispatched within 24 to 48 hours of payment and typically arrive 48 to 72 hours after dispatch, tracked with Evri. We are shipping within the United Kingdom only at the moment.",
  },
  {
    q: "How will I know when my order has been sent?",
    a: "Evri send you a text or an email with a tracking link as soon as the parcel is scanned into their network. That comes from them, not from us, which is why we ask for the email address at the point of payment.",
  },
  {
    q: "What condition will the clothes be in?",
    a: "Standard lots are Grade A/B. Grade A carries no stains, holes, tears or repairs — fading is expected on vintage and does not cost the grade. Grade B carries honest wear: a small hole, a small stain or mark, pilling, or a zip that no longer works. Nothing graded C goes into a lot. Full definitions are in the grading guide.",
  },
  {
    q: "Do the clothes arrive washed and pressed?",
    a: "No. Lots ship as graded — checked, counted and packed, not laundered. Wash and press everything before it goes out on the rail, as you would with any vintage intake.",
  },
  {
    q: "Will I receive the exact pieces in the photographs?",
    a: "No. Photographs and videos show a representative sample of the line. Lots are counted out from a fresh intake at dispatch, so the exact pieces, brands and colourways vary. The grade and the count are what stay constant.",
  },
  {
    q: "Is everything genuine?",
    a: "Yes. Every branded piece is guaranteed genuine. Labels, branding and construction are checked as part of grading, and anything that does not pass is not sold.",
  },
  {
    q: "Can I see the stock before I buy?",
    a: "Every lot has photographs on its product page, and several carry a short video of the rail so you can judge volume and condition rather than a flat lay. Those show the kind of pieces and the condition in the line. We do not photograph stock to order — lots are counted out from a fresh intake at dispatch, so there is nothing to photograph until it is picked.",
  },
  {
    q: "Where do you ship from?",
    a: "Our unit in Burnley, Lancashire. We ship within the United Kingdom only at the moment. If you are outside the UK, message us — we will tell you when we open it up.",
  },
];

const steps = [
  [
    "Pick your lots",
    "Browse by product, by brand or by reseller box. Every lot shows the price per piece at 10, 25 and 50, so you can see exactly what the lot size does to your cost.",
  ],
  [
    "Send the basket",
    "Add to basket and send it over, or message the lot straight to us on WhatsApp. Tell us where it is going so we can price the delivery.",
  ],
  [
    "We confirm and send a link",
    "We confirm it is in stock, confirm your delivery cost, and send a secure card payment link. Payment is handled by Stripe.",
  ],
  [
    "Send us three details",
    "Full name for the parcel, email address for the Evri tracking link, delivery address with postcode.",
  ],
  [
    "Picked, counted, dispatched",
    "Graded and counted out by hand, packed and dispatched within 24 to 48 hours, tracked with Evri. Your tracking link comes through from Evri as soon as it leaves us.",
  ],
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
    { "@type": "ListItem", position: 2, name: "Buyer Information", item: `${siteConfig.url}/buyer-information` },
  ],
};

export default function BuyerInformationPage() {
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
        eyebrow="Before you order"
        title="Buyer information"
        intro="Everything a first order needs: how to buy, how to pay, what delivery costs, how long it takes and what turns up in the box. If something here is not answered, message us and we will answer it straight."
        crumbs={[{ href: "/", label: "Home" }]}
      />

      {/* ------------------------------------------------------------ At a glance */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="eyebrow text-forest">At a glance</p>
        <h2 className="display mt-3 text-3xl sm:text-4xl">The short version</h2>

        <dl className="mt-10 grid gap-px border border-ash bg-ash sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Minimum order", "£90", "the 10-piece Starter Box"],
            ["Payment", "Card", "secure link, handled by Stripe"],
            ["Delivery", "£10", "per 10 pieces, UK"],
            ["Dispatch", "24–48 hrs", "after payment"],
            ["UK delivery", "48–72 hrs", "after dispatch, tracked with Evri"],
          ].map(([label, value, note]) => (
            <div key={label} className="bg-paper p-5">
              <dt className="eyebrow text-slate">{label}</dt>
              <dd className="display mt-2 text-2xl tabular-nums">{value}</dd>
              <dd className="mt-1 text-xs leading-relaxed text-slate">{note}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------------------ How it works */}
      <section className="border-y border-ash bg-smoke">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div>
              <p className="eyebrow text-forest">How it works</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">From basket to doorstep</h2>
              <p className="mt-6 text-base leading-relaxed text-slate">
                Five steps, and we do most of them. The only thing we need from you is the lot you
                want and three details for the parcel.
              </p>
              <div className="mt-8">
                <EnquiryActions
                  source="buyer-information"
                  subject="Order enquiry"
                  message="Hi Archive Wholesale, I'd like to order: "
                />
              </div>
            </div>

            <ol className="space-y-4">
              {steps.map(([step, detail], i) => (
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
        </div>
      </section>

      {/* --------------------------------------------------------- Delivery + grade */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="border-2 border-ink p-6 sm:p-8">
            <p className="eyebrow text-forest">Delivery</p>
            <h2 className="display mt-3 text-2xl sm:text-3xl">Tracked, from Lancashire</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate">
              <p>
                Everything is picked, counted and packed at our unit in Burnley, then shipped tracked
                with Evri. Delivery is <strong className="text-ink">£10 per 10 pieces</strong> — £10
                on a lot of 10, £25 on a 25, £50 on a 50. The basket works it out and adds it to the
                total before you pay, so there is no second bill.
              </p>
              <p>
                UK orders are dispatched within 24 to 48 hours of payment and typically arrive 48 to
                72 hours after dispatch. Evri send the tracking link straight to the email address you
                give us at payment, which is why we ask for it.
              </p>
              <p>
                We are shipping within the United Kingdom only at the moment. If you are outside
                the UK, message us and we will tell you when that changes.
              </p>
            </div>
          </div>

          <div className="border-2 border-ink p-6 sm:p-8">
            <p className="eyebrow text-forest">Condition</p>
            <h2 className="display mt-3 text-2xl sm:text-3xl">Graded A/B, by hand</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate">
              <p>
                <strong className="text-ink">Grade A</strong> carries no stains, holes, tears or
                repairs. Fading is expected on a garment this old and does not cost it the grade.
              </p>
              <p>
                <strong className="text-ink">Grade B</strong> carries honest wear: a small hole, a
                small stain or mark, pilling, or a zip that no longer works. It sells hard as
                workwear. Nothing graded C — a large hole, several holes, or a stain that would stop
                the piece being worn even as workwear — goes into a lot.
              </p>
              <p>
                Lots ship as graded rather than laundered, so wash and press everything before it goes
                out on the rail.
              </p>
            </div>
            <Link
              href="/grading-guide"
              className="mt-6 inline-flex items-center border-2 border-ink px-5 py-3 text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest"
            >
              Read the grading guide →
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- FAQ */}
      <section className="border-t border-ash bg-smoke">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="eyebrow text-forest">Common questions</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">Asked before a first order</h2>
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
              Still something you want to know before you order? Message us — we would rather answer
              it now than have you guess.
            </p>
            <div className="mt-5">
              <EnquiryActions
                source="buyer-information"
                subject="Buyer question"
                message="Hi Archive Wholesale, I have a question before I order. "
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
