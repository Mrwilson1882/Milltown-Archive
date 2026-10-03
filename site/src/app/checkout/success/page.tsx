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
        Your order is in, delivery included — there is nothing left to pay. Stripe emails your
        receipt straight away. We pick and count your lot, dispatch it within 24 to 48 hours, and
        Evri send a tracking link to the email address you gave at checkout.
      </p>
      <p className="mt-4 text-base leading-relaxed text-slate">
        One thing worth knowing before it goes on the rail: lots ship as graded, not laundered.
        Give everything a wash and a press and it will look twice the money.
      </p>
      <p className="mt-4 text-base leading-relaxed text-slate">
        Anything you need in the meantime, reply to your receipt or email{" "}
        <a href={`mailto:${siteConfig.email}`} className="font-bold text-forest underline underline-offset-4">
          {siteConfig.email}
        </a>
        .
      </p>
      <Link
        href="/products"
        className="mt-10 inline-flex items-center bg-ink px-7 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest"
      >
        Back to the products
      </Link>
    </div>
  );
}
