import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { policies } from "@/config/policies";
import { siteConfig } from "@/config/site";
import { formatGBP } from "@/lib/text";

export const metadata: Metadata = {
  title: "Delivery & returns",
  description:
    "How Milltown Archive orders are packed and posted, and your right to cancel and return an order bought online.",
  alternates: { canonical: "/delivery-returns" },
};

export default function DeliveryReturnsPage() {
  const { ukPostageGBP, freeUkPostageOverGBP, dispatchWorkingDays, returnWindowDays } = policies;

  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Delivery & returns"
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto max-w-[70ch] px-4 py-10 sm:px-6 lg:px-10">
        <h2 className="display text-2xl">Delivery</h2>
        <div className="mt-3 space-y-4 text-base text-ink-2">
          <p>
            Orders are packed and posted by hand from {siteConfig.location}
            {dispatchWorkingDays ? `, within ${dispatchWorkingDays} working days of payment` : ""}.
            Every parcel goes tracked, and the tracking number is emailed when it leaves.
          </p>
          <p>
            {ukPostageGBP !== null
              ? `UK postage is ${formatGBP(ukPostageGBP)} per order${
                  freeUkPostageOverGBP !== null
                    ? `, and free on orders over ${formatGBP(freeUkPostageOverGBP)}`
                    : ""
                }.`
              : "UK postage is calculated at checkout and shown before you pay."}
          </p>
          <p>
            {policies.shipsInternationally
              ? "Orders outside the UK are quoted individually — get in touch before ordering."
              : "Orders are posted within the UK. If you are outside the UK, get in touch before ordering and postage will be quoted for you."}
          </p>
        </div>

        <h2 className="display pt-10 text-2xl">Returns</h2>
        <div className="mt-3 space-y-4 text-base text-ink-2">
          <p>
            Buying online, you have {returnWindowDays} days from the day the parcel
            arrives to change your mind, and a further {returnWindowDays} days to
            send it back. You do not need a reason. This is your right under the
            Consumer Contracts Regulations 2013 and nothing on this page takes it
            away.
          </p>
          <p>
            Send it back in the condition it arrived in and the price of the
            garment is refunded to the card that paid for it. Return postage is
            yours to cover unless the piece was not as described.
          </p>
          <p>
            <strong>If a piece is not as described</strong> — a fault that is not on
            the listing, the wrong item, damage in the post — say so and the
            return postage and the full amount come back to you. The listings are
            written to stop that happening, but it is on us when it does.
          </p>
          <p>
            To start a return, email{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-brick underline underline-offset-4">
              {siteConfig.email}
            </a>{" "}
            with your order number.
          </p>
        </div>
      </div>
    </>
  );
}
