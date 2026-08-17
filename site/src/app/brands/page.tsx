import type { Metadata } from "next";
import { CategoryIndex } from "@/components/CategoryPages";

export const metadata: Metadata = {
  title: "Shop Vintage Wholesale by Brand",
  description:
    "Browse Archive Wholesale bundles by brand — vintage Nike, Adidas, Lacoste and Ralph Lauren wholesale lots, plus mixed-brand sportswear bundles, shipped from the UK.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return <CategoryIndex kind="brand" />;
}
