import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPage } from "@/components/SectionPage";
import { listingsInDepartment } from "@/data/catalogue";
import { departments, findSection } from "@/data/taxonomy";

const SLUG = "womens";

export async function generateMetadata(): Promise<Metadata> {
  const section = findSection(departments, SLUG);
  if (!section) return {};

  return {
    title: `${section.name} vintage`,
    description: section.seoCopy.slice(0, 200),
    alternates: { canonical: "/women" },
  };
}

export default function DepartmentPage() {
  const section = findSection(departments, SLUG);
  if (!section) notFound();

  return (
    <SectionPage
      eyebrow="Department"
      title={section.name}
      blurb={section.blurb}
      seoCopy={section.seoCopy}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
      ]}
      listings={listingsInDepartment(SLUG)}
    />
  );
}
