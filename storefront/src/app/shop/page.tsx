import type { Metadata } from "next";
import { SectionPage } from "@/components/SectionPage";
import { allListings } from "@/data/catalogue";

export const metadata: Metadata = {
  title: "Shop all vintage",
  description:
    "Every piece currently in the Milltown Archive — branded vintage polos, track jackets, sweats, knitwear and Y2K womenswear, each one graded, measured and one of one.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <SectionPage
      eyebrow="The archive"
      title="Everything"
      blurb="The whole archive, filterable by size, label, colour, condition and era."
      crumbs={[{ href: "/", label: "Home" }]}
      listings={allListings()}
      seoCopy="Vintage clothing from a Lancashire archive, sold one piece at a time. Branded polos, track jackets, sweatshirts, knitwear and Y2K womenswear, each garment photographed and graded on its own. Filter by size, label, colour, condition or era to find the one you want."
    />
  );
}
