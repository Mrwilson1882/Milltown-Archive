import Link from "next/link";
import type { Metadata } from "next";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you — your Archive Wholesale order has been received.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <ClearCartOnMount />
      <p className="eyebrow text-forest">Payment received</p>
      <h1 className="display mt-4 text-4xl sm:text-5xl">Thanks — you&apos;re sorted</h1>
      <p className="mt-6 text-base leading-relaxed text-slate">
        Your order is in. You will get a payment receipt from Stripe straight away, and a note from
        us confirming delivery cost and dispatch date once we have weighed the parcel.
      </p>
      <p className="mt-4 text-base leading-relaxed text-slate">
        Anything you need in the meantime, reply to your receipt or email{" "}
        <a href={`mailto:${siteConfig.email}`} className="font-bold text-forest underline underline-offset-4">
          {siteConfig.email}
        </a>
        .
      </p>
      <Link
        href="/bundles"
        className="mt-10 inline-flex items-center bg-ink px-7 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest"
      >
        Back to the bundles
      </Link>
    </div>
  );
}
