import type { Metadata } from "next";
import { CategoryIndex } from "@/components/CategoryPages";

export const metadata: Metadata = {
  title: "Vintage Wholesale Collections",
  description:
    "Trend-led vintage wholesale collections from Archive Wholesale — Y2K, women's, summer mix and premium picks, cutting across brand and garment type.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return <CategoryIndex kind="collection" />;
}
