import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPage } from "@/components/SectionPage";
import { listingsInType } from "@/data/catalogue";
import { findSection, productTypes } from "@/data/taxonomy";

type Params = { params: Promise<{ type: string }> };

/** Every category is a page at build time, so none of them cost a request. */
export function generateStaticParams() {
  return productTypes.map((section) => ({ type: section.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { type } = await params;
  const section = findSection(productTypes, type);
  if (!section) return {};

  return {
    title: `${section.name} — vintage`,
    description: section.seoCopy.slice(0, 200),
    alternates: { canonical: `/shop/${section.slug}` },
  };
}

export default async function TypePage({ params }: Params) {
  const { type } = await params;
  const section = findSection(productTypes, type);
  if (!section) notFound();

  return (
    <SectionPage
      eyebrow="Category"
      title={section.name}
      blurb={section.blurb}
      seoCopy={section.seoCopy}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
      ]}
      listings={listingsInType(section.slug)}
    />
  );
}
