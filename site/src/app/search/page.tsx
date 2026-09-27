import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchResults } from "./SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Archive Wholesale's vintage lots by brand, garment or collection.",
  // A results page for every query is thin content; the product and brand
  // pages it points at are the ones that should rank.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Search"
        title="Find a lot"
        intro="Search by brand, garment or collection — Lacoste, hoodies, windbreakers, Y2K."
        crumbs={[{ href: "/", label: "Home" }]}
      />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6" />}>
        <SearchResults />
      </Suspense>
    </>
  );
}
