import type { Metadata } from "next";
import { CategoryIndex } from "@/components/CategoryPages";

export const metadata: Metadata = {
  title: "Shop Vintage Wholesale by Brand",
  description:
    "Browse Archive Wholesale by brand — vintage Lacoste, Ralph Lauren, Nike, Champion, Hugo Boss, Carhartt, Dickies and Birkenstock wholesale lots, shipped from the UK.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return <CategoryIndex kind="brand" />;
}
