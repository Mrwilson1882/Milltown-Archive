import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Milltown Archive does with your data, and what it does not.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy" crumbs={[{ href: "/", label: "Home" }]} />

      <div className="mx-auto max-w-[70ch] px-4 py-10 sm:px-6 lg:px-10">
        <div className="space-y-5 text-base text-ink-2">
          <p>
            This site is run by {siteConfig.legalName} (company number{" "}
            {siteConfig.companyNumber}), trading as {siteConfig.name}. We are the
            data controller for anything collected here.
          </p>

          <h2 className="display pt-4 text-2xl text-ink">What is collected</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Your bag</strong> is stored in your own browser, not on our
              servers. Clearing your site data clears it, and we never see it
              unless you check out or send it to us.
            </li>
            <li>
              <strong>Orders</strong> are taken through Stripe, which handles the
              card details — they never reach this site. We receive your name,
              email, delivery address and what you bought, so we can post it.
            </li>
            <li>
              <strong>Messages</strong> you send by email, WhatsApp or the contact
              form, kept so we can answer them.
            </li>
            <li>
              <strong>Page analytics</strong> through Vercel Analytics, which counts
              visits without cookies and without building a profile of you.
            </li>
          </ul>

          <h2 className="display pt-4 text-2xl text-ink">What is not</h2>
          <p>
            No advertising trackers, no third-party cookies, no selling or sharing
            of your details with anyone who is not needed to get your order to you.
          </p>

          <h2 className="display pt-4 text-2xl text-ink">How long it is kept</h2>
          <p>
            Order records are kept for six years, because HMRC requires it.
            Messages are kept while they are useful and deleted after that.
          </p>

          <h2 className="display pt-4 text-2xl text-ink">Your rights</h2>
          <p>
            You can ask for a copy of what we hold, ask for it to be corrected, or
            ask for it to be deleted where we are not required to keep it. Email{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-brick underline underline-offset-4">
              {siteConfig.email}
            </a>
            . If you are not happy with the answer you can complain to the
            Information Commissioner&rsquo;s Office at ico.org.uk.
          </p>
        </div>
      </div>
    </>
  );
}
