import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { addressLine, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Archive Wholesale collects, uses and protects personal data — website enquiries, orders, WhatsApp messages and analytics. Your rights under UK GDPR.",
  alternates: { canonical: "/privacy" },
};

/** Reviewed date shown at the top and bottom. Update when the policy changes. */
const LAST_UPDATED = "27 September 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ash pt-8">
      <h2 className="display text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        intro={`How ${siteConfig.name} handles your personal data, what we do with it, who else sees it, and the rights you have over it.`}
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-14 sm:px-6">
        <p className="text-sm text-slate">Last updated: {LAST_UPDATED}</p>

        <Section title="Who we are">
          <p>
            {siteConfig.name} is a trading name of {siteConfig.legalName}, a company registered in
            England and Wales (company number {siteConfig.companyNumber}), trading from{" "}
            {addressLine}, {siteConfig.address.country}.
          </p>
          <p>
            We are the data controller for the personal data described here. For anything in this
            policy, contact us at{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-forest underline underline-offset-4">
              {siteConfig.email}
            </a>
            .
          </p>
        </Section>

        <Section title="What we collect, and why">
          <p>
            <strong className="text-ink">Enquiries through the contact form.</strong> Your name,
            email address, business name and the message you write. We use it to answer you. The
            form forwards the enquiry to our own inbox; it is not used for marketing and we do not
            add you to a mailing list.
          </p>
          <p>
            <strong className="text-ink">Orders.</strong> When you buy, checkout is handled by
            Stripe. <strong className="text-ink">We never see or store your card details.</strong>{" "}
            Stripe passes us the order: what was bought, the amount, and the name, email and
            delivery address you gave. We keep it to fulfil the order and to meet our accounting
            obligations.
          </p>
          <p>
            <strong className="text-ink">WhatsApp messages.</strong> If you message our WhatsApp
            business number, we hold the conversation — your WhatsApp number, your WhatsApp profile
            name, and the messages themselves — so we can reply and so we have a record of what was
            agreed. See the section below on how replies are drafted.
          </p>
          <p>
            <strong className="text-ink">Website analytics.</strong> We count page views and
            referrers through Vercel Web Analytics. It sets no cookies and does not identify you or
            follow you across other websites, which is why this site has no cookie banner.
          </p>
          <p>
            <strong className="text-ink">Your basket.</strong> Kept in your own browser&apos;s local
            storage. It is not sent to us until you check out, and clearing your browser data
            removes it.
          </p>
        </Section>

        <Section title="How we draft replies to WhatsApp messages">
          <p>
            We want to be straightforward about this, because it involves your message being read by
            a third party.
          </p>
          <p>
            When you message us on WhatsApp, we use an AI service —{" "}
            <a
              href="https://www.anthropic.com"
              rel="noopener noreferrer"
              target="_blank"
              className="text-forest underline underline-offset-4"
            >
              Anthropic
            </a>{" "}
            — to draft a suggested reply. Your message and the recent conversation are sent to that
            service for the purpose of producing the draft.
          </p>
          <p>
            <strong className="text-ink">
              A person reads and approves every reply before it is sent to you.
            </strong>{" "}
            Nothing is sent automatically. If you would rather we did not process your messages this
            way, say so in the chat or email us, and we will handle your conversation manually.
          </p>
        </Section>

        <Section title="Our lawful bases">
          <p>
            Under UK GDPR we rely on: <strong className="text-ink">performance of a contract</strong>{" "}
            for taking and fulfilling orders;{" "}
            <strong className="text-ink">legitimate interests</strong> for answering enquiries,
            replying on WhatsApp, keeping our records straight and understanding how the site is
            used; and <strong className="text-ink">legal obligation</strong> for keeping accounting
            and tax records.
          </p>
        </Section>

        <Section title="Who else handles your data">
          <p>
            We use the following providers, who process data on our behalf under contract and only
            on our instructions:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-ink">Meta (WhatsApp Business Platform)</strong> — carries
              WhatsApp messages between you and us
            </li>
            <li>
              <strong className="text-ink">Anthropic</strong> — drafts suggested replies, as
              described above
            </li>
            <li>
              <strong className="text-ink">Stripe</strong> — takes payments and handles card data as
              its own controller
            </li>
            <li>
              <strong className="text-ink">Vercel</strong> — hosts the website and provides analytics
            </li>
            <li>
              <strong className="text-ink">Upstash</strong> — stores WhatsApp conversations
            </li>
          </ul>
          <p>
            Some of these operate outside the UK. Where data is transferred abroad it is protected by
            UK-approved safeguards such as the International Data Transfer Agreement or an adequacy
            decision.
          </p>
          <p>
            <strong className="text-ink">
              We do not sell your personal data, and we never have.
            </strong>
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Enquiries: up to two years after our last contact. Orders and the records behind them:
            six years, as tax law requires. WhatsApp conversations: up to two years, so we can look
            back at what was agreed on an order. Analytics: aggregated, with nothing that identifies
            you.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can ask us for a copy of the personal data we hold about you, ask us to correct it or
            delete it, object to how we are using it, ask us to restrict our use of it, or ask for it
            in a portable form. Email{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-forest underline underline-offset-4">
              {siteConfig.email}
            </a>{" "}
            and we will respond within one month.
          </p>
          <p>
            If you are unhappy with how we have handled your data you can complain to the
            Information Commissioner&apos;s Office at{" "}
            <a
              href="https://ico.org.uk"
              rel="noopener noreferrer"
              target="_blank"
              className="text-forest underline underline-offset-4"
            >
              ico.org.uk
            </a>{" "}
            or on 0303 123 1113. We would rather you came to us first so we can put it right.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            This site sets no advertising or tracking cookies. Your basket uses your browser&apos;s
            local storage, and Stripe sets what it needs to process a payment securely when you check
            out. That is why you are not asked to accept cookies here.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we change how we handle personal data we will update this page and the date at the
            top. This policy was last reviewed on {LAST_UPDATED}.
          </p>
          <p>
            Questions about any of it:{" "}
            <Link href="/contact" className="text-forest underline underline-offset-4">
              get in touch
            </Link>
            .
          </p>
        </Section>
      </div>
    </>
  );
}
