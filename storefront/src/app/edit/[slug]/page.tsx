import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPage } from "@/components/SectionPage";
import { listingsInEdit } from "@/data/catalogue";
import { edits, findSection } from "@/data/taxonomy";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return edits.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const section = findSection(edits, slug);
  if (!section) return {};

  return {
    title: section.name,
    description: section.seoCopy.slice(0, 200),
    alternates: { canonical: `/edit/${section.slug}` },
  };
}

export default async function EditPage({ params }: Params) {
  const { slug } = await params;
  const section = findSection(edits, slug);
  if (!section) notFound();

  return (
    <SectionPage
      eyebrow="Edit"
      title={section.name}
      blurb={section.blurb}
      seoCopy={section.seoCopy}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
      ]}
      listings={listingsInEdit(section.slug)}
    />
  );
}
