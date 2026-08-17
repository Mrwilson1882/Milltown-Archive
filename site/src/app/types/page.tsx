import type { Metadata } from "next";
import { CategoryIndex } from "@/components/CategoryPages";

export const metadata: Metadata = {
  title: "Shop Vintage Wholesale by Product Type",
  description:
    "Browse vintage wholesale lots by garment — polos and t-shirts, jumpers and sweats, jackets, footwear and accessories, in quantities from five pieces to a hundred.",
  alternates: { canonical: "/types" },
};

export default function TypesPage() {
  return <CategoryIndex kind="type" />;
}
