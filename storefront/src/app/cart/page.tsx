import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CartView } from "@/components/CartView";
import { stripeEnabled } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Your bag",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        title="Your bag"
        crumbs={[{ href: "/", label: "Home" }]}
      />
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
        <CartView stripeEnabled={stripeEnabled} />
      </div>
    </>
  );
}
