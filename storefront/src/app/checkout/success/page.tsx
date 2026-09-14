import type { Metadata } from "next";
import Link from "next/link";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <ClearCartOnMount />
      <p className="eyebrow">Thank you</p>
      <h1 className="display mt-3 text-[2.75rem] leading-tight">That&rsquo;s yours.</h1>
      <p className="mt-5 text-ink-2">
        Your order is in and a confirmation is on its way by email. Everything is
        packed and posted by hand, so give it a day or two to go out.
      </p>
      <p className="mt-3 text-sm text-ink-3">
        Anything at all, email{" "}
        <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">
          {siteConfig.email}
        </a>
        .
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-brick"
      >
        Back to the archive
      </Link>
    </div>
  );
}
