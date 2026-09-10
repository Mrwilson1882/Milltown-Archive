import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { PageHeader } from "@/components/PageHeader";
import { stripeEnabled } from "@/lib/stripe";
import { hasWhatsApp } from "@/config/site";

export const metadata: Metadata = {
  title: "Your Basket",
  description: "Review your Archive Wholesale order and check out securely.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <>
      <PageHeader title="Your basket" crumbs={[{ href: "/", label: "Home" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CartView stripeEnabled={stripeEnabled} whatsappAvailable={hasWhatsApp} />
      </div>
    </>
  );
}
