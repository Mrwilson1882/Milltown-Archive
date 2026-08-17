import type { Metadata } from "next";
import { CategoryIndex } from "@/components/CategoryPages";

export const metadata: Metadata = {
  title: "Shop Vintage Wholesale by Product Type",
  description:
    "Browse vintage wholesale bundles by garment — track jackets, polos, hoodies, sweatshirts, tracksuits, outerwear and knitwear, hand-graded and shipped from the UK.",
  alternates: { canonical: "/types" },
};

export default function TypesPage() {
  return <CategoryIndex kind="type" />;
}
