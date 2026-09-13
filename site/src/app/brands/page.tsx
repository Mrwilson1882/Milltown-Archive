import type { Metadata } from "next";
import { CategoryIndex } from "@/components/CategoryPages";

export const metadata: Metadata = {
  title: "Shop Vintage Wholesale by Brand",
  description:
    "Browse Archive Wholesale by brand — vintage Lacoste, Ralph Lauren, Chaps, Nike, Champion, adidas, The North Face, Columbia, Sergio Tacchini, Juicy Couture, Von Dutch, Stone Island, Carhartt, Dickies and Birkenstock wholesale lots, shipped from the UK.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return <CategoryIndex kind="brand" />;
}
